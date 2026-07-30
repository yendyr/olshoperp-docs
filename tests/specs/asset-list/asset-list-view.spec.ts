import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { ASSET_LIST_PATH, AssetListPage } from '../../helpers/asset-list';

/**
 * Asset List — VIEW / filter / detail / export (read-only fixed asset).
 * Company: lumicharmsid (153)
 */
test.describe.serial('Asset List — View then Filter', () => {
  test.describe.configure({ timeout: 300_000 });

  let hasRows = false;
  let firstSku: string | null = null;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ASSET_LIST_PATH,
    });
  });

  test('[@TC-ASL-001] Shell — warehouse gate tanpa Create', async ({
    page,
  }) => {
    const report = new AssetListPage(page);
    await report.gotoReport();
    await report.assertShellBeforeWarehouse();
  });

  test('[@TC-ASL-002] Pilih warehouse → Asset Code + Unit Price', async ({
    page,
  }) => {
    const report = new AssetListPage(page);
    await report.gotoReport();

    const label = await report.selectWarehouse('Gayungsari');
    expect(label.length).toBeGreaterThan(0);

    await report.assertDatalistColumns();
    await report.assertLatestCalculationVisible();
    const { rowCount } = await report.assertRowsOrEmpty();
    hasRows = rowCount > 0;
    firstSku = hasRows ? await report.readFirstSkuFromRow() : null;
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('[@TC-ASL-003] Search + Availability (atau empty)', async ({
    page,
  }) => {
    const report = new AssetListPage(page);
    await report.gotoReport();
    await report.selectWarehouse('Gayungsari');

    const { rowCount } = await report.assertRowsOrEmpty();
    if (rowCount === 0) {
      await expect(page.locator('td.dataTables_empty')).toBeVisible({
        timeout: 15_000,
      });
      return;
    }

    hasRows = true;
    firstSku = firstSku ?? (await report.readFirstSkuFromRow());
    expect(firstSku, 'SKU baris pertama').toBeTruthy();
    await report.searchSku(firstSku!);
    await report.clickFirstAvailabilityLink();
  });

  test('[@TC-ASL-004] Detail Asset List → section sidenav', async ({
    page,
  }) => {
    const report = new AssetListPage(page);
    await report.gotoReport();
    await report.selectWarehouse('Gayungsari');

    const { rowCount } = await report.assertRowsOrEmpty();
    if (rowCount === 0) {
      test.info().annotations.push({
        type: 'note',
        description:
          'WH: tidak ada fixed-asset stock di warehouse — detail skip assert',
      });
      await expect(page.locator('td.dataTables_empty')).toBeVisible();
      return;
    }

    if (firstSku) {
      await report.searchSku(firstSku);
    }

    const itemStockId = await report.openFirstDetailFromAssetCodeLink();
    expect(itemStockId.length).toBeGreaterThan(0);
    await report.assertDetailSections();
  });

  test('[@TC-ASL-005] Buka panel Export', async ({ page }) => {
    const report = new AssetListPage(page);
    await report.gotoReport();
    await report.selectWarehouse('Gayungsari');
    await report.openExportPanel();
  });
});
