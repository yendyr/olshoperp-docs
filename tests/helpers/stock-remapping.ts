import fs from 'fs';
import path from 'path';
import { Locator, Page, expect } from '@playwright/test';
import { getApiUrl, readAuthFromPage } from './company-access';
import {
  OlshopDatalist,
  OlshopFormActions,
  OlshopMultiselect,
  getDetailDataRowTexts,
  extractIdentifierOrder,
} from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const STOCK_REMAPPING_PATH = '/accounting/stock-remapping';
export const STOCK_REMAPPING_DATALIST_PATH = STOCK_REMAPPING_PATH;
export const STOCK_REMAPPING_EDIT_PATH = /\/accounting\/stock-remapping\/edit\/\d+/;
export const STOCK_REMAPPING_EDIT_PATH_PATTERN = STOCK_REMAPPING_EDIT_PATH;

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

export type ApiCallResult = {
  ok: boolean;
  status: number;
  message: string;
  bodyPreview: string;
};

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

export function isSelfRemapRejected(result: ApiCallResult, toast = ''): boolean {
  const blob = `${result.message} ${toast} ${result.bodyPreview}`.toLowerCase();
  if (!result.ok && /different|cannot be the same|must be different|same sku|origin/i.test(blob)) {
    return true;
  }
  return /must be different|cannot be the same/.test(blob);
}

export class StockRemappingPage {
  readonly page: Page;
  readonly datalist: OlshopDatalist;
  readonly form: OlshopFormActions;
  readonly multiselect: OlshopMultiselect;

  constructor(page: Page) {
    this.page = page;
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  // Getters
  get codeInput(): Locator {
    return this.page.locator('#code').first();
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder('Add description or notes...').first();
  }

  get buildingCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Building');
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get detailSection(): Locator {
    return this.page.locator('#StockRemappingDetail').or(
      this.page
        .locator('section, div')
        .filter({ has: this.page.getByRole('button', { name: /Stock Remapping Detail/i }) })
        .first(),
    );
  }

  get availableProductsLink(): Locator {
    return this.page.getByText('Available Products', { exact: true }).first();
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

  // Methods
  async expandDetail(): Promise<void> {
    if (await this.isImportHistoryOpen().catch(() => false)) {
      return;
    }
    const btn = this.page
      .getByRole('button', { name: /Stock Remapping Detail|Remapping Detail|Transaction Detail/i })
      .or(this.page.getByText(/^Stock Remapping Detail$/i));
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
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

  async expandBasic(): Promise<void> {
    await this.expandBasicInformation().catch(() => undefined);
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(STOCK_REMAPPING_PATH, 'link');
  }

  async openAvailableProducts(): Promise<Locator> {
    await this.expandDetail();
    const availableResponse = this.page
      .waitForResponse(
        (response) => /available[-_]products/i.test(response.url()),
        { timeout: 60_000 },
      )
      .catch(() => null);
    await this.page.getByText('Available Products', { exact: true }).click();
    await availableResponse;
    await this.page.waitForTimeout(1_200);
    const panel = this.availableProductsPanel();
    await expect(panel, 'Panel Available Products').toBeVisible({ timeout: 45_000 });
    return panel;
  }

  async openAvailableProductsWithData(sku?: string): Promise<Record<string, unknown>[]> {
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
    const input = this.descriptionInput.or(
      this.page.locator('#description, textarea[name="description"]')
    ).first();
    if (await input.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await input.fill(text.slice(0, 150));
    }
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async screenshot(fileName: string): Promise<string> {
    fs.mkdirSync(path.join(ETM_15584_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });
    const filePath = path.join(ETM_15584_RESULTS_DIR, 'screenshots', fileName);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
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

  async readEditUrl(): Promise<string> {
    return this.page.url();
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

  async useOriginSku(opts: {
    sku: string;
    qty: number;
    remappedTo: string;
    stockId?: string;
    keepPanelOpen?: boolean;
  }): Promise<{ apiMessage: string | null; ok: boolean }> {
    let panel = this.availableProductsPanel();
    if (!(await panel.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await this.openAvailableProductsWithData(opts.sku);
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
              opts.sku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'),
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
      .filter({ hasText: new RegExp(sku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i') })
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
          originSku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&').slice(0, 20),
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
      .filter({ hasText: new RegExp(remappedTo.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i') })
      .first();
    if (await option.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await option.click();
    }
  }

  async selectWarehouse(label: string): Promise<void> {
    const box = this.warehouseCombobox;
    await expect(box, 'Warehouse Origin').toBeVisible({ timeout: 30_000 });
    const current = await this.multiselect.selectedLabel(box);
    if (new RegExp(label.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i').test(current)) {
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
      .filter({ hasText: new RegExp(label.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i') })
      .first();
    await expect(option, `Warehouse ${label}`).toBeVisible({ timeout: 20_000 });
    await option.click();
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(400);
  }

  async addOriginViaAvailableProducts(sku: string): Promise<ApiCallResult> {
    const panel = await this.openAvailableProducts();
    const search = panel.getByPlaceholder(/find something/i).first();
    await expect(search).toBeVisible({ timeout: 15_000 });
    await search.fill(sku);
    await this.page.waitForTimeout(1_800);

    const row = panel
      .locator('tbody tr')
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(row, `Available Products ${sku}`).toBeVisible({ timeout: 30_000 });
    await row.locator('input[type="checkbox"]').first().check({ force: true });
    await this.page.waitForTimeout(400);

    const useBtn = panel
      .locator('button.tooltip-use, button[class*="use-button"]')
      .or(panel.getByRole('button', { name: /^Use$/i }))
      .first();
    await expect(useBtn, 'Tombol Use / Bulk Use').toBeVisible({ timeout: 15_000 });

    const post = this.page.waitForResponse(
      (response) =>
        /stock-remapping-detail/i.test(response.url()) &&
        ['POST', 'PUT'].includes(response.request().method()),
      { timeout: 90_000 },
    );
    await useBtn.click();
    const response = await post;
    const parsed = await this.parseResponse(response);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.closeOverlays();
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async addOriginSku(sku: string): Promise<ApiCallResult> {
    return this.addOriginViaAvailableProducts(sku);
  }

  async addProductViaSelectProduct(sku: string): Promise<ApiCallResult> {
    await this.expandDetail();
    let combobox = this.selectProductCombobox;
    if (!(await combobox.isVisible({ timeout: 8_000 }).catch(() => false))) {
      const root = this.page
        .locator('.multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Select Product"]'),
        })
        .first();
      await root.click();
      combobox = root.locator('.multiselect-search').first();
    }

    const createResponse = this.page.waitForResponse(
      (response) =>
        /stock-remapping-detail/i.test(response.url()) &&
        ['POST', 'PUT'].includes(response.request().method()),
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox);
    await combobox.fill('').catch(() => undefined);
    await combobox.fill(sku).catch(async () => {
      await combobox.pressSequentially(sku, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({ hasText: new RegExp(sku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i') })
      .first();
    await expect(option, `Product ${sku}`).toBeVisible({ timeout: 25_000 });
    await option.click();

    const response = await createResponse;
    const parsed = await this.parseResponse(response);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
    return parsed;
  }

  detailRowBySku(sku: string): Locator {
    return this.page
      .locator('#StockRemappingDetail tbody tr, table tbody tr')
      .filter({ hasText: new RegExp(sku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i') })
      .first();
  }

  async readOriginOrder(skus: string[]): Promise<string[]> {
    await this.expandDetail();
    const section = this.page.locator('#StockRemappingDetail').first();
    const texts = await getDetailDataRowTexts(
      (await section.count()) ? section : this.page.locator('table').nth(1),
    );
    return extractIdentifierOrder(texts, skus);
  }

  async setRemappedToOnRow(originSku: string, remappedSku: string): Promise<ApiCallResult> {
    await this.expandDetail();
    const row = this.detailRowBySku(originSku);
    await expect(row, `Baris Origin ${originSku}`).toBeVisible({ timeout: 30_000 });

    const combo = row
      .locator('[aria-placeholder*="Remapped"], [aria-placeholder*="Select"], .multiselect-search, [role="combobox"]')
      .nth(1)
      .or(row.locator('.multiselect').nth(1).locator('input, [role="combobox"]'))
      .or(row.locator('td').nth(2).locator('input, [role="combobox"], .multiselect'));

    const cell = row.locator('td').nth(2);
    await cell.click({ force: true }).catch(() => undefined);
    await this.page.waitForTimeout(400);

    let target = combo;
    if (!(await target.first().isVisible({ timeout: 3_000 }).catch(() => false))) {
      target = this.page.locator('.multiselect-search:visible, [role="combobox"]:visible').last();
    }

    const put = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping-detail/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    const filterToken =
      remappedSku.split('-').pop()?.trim() ||
      remappedSku.replace(/^sku-/i, '').trim() ||
      remappedSku;

    await this.multiselect.selectOption(target.first(), remappedSku, {
      exact: false,
      typeToFilter: filterToken,
    });

    const response = await put;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async setOriginOnRow(currentSku: string, newOriginSku: string): Promise<ApiCallResult> {
    await this.expandDetail();
    const row = this.detailRowBySku(currentSku);
    await expect(row, `Baris ${currentSku}`).toBeVisible({ timeout: 30_000 });

    const originCombo = row
      .locator('.multiselect')
      .first()
      .locator('input, [role="combobox"]')
      .first();
    await row.locator('td').nth(1).click({ force: true }).catch(() => undefined);
    await this.page.waitForTimeout(400);

    const put = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping-detail/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    const target = (await originCombo.isVisible().catch(() => false))
      ? originCombo
      : this.page.locator('.multiselect-search:visible, [role="combobox"]:visible').first();

    await target.click({ force: true }).catch(() => undefined);
    await target.fill('').catch(() => undefined);
    await target.fill(newOriginSku).catch(async () => {
      await target.pressSequentially(newOriginSku, { delay: 40 });
    });
    await this.page.waitForTimeout(1_000);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({
        hasText: new RegExp(newOriginSku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(option, `Opsi Origin ${newOriginSku}`).toBeVisible({ timeout: 20_000 });
    await option.click();

    const response = await put;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async setQtyOnRow(sku: string, qty: number): Promise<ApiCallResult> {
    await this.expandDetail();
    const row = this.detailRowBySku(sku);
    await expect(row, `Baris ${sku}`).toBeVisible({ timeout: 30_000 });

    const qtyCell = row.locator('td').filter({ hasText: /^\s*\d/ }).first();
    await qtyCell.dblclick({ force: true }).catch(async () => {
      await qtyCell.click({ force: true });
    });
    await this.page.waitForTimeout(300);

    const input = this.page.locator('input:visible:not([type="checkbox"])').last();
    const put = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping-detail/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 45_000 },
      )
      .catch(() => null);

    await input.fill(String(qty));
    await input.press('Enter');
    await this.page.keyboard.press('Escape').catch(() => undefined);

    const response = await put;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async setDescriptionOnRow(sku: string, text: string): Promise<void> {
    await this.expandDetail();
    const row = this.detailRowBySku(sku);
    const descCell = row.locator('td').last();
    await descCell.dblclick({ force: true }).catch(() => undefined);
    const input = this.page.locator('input:visible, textarea:visible').last();
    await input.fill(text.slice(0, 150)).catch(() => undefined);
    await input.press('Enter').catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async tryApprove(description = 'ETM-15526 retest'): Promise<ApiCallResult> {
    const btn = this.page
      .locator('button')
      .filter({
        has: this.page.locator('.fa-check-double, [data-icon="check-double"]'),
      })
      .or(this.page.locator('button.bg-info').filter({ hasNotText: /Save/i }))
      .last();
    await expect(btn, 'Tombol Approve').toBeVisible({ timeout: 20_000 });

    const approveResponse = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping\/\d+\/approve/i.test(response.url()) &&
          response.request().method() === 'POST',
        { timeout: 90_000 },
      )
      .catch(() => null);

    await btn.click();
    const modalDesc = this.page
      .getByPlaceholder(/description|notes/i)
      .last()
      .or(this.page.locator('textarea:visible').last());
    if (await modalDesc.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await modalDesc.fill(description);
    }
    const confirm = this.page.getByRole('button', { name: /^Approve$/i }).last();
    if (await confirm.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await confirm.click();
    }

    const response = await approveResponse;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(1_000);
    return parsed;
  }

  async openEditById(id: string): Promise<void> {
    await this.page.goto(`/accounting/stock-remapping/edit/${id}`, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await this.expandBasic();
    await this.expandDetail();
  }

  async findEditableWithOriginSkus(skus: string[]): Promise<{
    id: string;
    code: string;
    url: string;
    details: Array<{ originSku: string; remappedSku: string; qty: number | null }>;
  } | null> {
    const auth = await readAuthFromPage(this.page);
    if (!auth.token) return null;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };
    const list = await this.page.request.get(
      `${getApiUrl()}/accounting/stock-remapping?start=0&length=200`,
      { headers },
    );
    if (!list.ok()) return null;
    const json = (await list.json().catch(() => null)) as {
      data?: Array<Record<string, unknown>>;
    } | null;
    const rows = json?.data ?? [];
    const needed = skus.map((sku) => sku.toLowerCase());

    for (const row of rows) {
      if (row.can_update === false) continue;
      const status = String(row.transaction_status ?? '').toLowerCase();
      if (status === 'closed' || status === 'void' || status === 'voided') continue;
      const id = String(row.id ?? '');
      if (!id) continue;
      const detailRes = await this.page.request.get(
        `${getApiUrl()}/accounting/stock-remapping/${id}`,
        { headers },
      );
      if (!detailRes.ok()) continue;
      const body = (await detailRes.json().catch(() => null)) as {
        data?: Record<string, unknown>;
      } | null;
      const data = body?.data ?? (body as Record<string, unknown> | null);
      const details = this.collectDetails(data);
      const origins = details.map((d) => d.originSku.toLowerCase());
      if (needed.every((sku) => origins.some((origin) => origin === sku))) {
        return {
          id,
          code: String(row.code ?? ''),
          url: `https://staging.olshoperp.com/accounting/stock-remapping/edit/${id}`,
          details,
        };
      }
    }
    return null;
  }

  async fetchApi(): Promise<Record<string, unknown> | null> {
    const id = this.currentEditId();
    if (!id) return null;
    const auth = await readAuthFromPage(this.page);
    if (!auth.token) return null;
    const res = await this.page.request.get(
      `${getApiUrl()}/accounting/stock-remapping/${id}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      },
    );
    if (!res.ok()) return null;
    const body = (await res.json().catch(() => null)) as {
      data?: Record<string, unknown>;
    } | null;
    return body?.data ?? (body as Record<string, unknown> | null);
  }

  collectDetails(so: Record<string, unknown> | null): Array<{
    originSku: string;
    remappedSku: string;
    qty: number | null;
  }> {
    if (!so) return [];
    const details = (so.stock_remapping_details ??
      so.details ??
      []) as Array<Record<string, unknown>>;
    return details.map((d) => {
      const origin = (d.product_origin ?? d.origin ?? {}) as Record<string, unknown>;
      const remap = (d.product_remapped_to ?? d.remapped ?? {}) as Record<
        string,
        unknown
      >;
      return {
        originSku: String(origin.sku ?? d.origin_sku ?? ''),
        remappedSku: String(remap.sku ?? d.remapped_sku ?? ''),
        qty: Number.isFinite(Number(d.quantity ?? d.qty))
          ? Number(d.quantity ?? d.qty)
          : null,
      };
    });
  }

  async importDetailFile(filePath: string): Promise<ApiCallResult> {
    await this.expandDetail();
    if (!(await this.isImportHistoryOpen())) {
      const importBtn = this.page
        .locator('#StockRemappingDetail')
        .getByRole('button', { name: /^Import$/i })
        .or(this.page.getByRole('button', { name: /^Import$/i }))
        .first();
      await expect(importBtn, 'Tombol Import di detail').toBeVisible({
        timeout: 20_000,
      });
      await importBtn.click();
      await expect(
        this.page.getByRole('tab', { name: /^Import History$/i }),
        'Tab Import History',
      ).toBeVisible({ timeout: 20_000 });
    }

    const importInDialog = this.page
      .getByRole('tabpanel', { name: /Import History$/i })
      .getByRole('button', { name: /^Import$/i })
      .or(
        this.page
          .locator('[role="dialog"]')
          .getByRole('button', { name: /^Import$/i }),
      )
      .first();
    await importInDialog.click({ force: true });
    await this.page.waitForTimeout(500);

    const fileInput = this.page.locator('input[type="file"]').last();
    await expect(fileInput).toBeAttached({ timeout: 20_000 });

    const upload = this.page
      .waitForResponse(
        (response) =>
          /stock-remapping/i.test(response.url()) &&
          /upload|import/i.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await fileInput.setInputFiles(filePath);
    const response = await upload;
    const parsed = await this.parseResponse(response);
    parsed.message = parsed.message || (await this.readToastText());
    await this.page.waitForTimeout(3_000);
    return parsed;
  }

  async readImportHistorySummary(): Promise<{
    text: string;
    failedRow: number | null;
    successRow: number | null;
    errorLogs: string;
  }> {
    const historyTab = this.page.getByRole('tab', { name: /^Import History$/i });
    if (await historyTab.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await historyTab.first().click({ force: true });
    }
    await this.page.waitForTimeout(1_200);

    const tableText = (
      (await this.page
        .locator('table')
        .filter({ hasText: /Failed Row|Success Row|File Name/i })
        .first()
        .innerText()
        .catch(() => '')) ?? ''
    ).replace(/\s+/g, ' ');

    const failedMatch = tableText.match(/Failed Row[^\d]{0,8}(\d+)/i);
    const successMatch = tableText.match(/Success Row[^\d]{0,8}(\d+)/i);
    const trailing = [...tableText.matchAll(/\b(\d+)\b/g)].map((m) => Number(m[1]));

    const errorTab = this.page.getByRole('tab', { name: /View Error Logs/i });
    let errorLogs = '';
    if (await errorTab.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await errorTab.click({ force: true });
      await this.page.waitForTimeout(1_000);
      errorLogs = (
        (await this.page
          .getByRole('table')
          .filter({ has: this.page.getByRole('columnheader', { name: /Message/i }) })
          .innerText()
          .catch(() => '')) ?? ''
      ).replace(/\s+/g, ' ');
      await historyTab.first().click().catch(() => undefined);
    }

    return {
      text: tableText.slice(0, 800),
      failedRow: failedMatch
        ? Number(failedMatch[1])
        : trailing.length >= 2
          ? trailing[trailing.length - 2]
          : null,
      successRow: successMatch
        ? Number(successMatch[1])
        : trailing.length >= 1
          ? trailing[trailing.length - 1]
          : null,
      errorLogs: errorLogs.slice(0, 1500),
    };
  }

  async readToastText(): Promise<string> {
    const toast = this.page.locator('.toastify, [class*="toast"]').first();
    if (await toast.isVisible({ timeout: 2_000 }).catch(() => false)) {
      return ((await toast.innerText()) ?? '').replace(/\s+/g, ' ').trim();
    }
    return '';
  }

  async countDetailRows(): Promise<number> {
    await this.expandDetail();
    const rows = this.page.locator('#StockRemappingDetail tbody tr, table tbody tr');
    let count = 0;
    const n = await rows.count();
    for (let i = 0; i < n; i++) {
      const text = ((await rows.nth(i).innerText()) ?? '').trim();
      if (text && !/no data available/i.test(text)) count++;
    }
    return count;
  }

  async bulkUseSkuFromAvailableProducts(sku: string): Promise<ApiCallResult> {
    const panel = await this.openAvailableProducts();
    const search = panel.getByPlaceholder(/find something/i).first();
    await search.fill(sku);
    await this.page.waitForTimeout(1_800);

    const matchingRows = panel.locator('tbody tr').filter({
      hasText: new RegExp(sku.replace(/[.*+?^${}()|[\\\]]/g, '\\$&'), 'i'),
    });
    const rowCount = await matchingRows.count();
    expect(rowCount, `Available Products ${sku} minimal 1 baris`).toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      await matchingRows
        .nth(i)
        .locator('input[type="checkbox"]')
        .first()
        .check({ force: true });
    }
    await this.page.waitForTimeout(400);

    const useBtn = panel
      .locator('button.tooltip-use, button[class*="use-button"]')
      .first();
    const post = this.page.waitForResponse(
      (response) =>
        /stock-remapping-detail/i.test(response.url()) &&
        ['POST', 'PUT'].includes(response.request().method()),
      { timeout: 90_000 },
    );
    await useBtn.click();
    const response = await post;
    const parsed = await this.parseResponse(response);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.closeOverlays();
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async readRemappedToOptions(originSku: string): Promise<string[]> {
    await this.expandDetail();
    const row = this.detailRowBySku(originSku);
    await expect(row).toBeVisible({ timeout: 30_000 });
    await row.locator('td').nth(2).click({ force: true }).catch(() => undefined);
    await this.page.waitForTimeout(600);
    const combo = row
      .locator('.multiselect-search, [role="combobox"]')
      .last()
      .or(this.page.locator('.multiselect-search:visible').last());
    await combo.click({ force: true }).catch(() => undefined);
    const searchHint = originSku.split('-').slice(0, 2).join('-') || originSku.slice(0, 8);
    await combo.fill(searchHint).catch(() => undefined);
    await this.page.waitForTimeout(1_200);
    const options = this.page.locator('.multiselect-option:visible');
    const n = await options.count();
    const labels: string[] = [];
    for (let i = 0; i < n; i++) {
      const t = ((await options.nth(i).textContent()) ?? '').replace(/\s+/g, ' ').trim();
      if (t && !/no results/i.test(t)) labels.push(t);
    }
    await this.page.keyboard.press('Escape').catch(() => undefined);
    return labels;
  }

  async readDetailRowText(originSku: string): Promise<string> {
    await this.expandDetail();
    const row = this.detailRowBySku(originSku);
    await expect(row).toBeVisible({ timeout: 30_000 });
    return ((await row.innerText()) ?? '').replace(/\s+/g, ' ').trim();
  }

  async clickSaveAllAndWait(): Promise<ApiCallResult> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /accounting\/stock-remapping\/\d+/.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()) &&
          !response.url().includes('detail') &&
          !response.url().includes('approve'),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();
    const response = await saveResponse;
    const parsed = await this.parseResponse(response);
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
    return parsed;
  }

  async closeOverlays(): Promise<void> {
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(300);
  }

  async openEditById(id: string): Promise<void> {
    await this.page.goto(`/accounting/stock-remapping/edit/${id}`, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await this.expandBasic();
    await this.expandDetail();
  }

  async readDetailRowTextBySku(sku: string): Promise<string> {
    return this.readDetailRowText(sku);
  }

  async isImportHistoryOpen(): Promise<boolean> {
    return this.page
      .getByRole('tab', { name: /^Import History$/i })
      .first()
      .isVisible({ timeout: 1_500 })
      .catch(() => false);
  }

  currentEditId(): string | null {
    return this.page.url().match(/stock-remapping\/edit\/(\d+)/)?.[1] ?? null;
  }

  currentEditUrl(): string | null {
    const id = this.currentEditId();
    return id
      ? `https://staging.olshoperp.com/accounting/stock-remapping/edit/${id}`
      : null;
  }

  async bulkUseStockIds(opts: {
    sku: string;
    remappedTo: string;
    stockIds: string[];
  }): Promise<{ apiMessage: string | null; ok: boolean }> {
    let panel = this.availableProductsPanel();
    if (!(await panel.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await this.openAvailableProductsWithData(opts.sku);
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

  availableProductsPanel(): Locator {
    return this.page
      .locator('[role="dialog"]')
      .filter({
        has: this.page.getByRole('heading', { name: /Available Products/i }),
      })
      .first()
      .or(
        this.page
          .locator('.modal-content, .p-dialog')
          .filter({ hasText: /Available Products/i })
          .first(),
      );
  }

  async closeAvailablePanel(): Promise<void> {
    await this.closeOverlays();
  }

  private async parseResponse(
    response: Awaited<ReturnType<Page['waitForResponse']>> | null,
  ): Promise<ApiCallResult> {
    if (!response) {
      return {
        ok: false,
        status: 0,
        message: await this.readToastText(),
        bodyPreview: '',
      };
    }
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
      message?: string;
    } | null;
    const message =
      body?.status?.message ?? body?.message ?? (await response.text().catch(() => ''));
    const errorFlag = Number(body?.status?.error ?? 0);
    return {
      ok: response.ok() && !errorFlag,
      status: response.status(),
      message: String(message ?? ''),
      bodyPreview: JSON.stringify(body ?? {}).slice(0, 800),
    };
  }
}
