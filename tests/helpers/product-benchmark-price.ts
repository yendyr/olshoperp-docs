import { Locator, Page, expect } from '@playwright/test';
import { OlshopDatalist } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const BENCHMARK_COGS_PATH = '/accounting/product-benchmark-price';

export type BenchmarkCogsMasterRow = {
  sku: string;
  cogsText: string;
  cogsNumber: number | null;
  description: string;
  manualCogsText: string;
  expiryText: string;
  rowText: string;
};

/**
 * POM Benchmark COGS — datalist master untuk bandingkan snapshot SO.
 */
export class ProductBenchmarkPricePage {
  readonly datalist: OlshopDatalist;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
  }

  async gotoDatalist(): Promise<void> {
    await this.page.goto(BENCHMARK_COGS_PATH, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await expect(this.page.locator('.topbar')).toBeVisible({ timeout: 45_000 });
    await expect(this.page.getByRole('table').first()).toBeVisible({
      timeout: 45_000,
    });
  }

  async searchSku(sku: string): Promise<void> {
    const search = this.page.getByRole('searchbox').first();
    await expect(search).toBeVisible({ timeout: 20_000 });
    await search.fill(sku);
    await this.page.waitForTimeout(2_000);
  }

  skuRow(sku: string): Locator {
    return this.page
      .getByRole('row')
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
  }

  parseNumber(raw: string): number | null {
    const cleaned = raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const n = Number.parseFloat(cleaned.replace(/,/g, ''));
    if (Number.isFinite(n)) return n;
    const fallback = Number.parseFloat(raw.replace(/[^\d.-]/g, ''));
    return Number.isFinite(fallback) ? fallback : null;
  }

  async readSkuRow(sku: string): Promise<BenchmarkCogsMasterRow> {
    const row = this.skuRow(sku);
    await expect(row, `Baris Benchmark COGS untuk ${sku}`).toBeVisible({
      timeout: 30_000,
    });
    const rowText = ((await row.innerText()) ?? '').replace(/\s+/g, ' ').trim();
    const cells = row.locator('th, td');
    const count = await cells.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      values.push(((await cells.nth(i).innerText()) ?? '').replace(/\s+/g, ' ').trim());
    }

    const headerCells = this.page.locator('table thead th, table thead td');
    const headerCount = await headerCells.count();
    const headers: string[] = [];
    for (let i = 0; i < headerCount; i++) {
      headers.push(
        ((await headerCells.nth(i).innerText()) ?? '').replace(/\s+/g, ' ').trim(),
      );
    }

    const pick = (...names: string[]): string => {
      const idx = headers.findIndex((h) =>
        names.some((n) => new RegExp(n, 'i').test(h)),
      );
      if (idx >= 0 && idx < values.length) return values[idx];
      return '';
    };

    const cogsText =
      pick('^COGS$', 'COGS') ||
      values.find((v) => /^[\d.,]+$/.test(v.replace(/\s/g, ''))) ||
      '';
    const description =
      pick('Description') ||
      values.find((v) =>
        /Manual Input|Highest Price|Last Inbound|No Inbound/i.test(v),
      ) ||
      '';
    const manualCogsText = pick('Manual COGS') || '';
    const expiryText = pick('Expiry', 'Manual COGS Expiry') || '';

    return {
      sku,
      cogsText,
      cogsNumber: this.parseNumber(cogsText),
      description,
      manualCogsText,
      expiryText,
      rowText: `headers=${headers.join(' | ')} || cells=${values.join(' | ')} || raw=${rowText}`,
    };
  }
}
