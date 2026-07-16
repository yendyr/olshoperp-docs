import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const REAL_STOCK_PATH = '/supplychain/real-stock';

/**
 * POM Real Time Stock (SCM Report — read-only).
 * Selector: tests/pom-registry/real-stock.yaml
 *
 * Tab: By Location (GET by-location) · By SKU (POST by-sku)
 * AS-IS V2: datalist kosong sampai warehouse dipilih (By Location / WH|Sales Team).
 * By SKU mode ALL: load tanpa warehouse.
 */
export class RealStockPage {
  readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  get createButton(): Locator {
    return this.page
      .getByRole('link', { name: 'Create', exact: true })
      .or(this.page.locator('button:has-text("Create")'));
  }

  get tabByLocation(): Locator {
    return this.page
      .getByRole('tab', { name: /By Location/i })
      .or(this.page.getByText('By Location', { exact: true }))
      .first();
  }

  get tabBySku(): Locator {
    return this.page
      .getByRole('tab', { name: /By SKU/i })
      .or(this.page.getByText('By SKU', { exact: true }))
      .first();
  }

  /** By Location — Placeholder Select one or more items to view data */
  get warehouseMultiselectByLocation(): Locator {
    return this.page
      .locator('.p-multiselect')
      .filter({
        has: this.page.getByText(
          /Select one or more items to view data/i,
        ),
      })
      .or(
        this.page
          .locator('.p-multiselect')
          .filter({ hasText: /Select one or more items/i }),
      )
      .first();
  }

  /** Legacy alias */
  get warehouseMultiselect(): Locator {
    return this.warehouseMultiselectByLocation;
  }

  /** By SKU (WH/Sales) — Placeholder You can choose up to 5 Buildings. */
  get warehouseMultiselectBySku(): Locator {
    return this.page
      .locator('.p-multiselect')
      .filter({
        hasText: /You can choose up to 5 Buildings/i,
      })
      .first();
  }

  get btnWhTeam(): Locator {
    return this.page.getByRole('button', { name: /^WH Team$/i });
  }

  get btnSalesTeam(): Locator {
    return this.page.getByRole('button', { name: /^Sales Team$/i });
  }

  get btnAllTeam(): Locator {
    return this.page.getByRole('button', { name: /^ALL$/i });
  }

  get manualCalculateButton(): Locator {
    return this.page
      .locator('button')
      .filter({ hasText: /Manual Calculate/i })
      .first();
  }

  get logDataButton(): Locator {
    return this.page
      .locator('button')
      .filter({ hasText: /Log Data/i })
      .first();
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  private isByLocationUrl(url: string): boolean {
    return (
      url.includes('/supplychain/real-stock/by-location') &&
      url.includes('warehouse_id=') &&
      !url.includes('/export') &&
      !url.includes('/select2')
    );
  }

  private isBySkuUrl(url: string): boolean {
    return (
      url.includes('/supplychain/real-stock/by-sku') &&
      !url.includes('/export') &&
      !url.includes('/select2') &&
      !url.includes('warehouse-column')
    );
  }

  async gotoReport(): Promise<void> {
    await this.page.goto(REAL_STOCK_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    await expect(this.page).toHaveURL(/\/supplychain\/real-stock/, {
      timeout: 45_000,
    });
    await expect(
      this.page.getByRole('link', { name: /Real Time Stock/i }).first(),
    ).toBeVisible({ timeout: 30_000 });
    await expect(this.tabByLocation).toBeVisible({ timeout: 30_000 });
  }

  // ─── By Location ───────────────────────────────────────────────

  async assertByLocationShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.tabByLocation).toBeVisible();
    await expect(this.tabBySku).toBeVisible();
    await expect(this.warehouseMultiselectByLocation).toBeVisible({
      timeout: 30_000,
    });
    // Manual Calculate muncul setelah warehouse dipilih
    await expect(this.manualCalculateButton).toHaveCount(0);
  }

  /** @deprecated use assertByLocationShell */
  async assertReadOnlyShell(): Promise<void> {
    await this.assertByLocationShell();
  }

  async selectFirstWarehouseByLocation(): Promise<string> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isByLocationUrl(response.url()),
      { timeout: 120_000 },
    );

    const ms = this.warehouseMultiselectByLocation;
    await expect(ms).toBeVisible({ timeout: 30_000 });
    await ms.click();
    await this.page.waitForTimeout(600);

    const option = this.page
      .locator(
        '.p-multiselect-option:visible, .p-multiselect-items .p-multiselect-item:visible, li.p-multiselect-item:visible, [role="option"]:visible',
      )
      .filter({ hasNotText: /No results|No available/i })
      .first();
    await expect(option, 'Opsi warehouse Building').toBeVisible({
      timeout: 45_000,
    });

    const label = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(400);

    const response = await listResponse;
    expect(
      response.ok(),
      `Real Stock by-location HTTP ${response.status()}`,
    ).toBeTruthy();

    const url = new URL(response.url());
    const warehouseId = url.searchParams.get('warehouse_id') ?? '';
    expect(warehouseId, 'Request harus kirim warehouse_id').toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 60_000 });
    return label.split(/\s+/)[0] || label.slice(0, 40);
  }

  /** @deprecated use selectFirstWarehouseByLocation */
  async selectFirstWarehouse(): Promise<string> {
    return this.selectFirstWarehouseByLocation();
  }

  async assertByLocationColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(
      headers.filter({ hasText: /system product/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /unit/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /on hand/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /\bats\b/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /availability/i }).first(),
    ).toBeVisible();
  }

  async assertManualCalculateVisible(): Promise<void> {
    await expect(this.manualCalculateButton).toBeVisible({ timeout: 20_000 });
    await expect(this.logDataButton).toBeVisible({ timeout: 15_000 });
  }

  // ─── By SKU ────────────────────────────────────────────────────

  async switchToBySku(): Promise<void> {
    await expect(this.tabBySku).toBeVisible({ timeout: 20_000 });
    await this.tabBySku.click();
    await this.page.waitForTimeout(800);
    await expect(this.btnWhTeam).toBeVisible({ timeout: 30_000 });
  }

  async assertBySkuShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.btnWhTeam).toBeVisible();
    await expect(this.btnSalesTeam).toBeVisible();
    await expect(this.btnAllTeam).toBeVisible();
    // Default menu = WH Team → Multiselect Buildings wajib
    await expect(this.warehouseMultiselectBySku).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      this.page.getByText(/You can choose up to 5 Warehouse/i).first(),
    ).toBeVisible();
  }

  /**
   * FILTER By SKU via mode ALL — load semua WH tanpa Multiselect.
   * API: POST/GET by-sku?menu=all
   */
  async filterBySkuAll(): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        (response.request().method() === 'POST' ||
          response.request().method() === 'GET') &&
        this.isBySkuUrl(response.url()),
      { timeout: 180_000 },
    );

    await this.btnAllTeam.click();
    const response = await listResponse;
    expect(
      response.ok(),
      `Real Stock by-sku (ALL) HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 90_000 });
  }

  /**
   * FILTER By SKU via WH Team + pilih 1 Building.
   */
  async filterBySkuFirstWarehouse(): Promise<string> {
    // Pastikan WH Team aktif
    await this.btnWhTeam.click();
    await this.page.waitForTimeout(500);

    const listResponse = this.page.waitForResponse(
      (response) =>
        (response.request().method() === 'POST' ||
          response.request().method() === 'GET') &&
        this.isBySkuUrl(response.url()) &&
        (response.url().includes('warehouse_id=') ||
          response.request().postData()?.includes('warehouse_id') === true),
      { timeout: 180_000 },
    );

    const ms = this.warehouseMultiselectBySku;
    await expect(ms).toBeVisible({ timeout: 30_000 });
    await ms.click();
    await this.page.waitForTimeout(600);

    const option = this.page
      .locator(
        '.p-multiselect-option:visible, .p-multiselect-items .p-multiselect-item:visible, li.p-multiselect-item:visible, [role="option"]:visible',
      )
      .filter({ hasNotText: /No results|No available/i })
      .first();
    await expect(option, 'Opsi Building By SKU').toBeVisible({
      timeout: 45_000,
    });

    const label = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.keyboard.press('Escape').catch(() => undefined);
    // Debounce scheduleApply ~800ms
    await this.page.waitForTimeout(1_000);

    const response = await listResponse;
    expect(
      response.ok(),
      `Real Stock by-sku (WH) HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 90_000 });
    return label.split(/\s+/)[0] || label.slice(0, 40);
  }

  async assertBySkuColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(
      headers.filter({ hasText: /system product/i }).first(),
    ).toBeVisible({ timeout: 45_000 });
    await expect(headers.filter({ hasText: /unit/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /latest calculation/i }).first(),
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

  async assertBySkuTabVisible(): Promise<void> {
    await expect(this.tabBySku).toBeVisible();
  }
}
