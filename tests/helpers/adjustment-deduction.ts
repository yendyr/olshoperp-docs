import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ADJUSTMENT_DEDUCTION_DATALIST_PATH =
  '/supplychain/adjustment-deduction';
export const ADJUSTMENT_DEDUCTION_EDIT_PATH_PATTERN =
  /\/supplychain\/adjustment-deduction\/edit\/\d+/;

/**
 * POM Stock Deduction (SCM Adjustment Deduction).
 * Selector: tests/pom-registry/adjustment-deduction.yaml
 *
 * AS-IS: Form.fetchDefaultValues() dapat auto-submit create
 * jika Building Origin default tersedia → langsung ke edit (code AO*).
 * Detail: Available Products → Use Product (Quantity) — bukan Select Product saja.
 */
export class AdjustmentDeductionPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  /** AS-IS: input code tanpa #code — pakai placeholder. */
  get codeInput(): Locator {
    return this.page.getByPlaceholder('Automatically generate by system');
  }

  get buildingCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder(
      'e.g: Seruni --> Lantai 1 --> Lorong A --> Rak A-001',
    );
  }

  get descriptionInput(): Locator {
    return this.page.locator('#BasicInformation textarea').first();
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

  get quantityInput(): Locator {
    return this.page
      .locator('form')
      .filter({
        has: this.page.getByRole('heading', { name: 'Use Product', exact: true }),
      })
      .locator('#quantity')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ADJUSTMENT_DEDUCTION_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(ADJUSTMENT_DEDUCTION_EDIT_PATH_PATTERN, { timeout: 60_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/supplychain\/adjustment-deduction\/create$/, {
          timeout: 60_000,
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
    await expect(
      this.buildingCombobox.or(
        this.page.locator('.multiselect').filter({
          has: this.page.locator('[aria-placeholder*="Seruni"]'),
        }),
      ).first(),
    ).toBeVisible({ timeout: 45_000 });

    const autoEdit = await this.page
      .waitForURL(ADJUSTMENT_DEDUCTION_EDIT_PATH_PATTERN, { timeout: 8_000 })
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

  async expandStockDeductionDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: 'Stock Deduction Detail',
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
      if (label && !/^e\.g:/i.test(label) && !/^choose/i.test(label)) {
        return label;
      }
    }

    let combobox = this.buildingCombobox;
    if (!(await combobox.isVisible().catch(() => false))) {
      await root.click();
      combobox = root.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    // Sudah terisi via default?
    const current = await this.multiselect.selectedLabel(combobox);
    if (current && !/^e\.g:|^choose/i.test(current) && current.length > 2) {
      return current;
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(600);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .first();
    await expect(
      option,
      'Minimal 1 Building Origin di dropdown',
    ).toBeVisible({ timeout: 25_000 });
    const optionText = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(500);
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
          pathname === '/api/supplychain/adjustment-deduction' ||
          pathname.endsWith('/supplychain/adjustment-deduction')
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
        `Save Stock Deduction gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(ADJUSTMENT_DEDUCTION_EDIT_PATH_PATTERN, {
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
    await expect(row, `Baris Stock Deduction ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(ADJUSTMENT_DEDUCTION_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);

    const loaded = await this.codeInput
      .or(this.page.getByRole('button', { name: 'Basic Information', exact: true }))
      .first()
      .isVisible({ timeout: 45_000 })
      .catch(() => false);

    if (!loaded) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await dismissStagingBanner(this.page);
    }

    await this.expandBasicInformation();
  }

  async setStatusOpen(): Promise<void> {
    const open = this.openRadio;
    await expect(open).toBeVisible({ timeout: 15_000 });
    if (!(await open.isChecked().catch(() => false))) {
      const put = this.page
        .waitForResponse(
          (response) =>
            /\/adjustment-deduction\/\d+/.test(response.url()) &&
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
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/adjustment-deduction\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('detail'),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update Stock Deduction gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(code: string, descriptionSnippet?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(
      row,
      `Stock Deduction ${code} harus tampil di datalist`,
    ).toBeVisible({ timeout: 45_000 });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  async openAvailableProductsModal(): Promise<void> {
    await this.expandStockDeductionDetail();
    await this.availableProductsLink.scrollIntoViewIfNeeded();

    const availableResponse = this.page
      .waitForResponse(
        (response) =>
          /available_products/i.test(response.url()) &&
          response.request().method() === 'GET',
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.availableProductsLink.click();
    await availableResponse;
    await this.page.waitForTimeout(1_500);

    const panel = this.availableProductsPanel();
    await expect(panel, 'Panel Available Products').toBeVisible({
      timeout: 45_000,
    });
    await expect(
      panel.getByText(/LUMI|CHARM|TTK|[A-Z0-9]{4,}/i).first(),
      'Available products ter-load',
    ).toBeVisible({ timeout: 60_000 });
  }

  /**
   * Available Products → Use → isi Quantity → Save.
   */
  async useFirstAvailableProductWithQty(qty: string | number): Promise<string> {
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
      timeout: 20_000,
    });

    const row = useBtn.locator('xpath=ancestor::tr[1]');
    const strongSku = (
      (await row.locator('strong').first().textContent().catch(() => '')) ?? ''
    ).trim();
    const productLabel = (
      ((await row.locator('td').nth(1).textContent()) ?? '')
        .replace(/\s+/g, ' ')
        .trim() || strongSku
    );
    expect(productLabel.length).toBeGreaterThan(0);

    await useBtn.click();

    await expect(
      this.page.getByRole('heading', { name: 'Use Product', exact: true }),
    ).toBeVisible({ timeout: 20_000 });

    const qtyInput = this.quantityInput;
    await expect(qtyInput).toBeVisible({ timeout: 15_000 });
    await qtyInput.click();
    await qtyInput.fill('');
    await qtyInput.fill(String(qty));

    const modalForm = this.page.locator('form').filter({
      has: this.page.getByRole('heading', { name: 'Use Product', exact: true }),
    });

    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        return (
          /\/adjustment-deduction\/\d+\/adjustment-deduction-detail(?:\?|$)/.test(
            url,
          ) && !url.includes('bulk')
        );
      },
      { timeout: 90_000 },
    );

    const saveBtn = modalForm
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
      this.page.getByRole('heading', { name: 'Use Product', exact: true }),
    ).toBeHidden({ timeout: 30_000 });
    await this.page.waitForTimeout(1_000);

    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.mouse.click(8, 8).catch(() => undefined);
    await this.page.waitForTimeout(700);

    return strongSku || productLabel.split(' ')[0] || productLabel.slice(0, 24);
  }

  async assertDetailHasProduct(skuToken: string): Promise<Locator> {
    await this.expandStockDeductionDetail();
    const section = this.page
      .locator('#TransactionDetails, [id="TransactionDetails"]')
      .first();
    const scope = (await section.count()) ? section : this.page;
    const token = skuToken.slice(0, 24);
    const row = scope
      .locator('.p-datatable-tbody tr')
      .filter({ hasText: new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })
      .first();
    await expect(
      row,
      `Product ${token} harus ada di Stock Deduction Detail`,
    ).toBeVisible({ timeout: 45_000 });
    return row;
  }
}
