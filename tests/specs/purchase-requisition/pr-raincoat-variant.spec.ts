import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_REQUISITION_DATALIST_PATH,
  PurchaseRequisitionPage,
} from '../../helpers/purchase-requisition';

/**
 * TC: PR dengan SKU-RAINCOAT variant (hitam + merah) — status Open
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Requisition — SKU-RAINCOAT', () => {
  test('[@TC-PR-RAINCOAT] Membuat PR 2 produk RAINCOAT — status Open', async ({
    page,
  }) => {
    const productLines = [
      { sku: 'SKU-RAINCOAT-hitam', requestQty: 50 },
      { sku: 'SKU-RAINCOAT-merah', requestQty: 50 },
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

    const pr = new PurchaseRequisitionPage(page);

    // Step 1 — Create di datalist
    await pr.gotoDatalist();
    await pr.openCreateForm();

    // Step 2 — Transaction Date auto-fill
    await pr.assertTransactionDateAutoFilled();

    // Step 3 — Save & Next
    await pr.clickSaveAndNext();
    await assertNoBlocker('setelah Save & Next');

    // Step 4 — Detail section + toast + trx code
    const trxCode = await pr.assertSaveAndNextSucceeded();

    // Step 5–6 — Detail lines + qty
    await pr.openPurchaseRequisitionDetailSection();
    await pr.addProductDetailLines(productLines);
    await assertNoBlocker('setelah input produk');

    // Step 7 — Save All
    await pr.clickSaveAll();
    await assertNoBlocker('setelah Save All');

    // Expected — datalist status Open
    await pr.assertPrStatusOpenInDatalist(trxCode);
  });
});
