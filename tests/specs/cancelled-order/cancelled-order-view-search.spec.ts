import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  CANCELLED_ORDER_PATH,
  CancelledOrderPage,
} from '../../helpers/cancelled-order';

/**
 * Cancelled Order — view + search.
 * Company: lumicharmsid (153)
 * Read-only monitoring (tidak ada CREATE/UPDATE/void).
 */
test.describe.serial('Cancelled Order — View then Search', () => {
  let sampleCode = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: CANCELLED_ORDER_PATH,
    });
  });

  test('[@TC-CANORD-001] Buka list Void/Rejected read-only', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const list = new CancelledOrderPage(page);
    await list.gotoList();
    await list.assertReadOnlyShell();
    await list.assertVisibleColumns();

    const { rowCount, sampleCode: code } = await list.assertRowsOrEmpty();
    // Lumi biasanya punya order batal; jika 0 — tetap valid AS-IS empty
    if (rowCount > 0 && code) {
      sampleCode = code;
    }
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('[@TC-CANORD-002] Search SO code / status void', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const list = new CancelledOrderPage(page);
    await list.gotoList();

    if (sampleCode) {
      await list.searchAndWait(sampleCode);
      await list.assertRowContains(sampleCode);
    } else {
      await list.searchAndWait('void');
      const empty = page.locator('td.dataTables_empty');
      const hasEmpty = await empty.isVisible().catch(() => false);
      if (!hasEmpty) {
        await expect(list.dataRows().first()).toContainText(/Void|Rejected/i);
      }
    }
  });
});
