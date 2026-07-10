import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_INBOUND_DATALIST_PATH,
  PurchaseInboundPage,
} from '../../helpers/purchase-inbound';

/**
 * Bulk delete Purchase Inbound dari datalist.
 * Company: DEV-STG / Dev Staging (13)
 */
test.describe('Purchase Inbound — Bulk Delete', () => {
  test('[@TC-PI-BULK-DELETE-001] Bulk delete IN-6A506737 / 584 / 544', async ({
    page,
  }) => {
    test.setTimeout(360_000);

    const trxCodes = ['IN-6A506737', 'IN-6A506584', 'IN-6A506544'];
    const sharedFilter = 'IN-6A506';

    const blockerToast = page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /error|gagal|failed|tidak dapat|cannot/i })
      .filter({ hasNotText: /success|berhasil|deleted|info/i });

    async function assertNoBlocker(context: string): Promise<void> {
      if (await blockerToast.isVisible({ timeout: 1_500 }).catch(() => false)) {
        const msg = await blockerToast.first().textContent();
        throw new Error(`BLOCKER (${context}): ${msg?.trim() ?? 'validasi backend'}`);
      }
    }

    await prepareSession(page, {
      companyCode: 'DEV-STG',
      targetPath: PURCHASE_INBOUND_DATALIST_PATH,
    });

    const pi = new PurchaseInboundPage(page);

    // Precondition — kumpulkan yang masih aktif (belum soft-delete)
    await pi.setShowDeletedData(false);
    await pi.gotoDatalist();
    await pi.setPageLength('all');
    await pi.datalist.search(sharedFilter, 2_000);

    const stillActive: string[] = [];
    for (const code of trxCodes) {
      const row = pi.rowByTrxCode(code);
      if (await row.isVisible({ timeout: 5_000 }).catch(() => false)) {
        stillActive.push(code);
      }
    }

    if (stillActive.length === 0) {
      // Idempotent: semua sudah terhapus dari datalist aktif
      for (const code of trxCodes) {
        await pi.assertInboundNotInDatalist(code);
      }
      // Soft-delete: dengan Show deleted data, minimal satu trx masih bisa tampil
      await pi.setShowDeletedData(true);
      await pi.datalist.search(sharedFilter, 2_000);
      let foundDeleted = 0;
      for (const code of trxCodes) {
        if (await pi.rowByTrxCode(code).isVisible({ timeout: 8_000 }).catch(() => false)) {
          foundDeleted += 1;
        }
      }
      expect(
        foundDeleted,
        `Show deleted data ON: minimal 1 trx test data tampil (dapat ${foundDeleted})`,
      ).toBeGreaterThan(0);
      return;
    }

    // Step — checklist target yang masih aktif
    await pi.checkRowsVisibleTogether(stillActive, sharedFilter);
    await expect(pi.bulkDeleteButton).toBeVisible({ timeout: 15_000 });
    await expect(pi.bulkApproveButton).toBeVisible({ timeout: 15_000 });

    // Step — bulk delete (di samping bulk approve)
    await pi.clickBulkDeleteAndConfirm();
    await assertNoBlocker('setelah bulk delete');

    // Expected — tidak tampil di datalist aktif
    for (const code of stillActive) {
      await pi.assertInboundNotInDatalist(code);
    }
    for (const code of trxCodes.filter((c) => !stillActive.includes(c))) {
      await pi.assertInboundNotInDatalist(code);
    }

    // Expected — dengan Show deleted data, masih mungkin tampil
    await pi.setShowDeletedData(true);
    await pi.datalist.search(sharedFilter, 2_000);
    let foundDeleted = 0;
    for (const code of stillActive) {
      if (await pi.rowByTrxCode(code).isVisible({ timeout: 8_000 }).catch(() => false)) {
        foundDeleted += 1;
      }
    }
    expect(
      foundDeleted,
      `Minimal 1 dari ${stillActive.join(', ')} tampil saat Show deleted data ON (dapat ${foundDeleted})`,
    ).toBeGreaterThan(0);
  });
});
