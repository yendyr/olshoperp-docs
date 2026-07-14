import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const PURCHASE_INBOUND_DATALIST_PATH = '/supplychain/new-purchase-inbound';
export const PURCHASE_INBOUND_CREATE_PATH = '/supplychain/new-purchase-inbound/create';
export const PURCHASE_INBOUND_EDIT_PATH_PATTERN =
  /\/supplychain\/new-purchase-inbound\/edit\/\d+/;

/**
 * POM Purchase Inbound (BETA — new-purchase-inbound).
 * Selector dari Form.vue + OutstandingPurchaseOrderDetail + InboundQuantity.
 */
export class PurchaseInboundPage {
  private readonly datalist: OlshopDatalist;
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

  get supplierCombobox(): Locator {
    return this.multiselect.comboboxByPlaceholderFragment('PT. ABC Indonesia');
  }

  get locationDestinationCombobox(): Locator {
    return this.multiselect.comboboxByPlaceholderFragment('Seruni');
  }

  get availablePurchaseOrderLink(): Locator {
    return this.page.getByText('Available Purchase Order', { exact: true });
  }

  get openStatusRadio(): Locator {
    return this.page.locator('#open');
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(PURCHASE_INBOUND_DATALIST_PATH, 'button');
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('button');
    await this.page.waitForURL(/\/supplychain\/new-purchase-inbound\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);

    const basicInfo = this.page
      .getByRole('button', { name: 'Basic Information', exact: true })
      .first();
    await expect(basicInfo).toBeVisible({ timeout: 45_000 });

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.form.expandAccordion('Basic Information');
        return;
      } catch {
        await this.page.waitForTimeout(1_000);
      }
    }

    await this.form.expandAccordion('Basic Information');
  }

  async searchDatalist(query: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(query, 2_000);
  }

  async assertTransactionDateAutoFilled(): Promise<void> {
    await expect(
      this.page.getByText(/\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}/).first(),
      'Transaction Date harus terisi otomatis',
    ).toBeVisible({ timeout: 15_000 });
  }

  async assertLocationDestinationAutoFilled(): Promise<void> {
    await expect(this.locationDestinationCombobox).toBeVisible({ timeout: 20_000 });
    const label = await this.multiselect.selectedLabel(this.locationDestinationCombobox);
    expect(label.length, 'Location Destination harus terisi otomatis').toBeGreaterThan(0);
    expect(label, 'Location Destination tidak boleh placeholder kosong').not.toMatch(
      /^choose\s*$/i,
    );
  }

  /**
   * Pastikan header PI tersimpan (create → edit).
   * Create page bisa auto-redirect setelah default values tanpa tombol Save & Next.
   */
  async ensureInboundHeaderSaved(supplierName: string): Promise<string> {
    await this.assertTransactionDateAutoFilled();

    const autoEdit = await this.page
      .waitForURL(PURCHASE_INBOUND_EDIT_PATH_PATTERN, { timeout: 15_000 })
      .then(() => true)
      .catch(() => false);

    if (autoEdit || PURCHASE_INBOUND_EDIT_PATH_PATTERN.test(this.page.url())) {
      await dismissStagingBanner(this.page);
      const code = await this.getCurrentTransactionCode();
      if (/^IN-/i.test(code)) {
        return code;
      }
    }

    const phase = await this.waitForCreateDefaultsSettled().catch(async () => {
      if (PURCHASE_INBOUND_EDIT_PATH_PATTERN.test(this.page.url())) {
        return 'edit' as const;
      }
      return 'create' as const;
    });

    if (phase === 'edit') {
      return await this.getCurrentTransactionCode();
    }

    await this.setTransactionDateFiscalFallback();
    await this.selectSupplier(supplierName);

    try {
      return await this.clickSaveAndNextAndWaitForEdit();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (/fiscal period/i.test(message) || (await this.hasFiscalPeriodError())) {
        await this.setTransactionDateFiscalFallback();
        return await this.clickSaveAndNextAndWaitForEdit();
      }
      if (PURCHASE_INBOUND_EDIT_PATH_PATTERN.test(this.page.url())) {
        return await this.getCurrentTransactionCode();
      }
      throw err;
    }
  }

  async selectSupplier(supplierName: string): Promise<void> {
    await this.multiselect.ensureValue(this.supplierCombobox, supplierName);
    await this.page.waitForTimeout(1_000);
  }

  async hasFiscalPeriodError(): Promise<boolean> {
    const inline = this.page
      .locator('.text-red-500, .text-sm')
      .filter({ hasText: /fiscal period/i });
    const toast = this.page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /fiscal period/i });
    return (
      (await inline.isVisible({ timeout: 1_000 }).catch(() => false)) ||
      (await toast.isVisible({ timeout: 1_000 }).catch(() => false))
    );
  }

  get transactionDateInput(): Locator {
    // PrimeVue DatePicker wrapper (bukan vuepic dp__input)
    return this.page
      .locator('input.olshoperp-datepicker-input, input.p-datepicker-input')
      .first()
      .or(this.page.getByRole('combobox').filter({ hasText: /\d{2}-\d{2}-\d{4}/ }).first());
  }

  /**
   * Set Transaction Date ke 09-07-2026 (TC: fiscal period fallback).
   * Model: yyyy-MM-dd HH:mm:ss — display: dd-MM-yyyy HH:mm:ss (PrimeVue).
   */
  async setTransactionDateFiscalFallback(): Promise<void> {
    const targetDisplay = '09-07-2026 12:00:00';
    const dpInput = this.transactionDateInput;
    await expect(dpInput).toBeVisible({ timeout: 15_000 });
    await dpInput.click({ clickCount: 3 });
    await dpInput.fill(targetDisplay);
    await dpInput.press('Enter');
    await dpInput.blur();
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(800);

    const shown = (await dpInput.inputValue().catch(() => '')).trim();
    if (!shown.startsWith('09-07-2026')) {
      await this.page.evaluate((value) => {
        const input = document.querySelector(
          'input.olshoperp-datepicker-input, input.p-datepicker-input',
        ) as HTMLInputElement | null;
        if (!input) return;
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        input.blur();
      }, targetDisplay);
      await this.page.waitForTimeout(800);
    }

    await expect(dpInput).toHaveValue(/09-07-2026/, { timeout: 10_000 });
  }

  /** Tunggu default values (location) terisi; create page bisa auto-submit via fetchDefaultValues. */
  async waitForCreateDefaultsSettled(): Promise<'create' | 'edit'> {
    await this.assertLocationDestinationAutoFilled();
    // Auto-submit default values bisa redirect ke edit, atau gagal (fiscal) tetap di create
    const editUrl = await this.page
      .waitForURL(PURCHASE_INBOUND_EDIT_PATH_PATTERN, { timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (editUrl) {
      await dismissStagingBanner(this.page);
      return 'edit';
    }
    return 'create';
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<string> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/mutation-inbound\/?$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { id?: number; code?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Purchase Inbound header gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(PURCHASE_INBOUND_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Inbound Detail');

    const trxCode = await this.getCurrentTransactionCode();
    expect(trxCode, 'IN code harus format IN-*').toMatch(/^IN-/i);
    return trxCode;
  }

  async getCurrentTransactionCode(): Promise<string> {
    await expect(this.codeInput).toBeVisible({ timeout: 20_000 });
    const value = (await this.codeInput.inputValue()).trim();
    if (/^IN-/i.test(value)) {
      return value.toUpperCase();
    }

    const link = this.page.getByRole('link', { name: /^IN-/i }).first();
    if (await link.isVisible({ timeout: 5_000 }).catch(() => false)) {
      return ((await link.textContent()) ?? '').trim().toUpperCase();
    }

    throw new Error('Transaction code IN-* tidak ditemukan di halaman');
  }

  private outstandingPanel(): Locator {
    return this.page
      .locator('div.fixed.rounded, div.bg-\\[\\#F1F5F9\\].fixed')
      .filter({ has: this.page.getByText(/Showing \d+ to \d+ of \d+ entries|Max Inbound|PO Qty/i) })
      .last();
  }

  private outstandingSearch(): Locator {
    return this.outstandingPanel()
      .getByPlaceholder(/find something/i)
      .or(this.outstandingPanel().getByRole('searchbox'))
      .first();
  }

  async openAvailablePurchaseOrderModal(): Promise<void> {
    await this.form.expandAccordion('Inbound Detail');
    await this.availablePurchaseOrderLink.scrollIntoViewIfNeeded();

    const outstandingResponse = this.page
      .waitForResponse(
        (response) =>
          response.url().includes('mutation-inbound-detail/outstanding') &&
          response.request().method() === 'GET',
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.availablePurchaseOrderLink.click();
    await outstandingResponse;
    await this.page.waitForTimeout(1_500);

    await expect(this.outstandingPanel()).toBeVisible({ timeout: 45_000 });
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
      await this.page.waitForTimeout(1_000);
    }
  }

  async searchOutstandingProducts(query: string): Promise<void> {
    const panel = this.outstandingPanel();
    const search = panel
      .getByRole('searchbox')
      .or(panel.getByPlaceholder(/find something/i))
      .first();

    if (await search.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await search.click();
      await search.fill(query);
      await search.press('Enter').catch(() => undefined);
      await this.page.waitForTimeout(2_000);
    }
  }

  async setOutstandingPageSize(size: '50' | '100' = '100'): Promise<void> {
    const panel = this.outstandingPanel();
    const select = panel.locator('select').first();
    if (await select.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await select.selectOption(size);
      await this.page.waitForTimeout(2_000);
    }
  }

  private skuMatchPatterns(sku: string, strict = false): RegExp[] {
    const exact = this.skuPattern(sku);
    const tokens = sku.trim().split(/[\s-]+/).filter(Boolean);
    const patterns = [exact];

    // Mapping kode → teks yang sering tampil di outstanding (product_sku_name)
    if (/SKUSINGLE-075/i.test(sku) || /075$/i.test(sku)) {
      patterns.push(/Single\s*075/i, /SKUSINGLE[\s-]*075/i);
    }
    if (/ForeignCURR004/i.test(sku)) {
      patterns.push(/ForeignCURR004/i, /Foreign\s*CURR\s*004/i);
    }

    if (!strict) {
      const last = tokens[tokens.length - 1];
      if (last && last.length >= 3) {
        patterns.push(new RegExp(last.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
      }
    }
    return patterns;
  }

  async findOutstandingRow(sku: string, poTrxCode?: string): Promise<Locator> {
    await this.clearOutstandingSearch();
    const panel = this.outstandingPanel();
    await expect(
      panel.getByText(/Showing \d+ to \d+ of \d+ entries|No matching|no data/i).first(),
    ).toBeVisible({ timeout: 30_000 });

    const strict = Boolean(poTrxCode);
    const patterns = this.skuMatchPatterns(sku, strict);
    const searchTokens = [
      ...(poTrxCode ? [`${poTrxCode} ${sku}`, poTrxCode] : []),
      sku,
      sku.split('-').slice(-2).join('-'),
      sku.split('-').pop() ?? sku,
    ];

    for (const token of searchTokens) {
      await this.searchOutstandingProducts(token);

      for (const pattern of patterns) {
        const row = panel.locator('tbody tr').filter({ hasText: pattern }).first();
        if (await row.isVisible({ timeout: 3_000 }).catch(() => false)) {
          if (!poTrxCode || (await row.innerText()).includes(poTrxCode)) {
            return row;
          }
        }
      }
    }

    await this.clearOutstandingSearch();
    const rows = panel.locator('tbody tr');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = ((await row.innerText().catch(() => '')) || '').replace(/\s+/g, ' ');
      if (patterns.some((p) => p.test(text))) {
        if (!poTrxCode || text.includes(poTrxCode)) {
          return row;
        }
      }
    }

    return panel.locator('tbody tr').filter({ hasText: patterns[0] }).first();
  }

  async checkOutstandingRows(skus: string[], poTrxCode?: string): Promise<void> {
    const panel = this.outstandingPanel();

    if (poTrxCode) {
      await this.setOutstandingPageSize('100');
      await this.searchOutstandingProducts(poTrxCode);
      await this.page.waitForTimeout(1_000);
    } else {
      await this.clearOutstandingSearch();
    }

    const strict = Boolean(poTrxCode);

    for (const sku of skus) {
      const patterns = this.skuMatchPatterns(sku, strict);
      let row = panel.locator('tbody tr').filter({ hasText: patterns[0] }).first();

      for (const pattern of patterns) {
        const candidate = panel.locator('tbody tr').filter({ hasText: pattern }).first();
        if (await candidate.isVisible({ timeout: 3_000 }).catch(() => false)) {
          const text = (await candidate.innerText().catch(() => '')) || '';
          if (!poTrxCode || text.includes(poTrxCode)) {
            row = candidate;
            break;
          }
        }
      }

      await expect(row, `Baris outstanding untuk ${sku}`).toBeVisible({ timeout: 30_000 });
      const checkbox = row.locator('input[type="checkbox"]').first();
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.check({ force: true });
      }
    }
  }

  async waitForInboundDetailRowCount(minRows: number): Promise<void> {
    await this.form.expandAccordion('Inbound Detail');
    const section = this.page.locator('#InventoryInDetail');
    await expect
      .poll(
        async () => {
          const rows = section.locator('tbody tr').filter({
            hasNotText: /no data available/i,
          });
          return rows.count();
        },
        { timeout: 90_000 },
      )
      .toBeGreaterThanOrEqual(minRows);
  }

  async clickBulkUseOnOutstanding(): Promise<void> {
    const bulkUse = this.outstandingPanel()
      .locator('button.tooltip-use')
      .filter({ hasText: /use/i })
      .first();
    await expect(bulkUse).toBeVisible({ timeout: 15_000 });

    const useResponse = this.page
      .waitForResponse(
        (response) =>
          response.url().includes('mutation-inbound-detail/bulk-fifo') &&
          response.request().method() === 'POST',
        { timeout: 90_000 },
      )
      .catch(() => null);

    await bulkUse.click();
    await useResponse;
    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.waitForTimeout(1_500);
  }

  async fillInboundQtyForSku(sku: string, qty: number): Promise<void> {
    await this.form.expandAccordion('Inbound Detail');
    const section = this.page.locator('#InventoryInDetail');
    const patterns = this.skuMatchPatterns(sku, true);

    let row = section.locator('tbody tr').filter({ hasText: patterns[0] }).first();
    for (const pattern of patterns) {
      const candidate = section.locator('tbody tr').filter({ hasText: pattern }).first();
      if (await candidate.isVisible({ timeout: 3_000 }).catch(() => false)) {
        row = candidate;
        break;
      }
    }
    await expect(row, `Baris inbound detail untuk ${sku}`).toBeVisible({ timeout: 30_000 });

    const qtyInput = row
      .locator('input.w-24, input[class*="w-24"]')
      .or(row.getByRole('textbox'))
      .last();
    await expect(qtyInput, `Inbound Qty input untuk ${sku}`).toBeVisible({ timeout: 10_000 });

    const current = (await qtyInput.inputValue().catch(() => '')).replace(/[^\d]/g, '');
    if (current === String(qty)) {
      return;
    }

    await qtyInput.click();
    await qtyInput.fill(String(qty));
    await qtyInput.press('Tab');
    await this.page.waitForTimeout(800);
  }

  async clickSaveAll(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/mutation-inbound\/\d+/.test(response.url()) &&
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

  async assertInboundOpenInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/open/i);
  }

  async assertInboundApprovedInDatalist(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(/approved/i);
  }

  get bulkDeleteButton(): Locator {
    return this.page.locator('button.delete-bulk').first();
  }

  get bulkApproveButton(): Locator {
    return this.page.locator('button.bulk-approve').first();
  }

  get showDeletedSwitch(): Locator {
    return this.page.locator('#show_deleted_switch');
  }

  get selectInfo(): Locator {
    return this.page.locator('.select-item').filter({ hasText: /row/i }).first();
  }

  rowByTrxCode(trxCode: string): Locator {
    return this.page.getByRole('row').filter({ hasText: trxCode }).first();
  }

  async setPageLength(length: number | 'all'): Promise<void> {
    const lengthSelect = this.page.locator('select.dt-input, select[name*="length"]').first();
    if (!(await lengthSelect.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }

    if (length === 'all') {
      const options = await lengthSelect.locator('option').allTextContents();
      const allOption = options.find((text) => /all|-1/i.test(text));
      if (allOption) {
        const value =
          (await lengthSelect.locator('option', { hasText: allOption }).getAttribute('value')) ??
          '-1';
        await lengthSelect.selectOption(value);
      } else {
        await lengthSelect.selectOption({
          index: (await lengthSelect.locator('option').count()) - 1,
        });
      }
    } else {
      await lengthSelect.selectOption(String(length));
    }
    await this.page.waitForTimeout(2_000);
  }

  /**
   * Centang beberapa trx sekaligus tanpa ganti search (DataTables deselect saat filter berubah).
   */
  async checkRowsVisibleTogether(trxCodes: string[], sharedFilter?: string): Promise<void> {
    await this.gotoDatalist();
    await this.setPageLength('all');
    await this.datalist.search(sharedFilter ?? '', 2_000);

    for (const code of trxCodes) {
      const row = this.rowByTrxCode(code);
      await row.scrollIntoViewIfNeeded();
      await expect(row, `Baris ${code} harus terlihat untuk bulk select`).toBeVisible({
        timeout: 60_000,
      });
      const checkbox = row.locator('input[type="checkbox"]').first();
      await expect(checkbox).toBeVisible({ timeout: 15_000 });
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.check({ force: true });
      }
      await this.page.waitForTimeout(400);
    }

    await expect(this.selectInfo).toContainText(String(trxCodes.length), {
      timeout: 15_000,
    });
  }

  async clickBulkDeleteAndConfirm(): Promise<void> {
    await expect(this.bulkDeleteButton).toBeVisible({ timeout: 15_000 });
    await this.bulkDeleteButton.scrollIntoViewIfNeeded();
    await this.bulkDeleteButton.click();

    const confirmDelete = this.page.getByRole('button', { name: /^Delete$/i }).last();
    await expect(confirmDelete).toBeVisible({ timeout: 15_000 });

    const deleteResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('bulk-delete') &&
        response.request().method() === 'DELETE',
      { timeout: 120_000 },
    );

    await confirmDelete.click();

    const response = await deleteResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Bulk delete Purchase Inbound gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.waitForTimeout(1_500);
  }

  async assertInboundNotInDatalist(trxCode: string): Promise<void> {
    await this.setShowDeletedData(false);
    await this.searchDatalist(trxCode);
    const row = this.page.getByRole('row').filter({ hasText: trxCode });
    await expect(row, `${trxCode} tidak boleh tampil tanpa Show deleted data`).toHaveCount(0, {
      timeout: 45_000,
    });
  }

  async setShowDeletedData(enabled: boolean): Promise<void> {
    await this.gotoDatalist();
    const sw = this.showDeletedSwitch;
    await expect(sw).toBeVisible({ timeout: 20_000 });
    const checked = await sw.isChecked().catch(() => false);
    if (checked !== enabled) {
      await sw.click({ force: true });
      await this.page.waitForTimeout(2_000);
    }
  }

  /** Setelah soft-delete: dengan Show deleted data ON, trx masih bisa muncul. */
  async assertInboundVisibleWithShowDeleted(trxCode: string): Promise<void> {
    await this.setShowDeletedData(true);
    await this.datalist.search(trxCode, 2_000);
    const row = this.rowByTrxCode(trxCode);
    await expect(
      row,
      `${trxCode} diharapkan masih tampil saat Show deleted data aktif`,
    ).toBeVisible({ timeout: 45_000 });
  }

  /** Show/edit dari datalist — `#updateButton` di kolom action. */
  async openShowFromDatalistByTrxCode(trxCode: string): Promise<void> {
    await this.searchDatalist(trxCode);

    const row = this.page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });

    await this.datalist.editButton(row).click();
    await this.page.waitForURL(PURCHASE_INBOUND_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information');
    await expect(this.codeInput).toHaveValue(trxCode, { timeout: 30_000 });
  }

  private get approveButton(): Locator {
    // Form.vue: tombol biru bg-info di samping Save All, Tippy "Approve" + icon check-double
    return this.page
      .locator('button.bg-info.border-info')
      .filter({ has: this.page.locator('.fa-check-double, [class*="check-double"]') })
      .or(this.page.locator('button.bg-info').filter({ hasText: '' }).last())
      .first();
  }

  /**
   * Approve dari halaman show/edit — checklist biru + modal ApprovalModal.
   * Sukses: toast + redirect ke datalist (`redirectUrl`).
   */
  async clickApproveFromShow(): Promise<void> {
    const approveBtn = this.page.locator('button.bg-info.border-info').last();
    await approveBtn.scrollIntoViewIfNeeded();
    await expect(approveBtn, 'Tombol Approve (checklist biru)').toBeVisible({
      timeout: 30_000,
    });

    await approveBtn.click();

    const confirmApprove = this.page.getByRole('button', { name: /^Approve$/i }).last();
    await expect(confirmApprove).toBeVisible({ timeout: 15_000 });

    const approveResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('mutation-inbound') &&
        response.url().includes('/approve') &&
        response.request().method() === 'POST',
      { timeout: 120_000 },
    );

    const redirected = this.page.waitForURL(
      /\/supplychain\/new-purchase-inbound\/?$/,
      { timeout: 120_000 },
    );

    await confirmApprove.click();

    const response = await approveResponse.catch(() => null);
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Approve Purchase Inbound gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await redirected.catch(() => undefined);
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  /** Setelah approved: buka show lagi — Save All / Approve hilang (read-only). */
  async assertFormReadOnlyOnShow(trxCode: string): Promise<void> {
    await this.openShowFromDatalistByTrxCode(trxCode);

    const saveAll = this.page.getByRole('button', { name: 'Save All', exact: true });
    await expect(saveAll, 'Save All harus hilang setelah approved').toHaveCount(0, {
      timeout: 30_000,
    });

    const approveBtn = this.page.locator('button.bg-info.border-info');
    await expect(approveBtn, 'Tombol Approve harus hilang setelah approved').toHaveCount(0, {
      timeout: 15_000,
    });
  }
}
