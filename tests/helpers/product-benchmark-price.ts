import fs from 'fs';
import path from 'path';
import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './shared/staging-banner';

export const BENCHMARK_COGS_PATH = '/accounting/product-benchmark-price';

export const ETM_15493_RESULTS_DIR = path.join(
  process.cwd(),
  'Automate Testing Card QA Review',
  'ETM-15493',
);

export type BenchmarkSkuRow = {
  sku: string;
  type: string;
  cogsText: string;
  cogs: number | null;
  manualCogsText: string;
  manualCogs: number | null;
  expiryText: string;
  description: string;
  source: 'table' | 'api';
};

const FORMULA_DESC = /highest price|last inbound|no inbound/i;
const MANUAL_DESC = /manual input/i;

export function parseMoney(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const cleaned = String(raw).replace(/[^\d,.\-]/g, '').trim();
  if (!cleaned || cleaned === '-' || cleaned === '.' || cleaned === ',') {
    return null;
  }
  const sign = cleaned.startsWith('-') ? -1 : 1;
  const unsigned = cleaned.replace(/^-/, '');
  const lastComma = unsigned.lastIndexOf(',');
  const lastDot = unsigned.lastIndexOf('.');
  let n: number;
  if (lastComma >= 0 && lastDot >= 0) {
    n =
      lastComma > lastDot
        ? Number(unsigned.replace(/\./g, '').replace(',', '.'))
        : Number(unsigned.replace(/,/g, ''));
  } else if (lastComma >= 0) {
    const frac = unsigned.split(',')[1] ?? '';
    n =
      frac.length > 0 && frac.length <= 2
        ? Number(unsigned.replace(',', '.'))
        : Number(unsigned.replace(/,/g, ''));
  } else if (lastDot >= 0) {
    const parts = unsigned.split('.');
    const last = parts[parts.length - 1] ?? '';
    n = last.length === 3 ? Number(parts.join('')) : Number(unsigned);
  } else {
    n = Number(unsigned);
  }
  if (!Number.isFinite(n)) return null;
  return n * sign;
}

export function moneyEquals(
  a: number | null,
  b: number | null,
  eps = 0.011,
): boolean {
  if (a == null || b == null) return false;
  return Math.abs(a - b) < eps;
}

export function isFormulaDescription(text: string): boolean {
  return FORMULA_DESC.test(text) && !MANUAL_DESC.test(text);
}

export function isManualDescription(text: string): boolean {
  return MANUAL_DESC.test(text);
}

function cellText(raw: string | null | undefined): string {
  return (raw ?? '').replace(/\s+/g, ' ').trim();
}

function pickRecordSku(record: Record<string, unknown>): string {
  const candidates = [
    record.sku_code,
    record.sku,
    record.product_sku,
    record.product_code,
    typeof record.product === 'object' && record.product
      ? (record.product as Record<string, unknown>).sku_code
      : undefined,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  const formatted = String(record.product_formatted ?? '');
  const m = formatted.match(/SKU[-A-Za-z0-9_]+/i);
  return m?.[0] ?? '';
}

function flattenApiRows(payload: unknown): Record<string, unknown>[] {
  if (!payload || typeof payload !== 'object') return [];
  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === 'object') {
    const inner = data as Record<string, unknown>;
    if (Array.isArray(inner.data)) return inner.data as Record<string, unknown>[];
    if (Array.isArray(inner.aaData)) return inner.aaData as Record<string, unknown>[];
  }
  if (Array.isArray(root.aaData)) return root.aaData as Record<string, unknown>[];
  return [];
}

export class ProductBenchmarkPricePage {
  constructor(private readonly page: Page) {}

  get searchInput(): Locator {
    return this.page
      .getByRole('searchbox')
      .or(this.page.getByPlaceholder(/find something|search/i))
      .or(this.page.locator('.dataTables_filter input, input[type="search"]'))
      .first();
  }

  get table(): Locator {
    return this.page.getByRole('table').first();
  }

  get showDetailSwitch(): Locator {
    return this.page
      .locator('label, span, button, div')
      .filter({ hasText: /^Show Detail$/i })
      .first();
  }

  async gotoList(): Promise<void> {
    await this.page.goto(BENCHMARK_COGS_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page.locator('.topbar')).toBeVisible({ timeout: 45_000 });
    await expect(this.table).toBeVisible({ timeout: 45_000 });
    await this.page.waitForTimeout(800);
  }

  async screenshot(fileName: string): Promise<string> {
    fs.mkdirSync(path.join(ETM_15493_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });
    const filePath = path.join(ETM_15493_RESULTS_DIR, 'screenshots', fileName);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  async ensureShowDetailOn(): Promise<boolean> {
    const sw = this.page
      .locator('input[type="checkbox"]')
      .filter({
        has: this.page.locator('xpath=ancestor::*[contains(., "Show Detail")]'),
      })
      .first();

    const labeled = this.page.getByText(/^Show Detail$/i).first();
    if (!(await labeled.isVisible({ timeout: 4_000 }).catch(() => false))) {
      return false;
    }

    const checkbox = this.page
      .locator('xpath=//*[contains(normalize-space(.), "Show Detail")]//input[@type="checkbox"]')
      .or(this.page.locator('xpath=//*[contains(normalize-space(.), "Show Detail")]/preceding::input[@type="checkbox"][1]'))
      .or(this.page.locator('xpath=//*[contains(normalize-space(.), "Show Detail")]/following::input[@type="checkbox"][1]'))
      .or(sw)
      .first();

    if (await checkbox.isVisible().catch(() => false)) {
      if (!(await checkbox.isChecked().catch(() => false))) {
        await checkbox.click({ force: true });
        await this.page.waitForTimeout(1_500);
      }
      return true;
    }

    await labeled.click();
    await this.page.waitForTimeout(1_500);
    return true;
  }

  async searchSku(sku: string): Promise<Record<string, unknown>[]> {
    const listResponse = this.page
      .waitForResponse(
        (response) => {
          if (response.request().method() !== 'GET') return false;
          const url = response.url();
          return (
            url.includes('product-benchmark-price') &&
            !url.includes('/select2/') &&
            !url.includes('/sync') &&
            !url.includes('export') &&
            !url.includes('calculate-log')
          );
        },
        { timeout: 30_000 },
      )
      .catch(() => null);

    await expect(this.searchInput).toBeVisible({ timeout: 20_000 });
    await this.searchInput.fill('');
    await this.searchInput.fill(sku);
    await this.searchInput.press('Enter').catch(() => undefined);
    await this.page.waitForTimeout(1_800);

    const response = await listResponse;
    if (!response) return [];
    const payload = await response.json().catch(() => null);
    return flattenApiRows(payload);
  }

  async readSkuFromApiRows(
    sku: string,
    rows: Record<string, unknown>[],
  ): Promise<BenchmarkSkuRow | null> {
    const hit = rows.find((row) => {
      const code = pickRecordSku(row);
      const blob = JSON.stringify(row);
      return (
        code.toLowerCase() === sku.toLowerCase() ||
        blob.toLowerCase().includes(sku.toLowerCase())
      );
    });
    if (!hit) return null;

    const cogsRaw =
      hit.benchmark_price_formatted ??
      hit.benchmark_price ??
      hit.cogs ??
      hit.effective_cogs;
    const manualRaw = hit.manual_cogs_formatted ?? hit.manual_cogs;
    const expiryRaw =
      hit.manual_cogs_expiry_formatted ??
      hit.manual_cogs_expiry ??
      hit.expiry;
    const descRaw =
      hit.description_formatted ?? hit.description ?? hit.cogs_description;
    const typeRaw = hit.type_product_formatted ?? hit.type_product ?? hit.type;

    return {
      sku: pickRecordSku(hit) || sku,
      type: cellText(String(typeRaw ?? '')),
      cogsText: cellText(String(cogsRaw ?? '')),
      cogs: parseMoney(String(cogsRaw ?? '')),
      manualCogsText: cellText(String(manualRaw ?? '')),
      manualCogs: parseMoney(String(manualRaw ?? '')),
      expiryText: cellText(String(expiryRaw ?? '')),
      description: cellText(String(descRaw ?? '')),
      source: 'api',
    };
  }

  async headerIndexMap(): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    const headers = this.table.locator('thead th, thead td');
    const count = await headers.count();
    for (let i = 0; i < count; i++) {
      const text = cellText(await headers.nth(i).innerText().catch(() => ''));
      if (text) map.set(text.toLowerCase(), i);
    }
    return map;
  }

  private indexFor(map: Map<string, number>, ...needles: string[]): number {
    for (const [label, idx] of map.entries()) {
      for (const needle of needles) {
        if (label.includes(needle.toLowerCase())) return idx;
      }
    }
    return -1;
  }

  async readSkuFromTable(sku: string): Promise<BenchmarkSkuRow | null> {
    const row = this.page
      .locator('table tbody tr')
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();

    if (!(await row.isVisible({ timeout: 8_000 }).catch(() => false))) {
      return null;
    }

    const map = await this.headerIndexMap();
    const cells = row.locator('td');
    const read = async (idx: number) =>
      idx >= 0 ? cellText(await cells.nth(idx).innerText().catch(() => '')) : '';

    const cogsText = await read(this.indexFor(map, 'cogs'));
    // Prefer exact "cogs" that is not "manual cogs"
    let cogsIdx = -1;
    let manualIdx = -1;
    let expiryIdx = -1;
    let descIdx = -1;
    let typeIdx = -1;
    for (const [label, idx] of map.entries()) {
      if (label.includes('manual') && label.includes('expir')) expiryIdx = idx;
      else if (label.includes('manual') && label.includes('cogs')) manualIdx = idx;
      else if (label === 'cogs' || (label.includes('cogs') && !label.includes('manual'))) {
        if (cogsIdx < 0) cogsIdx = idx;
      } else if (label.includes('description')) descIdx = idx;
      else if (label === 'type' || label.includes('type')) typeIdx = idx;
    }

    const cogsCell = await read(cogsIdx >= 0 ? cogsIdx : this.indexFor(map, 'cogs'));
    const manualText = await read(manualIdx);
    const expiryText = await read(expiryIdx);
    const description = await read(descIdx);
    const type = await read(typeIdx);

    return {
      sku,
      type,
      cogsText: cogsCell || cogsText,
      cogs: parseMoney(cogsCell || cogsText),
      manualCogsText: manualText,
      manualCogs: parseMoney(manualText),
      expiryText,
      description,
      source: 'table',
    };
  }

  async readSku(sku: string): Promise<BenchmarkSkuRow | null> {
    const apiRows = await this.searchSku(sku);
    const fromApi = await this.readSkuFromApiRows(sku, apiRows);
    if (fromApi) return fromApi;
    return this.readSkuFromTable(sku);
  }

  async readSkuWithShowDetailFallback(sku: string): Promise<BenchmarkSkuRow | null> {
    let row = await this.readSku(sku);
    if (row) return row;
    await this.ensureShowDetailOn();
    await this.screenshot(`debug-show-detail-on-${sku}.png`);
    row = await this.readSku(sku);
    return row;
  }
}
