import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_REQUISITION_DATALIST_PATH,
  PurchaseRequisitionPage,
} from '../../helpers/purchase-requisition';

/**
 * TC: PR PR-6A4F0F24 — tambah SKU-RAINCOAT-hitam, qty 25, status Draft → Open
 * Precondition: PR exists, status Draft
 * Company: lumicharmsid (153)
 *
 * Catatan: langkah TC menyebut SKU-RAINCOAT-hitam (step 3); test data header menyebut merah — mengikuti langkah TC.
 */
test.describe('Purchase Requisition — PR-6A4F0F24 Draft to Open', () => {
  test('[@TC-PR-DRAFT-OPEN-RAINCOAT] Tambah SKU-RAINCOAT-hitam lalu Save All status Open', async ({
    page,
  }) => {
    const trxCode = 'PR-6A4F0F24';
    const targetSku = 'SKU-RAINCOAT-hitam';
    const requestQty = 25;

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

    // Step 1 — pastikan status Draft
    await pr.gotoDatalist();
    await pr.searchDatalist(trxCode);
    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    const rowText = (await row.textContent()) ?? '';
    if (!/draft/i.test(rowText)) {
      throw new Error(
        `BLOCKER: PR ${trxCode} status bukan Draft (baris: "${rowText.trim()}"). Konfirmasi ke QA lead dulu.`,
      );
    }

    // Step 2 — show/edit dari datalist
    await pr.openEditFromDatalistByTrxCode(trxCode);

    // Step 3 — tambah produk + qty di section detail
    await pr.openPurchaseRequisitionDetailSection();
    await pr.addProductDetailLine(targetSku, requestQty);
    await assertNoBlocker('setelah tambah produk');

    // Step 4 — pilih status Open
    await pr.ensureStatusOpenChecked();

    // Step 5 — Save All
    await pr.clickSaveAll();
    await assertNoBlocker('setelah Save All');

    // Expected — datalist status Open
    await pr.assertPrStatusOpenInDatalist(trxCode);
  });
});
