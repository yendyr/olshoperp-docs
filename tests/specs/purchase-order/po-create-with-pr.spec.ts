import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import {
  PURCHASE_ORDER_DATALIST_PATH,
  PurchaseOrderPage,
  PoWithPrProductLine,
} from '../../helpers/purchase-order';

/**
 * Create PO with PR — supplier PT. SUPPLIER IDR, available products dari outstanding PR.
 * Precondition: sudah masuk menu Purchase Requisition (tanpa pengecekan kode PR).
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Order — Create with PR', () => {
  test('[@TC-PO-CREATE-WITH-PR] Create PO with PR dari available products', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    const supplierName = 'PT. SUPPLIER IDR';
    const productLines: PoWithPrProductLine[] = [
      { sku: 'SKUSINGLE-001', poQty: 100 },
      { sku: 'SKU-ALT-UNT-001', poQty: 5 },
      { sku: 'SKU-SPIDOL-biru', poQty: 10 },
      { sku: 'SKU-EMBER-merah', poQty: 90 },
    ];

    const blockerToast = page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /fiscal period|error|gagal|failed|tidak dapat|cannot/i });

    async function assertNoBlocker(context: string): Promise<void> {
      if (await blockerToast.isVisible({ timeout: 1_500 }).catch(() => false)) {
        const msg = await blockerToast.first().textContent();
        throw new Error(`BLOCKER (${context}): ${msg?.trim() ?? 'validasi backend'}`);
      }
    }

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });

    const po = new PurchaseOrderPage(page);
    await page.goto(PURCHASE_ORDER_DATALIST_PATH, { waitUntil: 'domcontentloaded' });

    // Step 1 — Create dari datalist Purchase Order
    await po.openCreateForm();

    // Step 2 — Transaction Date & Payment Type auto-fill
    await po.assertTransactionDateAutoFilled();
    await po.assertPaymentTypeAutoFilled();

    // Step 3–4 — Supplier + radio With PR
    await po.selectSupplier(supplierName);
    await po.selectWithPr();

    // Step 5 — Save & Next → edit page + PO code
    const poTrxCode = await po.clickSaveAndNextAndWaitForEdit();
    await assertNoBlocker('setelah Save & Next');

    // Step 6–9 — Available products: pilih semua SKU lalu bulk Use
    await po.openAvailableProductsModal();
    await po.checkOutstandingRows(productLines.map((line) => line.sku));
    await po.clickBulkUseAboveOutstandingTable();

    // Step 10 — PO Qty per SKU
    for (const line of productLines) {
      await po.fillPoQtyForSku(line.sku, line.poQty);
    }

    // Step 11–12 — Draft + Save All
    await po.selectDraftStatus();
    await po.clickSaveAll();
    await assertNoBlocker('setelah Save All');

    // Expected — PO di datalist status Draft
    await po.assertPoStatusDraftInDatalist(poTrxCode);
  });
});
