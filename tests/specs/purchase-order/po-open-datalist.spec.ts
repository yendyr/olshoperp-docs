import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_ORDER_DATALIST_PATH,
  PurchaseOrderPage,
} from '../../helpers/purchase-order';

/**
 * Set PO status Open dari datalist — ikon show, radio Open, Save All.
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Order — Open dari datalist', () => {
  test('[@TC-PO-OPEN-DATALIST] Set PO-6A4F5E97 status Open dari show datalist', async ({
    page,
  }) => {
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

    await po.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });

    const rowText = (await row.textContent()) ?? '';
    if (/open/i.test(rowText) && !/draft/i.test(rowText)) {
      await po.assertPoStatusOpenInDatalist(trxCode);
      return;
    }
    if (!/draft/i.test(rowText)) {
      throw new Error(
        `BLOCKER: PO ${trxCode} status bukan Draft (baris: "${rowText.trim()}"). Konfirmasi ke QA lead dulu.`,
      );
    }

    // Step 1 — klik ikon show di kolom action datalist
    await po.openShowFromDatalistByTrxCode(trxCode);

    // Step 2 — pilih radio Open
    await po.selectOpenStatus();

    // Step 3 — Save All
    await po.clickSaveAll();
    await assertNoBlocker('setelah Save All');

    // Expected — status Open di datalist
    await po.assertPoStatusOpenInDatalist(trxCode);
  });
});
