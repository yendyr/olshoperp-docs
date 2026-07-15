import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ASSEMBLY_DATALIST_PATH = '/supplychain/assembly';
export const ASSEMBLY_EDIT_PATH_PATTERN =
  /\/supplychain\/assembly\/edit\/\d+/;

/**
 * POM Assembly (SCM) — UI `/supplychain/assembly`, API `supplychain/work-order`.
 * Selector: tests/pom-registry/assembly.yaml
 *
 * AS-IS: Form.fetchDefaultValues() isi warehouse_id lalu submit() otomatis.
 * Type default = 'Assembly'; prefix code AS*.
 * Open membutuhkan minimal 1 detail FG (Header BOM) — jangan Open sebelum detail.
 */
export class AssemblyPage {
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
    return this.multiselect.comboboxByAriaPlaceholder('Choose Building Origin');
  }

  get typeCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose type');
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

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ASSEMBLY_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 60_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/supplychain\/assembly\/create$/, { timeout: 60_000 })
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
          has: this.page.locator('[aria-placeholder="Choose Building Origin"]'),
        }),
      ).first(),
    ).toBeVisible({ timeout: 45_000 });

    const autoEdit = await this.page
      .waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 8_000 })
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

  async expandAssemblyDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: 'Assembly Detail',
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
    if (current && !/^choose/i.test(current)) {
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
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(500);
    return text;
  }

  async ensureTypeSelected(preferred = 'Assembly'): Promise<void> {
    let combobox = this.typeCombobox;
    if (!(await combobox.isVisible({ timeout: 5_000 }).catch(() => false))) {
      const root = this.page
        .locator('#BasicInformation .multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Choose type"]'),
        })
        .first();
      await root.click();
      combobox = root.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    const current = await this.multiselect.selectedLabel(combobox);
    if (new RegExp(`^${preferred}$`, 'i').test(current.trim())) {
      return;
    }

    // Selalu paksa pilih — AS-IS edit kadang type kosong meski create pakai default
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(400);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: new RegExp(`^\\s*${preferred}\\s*$`, 'i') })
      .first();
    if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await option.click();
    } else {
      await this.multiselect.selectOption(combobox, preferred, {
        exact: true,
        typeToFilter: preferred,
      });
    }
    await this.page.waitForTimeout(400);
  }

  async fillDescription(text: string): Promise<void> {
    await this.descriptionInput.fill(text);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/work-order' ||
          pathname.endsWith('/supplychain/work-order')
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
        `Save Assembly gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 45_000 });
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
    await expect(row, `Baris Assembly ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(ASSEMBLY_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    const loaded = await this.codeInput
      .isVisible({ timeout: 30_000 })
      .catch(() => false);
    if (!loaded) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await dismissStagingBanner(this.page);
    }
    await this.expandBasicInformation();
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/work-order\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('detail') &&
          !response.url().includes('bulk'),
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
          `Update Assembly gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
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
    await expect(row, `Assembly ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  /**
   * Pilih FG Header BOM pertama via Select Product → bulk-fifo.
   * Return SKU atau null jika tidak ada BOM tersedia di company.
   */
  async tryAddFirstFinishGoodsProduct(): Promise<string | null> {
    await this.expandAssemblyDetail();

    // Sudah ada baris dari run sebelumnya / late response
    const existing = await this.readFirstDetailSku();
    if (existing) {
      return existing;
    }

    let combobox = this.selectProductCombobox;
    if (!(await combobox.isVisible({ timeout: 8_000 }).catch(() => false))) {
      const root = this.page
        .locator('#ProductDetails')
        .locator('.multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Select Product"]'),
        })
        .first();
      if (!(await root.isVisible({ timeout: 5_000 }).catch(() => false))) {
        return null;
      }
      await root.click();
      combobox = root.locator('.multiselect-search').first();
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(1_200);

    const options = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' });

    if ((await options.count()) === 0) {
      await this.page.keyboard.press('Escape').catch(() => undefined);
      return null;
    }

    const option = options.first();
    const strongSku = (
      (await option.locator('strong').first().textContent().catch(() => '')) ??
      ''
    ).trim();
    const sku =
      strongSku ||
      ((await option.textContent()) ?? '').replace(/\s+/g, ' ').trim().slice(0, 40);

    const bulkResponsePromise = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        return (
          /\/work-order\/\d+\/bulk-fifo/.test(url) ||
          (/\/work-order\/\d+/.test(url) && url.includes('bulk'))
        );
      },
      { timeout: 45_000 },
    );

    await option.click();

    const response = await bulkResponsePromise.catch(() => null);
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Add Assembly detail gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
      await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    }

    await this.page.waitForTimeout(2_000);
    const added = await this.readFirstDetailSku();
    return added ?? sku;
  }

  async readFirstDetailSku(): Promise<string | null> {
    await this.expandAssemblyDetail();
    const section = this.page.locator('#ProductDetails').first();
    const row = section
      .locator('.p-datatable-tbody tr')
      .filter({ hasNotText: /no (records|data)|empty/i })
      .first();
    if (!(await row.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return null;
    }
    const strong = (
      (await row.locator('strong, a').first().textContent().catch(() => '')) ??
      ''
    ).trim();
    if (strong) return strong;
    const text = ((await row.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    const match = text.match(/([A-Z][A-Z0-9._-]{3,})/);
    return match?.[1] ?? null;
  }

  async assertDetailHasProduct(skuToken: string): Promise<void> {
    await this.expandAssemblyDetail();
    const section = this.page.locator('#ProductDetails').first();
    const row = section
      .locator('.p-datatable-tbody tr, tbody tr')
      .filter({
        hasText: new RegExp(
          skuToken.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'i',
        ),
      })
      .first();
    await expect(
      row,
      `FG ${skuToken} harus ada di Assembly Detail`,
    ).toBeVisible({ timeout: 45_000 });
  }

  /**
   * Inline edit kolom QTY di baris detail pertama (atau filter skuToken).
   * AS-IS: integer-only; PUT work-order/{id}/work-order-detail.
   */
  async setQtyOnDetailRow(
    qty: string | number,
    skuToken?: string,
  ): Promise<string> {
    await this.expandAssemblyDetail();
    const section = this.page.locator('#ProductDetails').first();

    let row = section
      .locator('.p-datatable-tbody tr')
      .filter({ hasNotText: /no (records|data)|empty/i })
      .first();

    if (skuToken) {
      row = section
        .locator('.p-datatable-tbody tr')
        .filter({
          hasText: new RegExp(
            skuToken.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'i',
          ),
        })
        .first();
    }

    await expect(row, 'Baris Assembly Detail').toBeVisible({ timeout: 30_000 });

    const sku =
      (
        (await row.locator('strong, a').first().textContent().catch(() => '')) ??
        ''
      ).trim() ||
      (await this.readFirstDetailSku()) ||
      skuToken ||
      '';

    let input = row
      .locator('input.p-inputtext, input[type="text"]:not([type="checkbox"])')
      .first();
    if (!(await input.isVisible({ timeout: 3_000 }).catch(() => false))) {
      const cells = row.locator('td');
      const count = await cells.count();
      for (let i = 0; i < count; i++) {
        await cells.nth(i).dblclick().catch(() => cells.nth(i).click());
        input = row
          .locator('input.p-inputtext, input[type="text"]')
          .filter({ hasNot: this.page.locator('[type="checkbox"]') })
          .first();
        if (await input.isVisible({ timeout: 1_000 }).catch(() => false)) {
          break;
        }
      }
    }

    await expect(input, 'QTY input').toBeVisible({ timeout: 10_000 });

    const put = this.page
      .waitForResponse(
        (response) =>
          /\/work-order\/\d+\/work-order-detail/.test(response.url()) &&
          ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await input.click({ clickCount: 3 });
    await input.fill(String(qty));
    await input.press('Tab');
    const response = await put;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update QTY gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_500);

    // Verifikasi: jangan pakai checkbox — assert teks QTY di baris / input text
    const qtyInput = row.locator('input.p-inputtext, input[type="text"]').first();
    if (await qtyInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await expect(qtyInput).toHaveValue(String(qty), { timeout: 10_000 });
    } else {
      await expect(row.getByText(String(qty), { exact: true }).first()).toBeVisible({
        timeout: 10_000,
      });
    }

    return sku;
  }
}
