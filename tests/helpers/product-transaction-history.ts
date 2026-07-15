import { Page, expect, Locator } from '@playwright/test';
import { OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const PRODUCT_TRANSACTION_HISTORY_PATH =
  '/supplychain/product-transaction-history';

/**
 * POM Product Transaction History (SCM Report — read-only dashboard).
 * Selector: tests/pom-registry/product-transaction-history.yaml
 *
 * Fungsi: analytics PR/PO/inbound/outbound per SKU + tabs detail.
 * API: item-transaction-history/data · report-pr|po|mutation.
 */
export class ProductTransactionHistoryPage {
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
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

  get statusFilter(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Status');
  }

  get tabPurchaseRequisition(): Locator {
    return this.page.getByRole('tab', { name: /Purchase Requisition/i });
  }

  get tabPurchaseOrder(): Locator {
    return this.page.getByRole('tab', { name: /Purchase Order/i });
  }

  get tabMutation(): Locator {
    return this.page.getByRole('tab', { name: /Mutation/i });
  }

  private isKpiDataUrl(url: string): boolean {
    return (
      url.includes('/supplychain/item-transaction-history/data') &&
      url.includes('product_id=') &&
      !url.includes('product_id=&') &&
      !/product_id=(?:&|$)/.test(url)
    );
  }

  private isMutationReportUrl(url: string): boolean {
    return (
      url.includes('/item-transaction-history/report-mutation') &&
      url.includes('product_id=') &&
      !url.includes('outbound')
    );
  }

  async gotoReport(): Promise<void> {
    // Mount calls fetchDetail dengan product_id kosong — jangan hard-wait KPI success
    await this.page.goto(PRODUCT_TRANSACTION_HISTORY_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    await expect(this.page).toHaveURL(
      /\/supplychain\/product-transaction-history/,
      { timeout: 45_000 },
    );
    await expect(this.productFilter).toBeVisible({ timeout: 30_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.productFilter).toBeVisible();
    await expect(
      this.page.getByText('Choose Product Code', { exact: false }).first(),
    ).toBeVisible();
    await expect(
      this.page.getByText('Start Date', { exact: false }).first(),
    ).toBeVisible();
    await expect(
      this.page.getByText('End Date', { exact: false }).first(),
    ).toBeVisible();
    await expect(this.statusFilter).toBeVisible({ timeout: 15_000 });

    await expect(
      this.page.getByText('Product Information', { exact: false }).first(),
    ).toBeVisible();
    await expect(
      this.page.getByText('Day Count', { exact: false }).first(),
    ).toBeVisible();
    // FE typo: "Requisiton" — scope ke box KPI (bukan sidebar hidden)
    await expect(
      this.page
        .locator('div.box')
        .filter({ hasText: /Purchase Requisit/i })
        .first(),
    ).toBeVisible({ timeout: 20_000 });

    await expect(this.tabPurchaseRequisition).toBeVisible({ timeout: 20_000 });
    await expect(this.tabPurchaseOrder).toBeVisible();
    await expect(this.tabMutation).toBeVisible();
  }

  async filterByFirstProduct(searchTerm = 'a'): Promise<{
    productId: string;
    selectedSku: string;
  }> {
    const kpiResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'GET' &&
        this.isKpiDataUrl(response.url()),
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

    const response = await kpiResponse;
    expect(
      response.ok(),
      `item-transaction-history/data HTTP ${response.status()}`,
    ).toBeTruthy();

    const url = new URL(response.url());
    const productId = url.searchParams.get('product_id') ?? '';
    expect(productId, 'Request harus kirim product_id').toMatch(/\d+/);

    return {
      productId,
      selectedSku: selectedSku.split(/\s+/)[0] || selectedSku.slice(0, 40),
    };
  }

  async assertProductSkuFilled(): Promise<void> {
    const skuLabel = this.page.getByText('System Product SKU:', { exact: false });
    await expect(skuLabel).toBeVisible({ timeout: 20_000 });
    // Value in sibling/next bold — assert Product Information box bukan "-"
    const infoBox = this.page
      .locator('div.box')
      .filter({ hasText: 'System Product SKU' })
      .first();
    await expect(infoBox.locator('b').first()).not.toHaveText('-', {
      timeout: 30_000,
    });
    const skuText = (
      (await infoBox.locator('b').first().textContent()) ?? ''
    ).trim();
    expect(skuText.length).toBeGreaterThan(0);
  }

  async switchToMutationTab(): Promise<void> {
    const mutationResponse = this.page
      .waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          this.isMutationReportUrl(response.url()),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.tabMutation.click();
    await this.page.waitForTimeout(800);

    const response = await mutationResponse;
    if (response) {
      expect(response.ok(), `report-mutation HTTP ${response.status()}`).toBeTruthy();
    }

    await expect(this.tabMutation).toHaveAttribute('aria-selected', 'true', {
      timeout: 15_000,
    }).catch(async () => {
      // Headless UI may put selected on button child
      await expect(
        this.page.getByText('Mutation', { exact: false }).first(),
      ).toBeVisible();
    });
  }
}
