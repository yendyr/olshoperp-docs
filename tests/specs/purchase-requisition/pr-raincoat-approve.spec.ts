import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_REQUISITION_DATALIST_PATH,
  PurchaseRequisitionPage,
} from '../../helpers/purchase-requisition';

/**
 * TC: Approve PR PR-6A4F1E74 — update qty SKU-RAINCOAT-hitam → 25
 * Precondition: PR exists, status Open
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Requisition — Approve PR-6A4F1E74', () => {
  test('[@TC-PR-APPROVE-RAINCOAT] Update qty SKU-RAINCOAT-hitam lalu approve', async ({
    page,
  }) => {
    const trxCode = 'PR-6A4F1E74';
    const targetSku = 'SKU-RAINCOAT-hitam';
    const updatedQty = 25;

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

    // Step 1 — pastikan status Open
    await pr.gotoDatalist();
    await pr.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    const rowText = (await row.textContent()) ?? '';
    if (!/open/i.test(rowText)) {
      throw new Error(
        `BLOCKER: PR ${trxCode} status bukan Open (baris: "${rowText.trim()}"). Konfirmasi ke QA lead dulu.`,
      );
    }

    // Step 2 — show/edit dari datalist
    await pr.openEditFromDatalistByTrxCode(trxCode);

    // Step 3 — ubah request qty di section detail
    await pr.openPurchaseRequisitionDetailSection();
    await pr.fillRequestQtyForSku(targetSku, updatedQty);
    await assertNoBlocker('setelah ubah request qty');

    // Step 4 — approve (tombol ceklis biru)
    await pr.clickApprove();
    await assertNoBlocker('setelah approve');

    // Expected — datalist status Approved
    await pr.assertPrStatusApprovedInDatalist(trxCode);
  });
});
