import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const TRANSACTION_HISTORY_PATH = '/supplychain/transaction-history';

/**
 * POM BETA - Transaction History (SCM Report — read-only).
 * Selector: tests/pom-registry/transaction-history.yaml
 *
 * Filter: Building (PrimeVue) + Period + Transaction Type + Apply.
 * API: GET supplychain/transaction-history
 */
export class TransactionHistoryPage {
  readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  get createButton(): Locator {
    return this.page
      .getByRole('link', { name: 'Create', exact: true })
      .or(this.page.locator('button:has-text("Create")'));
  }

  /** PrimeVue MultiSelect scoped by section label (stable after chip selected). */
  multiselectBySectionLabel(label: string): Locator {
    return this.page
      .locator('div.ml-2')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .locator('.p-multiselect')
      .first();
  }

  get buildingMultiselect(): Locator {
    return this.multiselectBySectionLabel('Building');
  }

  get typeMultiselect(): Locator {
    return this.multiselectBySectionLabel('Transaction Type');
  }

  get applyButton(): Locator {
    return this.page.getByRole('button', { name: /^Apply$/i });
  }

  get periodLabel(): Locator {
    return this.page.getByText('Select Period', { exact: true });
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  private isListUrl(url: string, requiredParam?: string): boolean {
    if (!url.includes('/supplychain/transaction-history')) return false;
    if (url.includes('/select2') || url.includes('/export') || url.includes('/cek/')) {
      return false;
    }
    if (requiredParam && !url.includes(`${requiredParam}=`)) return false;
    return true;
  }

  async gotoReport(): Promise<void> {
    const listResponse = this.page
      .waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          this.isListUrl(response.url()),
        { timeout: 120_000 },
      )
      .catch(() => null);

    await this.page.goto(TRANSACTION_HISTORY_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    await expect(this.page).toHaveURL(/\/supplychain\/transaction-history/, {
      timeout: 45_000,
    });
    await expect(this.applyButton).toBeVisible({ timeout: 45_000 });
    await expect(
      this.page.getByText('Building', { exact: true }).first(),
    ).toBeVisible({ timeout: 30_000 });

    await listResponse;
    await expect(this.datalist.table).toBeVisible({ timeout: 90_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(
      this.page.getByText('Building', { exact: true }).first(),
    ).toBeVisible();
    await expect(this.periodLabel).toBeVisible();
    await expect(
      this.page.getByText('Transaction Type', { exact: true }).first(),
    ).toBeVisible();
    await expect(this.applyButton).toBeVisible();
    await expect(this.buildingMultiselect).toBeVisible({ timeout: 20_000 });
    await expect(this.typeMultiselect).toBeVisible();
  }

  async assertVisibleColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /^date$/i }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      headers.filter({ hasText: /trx\.?\s*code/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /^type$/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /product/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /building origin/i }).first(),
    ).toBeVisible();
    await expect(
      headers.filter({ hasText: /trx\.?\s*ref/i }).first(),
    ).toBeVisible();
  }

  private async closeDatepickerIfOpen(): Promise<void> {
    const datePanel = this.page.locator(
      '.p-datepicker-panel:visible, [aria-label="Choose Date"]:visible',
    );
    if (await datePanel.first().isVisible().catch(() => false)) {
      await this.page.keyboard.press('Escape');
      await expect(datePanel.first()).toBeHidden({ timeout: 5_000 }).catch(
        () => undefined,
      );
    }
  }

  private async selectPrimeOption(
    multiselect: Locator,
    searchTerm: string,
  ): Promise<string> {
    await this.closeDatepickerIfOpen();
    await expect(multiselect).toBeVisible({ timeout: 20_000 });
    await multiselect.click();
    await this.page.waitForTimeout(400);

    const filterInput = this.page
      .locator(
        [
          '.p-multiselect-overlay input[type="text"]',
          '.p-multiselect-filter-container input[type="text"]',
          '.p-multiselect-filter',
          'input.p-multiselect-filter',
        ].join(', '),
      )
      .locator('visible=true')
      .first();

    if (await filterInput.isVisible().catch(() => false)) {
      await filterInput.fill(searchTerm);
      await this.page.waitForTimeout(800);
    }

    const byRole = this.page.getByRole('option', {
      name: new RegExp(searchTerm, 'i'),
    });
    const byCss = this.page
      .locator('.p-multiselect-option:visible')
      .filter({ hasText: new RegExp(searchTerm, 'i') })
      .first();

    const option = (await byRole.first().isVisible().catch(() => false))
      ? byRole.first()
      : byCss;

    await expect(option, `Opsi untuk "${searchTerm}"`).toBeVisible({
      timeout: 45_000,
    });
    const label = ((await option.textContent()) ?? '').trim();
    await option.click({ force: true });
    await this.page.waitForTimeout(300);
    // Tutup panel tanpa membuka datepicker
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.closeDatepickerIfOpen();
    await this.page.waitForTimeout(200);
    return label;
  }

  async filterBuildingAndApply(searchTerm = 'Gayungsari'): Promise<string> {
    const listResponse = this.page.waitForResponse((response) => {
      if (response.request().method() !== 'GET') return false;
      if (!this.isListUrl(response.url(), 'warehouse_id')) return false;
      try {
        const wh = new URL(response.url()).searchParams.get('warehouse_id') ?? '';
        return wh.length > 0;
      } catch {
        return false;
      }
    }, { timeout: 180_000 });

    const label = await this.selectPrimeOption(this.buildingMultiselect, searchTerm);
    await this.closeDatepickerIfOpen();
    await this.applyButton.click();

    const response = await listResponse;
    expect(
      response.ok(),
      `Transaction History filter building HTTP ${response.status()}`,
    ).toBeTruthy();

    const url = new URL(response.url());
    const warehouseId = url.searchParams.get('warehouse_id') ?? '';
    expect(warehouseId.length, 'warehouse_id harus terisi').toBeGreaterThan(0);

    await expect(this.datalist.table).toBeVisible({ timeout: 90_000 });
    return label.split(/\s+/)[0] || label.slice(0, 40);
  }

  async filterTransactionTypeAndApply(
    typeLabel = 'Stock Addition',
  ): Promise<void> {
    const listResponse = this.page.waitForResponse((response) => {
      if (response.request().method() !== 'GET') return false;
      if (!this.isListUrl(response.url())) return false;
      try {
        const types =
          new URL(response.url()).searchParams.get('transaction_type') ?? '';
        return types.toLowerCase().includes(typeLabel.toLowerCase());
      } catch {
        return false;
      }
    }, { timeout: 120_000 });

    await this.selectPrimeOption(this.typeMultiselect, typeLabel);
    await this.closeDatepickerIfOpen();
    await this.applyButton.click();

    const response = await listResponse;
    expect(
      response.ok(),
      `Transaction History filter type HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 90_000 });
  }

  async searchSku(sku: string): Promise<void> {
    await this.datalist.search(sku, 2_000);
    await expect(
      this.page.getByRole('row').filter({ hasText: sku }).first(),
    ).toBeVisible({ timeout: 90_000 });
  }

  async assertTrxCodeLinkOnFirstMatchingRow(sku: string): Promise<void> {
    const row = this.page.getByRole('row').filter({ hasText: sku }).first();
    const trxLink = row.locator('a[href*="/supplychain/"]').first();
    await expect(trxLink).toBeVisible({ timeout: 30_000 });
    const href = (await trxLink.getAttribute('href')) ?? '';
    expect(href).toMatch(/\/supplychain\//);
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
