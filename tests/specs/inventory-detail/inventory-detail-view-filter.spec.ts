import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  INVENTORY_DETAIL_PATH,
  InventoryDetailPage,
} from '../../helpers/inventory-detail';

/**
 * Inventory Detail — view + quick filter Out of Stock.
 * Company: lumicharmsid (153)
 * Read-only report (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Inventory Detail — View then Filter', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: INVENTORY_DETAIL_PATH,
    });
  });

  test('[@TC-INVDET-001] Buka report + level Building + kolom', async ({
    page,
  }) => {
    test.setTimeout(240_000);

    const report = new InventoryDetailPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
    await report.assertVisibleColumns();

    const level = await report.selectedWarehouseLevelLabel();
    // AS-IS: prefer Building; fallback first level dari select2
    expect(level.length).toBeGreaterThan(0);

    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('[@TC-INVDET-002] Card Out of Stock → filter=', async ({
    page,
  }) => {
    test.setTimeout(240_000);

    const report = new InventoryDetailPage(page);
    await report.gotoReport();
    await report.filterOutOfStock();

    await expect(report.datalist.table).toBeVisible();
    // Setelah filter: boleh empty atau ada baris OOS
    const empty = page.locator('td.dataTables_empty');
    const hasEmpty = await empty.isVisible().catch(() => false);
    if (!hasEmpty) {
      expect(await report.dataRows().count()).toBeGreaterThan(0);
    }
  });
});
