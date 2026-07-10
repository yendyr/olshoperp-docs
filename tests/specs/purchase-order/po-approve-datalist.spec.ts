import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_ORDER_DATALIST_PATH,
  PurchaseOrderPage,
} from '../../helpers/purchase-order';

/**
 * Approve PO dari datalist (ikon approve di kolom action).
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Order — Approve dari datalist', () => {
  test('[@TC-PO-APPROVE-DATALIST] Approve PO-6A4F5E97 dari datalist', async ({ page }) => {
    test.setTimeout(300_000);
    const trxCode = 'PO-6A4F5E97';

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
      targetPath: PURCHASE_ORDER_DATALIST_PATH,
    });

    const po = new PurchaseOrderPage(page);

    // Step 1 — pastikan status Open
    await po.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    const rowText = (await row.textContent()) ?? '';
    if (/approved/i.test(rowText)) {
      await po.assertPoStatusApprovedInDatalist(trxCode);
      return;
    }
    if (!/open/i.test(rowText)) {
      throw new Error(
        `BLOCKER: PO ${trxCode} status bukan Open (baris: "${rowText.trim()}"). Konfirmasi ke QA lead dulu.`,
      );
    }

    // Step 2 — klik ikon approve di datalist
    await po.clickApproveFromDatalist(trxCode);
    await assertNoBlocker('setelah approve dari datalist');

    // Expected — status Approved
    await po.assertPoStatusApprovedInDatalist(trxCode);
  });
});
