import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './company-access';

export const PURCHASE_REQUISITION_DATALIST_PATH = '/supplychain/purchase-requisition';
export const PURCHASE_REQUISITION_CREATE_PATH = '/supplychain/purchase-requisition/create';
export const PURCHASE_REQUISITION_EDIT_PATH_PATTERN =
  /\/supplychain\/purchase-requisition\/edit\/\d+/;

export function purchaseRequisitionEditPath(requisitionId: string | number): string {
  return `/supplychain/purchase-requisition/edit/${requisitionId}`;
}

export type PurchaseRequisitionProductLine = {
  sku: string;
  requestQty: number;
};

/**
 * POM Purchase Requisition — datalist, create, edit (header + detail lines).
 */
export class PurchaseRequisitionPage {
  constructor(private readonly page: Page) {}

  // ─── Datalist — locators & click methods (canonical selectors) ───────────

  /** Edit/show per baris — `#updateButton`; URL edit ada di atribut `value`. */
  editButton(row?: Locator): Locator {
    return (row ?? this.page).locator('#updateButton');
  }

  get bulkOperationButton(): Locator {
    return this.page.locator('#triggerBulkOperationButton');
  }

  get createButton(): Locator {
    return this.page.locator('button:has-text("Create")');
  }

  get advancedFilterButton(): Locator {
    return this.page.locator('button:has-text("Advanced Filter")');
  }

  get bulkApproveButton(): Locator {
    return this.page.locator('button.bulk-approve');
  }

  get deleteBulkButton(): Locator {
    return this.page.locator('button.delete-bulk');
  }

  get exportButton(): Locator {
    return this.page.locator('button:has-text("Export")');
  }

  async clickCreateButton(): Promise<void> {
    const btn = this.createButton.or(this.page.getByRole('link', { name: 'Create', exact: true }));
    await btn.first().scrollIntoViewIfNeeded();
    await btn.first().click();
  }

  /**
   * Klik edit/show di datalist.
   * Jika `trxCode` diberikan, target baris tersebut; jika tidak, baris pertama yang punya `#updateButton`.
   */
  async clickEditButton(trxCode?: string): Promise<void> {
    const row = trxCode
      ? this.page.getByRole('row').filter({ hasText: trxCode }).first()
      : this.page.locator('#updateButton').first().locator('xpath=ancestor::tr[1]');

    const button = trxCode ? this.editButton(row) : this.editButton().first();
    await expect(button).toBeVisible({ timeout: 30_000 });

    const rawValue = (await button.getAttribute('value')) ?? '';
    const editPath = rawValue.trim();

    await button.click();

    const navigated = await this.page
      .waitForURL(PURCHASE_REQUISITION_EDIT_PATH_PATTERN, { timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    if (!navigated && editPath) {
      await this.page.goto(editPath, { waitUntil: 'domcontentloaded' });
      await this.page.waitForURL(PURCHASE_REQUISITION_EDIT_PATH_PATTERN, {
        timeout: 45_000,
      });
    }
  }

  async clickBulkOperationButton(): Promise<void> {
    await this.bulkOperationButton.scrollIntoViewIfNeeded();
    await this.bulkOperationButton.click();
  }

  async clickAdvancedFilterButton(): Promise<void> {
    await this.advancedFilterButton.scrollIntoViewIfNeeded();
    await this.advancedFilterButton.click();
  }

  async clickBulkApproveButton(): Promise<void> {
    await this.bulkApproveButton.scrollIntoViewIfNeeded();
    await this.bulkApproveButton.click();
  }

  async clickDeleteBulkButton(): Promise<void> {
    await this.deleteBulkButton.scrollIntoViewIfNeeded();
    await this.deleteBulkButton.click();
  }

  async clickExportButton(): Promise<void> {
    await this.exportButton.scrollIntoViewIfNeeded();
    await this.exportButton.click();
  }

  // ─── Navigation ─────────────────────────────────────────────────────────

  async gotoDatalist(): Promise<void> {
    await this.page.goto(PURCHASE_REQUISITION_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.createButton.or(this.page.getByRole('link', { name: 'Create' })).first()).toBeVisible({
      timeout: 45_000,
    });
    await expect(this.page.getByRole('table').first()).toBeVisible();
  }

  async gotoCreate(): Promise<void> {
    await this.page.goto(PURCHASE_REQUISITION_CREATE_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.saveAndNextButton).toBeVisible({ timeout: 45_000 });
  }

  async gotoEdit(requisitionId: string | number): Promise<void> {
    await this.page.goto(purchaseRequisitionEditPath(requisitionId), {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.saveAllButton).toBeVisible({ timeout: 45_000 });
  }

  /** TC step 1 — klik Create di datalist */
  async openCreateForm(): Promise<void> {
    await this.clickCreateButton();
    await this.page.waitForURL(/\/supplychain\/purchase-requisition\/create/, {
      timeout: 45_000,
    });
    await expect(this.basicInformationButton).toBeVisible({ timeout: 45_000 });
    await expect(this.saveAndNextButton).toBeVisible({ timeout: 45_000 });
  }

  // ─── TC steps 2–3: Basic Information ────────────────────────────────────

  async assertTransactionDateAutoFilled(): Promise<void> {
    const combobox = this.transactionDateCombobox;
    await expect(combobox, 'Transaction Date harus terlihat').toBeVisible();

    const value = await this.getTransactionDateDisplayValue();
    expect(value.length, 'Transaction Date harus sudah terisi').toBeGreaterThan(0);
    expect(value, 'Transaction Date harus format tanggal-waktu').toMatch(
      /\d{2}-\d{2}-\d{4}/,
    );
  }

  async clickSaveAndNext(): Promise<void> {
    await this.saveAndNextButton.scrollIntoViewIfNeeded();

    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/api\/supplychain\/purchase-requisition\/?$/.test(
          new URL(response.url()).pathname,
        ) && response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.saveAndNextButton.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { id?: number; purchase_requisition_id?: number };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save PR header gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    const requisitionId = body?.data?.id ?? body?.data?.purchase_requisition_id;

    const navigatedToEdit = this.page
      .waitForURL(PURCHASE_REQUISITION_EDIT_PATH_PATTERN, { timeout: 30_000 })
      .then(() => true)
      .catch(() => false);

    const detailSectionVisible = expect(
      this.purchaseRequisitionDetailSectionButton,
    )
      .toBeVisible({ timeout: 30_000 })
      .then(() => true)
      .catch(() => false);

    const [onEditUrl, detailReady] = await Promise.all([
      navigatedToEdit,
      detailSectionVisible,
    ]);

    if (!onEditUrl && !detailReady && requisitionId) {
      await this.page.goto(purchaseRequisitionEditPath(requisitionId), {
        waitUntil: 'domcontentloaded',
      });
      await dismissStagingBanner(this.page);
    }

    await expect(this.purchaseRequisitionDetailSectionButton).toBeVisible({
      timeout: 45_000,
    });
  }

  async assertSaveAndNextSucceeded(): Promise<string> {
    await this.assertSuccessToastVisible();
    await expect(this.purchaseRequisitionDetailSectionButton).toBeVisible({
      timeout: 30_000,
    });

    const trxCode = await this.getCurrentTransactionCode();
    expect(trxCode, 'Transaction code harus format PR-*').toMatch(/^PR-[A-F0-9]+$/i);
    return trxCode;
  }

  async assertSuccessToastVisible(): Promise<void> {
    await expect(
      this.successToast.first(),
      'Toast sukses harus muncul di pojok kanan atas setelah Save & Next',
    ).toBeVisible({ timeout: 15_000 });
  }

  // ─── TC steps 4–5: Purchase Requisition Detail ───────────────────────────

  async openPurchaseRequisitionDetailSection(): Promise<void> {
    const section = this.purchaseRequisitionDetailSectionButton;
    await section.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < 3; attempt++) {
      if ((await section.getAttribute('aria-expanded')) === 'true') {
        break;
      }
      await section.click();
      await this.page.waitForTimeout(800);
    }

    await expect(section).toHaveAttribute('aria-expanded', 'true', {
      timeout: 20_000,
    });
    await expect(this.selectProductCombobox).toBeVisible({ timeout: 30_000 });
  }

  async addProductDetailLine(sku: string, requestQty: number): Promise<void> {
    await this.selectProduct(sku);
    await this.fillRequestQtyForSku(sku, requestQty);
  }

  async addProductDetailLines(lines: PurchaseRequisitionProductLine[]): Promise<void> {
    for (const line of lines) {
      await this.addProductDetailLine(line.sku, line.requestQty);
    }
  }

  async selectProduct(sku: string): Promise<void> {
    const combobox = this.selectProductCombobox;
    await combobox.scrollIntoViewIfNeeded();
    await combobox.click();
    await this.page.waitForTimeout(300);

    await combobox.fill(sku).catch(async () => {
      await combobox.pressSequentially(sku, { delay: 50 });
    });
    await this.page.waitForTimeout(500);

    const option = this.page.getByRole('option', { name: sku, exact: true });
    if (await option.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await option.click();
    } else {
      await this.dropdownOptions.filter({ hasText: sku }).first().click();
    }

    await expect(this.detailTable).toContainText(sku, { timeout: 30_000 });
  }

  async fillRequestQtyForSku(sku: string, requestQty: number): Promise<void> {
    const row = this.productDetailRow(sku);
    await expect(row).toBeVisible({ timeout: 30_000 });

    const qtyInput = row
      .getByRole('spinbutton')
      .or(row.getByRole('textbox'))
      .or(row.locator('input[type="number"], input[type="text"]'))
      .first();

    await qtyInput.scrollIntoViewIfNeeded();
    await qtyInput.click();
    await qtyInput.fill(String(requestQty));
    await qtyInput.blur();
    await this.page.waitForTimeout(300);

    await expect(qtyInput).toHaveValue(String(requestQty));
  }

  // ─── TC step 6: Save ─────────────────────────────────────────────────────

  async clickSaveAll(): Promise<void> {
    await this.saveAllButton.scrollIntoViewIfNeeded();
    await this.saveAllButton.click();
    await expect(this.saveAllButton).toBeEnabled({ timeout: 60_000 });
  }

  // ─── Expected result & edit flow ─────────────────────────────────────────

  async searchDatalist(query: string): Promise<void> {
    await this.gotoDatalist();
    await this.fillDatalistSearch(query);
  }

  async fillDatalistSearch(query: string): Promise<void> {
    await this.datalistSearchInput.fill(query);
    await this.page.waitForTimeout(1_500);
  }

  async getCurrentTransactionCode(): Promise<string> {
    const fromField = await this.getTransactionCodeFromBasicInformation();
    if (fromField) {
      return fromField;
    }

    const breadcrumb = this.page.locator('.-intro-x, [class*="breadcrumb"]').first();
    if (await breadcrumb.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const text = (await breadcrumb.textContent())?.trim() ?? '';
      const match = text.match(/PR-[A-F0-9]+/i);
      if (match) {
        return match[0].toUpperCase();
      }
    }

    const url = this.page.url();
    const fromUrl = url.match(/PR-[A-F0-9]+/i);
    if (fromUrl) {
      return fromUrl[0].toUpperCase();
    }

    const headerLink = this.page.getByRole('link', { name: /^PR-/i }).first();
    if (await headerLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      return ((await headerLink.textContent()) ?? '').trim();
    }

    throw new Error('Transaction code PR-* tidak ditemukan di halaman');
  }

  async assertPrVisibleInDatalist(trxCode: string): Promise<void> {
    await expect(
      this.page.getByRole('link', { name: trxCode, exact: true }),
    ).toBeVisible({ timeout: 45_000 });
  }

  async assertPrStatusOpenInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/open/i);
  }

  async assertPrStatusApprovedInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/approved/i);
  }

  /**
   * Approve dari datalist — tombol ikon ceklis di kolom action (bukan halaman edit).
   * Selector: button.approve-button* pada baris trx; konfirmasi modal Approve.
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
        /\/supplychain\/purchase-requisition\/\d+\/approve/.test(response.url()) &&
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
        `Approve PR dari datalist gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
  }

  /**
   * Delete dari datalist — tombol ikon trash di kolom action.
   * Selector: button.delete-button* pada baris trx; konfirmasi modal Delete.
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
          /\/supplychain\/purchase-requisition\/\d+/.test(response.url()) &&
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
          `Delete PR dari datalist gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }
  }

  async assertPrNotInDatalist(trxCode: string): Promise<void> {
    await this.fillDatalistSearch(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode });
    await expect(row).toHaveCount(0, { timeout: 45_000 });
  }

  async openEditFromDatalistByTrxCode(trxCode: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalistSearchInput.fill(trxCode);
    await this.page.waitForTimeout(1_500);

    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });

    await this.clickEditButton(trxCode);

    await dismissStagingBanner(this.page);
    await expect(this.saveAllButton).toBeVisible({ timeout: 45_000 });
  }

  async ensureStatusOpenChecked(): Promise<void> {
    await this.openStatusRadio.click();
    await expect(this.openStatusRadio).toBeChecked({ timeout: 10_000 });
    await expect(this.draftStatusRadio).not.toBeChecked();
  }

  async clickApprove(): Promise<void> {
    const approveBtn = this.approveButton;
    await approveBtn.scrollIntoViewIfNeeded();
    await expect(approveBtn).toBeVisible({ timeout: 30_000 });

    const approveResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/supplychain/purchase-requisition') &&
        /approve/i.test(response.url()) &&
        ['POST', 'PUT'].includes(response.request().method()),
      { timeout: 90_000 },
    );

    await approveBtn.click();

    const confirmApprove = this.page
      .getByRole('button', { name: /^Approve$/i })
      .last();
    if (await confirmApprove.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await confirmApprove.click();
    }

    const response = await approveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Approve PR gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
  }

  // ─── Form / edit locators (bukan datalist) ───────────────────────────────

  private get datalistSearchInput(): Locator {
    return this.page.getByRole('searchbox').first();
  }

  private get basicInformationButton(): Locator {
    return this.page.getByRole('button', { name: /Basic Information/i });
  }

  private get basicInformationSection(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText('Transaction Code', { exact: false }) })
      .filter({ has: this.page.getByText('Transaction Date', { exact: false }) })
      .first();
  }

  private get transactionDateCombobox(): Locator {
    return this.basicInformationSection.getByRole('combobox').first();
  }

  private get saveAndNextButton(): Locator {
    return this.page.getByRole('button', { name: /Save & Next/i });
  }

  private get saveAllButton(): Locator {
    return this.page.getByRole('button', { name: /Save All/i }).last();
  }

  private get approveButton(): Locator {
    return this.saveAllButton
      .locator('xpath=following-sibling::button[1]')
      .or(this.page.getByRole('button', { name: /Show Modal Approve|^Approve$/i }))
      .first();
  }

  private get draftStatusRadio(): Locator {
    return this.page.getByRole('radio', { name: /^Draft$/i }).first();
  }

  private get openStatusRadio(): Locator {
    return this.page.getByRole('radio', { name: /^Open$/i }).first();
  }

  private get purchaseRequisitionDetailSectionButton(): Locator {
    return this.page.getByRole('button', {
      name: /Purchase Requisition Detail/i,
    });
  }

  private get selectProductCombobox(): Locator {
    return this.page
      .locator(
        [
          '[aria-placeholder*="Select Product"]',
          '[placeholder*="Select Product"]',
          '[aria-placeholder*="Select product"]',
          '[placeholder*="Select product"]',
          '.multiselect-search[aria-placeholder*="Product"]',
        ].join(', '),
      )
      .locator('visible=true')
      .first();
  }

  private get detailTable(): Locator {
    return this.page.getByRole('table').last();
  }

  private get dropdownOptions(): Locator {
    return this.page
      .locator('.multiselect-option:visible, [role="option"]:visible')
      .filter({ hasNotText: 'No results found' });
  }

  private productDetailRow(sku: string): Locator {
    return this.detailTable.getByRole('row').filter({ hasText: sku });
  }

  private get successToast(): Locator {
    return this.page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /success|saved|berhasil|successfully/i });
  }

  private get transactionCodeInput(): Locator {
    return this.page.getByRole('textbox', {
      name: 'Automatically generate by system',
    });
  }

  private async getTransactionCodeFromBasicInformation(): Promise<string | null> {
    const input = this.transactionCodeInput;
    if (!(await input.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return null;
    }

    const value = (await input.inputValue()).trim();
    if (/^PR-[A-F0-9]+$/i.test(value)) {
      return value.toUpperCase();
    }

    return null;
  }

  private async getTransactionDateDisplayValue(): Promise<string> {
    const combobox = this.transactionDateCombobox;
    const inputValue = await combobox.inputValue().catch(() => '');
    if (inputValue.trim()) {
      return inputValue.trim();
    }

    const text = (await combobox.textContent())?.trim() ?? '';
    if (text) {
      return text;
    }

    const ariaLabel = (await combobox.getAttribute('aria-label')) ?? '';
    return ariaLabel.trim();
  }
}
