import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const MANUAL_PICKING_LIST_DATALIST_PATH =
  '/supplychain/manual-picking-list';
export const MANUAL_PICKING_LIST_EDIT_PATH_PATTERN =
  /\/supplychain\/manual-picking-list\/edit\/\d+/;

/**
 * POM Manual Picking List (SCM — ad-hoc PL, bukan Omni wave).
 * Selector: tests/pom-registry/manual-picking-list.yaml
 *
 * Fungsi: create PL manual (Building Origin + produk), reserve stok FIFO,
 * lalu proses picking → Complete menghasilkan Transfer + Deduction.
 *
 * AS-IS: fetchDefaultValues() sering auto-submit → langsung edit (code PL*).
 */
export class ManualPickingListPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code');
  }

  get buildingCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Warehouse');
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder('Add description or notes...');
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get availableProductsLink(): Locator {
    return this.page.getByText('Available Products', { exact: true });
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  availableProductsPanel(): Locator {
    return this.page
      .locator('div.fixed')
      .filter({
        has: this.page.getByPlaceholder(/find something/i),
      })
      .filter({
        has: this.page.locator('table'),
      })
      .first();
  }

  get transferQtyInput(): Locator {
    return this.page
      .locator('form')
      .filter({
        has: this.page.getByRole('heading', {
          name: 'Use this Item',
          exact: true,
        }),
      })
      .locator('input')
      .filter({ hasNot: this.page.locator('[disabled]') })
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(MANUAL_PICKING_LIST_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(MANUAL_PICKING_LIST_EDIT_PATH_PATTERN, { timeout: 90_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/supplychain\/manual-picking-list\/create$/, {
          timeout: 90_000,
        })
        .then(() => 'create' as const),
    ]);

    await dismissStagingBanner(this.page);

    if (raced === 'edit') {
      await this.expandBasicInformation();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
      return 'edit';
    }

    await this.expandBasicInformation();
    await expect(this.buildingCombobox).toBeVisible({ timeout: 45_000 });

    const autoEdit = await this.page
      .waitForURL(MANUAL_PICKING_LIST_EDIT_PATH_PATTERN, { timeout: 12_000 })
      .then(() => true)
      .catch(() => false);
    if (autoEdit) {
      await this.expandBasicInformation();
      return 'edit';
    }

    return 'create';
  }

  private async expandBasicInformation(): Promise<void> {
    const basic = this.page.getByRole('button', {
      name: 'Basic Information',
      exact: true,
    });
    await expect(basic).toBeVisible({ timeout: 45_000 });
    if ((await basic.getAttribute('aria-expanded')) !== 'true') {
      await basic.click();
      await this.page.waitForTimeout(700);
    }
  }

  async expandPickingListDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: 'Picking List Detail',
      exact: true,
    });
    await expect(btn).toBeVisible({ timeout: 45_000 });
    if ((await btn.getAttribute('aria-expanded')) !== 'true') {
      await btn.click();
      await this.page.waitForTimeout(700);
    }
  }

  async ensureBuildingOriginSelected(): Promise<string> {
    const root = this.page
      .locator('div')
      .filter({
        has: this.page.getByText('Building Origin', { exact: false }),
      })
      .locator('.multiselect')
      .first();

    const single = root.locator('.multiselect-single-label');
    if (await single.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const label = ((await single.textContent()) ?? '').trim();
      if (label && !/^choose/i.test(label)) {
        return label;
      }
    }

    let combobox = this.buildingCombobox;
    if (!(await combobox.isVisible().catch(() => false))) {
      await root.click();
      combobox = root.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    const current = await this.multiselect.selectedLabel(combobox);
    if (current && !/^choose/i.test(current) && current.length > 2) {
      return current;
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(600);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .first();
    await expect(option, 'Minimal 1 Building Origin').toBeVisible({
      timeout: 25_000,
    });
    const optionText = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(800);
    return optionText;
  }

  async fillDescription(text: string): Promise<void> {
    await expect(this.descriptionInput).toBeVisible({ timeout: 15_000 });
    await this.descriptionInput.fill(text);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/manual-picking-list' ||
          pathname.endsWith('/supplychain/manual-picking-list')
        );
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;

    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Save Manual PL gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(MANUAL_PICKING_LIST_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Manual PL ${code}`).toBeVisible({
      timeout: 45_000,
    });

    // AS-IS: kode adalah link edit (bukan #updateButton)
    const codeLink = row
      .getByRole('link', { name: code, exact: true })
      .or(
        row.locator(
          `a[href*="/supplychain/manual-picking-list/edit/"]`,
        ),
      )
      .first();
    await expect(codeLink).toBeVisible({ timeout: 30_000 });
    const href = await codeLink.getAttribute('href');
    if (href) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded' });
    } else {
      await codeLink.click();
      await this.page.waitForURL(MANUAL_PICKING_LIST_EDIT_PATH_PATTERN, {
        timeout: 45_000,
      });
    }

    await expect(this.page).toHaveURL(MANUAL_PICKING_LIST_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async setStatusOpen(): Promise<void> {
    const open = this.openRadio;
    await expect(open).toBeVisible({ timeout: 15_000 });
    if (!(await open.isChecked().catch(() => false))) {
      const put = this.page
        .waitForResponse(
          (response) =>
            /\/manual-picking-list\/\d+/.test(response.url()) &&
            ['PUT', 'POST'].includes(response.request().method()),
          { timeout: 60_000 },
        )
        .catch(() => null);
      await open.check({ force: true });
      await put;
      await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
      await this.page.waitForTimeout(500);
    }
  }

  async clickSaveAllAndWait(): Promise<void> {
    const waitPut = () =>
      this.page.waitForResponse(
        (response) =>
          /\/manual-picking-list\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
        { timeout: 90_000 },
      );

    let saveResponse = waitPut().catch(() => null);
    await this.form.clickSaveAll();
    let response = await saveResponse;

    // AS-IS anti-spam: "Duplicate request detected, please wait 3 seconds"
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      const msg = String(body?.status?.message ?? '');
      if (/duplicate request/i.test(msg)) {
        await this.page.waitForTimeout(3_500);
        saveResponse = waitPut().catch(() => null);
        await this.form.clickSaveAll();
        response = await saveResponse;
      }
    }

    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update Manual PL gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertInDatalist(code: string, descriptionSnippet?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Manual PL ${code} di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  async openAvailableProductsModal(): Promise<void> {
    await this.expandPickingListDetail();
    await this.availableProductsLink.scrollIntoViewIfNeeded();

    const availableResponse = this.page
      .waitForResponse(
        (response) =>
          /available_item_warehouse/i.test(response.url()) &&
          response.request().method() === 'GET',
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.availableProductsLink.click();
    await availableResponse;
    await this.page.waitForTimeout(1_500);

    const panel = this.availableProductsPanel();
    await expect(panel, 'Panel Available Products').toBeVisible({
      timeout: 45_000,
    });
  }

  /**
   * Available Products → Use this Item → Transfer Qty → Save.
   * POST: .../manual-picking-middle-detail
   */
  async useFirstAvailableProductWithQty(
    qty: string | number,
  ): Promise<string> {
    await this.openAvailableProductsModal();
    const panel = this.availableProductsPanel();

    let useBtn = panel.locator('button[class*="use-button"]').first();
    if (!(await useBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      await panel
        .locator('.dataTables_scrollBody, .dt-scroll-body, table')
        .first()
        .evaluate((el) => {
          el.scrollLeft = el.scrollWidth;
        })
        .catch(() => undefined);
      useBtn = panel.locator('button[class*="use-button"]').first();
    }

    await expect(useBtn, 'Tombol Use available product').toBeVisible({
      timeout: 30_000,
    });

    await useBtn.click();

    await expect(
      this.page.getByRole('heading', { name: 'Use this Item', exact: true }),
    ).toBeVisible({ timeout: 20_000 });

    const form = this.page.locator('form').filter({
      has: this.page.getByRole('heading', {
        name: 'Use this Item',
        exact: true,
      }),
    });

    // SKU pasti dari field disabled "System Product SKU" di modal
    const skuField = form.locator('input[disabled]').first();
    await expect(skuField).toBeVisible({ timeout: 10_000 });
    const strongSku = ((await skuField.inputValue()) ?? '').trim();
    expect(strongSku.length, 'System Product SKU di modal').toBeGreaterThan(0);

    const qtyLabel = this.page.getByText('Transfer Qty', { exact: true });
    await expect(qtyLabel).toBeVisible({ timeout: 10_000 });
    const transferInput = form
      .locator('label, div')
      .filter({ hasText: /^Transfer Qty/ })
      .locator('xpath=following::input[1]')
      .first();

    const qtyField = (await transferInput.isVisible().catch(() => false))
      ? transferInput
      : form.locator('input:not([disabled])').first();

    await qtyField.click();
    await qtyField.fill('');
    await qtyField.fill(String(qty));

    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        return (
          /\/manual-picking-list\/\d+\/manual-picking-middle-detail(?:\?|$)/.test(
            response.url(),
          ) && !response.url().includes('bulk')
        );
      },
      { timeout: 90_000 },
    );

    const saveBtn = form
      .locator('button[type="submit"][data-modal-save], button[type="submit"]')
      .first();
    await expect(saveBtn).toBeVisible({ timeout: 10_000 });
    await saveBtn.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Add available product gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await expect(
      this.page.getByRole('heading', { name: 'Use this Item', exact: true }),
    ).toBeHidden({ timeout: 30_000 });
    await this.page.waitForTimeout(1_000);

    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.mouse.click(8, 8).catch(() => undefined);
    await this.page.waitForTimeout(700);

    return strongSku;
  }

  /** Fallback: Select Product (group view) → bulk-create middle. */
  async selectFirstProductViaSelectProduct(): Promise<string> {
    await this.expandPickingListDetail();
    const combobox = this.selectProductCombobox;
    await expect(combobox).toBeVisible({ timeout: 30_000 });

    const bulkResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /manual-picking-middle-detail\/bulk-create/.test(response.url()),
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(700);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Opsi Select Product').toBeVisible({
      timeout: 30_000,
    });
    const label = ((await option.textContent()) ?? '').trim();
    // Label select2 sering "SKU | Name" atau multi-line dengan <strong>SKU
    const strongOpt = option.locator('strong').first();
    const strongText = (
      (await strongOpt.textContent().catch(() => '')) ?? ''
    ).trim();
    await option.click();

    const response = await bulkResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Select Product gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
    return (
      strongText ||
      label.split('|')[0]?.trim() ||
      label.split(/\s+/)[0] ||
      label.slice(0, 24)
    );
  }

  async assertDetailHasProduct(skuToken: string): Promise<void> {
    await this.expandPickingListDetail();
    const token = skuToken.slice(0, 32).trim();
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const section = this.page.locator('#PickingListDetail').first();
    await expect(
      section.getByText(new RegExp(escaped, 'i')).first(),
      `Product ${token} harus ada di Picking List Detail`,
    ).toBeVisible({ timeout: 45_000 });
  }
}