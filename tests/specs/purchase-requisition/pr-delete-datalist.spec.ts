import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_REQUISITION_DATALIST_PATH,
  PurchaseRequisitionPage,
} from '../../helpers/purchase-requisition';

/**
 * TEST 6 — Delete PR dari datalist (ikon delete di kolom action)
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Requisition — Delete dari datalist', () => {
  test('[@TC-PR-DELETE-DATALIST] Delete PR-6A4DF63B dari datalist', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const trxCode = 'PR-6A4DF63B';

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

    // Precondition — PR ada di datalist (atau sudah terhapus → early pass)
    await pr.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode });
    if ((await row.count()) === 0) {
      await pr.assertPrNotInDatalist(trxCode);
      return;
    }

    // Langkah — klik ikon delete di datalist
    await pr.clickDeleteFromDatalist(trxCode);
    await assertNoBlocker('setelah delete dari datalist');

    // Expected — PR tidak ada di datalist
    await pr.assertPrNotInDatalist(trxCode);
  });
});
