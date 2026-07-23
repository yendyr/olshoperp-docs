import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  STOCK_MONITORING_PATH,
  StockMonitoringPage,
} from '../../helpers/stock-monitoring';

const SEED_SKU = 'AUTO-SKU001';

/**
 * Dev - Stock Monitoring — view shell + warehouse filter + drill-down.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Stock Monitoring — View then Filter', () => {
  test.describe.configure({ timeout: 300_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: STOCK_MONITORING_PATH,
    });
  });

  test('[@TC-STMON-001] Shell — warehouse gate tanpa Create', async ({
    page,
  }) => {
    const report = new StockMonitoringPage(page);
    await report.gotoReport();
    await report.assertShellBeforeWarehouse();
  });

  test('[@TC-STMON-002] Pilih warehouse → kolom qty + Latest Calculation', async ({
    page,
  }) => {
    const report = new StockMonitoringPage(page);
    await report.gotoReport();

    const label = await report.selectWarehouse('Gayungsari');
    expect(label.length).toBeGreaterThan(0);

    await report.assertDatalistColumns();
    await report.assertLatestCalculationVisible();
    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('[@TC-STMON-003] Search SKU + klik Availability modal', async ({
    page,
  }) => {
    const report = new StockMonitoringPage(page);
    await report.gotoReport();
    await report.selectWarehouse('Gayungsari');

    await report.searchSku(SEED_SKU);
    await report.clickFirstAvailabilityLink();
  });

  test('[@TC-STMON-004] Buka detail item stock → tab history/certificate', async ({
    page,
  }) => {
    const report = new StockMonitoringPage(page);
    await report.gotoReport();
    await report.selectWarehouse('Gayungsari');
    await report.searchSku(SEED_SKU);

    const itemStockId = await report.openFirstDetailFromSkuLink(SEED_SKU);
    expect(itemStockId.length).toBeGreaterThan(0);
    await report.assertDetailTabs();
  });
});
