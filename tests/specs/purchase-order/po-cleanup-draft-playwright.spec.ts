import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_ORDER_DATALIST_PATH,
  PurchaseOrderPage,
} from '../../helpers/purchase-order';

/**
 * Cleanup draft PO dari run automation Playwright — mengembalikan qty outstanding PR.
 * Company: lumicharmsid (153)
 */
test.describe('Purchase Order — Cleanup draft Playwright', () => {
  test('[@TC-PO-CLEANUP-DRAFT] Hapus draft PO automation Playwright', async ({ page }) => {
    test.setTimeout(300_000);

    const knownDraftCodes = ['PO-6A4F5A8E', 'PO-6A4F5CF2'];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_ORDER_DATALIST_PATH,
    });

    const po = new PurchaseOrderPage(page);

    for (const trxCode of knownDraftCodes) {
      await po.releaseDraftPo(trxCode).catch(() => undefined);
    }

    await po.deleteDraftPlaywrightPos();
  });
});
