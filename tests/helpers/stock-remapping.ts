import fs from 'fs';
import path from 'path';
import { Locator, Page, expect } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const STOCK_REMAPPING_PATH = '/accounting/stock-remapping';
export const STOCK_REMAPPING_EDIT_PATH =
  /\/accounting\/stock-remapping\/edit\/\d+/;

export const ETM_15584_RESULTS_DIR = path.join(
  process.cwd(),
  'Automate Testing Card QA Review',
  'ETM-15584',
);

export const INSUFFICIENT_STOCK_PATTERN =
  /Insufficient stock[\s\S]*only has 0 base units available for the selected stock/i;

export type AvailableStockRow = {
  sku: string;
  stockId: string;
  available: number | null;
  availableText: string;
  location: string;
  raw: string;
};

export type ApproveOutcome = {
  ok: boolean;
  httpStatus: number | null;
  apiMessage: string | null;
  toastText: string | null;
  insufficientStock: boolean;
  redirected: boolean;
};

export type SplitPlan = {
  qty: number;
  canSplit: boolean;
  reason: string;
  batches: AvailableStockRow[];
};

/**
 * Qty yang melewati batch terkecil supaya FIFO/split menyentuh ≥2 Stock ID
 * (repro ETM-15584: batch pertama available jadi 0).
 */
export function planSplitQty(rows: AvailableStockRow[]): SplitPlan {
  const batches = rows
    .filter((row) => (row.available ?? 0) > 0)
    .sort((a, b) => (a.available ?? 0) - (b.available ?? 0));

  if (batches.length >= 2) {
    const first = batches[0]?.available ?? 0;
    const second = batches[1]?.available ?? 0;
    const extra = Math.min(2, second);
    const qty = first + extra;
    return {
      qty,
      canSplit: extra > 0 && qty > first,
      reason: `2+ Stock ID: pakai ${first}+${extra}=${qty}`,
      batches,
    };
  }

  const total = batches[0]?.available ?? 0;
  const concatIds = (batches[0]?.raw ?? '').match(/\d{5,}/g) ?? [];
  const uniqueIds = [...new Set(concatIds)];
  if (uniqueIds.length >= 2 && total >= 2) {
    const qty = Math.min(15, total);
    return {
      qty,
      canSplit: true,
      reason: `API agregat ${uniqueIds.length} Stock ID; qty=${qty} (pola kartu 15 atau total)`,
      batches,
    };
  }

  if (total >= 15) {
    return {
      qty: 15,
      canSplit: true,
      reason:
        'Satu baris agregat available≥15; qty=15 mengikuti repro kartu (FIFO split jika batch pertama <15)',
      batches,
    };
  }

  if (total >= 2) {
    return {
      qty: total,
      canSplit: false,
      reason: `Hanya 1 batch terlihat (available=${total}); split ≥2 Stock ID belum terbukti sebelum Use`,
      batches,
    };
  }

  return {
    qty: 0,
    canSplit: false,
    reason: 'Tidak ada available qty untuk Origin SKU',
    batches,
  };
}

function parseQty(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const cleaned = String(raw).replace(/[^\d,.\-]/g, '').trim();
  if (!cleaned || cleaned === '-') return null;
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
  } else if (lastDot >= 0) {
    const parts = unsigned.split('.');
    const last = parts[parts.length - 1] ?? '';
    n = last.length === 3 ? Number(parts.join('')) : Number(unsigned);
  } else if (lastComma >= 0) {
    n = Number(unsigned.replace(',', '.'));
  } else {
    n = Number(unsigned);
  }
  return Number.isFinite(n) ? n * sign : null;
}

function flattenRecords(payload: unknown): Record<string, unknown>[] {
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

function pickString(rec: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = rec[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number') return String(v);
  }
  return '';
}

function nestedRecords(rec: Record<string, unknown>): Record<string, unknown>[] {
  const keys = [
    'item_stocks',
    'itemStocks',
    'stocks',
    'stock_ids',
    'details',
    'children',
  ];
  const out: Record<string, unknown>[] = [];
  for (const key of keys) {
    const v = rec[key];
    if (Array.isArray(v)) {
      for (const item of v) {
        if (item && typeof item === 'object') {
          out.push(item as Record<string, unknown>);
        }
      }
    }
  }
  return out;
}

/**
 * POM Stock Remapping (FA) — ETM-15584.
 */
export class StockRemappingPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page
      .locator('#code')
      .or(this.page.getByPlaceholder(/Automatically generate/i))
      .first();
  }

  get warehouseCombobox(): Locator {
    return this.multiselect
      .comboboxByAriaPlaceholder('Choose Warehouse')
      .or(this.multiselect.comboboxByAriaPlaceholder('Choose Building'))
      .or(this.multiselect.comboboxByPlaceholderFragment('Warehouse'))
      .or(
        this.multiselect.comboboxByAriaPlaceholder(
          'e.g: Seruni --> Lantai 1 --> Lorong A --> Rak A-001',
        ),
      );
  }

  get availableProductsLink(): Locator {
    return this.page.getByText('Available Products', { exact: true }).first();
  }

  availableProductsPanel(): Locator {
    return this.page
      .locator('div.fixed')
      .filter({ has: this.page.getByPlaceholder(/find something/i) })
      .filter({ has: this.page.locator('table') })
      .first();
  }

  async screenshot(fileName: string): Promise<string> {
    fs.mkdirSync(path.join(ETM_15584_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });
    const filePath = path.join(ETM_15584_RESULTS_DIR, 'screenshots', fileName);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(STOCK_REMAPPING_PATH, 'link');
  }

  async expandBasicInformation(): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.form.expandAccordion('Basic Information');
        return;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (!/not attached|detached/i.test(msg) || attempt === 2) throw err;
        await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
        await this.page.waitForTimeout(800);
      }
    }
  }

  async expandDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /Stock Remapping Detail|Remapping Detail|Transaction Detail/i,
    });
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
  }

  async openCreateOrAutoEdit(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');
    const raced = await Promise.race([
      this.page
        .waitForURL(STOCK_REMAPPING_EDIT_PATH, { timeout: 90_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/accounting\/stock-remapping\/create$/, { timeout: 90_000 })
        .then(() => 'create' as const),
    ]);
    await dismissStagingBanner(this.page);
    await this.page.waitForTimeout(800);
    await this.expandBasicInformation();
    if (raced === 'edit') {
      await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
      return 'edit';
    }
    const autoEdit = await this.page
      .waitForURL(STOCK_REMAPPING_EDIT_PATH, { timeout: 20_000 })
      .then(() => true)
      .catch(() => false);
    if (autoEdit) {
      await dismissStagingBanner(this.page);
      await this.expandBasicInformation();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
      return 'edit';
    }
    return 'create';
  }

  async fillDescription(text: string): Promise<void> {
    const input = this.page
      .locator('#description, textarea[name="description"]')
      .first();
    if (await input.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await input.fill(text);
    }
  }

  async selectWarehouse(label: string): Promise<void> {
    const box = this.warehouseCombobox;
    await expect(box, 'Warehouse Origin').toBeVisible({ timeout: 30_000 });
    const current = await this.multiselect.selectedLabel(box);
    if (new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(current)) {
      return;
    }
    await this.multiselect.open(box);
    await box.fill('');
    await box.fill(label).catch(async () => {
      await box.pressSequentially(label, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({ hasText: new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })
      .first();
    await expect(option, `Warehouse ${label}`).toBeVisible({ timeout: 20_000 });
    await option.click();
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(400);
  }

  async clickSaveAndNextIfCreate(): Promise<void> {
    if (STOCK_REMAPPING_EDIT_PATH.test(this.page.url())) return;
    const saveResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /\/accounting\/stock-remapping\/?$/.test(new URL(response.url()).pathname) &&
        !response.url().includes('detail'),
      { timeout: 90_000 },
    );
    await this.form.clickSaveAndNext();
    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Save header RM gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
    await this.page.waitForURL(STOCK_REMAPPING_EDIT_PATH, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.expandBasicInformation();
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async readEditUrl(): Promise<string> {
    return this.page.url();
  }

  async openAvailableProducts(sku?: string): Promise<Record<string, unknown>[]> {
    await this.expandDetail();
    const listResponse = this.page
      .waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          /available[_-]?products/i.test(response.url()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.availableProductsLink.click();
    const response = await listResponse;
    await this.page.waitForTimeout(1_200);
    const panel = this.availableProductsPanel();
    await expect(panel, 'Panel Available Products').toBeVisible({
      timeout: 45_000,
    });

    if (sku) {
      const search = panel
        .getByPlaceholder(/find something|search/i)
        .or(panel.getByRole('searchbox'))
        .first();
      if (await search.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await search.fill(sku);
        await this.page.waitForTimeout(1_500);
      }
    }

    if (!response) return [];
    return flattenRecords(await response.json().catch(() => null));
  }

  parseAvailableFromApi(
    sku: string,
    rows: Record<string, unknown>[],
  ): AvailableStockRow[] {
    const hit: AvailableStockRow[] = [];
    for (const rec of rows) {
      const blob = JSON.stringify(rec);
      if (!blob.toLowerCase().includes(sku.toLowerCase())) continue;
      const nested = nestedRecords(rec);
      const sources = nested.length > 0 ? nested : [rec];
      for (const src of sources) {
        const concat = pickString(src, [
          'item_stock_ids',
          'stock_ids',
          'ids',
          'group_concat_id',
        ]);
        const stockId =
          pickString(src, [
            'item_stock_id',
            'stock_id',
            'id',
            'item_stocks_id',
          ]) || concat;
        const availableText = pickString(src, [
          'available_qty',
          'availability',
          'qty_available',
          'stock_available',
          'available',
          'qty',
        ]);
        const location = pickString(src, [
          'location',
          'warehouse_name',
          'location_name',
          'rack',
          'warehouse',
        ]);
        hit.push({
          sku,
          stockId,
          available: parseQty(availableText),
          availableText,
          location,
          raw: JSON.stringify(src).slice(0, 500),
        });
      }
    }
    return hit;
  }

  async parseAvailableFromTable(sku: string): Promise<AvailableStockRow[]> {
    const panel = this.availableProductsPanel();
    const rows = panel.locator('table tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
    const count = await rows.count();
    const result: AvailableStockRow[] = [];
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const text = ((await row.innerText().catch(() => '')) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(text)) {
        continue;
      }
      const stockIdCell = ((await row.locator('td').nth(1).innerText().catch(() => '')) ?? '')
        .trim();
      const availCell = ((await row.locator('td').nth(4).innerText().catch(() => '')) ?? '')
        .trim();
      const idMatch = stockIdCell.match(/\b(\d{5,})\b/) ?? text.match(/\b(\d{5,})\b/);
      const piecesMatch = text.match(/(\d[\d.,]*)\s*Pieces/i);
      const availableText = piecesMatch?.[1] ?? availCell;
      result.push({
        sku,
        stockId: idMatch?.[1] ?? '',
        available: parseQty(availableText),
        availableText,
        location: /Lobby Tanrise/i.test(text) ? 'Lobby Tanrise' : '',
        raw: text,
      });
    }
    return result;
  }

  async closeAvailablePanel(): Promise<void> {
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(500);
  }

  private async scrollAvailableActions(panel: Locator): Promise<void> {
    const scrollers = panel.locator(
      '.dataTables_scrollBody, .dt-scroll-body, .dataTables_wrapper, table',
    );
    const n = await scrollers.count();
    for (let i = 0; i < n; i++) {
      await scrollers
        .nth(i)
        .evaluate((el) => {
          el.scrollLeft = el.scrollWidth;
        })
        .catch(() => undefined);
    }
    await this.page.waitForTimeout(400);
  }

  private async clickUseForRow(
    panel: Locator,
    row: Locator,
    rowIndex: number,
  ): Promise<void> {
    await this.scrollAvailableActions(panel);

    const modalShow = panel
      .getByRole('button', { name: /modal show availableProductIvOut/i })
      .locator('visible=true')
      .nth(rowIndex)
      .or(
        this.page
          .getByRole('button', { name: /modal show availableProductIvOut/i })
          .locator('visible=true')
          .nth(rowIndex),
      );
    if (await modalShow.isVisible({ timeout: 4_000 }).catch(() => false)) {
      await modalShow.click({ force: true });
      return;
    }

    const inPanelUse = panel
      .getByRole('button', { name: /^(Use|Direct Use)/i })
      .or(panel.locator('button[class*="use-button"]'))
      .locator('visible=true')
      .first();

    if (await inPanelUse.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await inPanelUse.click({ force: true });
      return;
    }

    const rowUse = panel
      .locator('button[class*="use-button"]')
      .locator('visible=true')
      .nth(rowIndex)
      .or(row.locator('button[class*="use-button"]').first());
    if (await rowUse.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await rowUse.click({ force: true });
      return;
    }

    const checkbox = row.locator('input[type="checkbox"], [type="checkbox"]').first();
    await expect(checkbox, 'Checkbox Available Product').toBeVisible({
      timeout: 10_000,
    });
    await checkbox.check({ force: true }).catch(async () => {
      await checkbox.click({ force: true });
    });
    await expect(inPanelUse, 'Use setelah centang').toBeVisible({
      timeout: 10_000,
    });
    await inPanelUse.click({ force: true });
  }

  /**
   * Centang beberapa Stock ID di Available Products lalu klik Use sekali (bulk).
   */
  async bulkUseStockIds(opts: {
    sku: string;
    remappedTo: string;
    stockIds: string[];
  }): Promise<{ apiMessage: string | null; ok: boolean }> {
    let panel = this.availableProductsPanel();
    if (!(await panel.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await this.openAvailableProducts(opts.sku);
      panel = this.availableProductsPanel();
    }

    for (const stockId of opts.stockIds) {
      const row = panel
        .locator('table tbody tr')
        .filter({ hasText: new RegExp(`\\b${stockId}\\b`) })
        .first();
      await expect(row, `Baris Stock ID ${stockId}`).toBeVisible({
        timeout: 20_000,
      });
      const checkbox = row
        .locator('input[type="checkbox"], [type="checkbox"]')
        .first();
      await checkbox.check({ force: true }).catch(async () => {
        await checkbox.click({ force: true });
      });
    }

    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (!['POST', 'PUT'].includes(response.request().method())) return false;
        const url = response.url();
        return (
          /stock-remapping-detail/.test(url) ||
          /stock-remapping\/\d+\/(stock-remapping-detail|bulk)/.test(url)
        );
      },
      { timeout: 90_000 },
    );

    const useBtn = panel
      .getByRole('button', { name: /^(Use|Direct Use)/i })
      .or(panel.locator('button[class*="use-button"]'))
      .locator('visible=true')
      .first();
    await expect(useBtn, 'Tombol Use di panel Available Products').toBeVisible({
      timeout: 15_000,
    });
    await useBtn.click({ force: true });

    const heading = this.page.getByRole('heading', { name: /Use Product/i });
    const modalVisible = await heading
      .isVisible({ timeout: 8_000 })
      .catch(() => false);

    if (modalVisible) {
      await this.fillRemappedToIfVisible(opts.remappedTo);
      const saveBtn = this.page
        .locator('form')
        .filter({ has: heading })
        .locator('button[type="submit"], [data-modal-save]')
        .first();
      await expect(saveBtn).toBeVisible({ timeout: 10_000 });
      await saveBtn.click();
    }

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    const ok = response.ok() && !Number(body?.status?.error ?? 0);
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    if (modalVisible) {
      await heading.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => undefined);
    }
    await this.closeAvailablePanel();
    return { ok, apiMessage: body?.status?.message ?? null };
  }

  /**
   * Use satu Stock ID Origin di Available Products.
   */
  async useOriginSku(opts: {
    sku: string;
    qty: number;
    remappedTo: string;
    stockId?: string;
    keepPanelOpen?: boolean;
  }): Promise<{ apiMessage: string | null; ok: boolean }> {
    let panel = this.availableProductsPanel();
    if (!(await panel.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await this.openAvailableProducts(opts.sku);
      panel = this.availableProductsPanel();
    }

    const row = opts.stockId
      ? panel
          .locator('table tbody tr')
          .filter({ hasText: new RegExp(`\\b${opts.stockId}\\b`) })
          .first()
      : panel
          .locator('table tbody tr')
          .filter({
            hasText: new RegExp(
              opts.sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'i',
            ),
          })
          .first();
    await expect(
      row,
      `Baris Available Product ${opts.stockId ?? opts.sku}`,
    ).toBeVisible({ timeout: 20_000 });

    const siblingRows = panel.locator('table tbody tr').filter({
      hasNot: this.page.locator('td.dataTables_empty'),
    });
    const siblingCount = await siblingRows.count();
    let rowIndex = 0;
    for (let i = 0; i < siblingCount; i++) {
      const t = (await siblingRows.nth(i).innerText().catch(() => '')) ?? '';
      if (opts.stockId && t.includes(opts.stockId)) {
        rowIndex = i;
        break;
      }
      if (!opts.stockId && new RegExp(opts.sku, 'i').test(t)) {
        rowIndex = i;
        break;
      }
    }

    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (!['POST', 'PUT'].includes(response.request().method())) return false;
        const url = response.url();
        return (
          /stock-remapping-detail/.test(url) ||
          /stock-remapping\/\d+\/(stock-remapping-detail|bulk)/.test(url)
        );
      },
      { timeout: 90_000 },
    );

    await this.clickUseForRow(panel, row, rowIndex);

    const heading = this.page.getByRole('heading', { name: /Use Product/i });
    const modalVisible = await heading
      .isVisible({ timeout: 8_000 })
      .catch(() => false);

    if (modalVisible) {
      await this.fillRemappedToIfVisible(opts.remappedTo);
      const qtyInput = this.page
        .locator('form')
        .filter({ has: heading })
        .locator('#quantity, input[name*="quantity" i], input[id*="quantity" i]')
        .first()
        .or(this.page.locator('#quantity').first());
      await expect(qtyInput).toBeVisible({ timeout: 15_000 });
      await qtyInput.click();
      await qtyInput.fill('');
      await qtyInput.fill(String(opts.qty));
      const saveBtn = this.page
        .locator('form')
        .filter({ has: heading })
        .locator('button[type="submit"], [data-modal-save]')
        .first();
      await expect(saveBtn).toBeVisible({ timeout: 10_000 });
      await saveBtn.click();
    }

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    const ok = response.ok() && !Number(body?.status?.error ?? 0);
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    if (modalVisible) {
      await heading.waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => undefined);
    }
    if (!opts.keepPanelOpen) {
      await this.closeAvailablePanel();
    }
    return { ok, apiMessage: body?.status?.message ?? null };
  }

  async useStockBatches(opts: {
    sku: string;
    remappedTo: string;
    batches: AvailableStockRow[];
  }): Promise<{ ok: boolean; apiMessage: string | null }[]> {
    const results: { ok: boolean; apiMessage: string | null }[] = [];
    const usable = opts.batches.filter((b) => (b.available ?? 0) > 0 && b.stockId);
    for (let i = 0; i < usable.length; i++) {
      const batch = usable[i];
      const keepPanelOpen = i < usable.length - 1;
      const used = await this.useOriginSku({
        sku: opts.sku,
        stockId: batch.stockId,
        qty: batch.available ?? 0,
        remappedTo: opts.remappedTo,
        keepPanelOpen,
      });
      results.push(used);
      if (!used.ok) return results;
    }
    return results;
  }

  private async fillRemappedToIfVisible(sku: string): Promise<void> {
    const box = this.page
      .locator(
        '[aria-placeholder="Choose Product"], [aria-placeholder*="Remapped"], [aria-placeholder*="Choose SKU"]',
      )
      .locator('visible=true')
      .last();
    if (!(await box.isVisible({ timeout: 4_000 }).catch(() => false))) {
      return;
    }
    await this.multiselect.open(box);
    await box.fill('');
    await box.fill(sku).catch(async () => {
      await box.pressSequentially(sku, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(option, `Remapped To ${sku}`).toBeVisible({ timeout: 20_000 });
    await option.click();
    await this.page.keyboard.press('Escape').catch(() => undefined);
  }

  async setRemappedToOnDetail(originSku: string, remappedTo: string): Promise<void> {
    await this.expandDetail();
    const row = this.page
      .locator(
        '#TransactionDetails tr, [id*="Detail"] tr, .p-datatable-tbody tr',
      )
      .filter({
        hasText: new RegExp(
          originSku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 20),
          'i',
        ),
      })
      .first();
    if (!(await row.isVisible({ timeout: 8_000 }).catch(() => false))) {
      return;
    }
    const combobox = row
      .locator('.multiselect-search, [aria-placeholder*="Choose"]')
      .first();
    if (!(await combobox.isVisible({ timeout: 3_000 }).catch(() => false))) {
      const editBtn = row.locator('#updateButton, button').last();
      if (await editBtn.isVisible().catch(() => false)) {
        await editBtn.click();
        await this.fillRemappedToIfVisible(remappedTo);
        const saveBtn = this.page
          .getByRole('button', { name: /^Save$/i })
          .last();
        if (await saveBtn.isVisible({ timeout: 5_000 }).catch(() => false)) {
          const put = this.page
            .waitForResponse(
              (r) =>
                /stock-remapping-detail/.test(r.url()) &&
                ['PUT', 'POST', 'PATCH'].includes(r.request().method()),
              { timeout: 60_000 },
            )
            .catch(() => null);
          await saveBtn.click();
          await put;
        }
      }
      return;
    }
    await this.multiselect.open(combobox);
    await combobox.fill(remappedTo);
    await this.page.waitForTimeout(1_000);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: new RegExp(remappedTo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })
      .first();
    if (await option.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await option.click();
    }
  }

  async readDetailTexts(): Promise<string> {
    await this.expandDetail();
    const section = this.page
      .locator('#TransactionDetails, [id*="RemappingDetail"], [id*="Detail"]')
      .first();
    const text = ((await section.innerText().catch(() => '')) ?? '').trim();
    return text.replace(/\s+/g, ' ');
  }

  async readDetailStockIds(): Promise<string[]> {
    const text = await this.readDetailTexts();
    const ids = [...new Set(text.match(/\b\d{5,}\b/g) ?? [])];
    return ids;
  }

  async approve(note = 'automation playwright ETM-15584'): Promise<ApproveOutcome> {
    const approveTrigger = this.page
      .getByRole('button', { name: /^Approve$/i })
      .or(
        this.page.locator('button.bg-info.border-info').filter({
          has: this.page.locator('.fa-check-double, [class*="check-double"]'),
        }),
      )
      .locator('visible=true')
      .first();
    await expect(approveTrigger, 'Tombol Approve').toBeVisible({
      timeout: 30_000,
    });
    await approveTrigger.scrollIntoViewIfNeeded();
    await approveTrigger.click();

    const noteInput = this.page.getByPlaceholder(
      /why you are approving this transaction|Add information/i,
    );
    if (await noteInput.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await noteInput.fill(note);
      const confirm = this.page.getByRole('button', { name: /^Approve$/i }).last();
      await expect(confirm).toBeVisible({ timeout: 10_000 });
      await confirm.click();
    }

    const api = await this.page
      .waitForResponse(
        (response) =>
          response.request().method() === 'POST' &&
          /\/accounting\/stock-remapping\/\d+\/approve/.test(response.url()),
        { timeout: 120_000 },
      )
      .catch(() => null);

    const redirected = await this.page
      .waitForURL(/\/accounting\/stock-remapping\/?$/, { timeout: 20_000 })
      .then(() => true)
      .catch(() => false);

    let httpStatus: number | null = null;
    let apiMessage: string | null = null;
    let ok = false;
    if (api) {
      httpStatus = api.status();
      const body = (await api.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      apiMessage = body?.status?.message ?? null;
      ok = api.ok() && !Number(body?.status?.error ?? 0);
    }

    const toast = this.page.locator('.toastify, [class*="toast"]').first();
    const toastText = (await toast.innerText().catch(() => '')) || null;
    const pageText = (await this.page.locator('body').innerText().catch(() => '')) ?? '';
    const combined = `${apiMessage ?? ''} ${toastText ?? ''} ${pageText}`;
    const insufficientStock = INSUFFICIENT_STOCK_PATTERN.test(combined);

    if (redirected && !insufficientStock) ok = true;

    return {
      ok,
      httpStatus,
      apiMessage,
      toastText,
      insufficientStock,
      redirected,
    };
  }
}
