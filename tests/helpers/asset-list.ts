import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const ASSET_LIST_PATH = '/accounting/asset-list';
export const ASSET_LIST_DETAIL_PATTERN = /\/accounting\/asset-list\/\d+/;

/**
 * POM Asset List — FA monitoring (fixed asset stock).
 * Selector: tests/pom-registry/asset-list.yaml
 */
export class AssetListPage {
  readonly datalist: OlshopDatalist;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get createButton(): Locator {
    return this.page.getByRole('link', { name: 'Create', exact: true });
  }

  get warehouseFilter(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Warehouse');
  }

  get applyButton(): Locator {
    return this.page.getByRole('button', { name: /^Apply$/i });
  }

  get latestCalculationBanner(): Locator {
    return this.page.getByText(/Latest Calculation/i).first();
  }

  get mainContent(): Locator {
    return this.page.locator('#main-content');
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  private isDatalistUrl(url: string): boolean {
    return (
      url.includes('/accounting/asset-list') &&
      url.includes('warehouse_id=') &&
      !url.includes('/select2/') &&
      !url.includes('/export') &&
      !url.includes('/cek/') &&
      !url.includes('/modal-available')
    );
  }

  async gotoReport(): Promise<void> {
    await this.page.goto(ASSET_LIST_PATH, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await expect(this.page).toHaveURL(/\/accounting\/asset-list/, {
      timeout: 45_000,
    });
    await expect(
      this.page.getByRole('link', { name: /Asset List/i }).first(),
    ).toBeVisible({ timeout: 30_000 });
  }

  async assertShellBeforeWarehouse(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.warehouseFilter).toBeVisible({ timeout: 30_000 });
    await expect(this.applyButton).toBeVisible();
    const selected = await this.multiselect.selectedLabel(this.warehouseFilter);
    expect(
      !selected || /^choose\b/i.test(selected),
      'Warehouse belum dipilih',
    ).toBeTruthy();
  }

  async selectWarehouse(searchTerm = 'Gayungsari'): Promise<string> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isDatalistUrl(response.url()),
      { timeout: 180_000 },
    );

    await this.multiselect.selectOption(this.warehouseFilter, searchTerm, {
      exact: false,
      typeToFilter: searchTerm,
    });

    if ((await this.mainContent.count()) === 0) {
      await this.applyButton.click();
    }

    const response = await listResponse;
    expect(
      response.ok(),
      `Asset List datalist HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.mainContent).toBeVisible({ timeout: 90_000 });
    await expect(this.datalist.table).toBeVisible({ timeout: 90_000 });

    const label = await this.multiselect.selectedLabel(this.warehouseFilter);
    return label.split(/\s+/)[0] || label.slice(0, 40);
  }

  async assertDatalistColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(
      headers.filter({ hasText: /asset code/i }).first(),
    ).toBeVisible({ timeout: 45_000 });
    await expect(
      headers.filter({ hasText: /system product/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /unit price/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /availability/i }).first(),
    ).toBeVisible();
  }

  async assertLatestCalculationVisible(): Promise<void> {
    await expect(this.latestCalculationBanner).toBeVisible({
      timeout: 30_000,
    });
    const text = (await this.latestCalculationBanner.textContent()) ?? '';
    expect(
      text.replace(/Latest Calculation\s*:?\s*/i, '').trim().length,
    ).toBeGreaterThan(0);
  }

  async assertRowsOrEmpty(): Promise<{ rowCount: number }> {
    await this.page.waitForTimeout(600);
    const empty = this.page.locator('td.dataTables_empty');
    if (await empty.isVisible().catch(() => false)) {
      return { rowCount: 0 };
    }
    return { rowCount: await this.dataRows().count() };
  }

  async readFirstSkuFromRow(): Promise<string | null> {
    const { rowCount } = await this.assertRowsOrEmpty();
    if (rowCount === 0) return null;

    const row = this.dataRows().first();
    const skuLink = row.locator('a[href*="/supplychain/product/edit/"]').first();
    if (await skuLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      return ((await skuLink.textContent()) ?? '').trim() || null;
    }

    const text = ((await row.innerText()) ?? '').trim();
    const firstLine = text.split('\n').map((s) => s.trim()).find(Boolean);
    return firstLine || null;
  }

  async searchSku(sku: string): Promise<void> {
    await this.datalist.search(sku, 2_000);
    await expect(
      this.page.getByRole('row').filter({ hasText: sku }).first(),
    ).toBeVisible({ timeout: 60_000 });
  }

  async clickFirstAvailabilityLink(): Promise<void> {
    const modalResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/stock-monitoring/') &&
        response.url().includes('/modal-available'),
      { timeout: 60_000 },
    );

    const link = this.dataRows()
      .first()
      .locator('p.available.text-blue-700')
      .first();
    await expect(link).toBeVisible({ timeout: 30_000 });
    await link.click();

    const response = await modalResponse;
    expect(
      response.ok(),
      `modal-available HTTP ${response.status()}`,
    ).toBeTruthy();
    await expect(this.page.getByText(/^Available:/i).first()).toBeVisible({
      timeout: 30_000,
    });
  }

  async openFirstDetailFromAssetCodeLink(): Promise<string> {
    const row = this.dataRows().first();
    const detailLink = row
      .locator('a[href*="/accounting/asset-list/"]')
      .first();
    await expect(detailLink).toBeVisible({ timeout: 30_000 });

    const href = (await detailLink.getAttribute('href')) ?? '';
    const match = href.match(/\/asset-list\/(\d+)/);
    expect(match, 'Link Asset Code harus mengandung item_stock id').toBeTruthy();

    const path = href.startsWith('http') ? new URL(href).pathname : href;
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await expect(this.page).toHaveURL(ASSET_LIST_DETAIL_PATTERN, {
      timeout: 45_000,
    });

    return match![1];
  }

  async assertDetailSections(): Promise<void> {
    await expect(
      this.page.getByText('Basic Information', { exact: true }).first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      this.page.getByText('Product Trx History', { exact: true }).first(),
    ).toBeVisible();
    await expect(
      this.page.getByText('Certificate', { exact: true }).first(),
    ).toBeVisible();
    await expect(
      this.page.getByText('Product Interchange', { exact: true }).first(),
    ).toBeVisible();
  }

  async openExportPanel(): Promise<void> {
    // Accessibility tree: button "Export" (bukan .dt-btn-export yang hidden).
    const exportBtn = this.page.getByRole('button', { name: 'Export', exact: true });
    await expect(exportBtn).toBeVisible({ timeout: 30_000 });
    await exportBtn.scrollIntoViewIfNeeded();
    await exportBtn.click();

    // ExportFileTable / PrimeExportLog slideover
    const panel = this.page
      .getByRole('heading', { name: /Export Log/i })
      .or(this.page.locator('.export-all-div'))
      .or(this.page.getByText(/Export All Data|Export in progress/i))
      .or(this.page.getByText(/All Data|Active Page/i))
      .first();

    await expect(panel).toBeVisible({ timeout: 30_000 });
  }
}
