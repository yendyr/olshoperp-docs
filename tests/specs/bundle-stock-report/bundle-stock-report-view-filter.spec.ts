import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  BUNDLE_STOCK_REPORT_PATH,
  BundleStockReportPage,
} from '../../helpers/bundle-stock-report';

/**
 * Bundle Stock Report — view + filter produk.
 * Company: lumicharmsid (153)
 * Read-only report (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Bundle Stock Report — View then Filter', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: BUNDLE_STOCK_REPORT_PATH,
    });
  });

  test('[@TC-BSR-001] Buka laporan + kolom Availability', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const report = new BundleStockReportPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
    await report.assertVisibleColumns();

    const { rowCount, sampleSku } = await report.assertHasBundleRowsOrEmptyState();
    // Company Lumi biasanya sudah punya Product Bundle — expect data
    expect(
      rowCount,
      'lumicharmsid diharapkan punya minimal 1 header bundle',
    ).toBeGreaterThan(0);
    expect(sampleSku).toBeTruthy();
  });

  test('[@TC-BSR-002] Filter Choose Product → product_id', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const report = new BundleStockReportPage(page);
    await report.gotoReport();

    // Cari product yang punya BOM (select2 scope). Token generik → ambil opsi pertama.
    const { productId, selectedLabel } = await report.filterByProductSearch('a');
    expect(productId).toMatch(/^\d+$/);
    expect(selectedLabel.length).toBeGreaterThan(0);

    // Setelah filter: tabel masih valid (bisa 0 baris jika SKU filter = header
    // tanpa jadi komponen header lain — AS-IS).
    await expect(report.datalist.table).toBeVisible();
    const empty = page.locator('td.dataTables_empty');
    const hasEmpty = await empty.isVisible().catch(() => false);
    if (!hasEmpty) {
      const rows = await report.dataRows().count();
      expect(rows).toBeGreaterThan(0);
    }
  });
});
