import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const PRODUCT_MUTATION_PATH = '/supplychain/product-mutation';

/**
 * POM Product Mutation History (SCM Report — read-only).
 * Selector: tests/pom-registry/product-mutation.yaml
 *
 * Fungsi: riwayat mutasi stok per SKU + ending balance.
 * Wajib Choose Product sebelum datalist (v-if product_id).
 */
export class ProductMutationPage {
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

  get applyButton(): Locator {
    return this.page.getByRole('button', { name: /^Apply$/i }).first();
  }

  get manualCalculationButton(): Locator {
    return this.page
      .getByRole('button', {
        name: /manual calculation of ending balance/i,
      })
      .first();
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  private isHistoryListUrl(url: string): boolean {
    if (!url.includes('/supplychain/product-mutation')) return false;
    if (!url.includes('product_id=')) return false;
    if (url.includes('/select2') || url.includes('/calculation')) return false;
    if (url.includes('product-mutation-stock')) return false;
    return true;
  }

  async gotoReport(): Promise<void> {
    // Mount fire calculation-progress — jangan tunggu list tanpa product_id
    await this.page.goto(PRODUCT_MUTATION_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    await expect(
      this.page
        .locator('a[href="/supplychain/product-mutation"]')
        .filter({ hasText: /Product Mutation History/i })
        .locator('visible=true')
        .first()
        .or(
          this.page.getByText('Product Mutation History', { exact: true }).first(),
        ),
    ).toBeVisible({ timeout: 30_000 });

    await expect(this.productFilter).toBeVisible({ timeout: 30_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.productFilter).toBeVisible();
    await expect(this.applyButton).toBeVisible({ timeout: 15_000 });
    await expect(this.manualCalculationButton).toBeVisible({ timeout: 15_000 });
    // Tabel belum ada sebelum product dipilih
    await expect(this.page.getByRole('table')).toHaveCount(0);
  }

  /**
   * Pilih produk di filter → watch auto click_select → ?product_id=.
   */
  async filterByFirstProduct(searchTerm = 'a'): Promise<{
    productId: string;
    selectedSku: string;
  }> {
    const listResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isHistoryListUrl(response.url()),
      { timeout: 120_000 },
    );

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

    const response = await listResponse;
    expect(
      response.ok(),
      `Product Mutation History HTTP ${response.status()}`,
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
    await expect(headers.filter({ hasText: /^date$/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /stock mutation/i }).first(),
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
