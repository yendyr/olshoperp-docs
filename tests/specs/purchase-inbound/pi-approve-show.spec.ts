import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_INBOUND_DATALIST_PATH,
  PurchaseInboundPage,
} from '../../helpers/purchase-inbound';

/**
 * Approve Purchase Inbound dari halaman show/edit (checklist biru).
 * Company: lumicharmsid (153)
 * Trx: IN-6A506EAC (hasil create @TC-PI-CREATE-001)
 */
test.describe('Purchase Inbound — Approve dari show', () => {
  test('[@TC-PI-APPROVE-001] Approve IN-6A506EAC dari show — status Approved', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const trxCode = 'IN-6A506EAC';

    const blockerToast = page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /error|gagal|failed|tidak dapat|cannot/i })
      .filter({ hasNotText: /success|berhasil|approved/i });

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

    // Step — pastikan dokumen ada; skip jika sudah Approved
    await pi.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    const rowText = (await row.textContent()) ?? '';

    if (/approved/i.test(rowText)) {
      await pi.assertInboundApprovedInDatalist(trxCode);
      await pi.assertFormReadOnlyOnShow(trxCode);
      return;
    }

    if (!/open/i.test(rowText)) {
      throw new Error(
        `BLOCKER: ${trxCode} status bukan Open (baris: "${rowText.trim()}"). Konfirmasi ke QA lead dulu.`,
      );
    }

    // Step — show detail dari kolom action
    await pi.openShowFromDatalistByTrxCode(trxCode);

    // Step — checklist biru Approve + modal
    await pi.clickApproveFromShow();
    await assertNoBlocker('setelah Approve dari show');

    // Expected — datalist status Approved
    await pi.assertInboundApprovedInDatalist(trxCode);

    // Expected — form read-only saat dibuka lagi
    await pi.assertFormReadOnlyOnShow(trxCode);
  });
});
