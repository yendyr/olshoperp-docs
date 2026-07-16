import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PRODUCT_ENDING_STOCK_PATH,
  ProductEndingStockPage,
} from '../../helpers/product-ending-stock';

/**
 * Product Ending Stock — view (By Warehouse) + filter (tab By SKU).
 * Company: lumicharmsid (153)
 * Read-only report (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Product Ending Stock — View then Filter', () => {
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRODUCT_ENDING_STOCK_PATH,
    });
  });

  test('[@TC-PENDSTK-001] By Warehouse + kolom Availability', async ({
    page,
  }) => {
    const report = new ProductEndingStockPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
    await report.assertByWarehouseColumns();

    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('[@TC-PENDSTK-002] Tab By SKU + kolom On hand/ATS', async ({
    page,
  }) => {
    const report = new ProductEndingStockPage(page);
    await report.gotoReport();
    await report.switchToBySku();
    await report.assertBySkuColumns();

    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);

    // Soft search — tabel tetap valid
    await report.searchSkuToken('a');
    const empty = page.locator('td.dataTables_empty');
    const hasEmpty = await empty.isVisible().catch(() => false);
    if (!hasEmpty) {
      expect(await report.dataRows().count()).toBeGreaterThan(0);
    }
  });
});
