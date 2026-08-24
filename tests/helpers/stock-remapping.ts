import { Locator, Page, expect } from '@playwright/test';
import { getApiUrl, readAuthFromPage } from './company-access';
import {
  OlshopDatalist,
  OlshopFormActions,
  OlshopMultiselect,
  getDetailDataRowTexts,
  extractIdentifierOrder,
} from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const STOCK_REMAPPING_DATALIST_PATH = '/accounting/stock-remapping';
export const STOCK_REMAPPING_EDIT_PATH_PATTERN =
  /\/accounting\/stock-remapping\/edit\/\d+/;

export type ApiCallResult = {
  ok: boolean;
  status: number;
  message: string;
  bodyPreview: string;
};

/**
 * POM Stock Remapping (FA).
 * Selector: tests/pom-registry/stock-remapping.yaml
 */
export class StockRemappingPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code').first();
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder('Add description or notes...').first();
  }

  get buildingCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Building');
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get detailSection(): Locator {
    return this.page.locator('#StockRemappingDetail').or(
      this.page
        .locator('section, div')
        .filter({ has: this.page.getByRole('button', { name: /Stock Remapping Detail/i }) })
        .first(),
    );
  }

  currentEditId(): string | null {
    return this.page.url().match(/stock-remapping\/edit\/(\d+)/)?.[1] ?? null;
  }

  currentEditUrl(): string | null {
    const id = this.currentEditId();
    return id
      ? `https://staging.olshoperp.com/accounting/stock-remapping/edit/${id}`
      : null;
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(STOCK_REMAPPING_DATALIST_PATH, 'link');
  }

  async isImportHistoryOpen(): Promise<boolean> {
    return this.page
      .getByRole('tab', { name: /^Import History$/i })
      .isVisible({ timeout: 1_500 })
      .catch(() => false);
  }

  async expandDetail(): Promise<void> {
    if (await this.isImportHistoryOpen()) {
      return;
    }
    const btn = this.page
      .getByRole('button', { name: /Stock Remapping Detail/i })
      .or(this.page.getByText(/^Stock Remapping Detail$/i));
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
  }

  async expandBasic(): Promise<void> {
    await this.form.expandAccordion('Basic Information').catch(() => undefined);
  }

  async openCreateOrAutoEdit(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');
    const raced = await Promise.race([
      this.page
        .waitForURL(STOCK_REMAPPING_EDIT_PATH_PATTERN, { timeout: 90_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/accounting\/stock-remapping\/create$/, { timeout: 90_000 })
        .then(() => 'create' as const),
    ]);
    await dismissStagingBanner(this.page);
    await this.expandBasic();
    if (raced === 'edit') {
      await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
      return 'edit';
    }
    const autoEdit = await this.page
      .waitForURL(STOCK_REMAPPING_EDIT_PATH_PATTERN, { timeout: 20_000 })
      .then(() => true)
      .catch(() => false);
    if (autoEdit) {
      await this.expandBasic();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
      return 'edit';
    }
    return 'create';
  }

  async fillDescription(text: string): Promise<void> {
    await this.descriptionInput.fill(text.slice(0, 150));
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async clickSaveAllAndWait(): Promise<ApiCallResult> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /accounting\/stock-remapping\/\d+/.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()) &&
          !response.url().includes('detail') &&
          !response.url().includes('approve'),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();
    const response = await saveResponse;
    const parsed = await this.parseResponse(response);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async closeOverlays(): Promise<void> {
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(300);
  }

  async setBuilding(fragment: string): Promise<string> {
    await this.closeOverlays();
    await this.expandBasic();
    let combobox = this.buildingCombobox;
    if (!(await combobox.isVisible({ timeout: 8_000 }).catch(() => false))) {
      const root = this.page
        .locator('#BasicInformation .multiselect, .multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Choose Building"]'),
        })
        .first();
      await root.click();
      combobox = root.locator('.multiselect-search').first();
    }
    await this.multiselect.open(combobox);
    await combobox.fill('').catch(() => undefined);
    await combobox.fill(fragment).catch(async () => {
      await combobox.pressSequentially(fragment, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({ hasText: new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })
      .filter({ hasNotText: /Rack/i })
      .first();
    await expect(option, `Building ${fragment}`).toBeVisible({ timeout: 25_000 });
    const label = ((await option.textContent()) ?? '').replace(/\s+/g, ' ').trim();
    await option.click({ force: true });
    await this.page.waitForTimeout(500);
    await this.clickSaveAllAndWait();
    return label;
  }

  availableProductsPanel(): Locator {
    return this.page
      .locator('div.fixed')
      .filter({ has: this.page.getByPlaceholder(/find something/i) })
      .filter({ has: this.page.locator('table') })
      .first();
  }

  async openAvailableProducts(): Promise<Locator> {
    await this.expandDetail();
    const availableResponse = this.page
      .waitForResponse(
        (response) => /available[-_]products/i.test(response.url()),
        { timeout: 60_000 },
      )
      .catch(() => null);
    await this.page.getByText('Available Products', { exact: true }).click();
    await availableResponse;
    await this.page.waitForTimeout(1_200);
    const panel = this.availableProductsPanel();
    await expect(panel, 'Panel Available Products').toBeVisible({ timeout: 45_000 });
    return panel;
  }

  async isSkuInAvailableProducts(sku: string): Promise<boolean> {
    const panel = await this.openAvailableProducts();
    const search = panel.getByPlaceholder(/find something/i).first();
    await expect(search).toBeVisible({ timeout: 15_000 });
    await search.fill(sku);
    await this.page.waitForTimeout(1_800);
    const row = panel
      .locator('tbody tr')
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    const found = await row.isVisible({ timeout: 8_000 }).catch(() => false);
    await this.closeOverlays();
    return found;
  }

  async addOriginViaAvailableProducts(sku: string): Promise<ApiCallResult> {
    const panel = await this.openAvailableProducts();
    const search = panel.getByPlaceholder(/find something/i).first();
    await expect(search).toBeVisible({ timeout: 15_000 });
    await search.fill(sku);
    await this.page.waitForTimeout(1_800);

    const row = panel
      .locator('tbody tr')
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(row, `Available Products ${sku}`).toBeVisible({ timeout: 30_000 });
    await row.locator('input[type="checkbox"]').first().check({ force: true });
    await this.page.waitForTimeout(400);

    const useBtn = panel
      .locator('button.tooltip-use, button[class*="use-button"]')
      .or(panel.getByRole('button', { name: /^Use$/i }))
      .first();
    await expect(useBtn, 'Tombol Use / Bulk Use').toBeVisible({ timeout: 15_000 });

    const post = this.page.waitForResponse(
      (response) =>
        /stock-remapping-detail/i.test(response.url()) &&
        ['POST', 'PUT'].includes(response.request().method()),
      { timeout: 90_000 },
    );
    await useBtn.click();
    const response = await post;
    const parsed = await this.parseResponse(response);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.closeOverlays();
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async addOriginSku(sku: string): Promise<ApiCallResult> {
    return this.addOriginViaAvailableProducts(sku);
  }

  async addProductViaSelectProduct(sku: string): Promise<ApiCallResult> {
    await this.expandDetail();
    let combobox = this.selectProductCombobox;
    if (!(await combobox.isVisible({ timeout: 8_000 }).catch(() => false))) {
      const root = this.page
        .locator('.multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Select Product"]'),
        })
        .first();
      await root.click();
      combobox = root.locator('.multiselect-search').first();
    }

    const createResponse = this.page.waitForResponse(
      (response) =>
        /stock-remapping-detail/i.test(response.url()) &&
        ['POST', 'PUT'].includes(response.request().method()),
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox);
    await combobox.fill('').catch(() => undefined);
    await combobox.fill(sku).catch(async () => {
      await combobox.pressSequentially(sku, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(option, `Product ${sku}`).toBeVisible({ timeout: 25_000 });
    await option.click();

    const response = await createResponse;
    const parsed = await this.parseResponse(response);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
    return parsed;
  }

  detailRowBySku(sku: string): Locator {
    return this.page
      .locator('#StockRemappingDetail tbody tr, table tbody tr')
      .filter({ hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })
      .first();
  }

  async readOriginOrder(skus: string[]): Promise<string[]> {
    await this.expandDetail();
    const section = this.page.locator('#StockRemappingDetail').first();
    const texts = await getDetailDataRowTexts(
      (await section.count()) ? section : this.page.locator('table').nth(1),
    );
    return extractIdentifierOrder(texts, skus);
  }

  async setRemappedToOnRow(originSku: string, remappedSku: string): Promise<ApiCallResult> {
    await this.expandDetail();
    const row = this.detailRowBySku(originSku);
    await expect(row, `Baris Origin ${originSku}`).toBeVisible({ timeout: 30_000 });

    const combo = row
      .locator('[aria-placeholder*="Remapped"], [aria-placeholder*="Select"], .multiselect-search, [role="combobox"]')
      .nth(1)
      .or(row.locator('.multiselect').nth(1).locator('input, [role="combobox"]'))
      .or(row.locator('td').nth(2).locator('input, [role="combobox"], .multiselect'));

    const cell = row.locator('td').nth(2);
    await cell.click({ force: true }).catch(() => undefined);
    await this.page.waitForTimeout(400);

    let target = combo;
    if (!(await target.first().isVisible({ timeout: 3_000 }).catch(() => false))) {
      target = this.page.locator('.multiselect-search:visible, [role="combobox"]:visible').last();
    }

    const put = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping-detail/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await target.first().click({ force: true }).catch(() => undefined);
    await target.first().fill('').catch(() => undefined);
    await target
      .first()
      .fill(remappedSku)
      .catch(async () => {
        await target.first().pressSequentially(remappedSku, { delay: 40 });
      });
    await this.page.waitForTimeout(1_000);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({
        hasText: new RegExp(remappedSku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(option, `Opsi Remapped To ${remappedSku}`).toBeVisible({
      timeout: 20_000,
    });
    await option.click();

    const response = await put;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async setOriginOnRow(currentSku: string, newOriginSku: string): Promise<ApiCallResult> {
    await this.expandDetail();
    const row = this.detailRowBySku(currentSku);
    await expect(row, `Baris ${currentSku}`).toBeVisible({ timeout: 30_000 });

    const originCombo = row
      .locator('.multiselect')
      .first()
      .locator('input, [role="combobox"]')
      .first();
    await row.locator('td').nth(1).click({ force: true }).catch(() => undefined);
    await this.page.waitForTimeout(400);

    const put = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping-detail/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    const target = (await originCombo.isVisible().catch(() => false))
      ? originCombo
      : this.page.locator('.multiselect-search:visible, [role="combobox"]:visible').first();

    await target.click({ force: true }).catch(() => undefined);
    await target.fill('').catch(() => undefined);
    await target.fill(newOriginSku).catch(async () => {
      await target.pressSequentially(newOriginSku, { delay: 40 });
    });
    await this.page.waitForTimeout(1_000);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({
        hasText: new RegExp(newOriginSku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(option, `Opsi Origin ${newOriginSku}`).toBeVisible({ timeout: 20_000 });
    await option.click();

    const response = await put;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async setQtyOnRow(sku: string, qty: number): Promise<ApiCallResult> {
    await this.expandDetail();
    const row = this.detailRowBySku(sku);
    await expect(row, `Baris ${sku}`).toBeVisible({ timeout: 30_000 });

    const qtyCell = row.locator('td').filter({ hasText: /^\s*\d/ }).first();
    await qtyCell.dblclick({ force: true }).catch(async () => {
      await qtyCell.click({ force: true });
    });
    await this.page.waitForTimeout(300);

    const input = this.page.locator('input:visible:not([type="checkbox"])').last();
    const put = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping-detail/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 45_000 },
      )
      .catch(() => null);

    await input.fill(String(qty));
    await input.press('Enter');
    await this.page.keyboard.press('Escape').catch(() => undefined);

    const response = await put;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async setDescriptionOnRow(sku: string, text: string): Promise<void> {
    await this.expandDetail();
    const row = this.detailRowBySku(sku);
    const descCell = row.locator('td').last();
    await descCell.dblclick({ force: true }).catch(() => undefined);
    const input = this.page.locator('input:visible, textarea:visible').last();
    await input.fill(text.slice(0, 150)).catch(() => undefined);
    await input.press('Enter').catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async tryApprove(description = 'ETM-15526 retest'): Promise<ApiCallResult> {
    const btn = this.page
      .locator('button')
      .filter({
        has: this.page.locator('.fa-check-double, [data-icon="check-double"]'),
      })
      .or(this.page.locator('button.bg-info').filter({ hasNotText: /Save/i }))
      .last();
    await expect(btn, 'Tombol Approve').toBeVisible({ timeout: 20_000 });

    const approveResponse = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping\/\d+\/approve/i.test(response.url()) &&
          response.request().method() === 'POST',
        { timeout: 90_000 },
      )
      .catch(() => null);

    await btn.click();
    const modalDesc = this.page
      .getByPlaceholder(/description|notes/i)
      .last()
      .or(this.page.locator('textarea:visible').last());
    if (await modalDesc.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await modalDesc.fill(description);
    }
    const confirm = this.page.getByRole('button', { name: /^Approve$/i }).last();
    if (await confirm.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await confirm.click();
    }

    const response = await approveResponse;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(1_000);
    return parsed;
  }

  async openEditById(id: string): Promise<void> {
    await this.page.goto(`/accounting/stock-remapping/edit/${id}`, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await this.expandBasic();
    await this.expandDetail();
  }

  async findEditableWithOriginSkus(skus: string[]): Promise<{
    id: string;
    code: string;
    url: string;
    details: Array<{ originSku: string; remappedSku: string; qty: number | null }>;
  } | null> {
    const auth = await readAuthFromPage(this.page);
    if (!auth.token) return null;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };
    const list = await this.page.request.get(
      `${getApiUrl()}/accounting/stock-remapping?start=0&length=200`,
      { headers },
    );
    if (!list.ok()) return null;
    const json = (await list.json().catch(() => null)) as {
      data?: Array<Record<string, unknown>>;
    } | null;
    const rows = json?.data ?? [];
    const needed = skus.map((sku) => sku.toLowerCase());

    for (const row of rows) {
      if (row.can_update === false) continue;
      const status = String(row.transaction_status ?? '').toLowerCase();
      if (status === 'closed' || status === 'void' || status === 'voided') continue;
      const id = String(row.id ?? '');
      if (!id) continue;
      const detailRes = await this.page.request.get(
        `${getApiUrl()}/accounting/stock-remapping/${id}`,
        { headers },
      );
      if (!detailRes.ok()) continue;
      const body = (await detailRes.json().catch(() => null)) as {
        data?: Record<string, unknown>;
      } | null;
      const data = body?.data ?? (body as Record<string, unknown> | null);
      const details = this.collectDetails(data);
      const origins = details.map((d) => d.originSku.toLowerCase());
      if (needed.every((sku) => origins.some((origin) => origin === sku))) {
        return {
          id,
          code: String(row.code ?? ''),
          url: `https://staging.olshoperp.com/accounting/stock-remapping/edit/${id}`,
          details,
        };
      }
    }
    return null;
  }

  async fetchApi(): Promise<Record<string, unknown> | null> {
    const id = this.currentEditId();
    if (!id) return null;
    const auth = await readAuthFromPage(this.page);
    if (!auth.token) return null;
    const res = await this.page.request.get(
      `${getApiUrl()}/accounting/stock-remapping/${id}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );
    if (!res.ok()) return null;
    const body = (await res.json().catch(() => null)) as {
      data?: Record<string, unknown>;
    } | null;
    return body?.data ?? (body as Record<string, unknown> | null);
  }

  collectDetails(so: Record<string, unknown> | null): Array<{
    originSku: string;
    remappedSku: string;
    qty: number | null;
  }> {
    if (!so) return [];
    const details = (so.stock_remapping_details ??
      so.details ??
      []) as Array<Record<string, unknown>>;
    return details.map((d) => {
      const origin = (d.product_origin ?? d.origin ?? {}) as Record<string, unknown>;
      const remap = (d.product_remapped_to ?? d.remapped ?? {}) as Record<
        string,
        unknown
      >;
      return {
        originSku: String(origin.sku ?? d.origin_sku ?? ''),
        remappedSku: String(remap.sku ?? d.remapped_sku ?? ''),
        qty: Number.isFinite(Number(d.quantity ?? d.qty))
          ? Number(d.quantity ?? d.qty)
          : null,
      };
    });
  }

  async importDetailFile(filePath: string): Promise<ApiCallResult> {
    await this.expandDetail();
    if (!(await this.isImportHistoryOpen())) {
      const importBtn = this.page
        .locator('#StockRemappingDetail')
        .getByRole('button', { name: /^Import$/i })
        .or(this.page.getByRole('button', { name: /^Import$/i }))
        .first();
      await expect(importBtn, 'Tombol Import di detail').toBeVisible({
        timeout: 20_000,
      });
      await importBtn.click();
      await expect(
        this.page.getByRole('tab', { name: /^Import History$/i }),
        'Tab Import History',
      ).toBeVisible({ timeout: 20_000 });
    }

    const importInDialog = this.page
      .getByRole('tabpanel', { name: /Import History/i })
      .getByRole('button', { name: /^Import$/i })
      .or(
        this.page
          .locator('[role="dialog"]')
          .getByRole('button', { name: /^Import$/i }),
      )
      .first();
    await importInDialog.click({ force: true });
    await this.page.waitForTimeout(500);

    const fileInput = this.page.locator('input[type="file"]').last();
    await expect(fileInput).toBeAttached({ timeout: 20_000 });

    const upload = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping/i.test(response.url()) &&
          /upload|import/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await fileInput.setInputFiles(filePath);
    const response = await upload;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(3_000);
    return parsed;
  }

  async readImportHistorySummary(): Promise<{
    text: string;
    failedRow: number | null;
    successRow: number | null;
    errorLogs: string;
  }> {
    const historyTab = this.page.getByRole('tab', { name: /^Import History$/i });
    if (await historyTab.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await historyTab.first().click({ force: true });
    }
    await this.page.waitForTimeout(1_200);

    const tableText = (
      (await this.page
        .locator('table')
        .filter({ hasText: /Failed Row|Success Row|File Name/i })
        .first()
        .innerText()
        .catch(() => '')) ?? ''
    ).replace(/\s+/g, ' ');

    const failedMatch = tableText.match(/Failed Row[^\d]{0,8}(\d+)/i);
    const successMatch = tableText.match(/Success Row[^\d]{0,8}(\d+)/i);
    const trailing = [...tableText.matchAll(/\b(\d+)\b/g)].map((m) => Number(m[1]));

    const errorTab = this.page.getByRole('tab', { name: /View Error Logs/i });
    let errorLogs = '';
    if (await errorTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await errorTab.click({ force: true });
      await this.page.waitForTimeout(1_000);
      errorLogs = (
        (await this.page
          .getByRole('table')
          .filter({ has: this.page.getByRole('columnheader', { name: /Message/i }) })
          .innerText()
          .catch(() => '')) ?? ''
      ).replace(/\s+/g, ' ');
      await historyTab.first().click().catch(() => undefined);
    }

    return {
      text: tableText.slice(0, 800),
      failedRow: failedMatch
        ? Number(failedMatch[1])
        : trailing.length >= 2
          ? trailing[trailing.length - 2]
          : null,
      successRow: successMatch
        ? Number(successMatch[1])
        : trailing.length >= 1
          ? trailing[trailing.length - 1]
          : null,
      errorLogs: errorLogs.slice(0, 1500),
    };
  }

  async readToastText(): Promise<string> {
    const toast = this.page.locator('.toastify, [class*="toast"]').first();
    if (await toast.isVisible({ timeout: 2_000 }).catch(() => false)) {
      return ((await toast.innerText()) ?? '').replace(/\s+/g, ' ').trim();
    }
    return '';
  }

  private async parseResponse(
    response: Awaited<ReturnType<Page['waitForResponse']>> | null,
  ): Promise<ApiCallResult> {
    if (!response) {
      return {
        ok: false,
        status: 0,
        message: await this.readToastText(),
        bodyPreview: '',
      };
    }
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
      message?: string;
    } | null;
    const message =
      body?.status?.message ?? body?.message ?? (await response.text().catch(() => ''));
    const errorFlag = Number(body?.status?.error ?? 0);
    return {
      ok: response.ok() && !errorFlag,
      status: response.status(),
      message: String(message ?? ''),
      bodyPreview: JSON.stringify(body ?? {}).slice(0, 800),
    };
  }
}

export function isSelfRemapRejected(result: ApiCallResult, toast = ''): boolean {
  const blob = `${result.message} ${toast} ${result.bodyPreview}`.toLowerCase();
  if (!result.ok && /different|cannot be the same|must be different|same sku|origin/i.test(blob)) {
    return true;
  }
  return /must be different|cannot be the same/.test(blob);
}
