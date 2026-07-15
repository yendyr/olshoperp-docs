import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { REAL_STOCK_PATH, RealStockPage } from '../../helpers/real-stock';

/**
 * Real Time Stock — view shell + filter warehouse (By Location).
 * Company: lumicharmsid (153)
 * Read-only report (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Real Time Stock — View then Filter', () => {
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: REAL_STOCK_PATH,
    });
  });

  test('[@TC-VIEW-real-stock] Shell By Location + warehouse filter', async ({
    page,
  }) => {
    const report = new RealStockPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
  });

  test('[@TC-FILTER-real-stock] Warehouse → On Hand/ATS columns', async ({
    page,
  }) => {
    const report = new RealStockPage(page);
    await report.gotoReport();

    const label = await report.selectFirstWarehouse();
    expect(label.length).toBeGreaterThan(0);

    await report.assertByLocationColumns();
    await report.assertManualCalculateVisible();
    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);

    await report.assertBySkuTabVisible();
  });
});
