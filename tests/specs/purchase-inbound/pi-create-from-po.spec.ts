import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_INBOUND_DATALIST_PATH,
  PurchaseInboundPage,
} from '../../helpers/purchase-inbound';

/**
 * Create Purchase Inbound dari Available Purchase Order (PO approved).
 * Company: lumicharmsid (153)
 *
 * Catatan data staging:
 * - TC menulis "PT. Suplier Lumi 00 Texable" — nama AS-IS select2:
 *   "PT. Supplier Lumi 001 Taxable"
 * - FE wajib supplier sebelum Save & Next
 * - Tanggal hari ini sering kena fiscal period → set 09-07-2026
 */
test.describe('Purchase Inbound — Create from approved PO', () => {
  test('[@TC-PI-CREATE-001] Create inbound dari Available PO — status Open', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    const supplierName = 'PT. Supplier Lumi 001 Taxable';
    const skus = ['SKUSINGLE-075', 'SKU-ForeignCURR004-TAX'];
    const inboundQty = 100;

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
      targetPath: PURCHASE_INBOUND_DATALIST_PATH,
    });

    const pi = new PurchaseInboundPage(page);

    await pi.openCreateForm();
    await pi.assertTransactionDateAutoFilled();
    const phase = await pi.waitForCreateDefaultsSettled();

    let trxCode: string;

    if (phase === 'edit') {
      trxCode = await pi.getCurrentTransactionCode();
    } else {
      await pi.setTransactionDateFiscalFallback();
      await pi.selectSupplier(supplierName);

      try {
        trxCode = await pi.clickSaveAndNextAndWaitForEdit();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (/fiscal period/i.test(message) || (await pi.hasFiscalPeriodError())) {
          await pi.setTransactionDateFiscalFallback();
          trxCode = await pi.clickSaveAndNextAndWaitForEdit();
        } else {
          throw err;
        }
      }
    }
    await assertNoBlocker('setelah header inbound tersimpan');

    await pi.selectSupplier(supplierName);

    await pi.openAvailablePurchaseOrderModal();
    await pi.checkOutstandingRows(skus);
    await pi.clickBulkUseOnOutstanding();
    await assertNoBlocker('setelah bulk Use outstanding PO');

    for (const sku of skus) {
      await pi.fillInboundQtyForSku(sku, inboundQty);
    }

    await pi.clickSaveAll();
    await assertNoBlocker('setelah Save All');

    await pi.assertInboundOpenInDatalist(trxCode);
  });
});
