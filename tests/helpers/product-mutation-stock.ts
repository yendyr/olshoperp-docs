import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const PRODUCT_MUTATION_STOCK_PATH = '/supplychain/product-mutation-stock';

/**
 * POM Stock History (menu slug product-mutation-stock).
 * Selector: tests/pom-registry/product-mutation-stock.yaml
 *
 * AS-IS FE: route `/supplychain/product-mutation-stock` loads StockHistory/DataList.vue
 * (breadcrumb "Stock History V2"; API `GET supplychain/stock-history?product_id=`).
 * Wajib Choose Product + Apply (show_table=false sampai Apply).
 */
export class ProductMutationStockPage {
  readonly datalist: OlshopDatalist;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get createButton(): Locator {
    return this.page
      .getByRole('link', { name: 'Create', exact: true })
      .or(this.page.locator('button:has-text("Create")'));
  }

  get productFilter(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Product');
  }

  get warehouseFilter(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Filter Building');
  }

  get warehouseLevelFilter(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Show data as');
  }

  get applyButton(): Locator {
    return this.page.getByRole('button', { name: /^Apply$/i }).first();
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  private isStockHistoryListUrl(url: string): boolean {
    // AS-IS: product-mutation-stock route → StockHistory.vue → API stock-history
    const isApi =
      url.includes('/supplychain/stock-history') ||
      url.includes('/supplychain/product-mutation-stock');
    if (!isApi) return false;
    if (!url.includes('product_id=')) return false;
    if (url.includes('/select2') || url.includes('/calculation')) return false;
    if (url.includes('export') || url.includes('progress')) return false;
    return true;
  }

  async gotoReport(): Promise<void> {
    await this.page.goto(PRODUCT_MUTATION_STOCK_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    await expect(
      this.page.getByRole('link', { name: /Stock History/i }).first(),
    ).toBeVisible({ timeout: 30_000 });

    await expect(this.productFilter).toBeVisible({ timeout: 30_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.productFilter).toBeVisible();
    await expect(this.warehouseFilter).toBeVisible({ timeout: 15_000 });
    await expect(this.warehouseLevelFilter).toBeVisible({ timeout: 15_000 });
    await expect(this.applyButton).toBeVisible({ timeout: 15_000 });
    await expect(
      this.page.getByText('Select Period', { exact: false }).first(),
    ).toBeVisible();
    // Tabel belum ada sampai Apply (show_table=false)
    await expect(this.page.getByRole('table')).toHaveCount(0);
  }

  /** Choose Product → Apply → GET stock-history?product_id= */
  async filterByFirstProductAndApply(searchTerm = 'a'): Promise<{
    productId: string;
    selectedSku: string;
  }> {
    const combobox = this.productFilter;
    await this.multiselect.open(combobox);
    await combobox.fill(searchTerm).catch(async () => {
      await combobox.pressSequentially(searchTerm, { delay: 40 });
    });
    await this.page.waitForTimeout(700);

    const option = this.multiselect.visibleOptions().first();
    await expect(option, `Opsi Choose Product untuk "${searchTerm}"`).toBeVisible(
      { timeout: 45_000 },
    );

    const strong = option.locator('strong').first();
    const selectedSku = (
      (await strong.textContent().catch(() => '')) ??
      (await option.textContent()) ??
      ''
    ).trim();
    await option.click();
    await this.page.waitForTimeout(400);

    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isStockHistoryListUrl(response.url()),
      { timeout: 120_000 },
    );

    await this.applyButton.click();

    const response = await listResponse;
    expect(
      response.ok(),
      `Stock History HTTP ${response.status()}`,
    ).toBeTruthy();

    const url = new URL(response.url());
    const productId = url.searchParams.get('product_id') ?? '';
    expect(productId, 'Request harus kirim product_id').toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 60_000 });
    return {
      productId,
      selectedSku: selectedSku.split(/\s+/)[0] || selectedSku.slice(0, 40),
    };
  }

  async assertHistoryColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /date/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /trx\.?\s*code/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /receiving process/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /product in/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /product out/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /ending balance/i }).first(),
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
