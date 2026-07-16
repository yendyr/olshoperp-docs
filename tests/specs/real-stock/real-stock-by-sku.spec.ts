import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { REAL_STOCK_PATH, RealStockPage } from '../../helpers/real-stock';

/**
 * Real Time Stock — TAB By SKU saja.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Real Time Stock — By SKU', () => {
  test.describe.configure({ timeout: 300_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: REAL_STOCK_PATH,
    });
  });

  test('[@TC-REALSTK-005] Shell By SKU + WH/Sales/ALL', async ({
    page,
  }) => {
    const report = new RealStockPage(page);
    await report.gotoReport();
    await report.switchToBySku();
    await report.assertBySkuShell();
  });

  test('[@TC-REALSTK-006] Mode ALL → by-sku columns', async ({
    page,
  }) => {
    const report = new RealStockPage(page);
    await report.gotoReport();
    await report.switchToBySku();

    await report.filterBySkuAll();
    await report.assertBySkuColumns();
    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });
});
