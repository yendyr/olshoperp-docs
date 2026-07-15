import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const INVENTORY_DETAIL_PATH = '/supplychain/inventory-detail';

/**
 * POM Inventory Detail (SCM Report — read-only).
 * Selector: tests/pom-registry/inventory-detail.yaml
 *
 * Fungsi: laporan stok per level gudang (SKU × warehouse parent)
 * dengan Availability, reserved, transit, dan quick-filter KPI cards.
 */
export class InventoryDetailPage {
  readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  get createButton(): Locator {
    return this.page
      .getByRole('link', { name: 'Create', exact: true })
      .or(this.page.locator('button:has-text("Create")'));
  }

  /** FormSelect warehouse space type — bukan pageLength select DataTables. */
  get warehouseLevelSelect(): Locator {
    return this.page
      .locator('select')
      .filter({
        has: this.page.locator('option', {
          hasText: /Building|Company|Floor|City|Rack|Area|Zone/i,
        }),
      })
      .first();
  }

  get cardTotalAvailability(): Locator {
    return this.page
      .locator('div.cursor-pointer')
      .filter({ hasText: 'Total Availability' })
      .first();
  }

  get cardOutOfStock(): Locator {
    return this.page
      .locator('div.cursor-pointer')
      .filter({ hasText: 'Out of Stock' })
      .first();
  }

  get cardWarning(): Locator {
    return this.page
      .locator('div.cursor-pointer')
      .filter({ hasText: /^Warning/ })
      .first();
  }

  get cardTransit(): Locator {
    return this.page
      .locator('div.cursor-pointer')
      .filter({ hasText: /^Transit/ })
      .first();
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  private isDatalistUrl(url: string): boolean {
    return (
      url.includes('/supplychain/inventory-detail') &&
      url.includes('warehouse_space_type=') &&
      !url.includes('/select2-') &&
      !url.includes('/all-') &&
      !url.includes('/export') &&
      !url.includes('/get-')
    );
  }

  async gotoReport(): Promise<void> {
    const levelResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        response.url().includes('/inventory-detail/select2-warehouse-level'),
      { timeout: 90_000 },
    );

    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isDatalistUrl(response.url()),
      { timeout: 120_000 },
    );

    await this.page.goto(INVENTORY_DETAIL_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    const level = await levelResponse;
    expect(level.ok(), `select2-warehouse-level HTTP ${level.status()}`).toBeTruthy();

    const list = await listResponse;
    expect(list.ok(), `Inventory Detail datalist HTTP ${list.status()}`).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 60_000 });
    await expect(this.warehouseLevelSelect).toBeVisible({ timeout: 30_000 });

    await expect(
      this.page
        .locator('a[href="/supplychain/inventory-detail"]')
        .filter({ hasText: 'Inventory Detail' })
        .locator('visible=true')
        .first(),
    ).toBeVisible({ timeout: 15_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.cardTotalAvailability).toBeVisible({ timeout: 30_000 });
    await expect(this.cardOutOfStock).toBeVisible();
    await expect(this.cardWarning).toBeVisible();
    await expect(this.cardTransit).toBeVisible();
  }

  async assertVisibleColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /system product/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /warehouse/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /reserved tf/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /availability/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /primary unit/i }).first()).toBeVisible();
  }

  async selectedWarehouseLevelLabel(): Promise<string> {
    const select = this.warehouseLevelSelect;
    const value = await select.inputValue();
    const option = select.locator(`option[value="${value}"]`);
    return ((await option.textContent()) ?? '').trim();
  }

  async assertRowsOrEmpty(): Promise<{ rowCount: number; sampleSku?: string }> {
    await this.page.waitForTimeout(800);
    const empty = this.page.locator('td.dataTables_empty');
    if (await empty.isVisible().catch(() => false)) {
      return { rowCount: 0 };
    }

    const rows = this.dataRows();
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    const skuCell = rows.first().locator('td').first();
    const sampleSku = ((await skuCell.innerText()) ?? '').trim().split('\n')[0];
    return { rowCount, sampleSku: sampleSku || undefined };
  }

  /** Klik card Out of Stock → datalist reload dengan &filter= */
  async filterOutOfStock(): Promise<void> {
    const filtered = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isDatalistUrl(response.url()) &&
        response.url().includes('filter='),
      { timeout: 120_000 },
    );

    await this.cardOutOfStock.click();
    const response = await filtered;
    expect(response.ok(), `Filter OOS HTTP ${response.status()}`).toBeTruthy();
    await expect(this.datalist.table).toBeVisible({ timeout: 60_000 });
  }
}
