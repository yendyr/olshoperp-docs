import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const MUTATION_TRANSFER_VOID_DATALIST_PATH =
  '/supplychain/mutation-transfer-void';
export const MUTATION_TRANSFER_VOID_EDIT_PATH_PATTERN =
  /\/supplychain\/mutation-transfer-void\/edit\/\d+/;

/**
 * POM Transfer Void (mutation-transfer-void).
 *
 * AS-IS create form: Origin Multiselect di-comment — manual create tidak viable.
 * TFV* biasanya auto-generate; automation CREATE = smoke create page + bind Open TFV existing.
 * Detail: Select Product → mutation-transfer-middle-detail/bulk-fifo.
 */
export class MutationTransferVoidPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page
      .locator('#code')
      .or(this.page.getByPlaceholder('Automatically generate by system'))
      .first();
  }

  get destinationCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Location');
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  async gotoDatalist(): Promise<void> {
    await this.page.goto(MUTATION_TRANSFER_VOID_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.datalist.table).toBeVisible({ timeout: 45_000 });
  }

  /** Smoke create page — Origin picker AS-IS tidak ada. */
  async openCreateFormSmoke(): Promise<void> {
    await this.page.goto(`${MUTATION_TRANSFER_VOID_DATALIST_PATH}/create`, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page).toHaveURL(
      /\/supplychain\/mutation-transfer-void\/create$/,
      { timeout: 45_000 },
    );
    await this.expandBasicInformation();
    await expect(
      this.page.getByText('Building Origin', { exact: false }).first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(this.destinationCombobox).toBeVisible({ timeout: 30_000 });
    // Multiselect Origin di-comment AS-IS
    await expect(
      this.page.locator('[aria-placeholder="Choose Building Origin"]'),
    ).toHaveCount(0);
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

  async expandTransferProductDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /Transfer Product Detail/i,
    });
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
  }

  /**
   * Bind dokumen dari datalist (prefer Open / TFV*).
   * AS-IS searchbox: match dari awal teks — jangan search "Open".
   */
  async openFirstOpenEditableFromDatalist(): Promise<string> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.keyboard.press('Control+A').catch(() => undefined);
    await this.page.keyboard.press('Backspace').catch(() => undefined);
    await this.page.waitForTimeout(1_500);

    // Prefer filter TFV* (awal code)
    await this.datalist.search('TFV', 2_500);
    let bodyRows = this.page.locator('tbody tr').filter({
      hasNotText: /no data available/i,
    });
    let count = await bodyRows.count();

    if (count === 0) {
      await this.datalist.searchInput.fill('');
      await this.page.waitForTimeout(1_500);
      bodyRows = this.page.locator('tbody tr').filter({
        hasNotText: /no data available/i,
      });
      count = await bodyRows.count();
    }

    if (count === 0) {
      throw new Error(
        'Datalist Transfer Void kosong di lumicharmsid (tidak ada fixture TFV*)',
      );
    }

    // Prefer baris Open, else baris pertama
    let row = bodyRows.filter({ hasText: /Open/i }).first();
    if (!(await row.isVisible({ timeout: 2_000 }).catch(() => false))) {
      row = bodyRows.first();
    }

    const codeLink = row
      .locator(`a[href*="/supplychain/mutation-transfer-void/edit/"]`)
      .first()
      .or(row.getByRole('link').filter({ hasText: /TF/i }).first());

    if (await codeLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const href = await codeLink.getAttribute('href');
      if (href) {
        await this.page.goto(href, { waitUntil: 'domcontentloaded' });
      } else {
        await codeLink.click();
      }
    } else {
      const editBtn = this.datalist.editButton(row).first();
      await expect(editBtn, 'Tombol edit void').toBeVisible({ timeout: 15_000 });
      await editBtn.click();
    }

    await expect(this.page).toHaveURL(MUTATION_TRANSFER_VOID_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    const generated = await this.readGeneratedCode();
    expect(generated.length).toBeGreaterThan(0);
    return generated;
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async ensureStatusOpen(): Promise<void> {
    const open = this.page.locator('#open');
    if (!(await open.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }
    if (await open.isChecked().catch(() => false)) {
      return;
    }
    if (await open.isDisabled().catch(() => false)) {
      return;
    }

    const put = this.page
      .waitForResponse(
        (response) =>
          /\/mutation-transfer-void\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('detail'),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await open.check({ force: true });
    await put;
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const waitPut = () =>
      this.page.waitForResponse(
        (response) =>
          /\/mutation-transfer-void\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('detail'),
        { timeout: 90_000 },
      );

    const saveResponse = waitPut().catch(() => null);
    await this.form.clickSaveAll();
    const response = await saveResponse;

    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update Transfer Void gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async selectFirstAvailableProduct(): Promise<string> {
    await this.expandTransferProductDetail();
    const combobox = this.selectProductCombobox;
    await expect(combobox).toBeVisible({ timeout: 45_000 });

    const bulkResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /mutation-transfer-middle-detail\/bulk-fifo/.test(response.url()),
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(800);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Opsi Select Product (stock di voided origin)').toBeVisible(
      { timeout: 45_000 },
    );

    const strong = option.locator('strong').first();
    const sku = (
      (await strong.textContent().catch(() => '')) ??
      (await option.textContent()) ??
      ''
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
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.mouse.click(8, 8).catch(() => undefined);
    await this.page.waitForTimeout(1_200);
    return sku.split(/\s+/)[0] || sku.slice(0, 32);
  }

  async assertDetailHasProduct(skuToken: string): Promise<void> {
    await this.expandTransferProductDetail();
    const token = skuToken.slice(0, 32).trim();
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tableRow = this.page
      .locator(
        '#DatalistDetail .p-datatable-tbody tr, #DatalistDetail tbody tr',
      )
      .filter({ hasText: new RegExp(escaped, 'i') })
      .locator('visible=true')
      .first();
    await expect(
      tableRow,
      `Product ${token} harus ada di Transfer Product Detail table`,
    ).toBeVisible({ timeout: 45_000 });
  }
}
