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

  get openStatusRadio() {
    return this.page.locator('#open');
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

  async selectWithoutPr(): Promise<void> {
    await this.withoutPrRadio.scrollIntoViewIfNeeded();
    await this.withoutPrRadio.check({ force: true });
    await expect(this.withoutPrRadio).toBeChecked({ timeout: 10_000 });
  }

  async selectPoDetailProduct(sku: string): Promise<void> {
    await this.expandPurchaseOrderDetail();

    const createResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('purchase-order-detail') &&
        response.url().includes('bulk-use') &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    const section = this.page.locator('#PurchaseOrderDetail');
    const combobox = section.locator('.multiselect').first().getByRole('combobox');
    await expect(combobox).toBeVisible({ timeout: 30_000 });
    await combobox.click();
    await combobox.fill(sku);
    await this.page.waitForTimeout(800);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: sku })
      .first();
    await expect(option, `Opsi PO detail "${sku}" harus ada`).toBeVisible({
      timeout: 20_000,
    });
    await option.click();
    await createResponse;
    await this.page.waitForTimeout(1_000);

    await expect(
      section.getByRole('row').filter({ hasText: this.skuPattern(sku) }).first(),
      `Baris PO detail untuk ${sku} harus muncul`,
    ).toBeVisible({ timeout: 30_000 });
  }

  async addPoDetailLines(lines: PoWithPrProductLine[]): Promise<void> {
    for (const line of lines) {
      await this.selectPoDetailProduct(line.sku);
      await this.fillPoQtyForSku(line.sku, line.poQty);
      await this.page.waitForTimeout(500);
    }
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

  private outstandingPanel(): Locator {
    return this.page
      .locator('div.fixed.rounded')
      .filter({ has: this.page.getByText(/Showing \d+ to \d+ of \d+ entries/i) })
      .last();
  }

  private outstandingTable(): Locator {
    return this.outstandingPanel()
      .locator('table')
      .filter({ has: this.page.getByRole('columnheader', { name: /req\. qty/i }) })
      .first();
  }

  private outstandingSearch(): Locator {
    return this.outstandingPanel().getByPlaceholder(/find something/i);
  }

  private skuPattern(sku: string): RegExp {
    const tokens = sku.trim().split(/[\s-]+/).filter(Boolean);
    const pattern = tokens
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('[\\s-]+');
    return new RegExp(pattern, 'i');
  }

  async clearOutstandingSearch(): Promise<void> {
    const search = this.outstandingSearch();
    if (await search.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await search.fill('');
      await this.page.waitForTimeout(1_200);
    }
  }

  async openAvailableProductsModal(): Promise<void> {
    await this.expandPurchaseOrderDetail();

    const panel = this.outstandingPanel();
    const useButton = panel.locator('button[class*="use-button"]').first();
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

    await expect(this.outstandingPanel()).toBeVisible({ timeout: 45_000 });
    await this.clearOutstandingSearch();
    await expect(
      panel.locator('button[class*="use-button"]').first(),
    ).toBeVisible({ timeout: 45_000 });
  }

  async searchOutstandingProducts(query: string): Promise<void> {
    await this.clearOutstandingSearch();

    const search = this.outstandingSearch();
    if (await search.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await search.fill(query);
      await this.page.waitForTimeout(1_500);
    }
  }

  async findOutstandingRow(sku: string): Promise<Locator> {
    await this.clearOutstandingSearch();
    const panel = this.outstandingPanel();
    const pattern = this.skuPattern(sku);

    const skuButton = panel.getByRole('button', { name: pattern }).first();
    if (await skuButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
      return skuButton.locator('xpath=ancestor::tr[1]');
    }

    let row = this.outstandingTable().getByRole('row').filter({ hasText: pattern }).first();
    if (await row.isVisible({ timeout: 3_000 }).catch(() => false)) {
      return row;
    }

    const searchTokens = [
      sku,
      sku.split('-').slice(1).join('-'),
      sku.split('-').pop() ?? sku,
    ];
    for (const token of searchTokens) {
      await this.searchOutstandingProducts(token);
      row = this.outstandingTable().getByRole('row').filter({ hasText: pattern }).first();
      if (await row.isVisible({ timeout: 5_000 }).catch(() => false)) {
        return row;
      }
    }

    await this.clearOutstandingSearch();
    return this.outstandingTable().getByRole('row').filter({ hasText: pattern }).first();
  }

  async clickUseOnOutstandingRow(sku: string): Promise<void> {
    const row = await this.findOutstandingRow(sku);
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
    for (const sku of skus) {
      const row = await this.findOutstandingRow(sku);
      await expect(row, `Baris outstanding untuk ${sku}`).toBeVisible({ timeout: 30_000 });
      const checkbox = row.locator('input[type="checkbox"]').first();
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.check({ force: true });
      }
      await this.clearOutstandingSearch();
    }
  }

  async clickBulkUseAboveOutstandingTable(): Promise<void> {
    const bulkUse = this.outstandingPanel().locator('button.tooltip-use').first();
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

  async selectOpenStatus(): Promise<void> {
    await this.openStatusRadio.scrollIntoViewIfNeeded();

    const updateResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/purchase-order\/\d+/.test(response.url()) &&
          response.request().method() === 'POST',
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.openStatusRadio.click({ force: true });
    await updateResponse;
    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await expect(this.openStatusRadio).toBeChecked({ timeout: 15_000 });
    await this.page.waitForTimeout(1_500);
  }

  async clickSaveAll(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/purchase-order\/\d+/.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 120_000 },
      )
      .catch(() => null);

    const saveAll = this.page.getByRole('button', { name: 'Save All', exact: true }).last();
    await expect(saveAll).toBeVisible({ timeout: 30_000 });
    await expect(saveAll).toBeEnabled({ timeout: 30_000 });
    await saveAll.scrollIntoViewIfNeeded();
    await saveAll.click();

    await saveResponse;
    await expect(saveAll).toBeEnabled({ timeout: 90_000 });
  }

  async assertPoStatusDraftInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/draft/i);
  }

  async assertPoStatusOpenInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/open/i);
  }

  async assertPoStatusApprovedInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/approved/i);
  }

  /**
   * Buka PO dari datalist — tombol ikon show/edit di kolom action (`#updateButton`).
   */
  async openShowFromDatalistByTrxCode(trxCode: string): Promise<void> {
    await this.openEditFromDatalistByTrxCode(trxCode);
  }

  /**
   * Approve dari datalist — tombol ikon ceklis di kolom action.
   */
  async clickApproveFromDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);

    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });

    const approveBtn = row.locator('button[class*="approve-button"]').first();
    await expect(approveBtn, `Tombol approve datalist untuk ${trxCode}`).toBeVisible({
      timeout: 30_000,
    });

    const approveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/purchase-order\/\d+\/approve/.test(response.url()) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await approveBtn.scrollIntoViewIfNeeded();
    await approveBtn.click();

    const confirmApprove = this.page.getByRole('button', { name: /^Approve$/i }).last();
    await expect(confirmApprove).toBeVisible({ timeout: 15_000 });
    await confirmApprove.click();

    const response = await approveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Approve PO dari datalist gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
  }

  /**
   * Delete dari datalist — tombol ikon trash di kolom action.
   */
  async clickDeleteFromDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);

    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });

    const deleteBtn = row.locator('button[class*="delete-button"]').first();
    await expect(deleteBtn, `Tombol delete datalist untuk ${trxCode}`).toBeVisible({
      timeout: 30_000,
    });
    await expect(deleteBtn).toBeEnabled({ timeout: 10_000 });

    const confirmDelete = this.page.getByRole('button', { name: /^Delete$/i }).last();

    const deleteResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/purchase-order\/\d+/.test(response.url()) &&
          response.request().method() === 'DELETE',
        { timeout: 90_000 },
      )
      .catch(() => null);

    await deleteBtn.scrollIntoViewIfNeeded();
    await deleteBtn.click();

    await expect(confirmDelete).toBeVisible({ timeout: 15_000 });
    await confirmDelete.click();
    await expect(confirmDelete).toBeHidden({ timeout: 60_000 });

    const response = await deleteResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;

      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Delete PO dari datalist gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }
  }

  async assertPoNotInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode });
    await expect(row).toHaveCount(0, { timeout: 45_000 });
  }

  async openEditFromDatalistByTrxCode(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);

    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });

    await this.datalist.editButton(row).click();
    await this.page.waitForURL(PURCHASE_ORDER_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await expect(this.poCodeInput).toHaveValue(trxCode, { timeout: 30_000 });
  }

  /** Hapus semua baris Purchase Order Detail agar qty PR kembali ke outstanding. */
  async deleteAllPoDetailLines(): Promise<void> {
    await this.expandPurchaseOrderDetail();
    const section = this.page.locator('#PurchaseOrderDetail');

    for (let attempt = 0; attempt < 20; attempt++) {
      const deleteBtn = section.locator('button.tooltip-delete, button#deleteButton').first();
      if (!(await deleteBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
        break;
      }

      const destroyResponse = this.page
        .waitForResponse(
          (response) =>
            response.url().includes('purchase-order-detail') &&
            response.request().method() === 'DELETE',
          { timeout: 60_000 },
        )
        .catch(() => null);

      await deleteBtn.scrollIntoViewIfNeeded();
      await deleteBtn.click();

      const confirmDelete = this.page.getByRole('button', { name: /^Delete$/i }).last();
      if (await confirmDelete.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await confirmDelete.click();
        await expect(confirmDelete).toBeHidden({ timeout: 60_000 });
      }

      await destroyResponse;
      await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
      await this.page.waitForTimeout(1_000);
    }
  }

  /**
   * Kosongkan detail draft PO lalu hapus header — mengembalikan qty outstanding PR.
   * Return false jika PO tidak ditemukan di datalist.
   */
  async releaseDraftPo(trxCode: string): Promise<boolean> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode });
    if ((await row.count()) === 0) {
      return false;
    }

    await this.openEditFromDatalistByTrxCode(trxCode);
    await this.deleteAllPoDetailLines();
    await this.clickSaveAll();
    await this.clickDeleteFromDatalist(trxCode);
    await this.assertPoNotInDatalist(trxCode);
    return true;
  }

  /** Hapus draft PO yang dibuat user Playwright automation dari datalist. */
  async deleteDraftPlaywrightPos(maxDeletes = 10): Promise<string[]> {
    await this.gotoDatalist();
    await this.datalist.search('Playwright', 2_000);

    const deleted: string[] = [];

    for (let i = 0; i < maxDeletes; i++) {
      const draftRow = this.page
        .getByRole('row')
        .filter({ hasText: /playwright/i })
        .filter({ hasText: /draft/i })
        .first();

      if (!(await draftRow.isVisible({ timeout: 5_000 }).catch(() => false))) {
        break;
      }

      const trxMatch = (await draftRow.textContent())?.match(/PO-[A-Z0-9]+/i);
      const trxCode = trxMatch?.[0];
      if (!trxCode) {
        break;
      }

      await this.releaseDraftPo(trxCode);
      deleted.push(trxCode);
      await this.gotoDatalist();
      await this.datalist.search('Playwright', 2_000);
    }

    return deleted;
  }
}
