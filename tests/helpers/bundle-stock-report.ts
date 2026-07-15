import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const BUNDLE_STOCK_REPORT_PATH = '/supplychain/bundle-stock-report';

/**
 * POM Bundle Stock Report (SCM Report — read-only).
 * Selector: tests/pom-registry/bundle-stock-report.yaml
 *
 * Fungsi: lihat berapa unit **header Product Bundle** yang bisa
 * "dirakit" dari stok komponen (Availability = min komponen/BOM qty).
 */
export class BundleStockReportPage {
  readonly datalist: OlshopDatalist;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get productFilter(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Product');
  }

  get warehouseLabel(): Locator {
    return this.page.getByText('Warehouse Name', { exact: true });
  }

  get createButton(): Locator {
    return this.page.getByRole('link', { name: 'Create', exact: true });
  }

  async gotoReport(): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'GET') return false;
        const url = response.url();
        return (
          url.includes('/supplychain/bundle-stock-report') &&
          !url.includes('/select2/')
        );
      },
      { timeout: 90_000 },
    );

    await this.page.goto(BUNDLE_STOCK_REPORT_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    const response = await listResponse;
    expect(
      response.ok(),
      `Bundle Stock Report datalist HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 45_000 });
    await expect(
      this.page.getByText('Bundle Stock Report', { exact: true }).first(),
    ).toBeVisible({ timeout: 15_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.warehouseLabel).toBeHidden();
    await expect(this.productFilter).toBeVisible({ timeout: 15_000 });
  }

  async assertVisibleColumns(): Promise<void> {
    // DataTables columnheader accessible name sering lowercase ("unit", "update at")
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /system product/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /availability/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /^unit$/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /update at/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /ats qty/i })).toHaveCount(0);
  }

  /** Baris data (abaikan header). */
  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  async assertHasBundleRowsOrEmptyState(): Promise<{
    rowCount: number;
    sampleSku?: string;
  }> {
    await this.page.waitForTimeout(800);
    const empty = this.page.locator('td.dataTables_empty');
    if (await empty.isVisible().catch(() => false)) {
      return { rowCount: 0 };
    }

    const rows = this.dataRows();
    const rowCount = await rows.count();
    expect(rowCount, 'Harus ada minimal 1 baris bundle atau empty state').toBeGreaterThan(0);

    const firstSkuLink = rows.first().locator('a[href*="/supplychain/product/edit/"]').first();
    await expect(firstSkuLink).toBeVisible({ timeout: 15_000 });
    const sampleSku = ((await firstSkuLink.textContent()) ?? '').trim();
    expect(sampleSku.length).toBeGreaterThan(0);

    // Availability cell (kolom qty biru)
    await expect(rows.first().locator('p.text-blue-700').first()).toBeVisible();

    return { rowCount, sampleSku };
  }

  /**
   * Pilih produk di filter → datalist reload dengan ?product_id=.
   * AS-IS select2: produk yang punya BOM is_bom=0 (umumnya header bundle).
   */
  async filterByProductSearch(searchTerm: string): Promise<{
    productId: string;
    selectedLabel: string;
  }> {
    const filterResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'GET') return false;
        const url = response.url();
        return (
          url.includes('/supplychain/bundle-stock-report') &&
          url.includes('product_id=') &&
          !url.includes('/select2/')
        );
      },
      { timeout: 90_000 },
    );

    const combobox = this.productFilter;
    await this.multiselect.open(combobox);
    await combobox.fill(searchTerm).catch(async () => {
      await combobox.pressSequentially(searchTerm, { delay: 40 });
    });
    await this.page.waitForTimeout(700);

    const option = this.multiselect.visibleOptions().first();
    await expect(option, `Opsi filter untuk "${searchTerm}"`).toBeVisible({
      timeout: 30_000,
    });
    const selectedLabel = ((await option.textContent()) ?? '').trim();
    await option.click();

    const response = await filterResponse;
    expect(response.ok(), `Filter datalist HTTP ${response.status()}`).toBeTruthy();

    const url = new URL(response.url());
    const productId = url.searchParams.get('product_id') ?? '';
    expect(productId, 'Request filter harus kirim product_id').toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 30_000 });
    return { productId, selectedLabel };
  }
}
