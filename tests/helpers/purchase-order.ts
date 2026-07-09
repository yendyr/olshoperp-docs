import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const PURCHASE_ORDER_DATALIST_PATH = '/supplychain/purchase-order';
export const PURCHASE_ORDER_CREATE_PATH = '/supplychain/purchase-order/create';
export const PURCHASE_ORDER_EDIT_PATH_PATTERN =
  /\/supplychain\/purchase-order\/edit\/\d+/;

export function purchaseOrderEditPath(orderId: string | number): string {
  return `/supplychain/purchase-order/edit/${orderId}`;
}

export type PoWithPrProductLine = {
  sku: string;
  poQty: number;
};

/**
 * POM Purchase Order — smoke + form dasar + create with PR.
 * Selector dari pom-registry/purchase-order.yaml (verifikasi Vue Form.vue).
 */
export class PurchaseOrderPage {
  private readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(PURCHASE_ORDER_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/supplychain\/purchase-order\/create/, {
      timeout: 45_000,
    });
    await this.waitForCreateFormReady();
  }

  async gotoCreate(): Promise<void> {
    await this.page.goto(PURCHASE_ORDER_CREATE_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await this.waitForCreateFormReady();
  }

  private async waitForCreateFormReady(): Promise<void> {
    await this.form.expandAccordion('Basic Information');
    await expect(this.supplierCombobox).toBeVisible({ timeout: 45_000 });
  }

  async searchDatalist(query: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(query);
  }

  async assertTrxCodeVisibleInDatalist(code: string): Promise<void> {
    await this.datalist.assertRowContains(code);
  }

  get supplierCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Supplier');
  }

  get paymentTypeCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Payment Type');
  }

  get poCodeInput() {
    return this.page.locator('#code');
  }

  get withoutPrRadio() {
    return this.page.locator('#without_pr');
  }

  get withPrRadio() {
    return this.page.locator('#with_pr');
  }

  get draftStatusRadio() {
    return this.page.locator('#draft');
  }

  get availableProductsLink(): Locator {
    return this.page.getByText('Available Products', { exact: true });
  }

  async expandBasicInformation(): Promise<void> {
    await this.form.expandAccordion('Basic Information');
  }

  async expandPurchaseOrderDetail(): Promise<void> {
    await this.form.expandAccordion('Purchase Order Detail');
  }

  async assertTransactionDateAutoFilled(): Promise<void> {
    await expect(
      this.page.getByText(/\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}/).first(),
      'Transaction Date harus terisi otomatis',
    ).toBeVisible({ timeout: 15_000 });
  }

  async assertPaymentTypeAutoFilled(): Promise<void> {
    await expect(this.paymentTypeCombobox).toBeVisible();
    const label = await this.multiselect.selectedLabel(this.paymentTypeCombobox);
    expect(label, 'Payment Type harus terisi otomatis').not.toMatch(/^choose payment type$/i);
    expect(label.length).toBeGreaterThan(0);
  }

  async selectSupplier(supplierName: string): Promise<void> {
    await this.multiselect.ensureValue(this.supplierCombobox, supplierName);
    await this.page.waitForTimeout(1_000);
    await this.multiselect.assertFilled(this.paymentTypeCombobox, 'Payment Type');
  }

  async selectWithPr(): Promise<void> {
    await this.withPrRadio.scrollIntoViewIfNeeded();
    await this.withPrRadio.check({ force: true });
    await expect(this.withPrRadio).toBeChecked({ timeout: 10_000 });
  }

  async clickSaveAndNext(): Promise<void> {
    await this.form.clickSaveAndNext();
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<string> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/purchase-order\/?$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { id?: number; code?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save PO header gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(PURCHASE_ORDER_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 3_000).catch(() => undefined);
    await this.expandPurchaseOrderDetail();

    const trxCode = await this.getCurrentTransactionCode();
    expect(trxCode, 'PO code harus format PO-*').toMatch(/^PO-[A-F0-9]+$/i);
    return trxCode;
  }

  async getCurrentTransactionCode(): Promise<string> {
    const input = this.poCodeInput;
    await expect(input).toBeVisible({ timeout: 15_000 });
    const value = (await input.inputValue()).trim();
    if (/^PO-[A-F0-9]+$/i.test(value)) {
      return value.toUpperCase();
    }

    const breadcrumb = this.page.locator('.-intro-x, [class*="breadcrumb"]').first();
    if (await breadcrumb.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const match = ((await breadcrumb.textContent()) ?? '').match(/PO-[A-F0-9]+/i);
      if (match) {
        return match[0].toUpperCase();
      }
    }

    throw new Error('Transaction code PO-* tidak ditemukan di halaman');
  }

  private outstandingTable(): Locator {
    return this.page
      .locator('table')
      .filter({ has: this.page.locator('button[class*="use-button"]') })
      .last();
  }

  private skuPattern(sku: string): RegExp {
    const tokens = sku.trim().split(/[\s-]+/).filter(Boolean);
    const pattern = tokens
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('[\\s-]+');
    return new RegExp(pattern, 'i');
  }

  async clearOutstandingSearch(): Promise<void> {
    const search = this.page.getByPlaceholder(/find something/i).last();
    if (await search.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await search.fill('');
      await this.page.waitForTimeout(1_000);
    }
  }

  async openAvailableProductsModal(): Promise<void> {
    await this.expandPurchaseOrderDetail();

    const useButton = this.outstandingTable()
      .locator('button[class*="use-button"]')
      .first();
    if (await useButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await this.clearOutstandingSearch();
      return;
    }

    await this.availableProductsLink.scrollIntoViewIfNeeded();

    const outstandingResponse = this.page
      .waitForResponse(
        (response) =>
          response.url().includes('purchase-order-detail/outstanding') &&
          response.request().method() === 'GET',
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.availableProductsLink.click();
    await outstandingResponse;
    await this.page.waitForTimeout(1_000);

    await expect(this.outstandingTable()).toBeVisible({ timeout: 45_000 });
    await this.clearOutstandingSearch();
    await expect(
      this.outstandingTable().locator('button[class*="use-button"]').first(),
    ).toBeVisible({ timeout: 45_000 });
  }

  async searchOutstandingProducts(query: string): Promise<void> {
    await this.clearOutstandingSearch();

    const search = this.page.getByPlaceholder(/find something/i).last();
    if (await search.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await search.fill(query);
      await this.page.waitForTimeout(1_500);
      return;
    }

    const fallback = this.page.getByRole('searchbox').last();
    if (await fallback.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await fallback.fill(query);
      await this.page.waitForTimeout(1_500);
    }
  }

  async clickUseOnOutstandingRow(sku: string): Promise<void> {
    await this.searchOutstandingProducts(sku);

    const table = this.outstandingTable();
    const row = table.getByRole('row').filter({ hasText: this.skuPattern(sku) }).first();
    await expect(row, `Baris outstanding untuk ${sku}`).toBeVisible({ timeout: 30_000 });

    await row.locator('button[class*="use-button"]').first().click();
    await expect(
      this.page.getByRole('heading', { name: 'Use this Product to Purchase Order' }),
    ).toBeVisible({ timeout: 15_000 });

    await this.page.getByRole('button', { name: /^Use$/i }).last().click();
    await expect(
      this.page.getByRole('heading', { name: 'Use this Product to Purchase Order' }),
    ).toBeHidden({ timeout: 60_000 });
    await this.page.waitForTimeout(1_000);
  }

  async checkOutstandingRows(skus: string[]): Promise<void> {
    const table = this.outstandingTable();
    for (const sku of skus) {
      await this.searchOutstandingProducts(sku);
      const row = table.getByRole('row').filter({ hasText: this.skuPattern(sku) }).first();
      await expect(row, `Baris outstanding untuk ${sku}`).toBeVisible({ timeout: 30_000 });
      const checkbox = row.locator('input[type="checkbox"]').first();
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.check({ force: true });
      }
    }
  }

  async clickBulkUseAboveOutstandingTable(): Promise<void> {
    const bulkUse = this.outstandingTable()
      .locator('xpath=ancestor::div[contains(@class,"intro") or contains(@class,"fixed")]')
      .locator('button.tooltip-use')
      .first();
    await expect(bulkUse).toBeVisible({ timeout: 15_000 });
    await bulkUse.click();
    await waitForSuccessToast(this.page, 15_000);
    await this.page.waitForTimeout(1_500);
  }

  async fillPoQtyForSku(sku: string, poQty: number): Promise<void> {
    await this.expandPurchaseOrderDetail();
    const section = this.page.locator('#PurchaseOrderDetail');
    const row = section.getByRole('row').filter({ hasText: this.skuPattern(sku) }).first();
    await expect(row, `Baris PO detail untuk ${sku}`).toBeVisible({ timeout: 30_000 });

    const qtyInput = row.getByRole('textbox').first();
    await expect(qtyInput, `PO Qty input untuk ${sku}`).toBeVisible({ timeout: 10_000 });
    await qtyInput.click();
    await qtyInput.fill(String(poQty));
    await qtyInput.press('Tab');
    await this.page.waitForTimeout(800);
  }

  async selectDraftStatus(): Promise<void> {
    await this.draftStatusRadio.scrollIntoViewIfNeeded();
    await this.draftStatusRadio.check({ force: true });
    await expect(this.draftStatusRadio).toBeChecked({ timeout: 10_000 });
  }

  async clickSaveAll(): Promise<void> {
    await this.form.clickSaveAll();
    await expect(this.form.saveAllButton).toBeEnabled({ timeout: 60_000 });
  }

  async assertPoStatusDraftInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/draft/i);
  }
}
