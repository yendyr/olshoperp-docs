import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const PRODUCT_ENDING_STOCK_PATH = '/supplychain/product-ending-stock';

/**
 * POM Product Ending Stock (SCM Report — read-only).
 * Selector: tests/pom-registry/product-ending-stock.yaml
 *
 * Fungsi: laporan ending stock (scmag_ending_stocks) — By Warehouse & By SKU.
 * Manual Calculate memicu real-stock/manual-calculate.
 */
export class ProductEndingStockPage {
  readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  get createButton(): Locator {
    return this.page
      .getByRole('link', { name: 'Create', exact: true })
      .or(this.page.locator('button:has-text("Create")'));
  }

  get tabByWarehouse(): Locator {
    return this.page.getByRole('tab', { name: /By Warehouse/i });
  }

  get tabBySku(): Locator {
    return this.page.getByRole('tab', { name: /By SKU/i });
  }

  get manualCalculateButton(): Locator {
    return this.page
      .getByRole('button', { name: /Manual Calculate/i })
      .or(this.page.locator('button').filter({ hasText: /Manual Calculate/i }))
      .first();
  }

  get logDataButton(): Locator {
    return this.page
      .getByRole('button', { name: /Log Data/i })
      .or(this.page.locator('button').filter({ hasText: /Log Data/i }))
      .first();
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  private isWarehouseListUrl(url: string): boolean {
    if (!url.includes('/supplychain/product-ending-stock')) return false;
    if (url.includes('product-ending-stock-by-sku')) return false;
    if (url.includes('/export') || url.includes('/select2')) return false;
    if (url.includes('manual-calculate')) return false;
    return true;
  }

  private isSkuListUrl(url: string): boolean {
    return (
      url.includes('/supplychain/product-ending-stock-by-sku') &&
      !url.includes('/export') &&
      !url.includes('/select2')
    );
  }

  async gotoReport(): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isWarehouseListUrl(response.url()),
      { timeout: 120_000 },
    );

    await this.page.goto(PRODUCT_ENDING_STOCK_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    const response = await listResponse;
    expect(
      response.ok(),
      `Product Ending Stock (By Warehouse) HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 60_000 });
    await expect(
      this.page.getByText('Product Ending Stock', { exact: true }).first(),
    ).toBeVisible({ timeout: 15_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.manualCalculateButton).toBeVisible({ timeout: 20_000 });
    await expect(this.logDataButton).toBeVisible({ timeout: 15_000 });
    await expect(
      this.page.getByText('By Warehouse', { exact: false }).first(),
    ).toBeVisible();
  }

  async assertByWarehouseColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(
      headers.filter({ hasText: /system product/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /availability/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /unit/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /latest calculation/i }).first(),
    ).toBeVisible();
    // Header HTML + tippy → accessible name tidak exact "Status"
    await expect(headers.filter({ hasText: /status/i }).first()).toBeVisible();
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

  async switchToBySku(): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isSkuListUrl(response.url()),
      { timeout: 120_000 },
    );

    const tab = this.tabBySku;
    await expect(tab).toBeVisible({ timeout: 20_000 });
    await tab.click();

    const response = await listResponse;
    expect(
      response.ok(),
      `Product Ending Stock (By SKU) HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 60_000 });
  }

  async assertBySkuColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(
      headers.filter({ hasText: /system product/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /on hand/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /\bats\b/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /availability/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /unit/i }).first()).toBeVisible();
  }

  /** Global searchbox — soft filter after By SKU. */
  async searchSkuToken(token: string): Promise<void> {
    const search = this.datalist.searchInput;
    await expect(search).toBeVisible({ timeout: 20_000 });
    await search.fill(token);
    await this.page.waitForTimeout(1_500);
    await expect(this.datalist.table).toBeVisible({ timeout: 30_000 });
  }
}
