import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_ORDER_DATALIST_PATH,
  PurchaseOrderPage,
  PoWithPrProductLine,
} from '../../helpers/purchase-order';
import {
  PURCHASE_INBOUND_DATALIST_PATH,
  PurchaseInboundPage,
} from '../../helpers/purchase-inbound';

/**
 * Satu alur: PO Without PR (8 SKU, approve) → PI dari approved PO (8 SKU).
 * Company: lumicharmsid (153)
 *
 * Catatan: TRUZ/WENTER tidak muncul di outstanding PR With PR untuk supplier ini —
 * produk ditambah langsung via Select Product (Without PR).
 * Tidak ada automation Purchase Outbound — scope = 1 PO + 1 PI.
 */
test.describe.serial('PO + PI — TRUZV1 & WENTER 8 SKU', () => {
  const supplierName = 'PT. SUPPLIER IDR';

  const productLines: Array<{ sku: string; qty: number }> = [
    { sku: 'SKU-TRUZV1-white', qty: 500 },
    { sku: 'SKU-TRUZV1-yellow', qty: 500 },
    { sku: 'SKU-WENTER-black', qty: 200 },
    { sku: 'SKU-WENTER-blue', qty: 200 },
    { sku: 'SKU-WENTER-navy', qty: 200 },
    { sku: 'SKU-WENTER-maroon', qty: 200 },
    { sku: 'SKU-WENTER-yellow', qty: 200 },
    { sku: 'SKU-WENTER-purple', qty: 200 },
  ];

  const skus = productLines.map((line) => line.sku);

  let poTrxCode = '';
  let piTrxCode = '';

  test('[@TC-PO-PI-TRUZ-WENTER-001] PO Without PR approve → PI Open (8 SKU, 1 dokumen masing-masing)', async ({
    page,
  }) => {
    test.setTimeout(900_000);

    const blockerToast = page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /error|gagal|failed|tidak dapat|cannot|required/i })
      .filter({ hasNotText: /fiscal period/i });

    async function assertNoBlocker(context: string): Promise<void> {
      if (await blockerToast.isVisible({ timeout: 1_500 }).catch(() => false)) {
        const msg = await blockerToast.first().textContent();
        throw new Error(`BLOCKER (${context}): ${msg?.trim() ?? 'validasi backend'}`);
      }
    }

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_ORDER_DATALIST_PATH,
    });

    const po = new PurchaseOrderPage(page);
    const pi = new PurchaseInboundPage(page);

    const poLines: PoWithPrProductLine[] = productLines.map((line) => ({
      sku: line.sku,
      poQty: line.qty,
    }));

    // ── Phase 1: Purchase Order — 1 dokumen Without PR, 8 baris, approve ──
    await po.openCreateForm();
    await po.assertTransactionDateAutoFilled();
    await po.assertPaymentTypeAutoFilled();
    await po.selectSupplier(supplierName);
    await po.selectWithoutPr();

    poTrxCode = await po.clickSaveAndNextAndWaitForEdit();
    await assertNoBlocker('setelah PO Save & Next');

    await po.addPoDetailLines(poLines);

    await po.selectOpenStatus();
    await po.clickSaveAll();
    await assertNoBlocker('setelah PO Save All');
    await po.assertPoStatusOpenInDatalist(poTrxCode);

    await po.clickApproveFromDatalist(poTrxCode);
    await assertNoBlocker('setelah PO approve');
    await po.assertPoStatusApprovedInDatalist(poTrxCode);

    // ── Phase 2: Purchase Inbound — 1 dokumen dari approved PO ──
    await page.goto(PURCHASE_INBOUND_DATALIST_PATH, { waitUntil: 'domcontentloaded' });
    await pi.openCreateForm();
    await pi.assertTransactionDateAutoFilled();
    const phase = await pi.waitForCreateDefaultsSettled();

    if (phase === 'edit') {
      piTrxCode = await pi.getCurrentTransactionCode();
    } else {
      await pi.setTransactionDateFiscalFallback();
      await pi.selectSupplier(supplierName);

      try {
        piTrxCode = await pi.clickSaveAndNextAndWaitForEdit();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (/fiscal period/i.test(message) || (await pi.hasFiscalPeriodError())) {
          await pi.setTransactionDateFiscalFallback();
          piTrxCode = await pi.clickSaveAndNextAndWaitForEdit();
        } else {
          throw err;
        }
      }
    }
    await assertNoBlocker('setelah PI header tersimpan');

    await pi.selectSupplier(supplierName);
    await pi.openAvailablePurchaseOrderModal();
    await pi.checkOutstandingRows(skus);
    await pi.clickBulkUseOnOutstanding();
    await assertNoBlocker('setelah PI bulk Use outstanding PO');

    for (const line of productLines) {
      await pi.fillInboundQtyForSku(line.sku, line.qty);
    }

    await pi.clickSaveAll();
    await assertNoBlocker('setelah PI Save All');
    await pi.assertInboundOpenInDatalist(piTrxCode);
  });
});
