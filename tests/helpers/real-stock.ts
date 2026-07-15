import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const REAL_STOCK_PATH = '/supplychain/real-stock';

/**
 * POM Real Time Stock (SCM Report — read-only).
 * Selector: tests/pom-registry/real-stock.yaml
 *
 * Fungsi: stok real-time On Hand / ATS / Availability per location & SKU.
 * AS-IS V2: datalist kosong sampai warehouse Multiselect dipilih.
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
    return this.page.getByRole('tab', { name: /By Location/i });
  }

  get tabBySku(): Locator {
    return this.page.getByRole('tab', { name: /By SKU/i });
  }

  get warehouseMultiselect(): Locator {
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

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.tabByLocation).toBeVisible();
    await expect(this.tabBySku).toBeVisible();
    await expect(this.warehouseMultiselect).toBeVisible({ timeout: 30_000 });
    // Manual Calculate muncul setelah warehouse dipilih
    await expect(this.manualCalculateButton).toHaveCount(0);
  }

  async selectFirstWarehouse(): Promise<string> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isByLocationUrl(response.url()),
      { timeout: 120_000 },
    );

    const ms = this.warehouseMultiselect;
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
    // Close overlay jika masih open
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
