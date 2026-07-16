import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { REAL_STOCK_PATH, RealStockPage } from '../../helpers/real-stock';

/**
 * Real Time Stock — TAB By Location saja.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Real Time Stock — By Location', () => {
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: REAL_STOCK_PATH,
    });
  });

  test('[@TC-VIEW-real-stock-by-location] Shell By Location + Multiselect WH', async ({
    page,
  }) => {
    const report = new RealStockPage(page);
    await report.gotoReport();
    await report.assertByLocationShell();
  });

  test('[@TC-FILTER-real-stock-by-location] Warehouse → On Hand/ATS columns', async ({
    page,
  }) => {
    const report = new RealStockPage(page);
    await report.gotoReport();

    const label = await report.selectFirstWarehouseByLocation();
    expect(label.length).toBeGreaterThan(0);

    await report.assertByLocationColumns();
    await report.assertManualCalculateVisible();
    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });
});
