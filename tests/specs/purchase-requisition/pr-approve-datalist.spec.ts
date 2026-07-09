import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_REQUISITION_DATALIST_PATH,
  PurchaseRequisitionPage,
} from '../../helpers/purchase-requisition';

/**
 * TEST 5 — Approve PR dari datalist (ikon approve di kolom action)
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Requisition — Approve dari datalist', () => {
  test('[@TC-PR-APPROVE-DATALIST] Approve PR-6A4F0A91 dari datalist', async ({
    page,
  }) => {
    const trxCode = 'PR-6A4F0A91';

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

    // Step 1 — pastikan status Open (TC menyebut PR-6A4F0A91; typo PR-6A4F0F24 di step 1 diabaikan)
    await pr.gotoDatalist();
    await pr.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    const rowText = (await row.textContent()) ?? '';
    if (/approved/i.test(rowText)) {
      await pr.assertPrStatusApprovedInDatalist(trxCode);
      return;
    }
    if (!/open/i.test(rowText)) {
      throw new Error(
        `BLOCKER: PR ${trxCode} status bukan Open (baris: "${rowText.trim()}"). Konfirmasi ke QA lead dulu.`,
      );
    }

    // Step 2 — klik ikon approve di datalist
    await pr.clickApproveFromDatalist(trxCode);
    await assertNoBlocker('setelah approve dari datalist');

    // Expected — status Approved di datalist
    await pr.assertPrStatusApprovedInDatalist(trxCode);
  });

  test('[@TC-PR-APPROVE-DATALIST-69DDDB84] Approve PR-69DDDB84 dari datalist', async ({
    page,
  }) => {
    const trxCode = 'PR-69DDDB84';

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

    await pr.gotoDatalist();
    await pr.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    const rowText = (await row.textContent()) ?? '';
    if (/approved/i.test(rowText)) {
      await pr.assertPrStatusApprovedInDatalist(trxCode);
      return;
    }
    if (!/open/i.test(rowText)) {
      throw new Error(
        `BLOCKER: PR ${trxCode} status bukan Open (baris: "${rowText.trim()}"). Konfirmasi ke QA lead dulu.`,
      );
    }

    await pr.clickApproveFromDatalist(trxCode);
    await assertNoBlocker('setelah approve dari datalist');
    await pr.assertPrStatusApprovedInDatalist(trxCode);
  });
});
