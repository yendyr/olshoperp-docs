import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const STOCK_MONITORING_PATH = '/supplychain/stock-monitoring';

/**
 * POM Dev - Stock Monitoring (SCM Report — read-only).
 * Selector: tests/pom-registry/stock-monitoring.yaml
 */
export class StockMonitoringPage {
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
      url.includes('/supplychain/stock-monitoring') &&
      url.includes('warehouse_id=') &&
      !url.includes('/select2/') &&
      !url.includes('/export') &&
      !url.includes('/cek/') &&
      !url.includes('/modal-available')
    );
  }

  async gotoReport(): Promise<void> {
    await this.page.goto(STOCK_MONITORING_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    await expect(this.page).toHaveURL(/\/supplychain\/stock-monitoring/, {
      timeout: 45_000,
    });
    await expect(
      this.page.getByRole('link', { name: /Stock Monitoring/i }).first(),
    ).toBeVisible({ timeout: 30_000 });
  }

  async assertShellBeforeWarehouse(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.warehouseFilter).toBeVisible({ timeout: 30_000 });
    await expect(this.applyButton).toBeVisible();
    // AS-IS: fetchTableType() ikut ++dataTableComponentKey di mount → #main-content
    // bisa sudah ada sebelum warehouse dipilih. Gate = filter + Apply wajib.
    const selected = await this.multiselect.selectedLabel(this.warehouseFilter);
    expect(
      !selected || /^choose\b/i.test(selected),
      'Warehouse belum dipilih (placeholder Choose Warehouse)',
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
      `Stock Monitoring datalist HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.mainContent).toBeVisible({ timeout: 90_000 });
    await expect(this.datalist.table).toBeVisible({ timeout: 90_000 });

    const label = await this.multiselect.selectedLabel(this.warehouseFilter);
    return label.split(/\s+/)[0] || label.slice(0, 40);
  }

  async assertDatalistColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(
      headers.filter({ hasText: /system product/i }).first(),
    ).toBeVisible({ timeout: 45_000 });
    await expect(headers.filter({ hasText: /inbound/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /transfer/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /used/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /availability/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /^unit$/i }).first()).toBeVisible();
  }

  async assertLatestCalculationVisible(): Promise<void> {
    await expect(this.latestCalculationBanner).toBeVisible({
      timeout: 30_000,
    });
    const text = (await this.latestCalculationBanner.textContent()) ?? '';
    expect(text.replace(/Latest Calculation\s*:?\s*/i, '').trim().length).toBeGreaterThan(0);
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
    expect(response.ok(), `modal-available HTTP ${response.status()}`).toBeTruthy();
    await expect(this.page.getByText(/^Available:/i).first()).toBeVisible({
      timeout: 30_000,
    });
  }

  async openFirstDetailFromSkuLink(sku: string): Promise<string> {
    const row = this.page.getByRole('row').filter({ hasText: sku }).first();
    const detailLink = row.locator('a[href*="/supplychain/stock-monitoring/"]').first();
    await expect(detailLink).toBeVisible({ timeout: 30_000 });

    const href = (await detailLink.getAttribute('href')) ?? '';
    const match = href.match(/\/stock-monitoring\/(\d+)/);
    expect(match, 'Link detail harus mengandung item_stock id').toBeTruthy();

    // AS-IS: product_formatted pakai target=_blank — navigasi same-tab via href
    const path = href.startsWith('http')
      ? new URL(href).pathname
      : href;
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await expect(this.page).toHaveURL(/\/supplychain\/stock-monitoring\/\d+/, {
      timeout: 45_000,
    });

    return match![1];
  }

  async assertDetailTabs(): Promise<void> {
    await expect(
      this.page.getByText('Product Trx History', { exact: true }),
    ).toBeVisible({ timeout: 30_000 });
    await expect(this.page.getByText('Certificate', { exact: true })).toBeVisible();
    await expect(
      this.page.getByText('Product Interchange', { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByRole('button', { name: /Back To Datalist/i }),
    ).toBeVisible();
  }

  async assertRowsOrEmpty(): Promise<{ rowCount: number }> {
    await this.page.waitForTimeout(600);
    const empty = this.page.locator('td.dataTables_empty');
    if (await empty.isVisible().catch(() => false)) {
      return { rowCount: 0 };
    }
    const rowCount = await this.dataRows().count();
    expect(rowCount).toBeGreaterThan(0);
    return { rowCount };
  }
}
