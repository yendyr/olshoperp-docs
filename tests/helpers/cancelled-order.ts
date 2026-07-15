import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const CANCELLED_ORDER_PATH = '/supplychain/cancelled-order';

/**
 * POM Cancelled Order (SCM Processing — read-only monitoring).
 * Selector: tests/pom-registry/cancelled-order.yaml
 *
 * Fungsi: daftar SO yang sudah Void/Rejected untuk investigasi;
 * tidak membatalkan order dari menu ini.
 */
export class CancelledOrderPage {
  readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  get createButton(): Locator {
    return this.page
      .getByRole('link', { name: 'Create', exact: true })
      .or(this.page.locator('button:has-text("Create")'));
  }

  dataRows(): Locator {
    return this.page.locator('tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
  }

  async gotoList(): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'GET') return false;
        const url = response.url();
        return (
          url.includes('/supplychain/cancelled-order') &&
          !url.includes('/select2/')
        );
      },
      { timeout: 90_000 },
    );

    await this.page.goto(CANCELLED_ORDER_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    const response = await listResponse;
    expect(
      response.ok(),
      `Cancelled Order datalist HTTP ${response.status()}`,
    ).toBeTruthy();

    await expect(this.datalist.table).toBeVisible({ timeout: 45_000 });
    // Sidebar juga punya teks "Cancelled Order" (sering hidden) — pakai breadcrumb link
    await expect(
      this.page
        .locator('a[href="/supplychain/cancelled-order"]')
        .filter({ hasText: 'Cancelled Order' })
        .locator('visible=true')
        .first(),
    ).toBeVisible({ timeout: 15_000 });
  }

  async assertReadOnlyShell(): Promise<void> {
    await expect(this.createButton).toHaveCount(0);
    await expect(this.datalist.searchInput).toBeVisible({ timeout: 15_000 });
  }

  async assertVisibleColumns(): Promise<void> {
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /trx\.?\s*code/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /customer/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /payment time/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /trx\.?\s*status/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /latest processing status/i }).first(),
    ).toBeVisible();
    await expect(headers.filter({ hasText: /void notes/i }).first()).toBeVisible();
  }

  async assertRowsOrEmpty(): Promise<{
    rowCount: number;
    sampleCode?: string;
  }> {
    await this.page.waitForTimeout(800);
    const empty = this.page.locator('td.dataTables_empty');
    if (await empty.isVisible().catch(() => false)) {
      return { rowCount: 0 };
    }

    const rows = this.dataRows();
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);

    const firstRow = rows.first();
    // Status Void / Rejected (kolom TRX. STATUS)
    await expect(firstRow).toContainText(/Void|Rejected/i);

    const soLink = firstRow
      .locator(
        'a[href*="/omni/sales-order/edit/"], a[href*="/businessdevelopment/sales-order-general/edit/"]',
      )
      .first();
    await expect(soLink).toBeVisible({ timeout: 15_000 });
    const sampleCode = ((await soLink.textContent()) ?? '').trim();

    return { rowCount, sampleCode: sampleCode || undefined };
  }

  async searchAndWait(query: string): Promise<void> {
    const listResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'GET') return false;
        return (
          response.url().includes('/supplychain/cancelled-order') &&
          !response.url().includes('/select2/')
        );
      },
      { timeout: 90_000 },
    );

    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(400);
    await this.datalist.search(query, 1_800);

    const response = await listResponse.catch(() => null);
    if (response) {
      expect(response.ok(), `Search datalist HTTP ${response.status()}`).toBeTruthy();
    }

    await expect(this.datalist.table).toBeVisible({ timeout: 30_000 });
  }

  async assertRowContains(text: string): Promise<void> {
    await expect(
      this.page.getByRole('row').filter({ hasText: text }).first(),
    ).toBeVisible({ timeout: 45_000 });
  }
}
