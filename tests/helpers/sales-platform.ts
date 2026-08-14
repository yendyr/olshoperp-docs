import { Locator, Page, expect } from '@playwright/test';
import { getApiUrl, readAuthFromPage } from './company-access';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const SALES_PLATFORM_DATALIST_PATH = '/omni/sales-order';
export const SALES_PLATFORM_EDIT_PATH_PATTERN =
  /\/omni\/sales-order\/edit\/\d+|\/businessdevelopment\/sales-order(?:-general)?\/edit\/\d+/;

export type PlatformDetailSnapshot = {
  id?: number;
  sku: string;
  platformSku: string;
  benchmarkCogs: number | null;
  productId?: number | null;
};

/**
 * POM Dev - Sales Platform (`/omni/sales-order`, type=platform).
 * Create redirect ke SO General. Capture Benchmark COGS via bind System SKU.
 */
export class SalesPlatformPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(SALES_PLATFORM_DATALIST_PATH, 'link');
  }

  async toolbarLabels(): Promise<string[]> {
    const buttons = this.page.locator(
      '.topbar button, .topbar a, [class*="TopBar"] button, [class*="TopBar"] a',
    );
    const n = await buttons.count();
    const labels: string[] = [];
    for (let i = 0; i < Math.min(n, 40); i++) {
      const t = ((await buttons.nth(i).innerText().catch(() => '')) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      if (t) labels.push(t);
    }
    return labels;
  }

  hasImportButton(): Locator {
    return this.page.getByRole('button', { name: /^Import$/i }).first();
  }

  async listOrders(search = ''): Promise<Record<string, unknown>[]> {
    const waitList = () =>
      this.page.waitForResponse(
        (response) =>
          /omnichannel\/sales-order\/get/.test(response.url()) &&
          response.ok(),
        { timeout: 60_000 },
      );

    const pending = waitList();
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    let response = await pending;
    if (search) {
      const searched = waitList();
      await this.datalist.search(search, 2_500);
      response = await searched;
    }
    const body = (await response.json().catch(() => null)) as {
      data?: unknown;
    } | null;
    const data = body?.data;
    return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
  }

  async listOrdersViaApi(length = 100): Promise<Record<string, unknown>[]> {
    await this.gotoDatalist();
    const auth = await readAuthFromPage(this.page);
    if (!auth.token) return this.listOrders();
    const url = `${getApiUrl()}/omnichannel/sales-order/get?type=platform`;
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${auth.token}`,
    };
    const attempts = [
      () =>
        this.page.request.get(`${url}&start=0&length=${length}`, { headers }),
      () =>
        this.page.request.post(url, {
          headers,
          data: { start: 0, length, search: { value: '' } },
        }),
      () =>
        this.page.request.post(url, {
          headers,
          form: { start: '0', length: String(length), 'search[value]': '' },
        }),
    ];
    for (const attempt of attempts) {
      const res = await attempt();
      if (!res.ok()) continue;
      const body = (await res.json().catch(() => null)) as { data?: unknown };
      if (Array.isArray(body?.data) && body.data.length) {
        return body.data as Record<string, unknown>[];
      }
    }
    return this.listOrders();
  }

  async fetchSalesOrderApi(
    id?: string,
  ): Promise<Record<string, unknown> | null> {
    const soId = id ?? this.currentEditId();
    if (!soId) return null;
    const auth = await readAuthFromPage(this.page);
    if (!auth.token) return null;
    const res = await this.page.request.get(
      `${getApiUrl()}/omnichannel/sales-order/${soId}`,
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

  currentEditId(): string | null {
    return this.page.url().match(/\/edit\/(\d+)/)?.[1] ?? null;
  }

  collectDetailSnapshots(
    so: Record<string, unknown> | null,
  ): PlatformDetailSnapshot[] {
    if (!so) return [];
    const details = (so.sales_order_details ??
      so.details ??
      []) as Array<Record<string, unknown>>;
    return details.map((d) => {
      const product = (d.product ?? {}) as Record<string, unknown>;
      const n = Number(d.benchmark_cogs);
      return {
        id: typeof d.id === 'number' ? d.id : Number(d.id) || undefined,
        sku: String(product.sku ?? d.sku ?? ''),
        platformSku: String(d.platform_sku ?? d.platform_product_sku ?? ''),
        benchmarkCogs: Number.isFinite(n) ? n : null,
        productId:
          typeof d.product_id === 'number'
            ? d.product_id
            : d.product_id == null
              ? null
              : Number(d.product_id) || null,
      };
    });
  }

  isEditableStatus(row: Record<string, unknown>): boolean {
    const internal = String(row.transaction_status ?? row.status_name ?? '');
    return /^(draft|open)$/i.test(internal.trim());
  }

  async findOrderIdBySku(sku: string): Promise<string | null> {
    const rows = await this.listOrders(sku);
    const match = rows.find((row) => {
      const blob = JSON.stringify(row);
      return new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(
        blob,
      );
    });
    const id = match?.id ?? match?.sales_order_id;
    return id != null ? String(id) : null;
  }

  async findEditableOrderIds(limit = 8): Promise<string[]> {
    const rows = await this.listOrdersViaApi(100);
    return rows
      .filter((row) => this.isEditableStatus(row))
      .sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0))
      .slice(0, limit)
      .map((row) => String(row.id ?? row.sales_order_id));
  }

  async openEditById(id: string): Promise<void> {
    await this.page.goto(`${SALES_PLATFORM_DATALIST_PATH}/edit/${id}`, {
      waitUntil: 'domcontentloaded',
    });
    const ok = await this.page
      .waitForURL(SALES_PLATFORM_EDIT_PATH_PATTERN, { timeout: 20_000 })
      .then(() => true)
      .catch(() => false);
    if (!ok) {
      await this.gotoDatalist();
      await this.datalist.search(id, 2_000);
      const row = this.page.getByRole('row').filter({ hasText: id }).first();
      const href = await row.locator('a[href*="/edit/"]').first().getAttribute('href');
      if (href) {
        await this.page.goto(href, { waitUntil: 'domcontentloaded' });
      } else {
        await row.locator('#updateButton').first().click();
      }
      await this.page.waitForURL(SALES_PLATFORM_EDIT_PATH_PATTERN, {
        timeout: 45_000,
      });
    }
    await dismissStagingBanner(this.page);
    await this.expandPlatformDetail();
    await this.page
      .getByText(/no data available in table/i)
      .first()
      .waitFor({ state: 'hidden', timeout: 20_000 })
      .catch(() => undefined);
  }

  async expandPlatformDetail(): Promise<void> {
    const btn = this.page
      .getByRole('button', {
        name: /Sales Platform Detail|Platform Detail|Sales Order Detail/i,
      })
      .first();
    await expect(btn, 'Accordion Sales Platform Detail').toBeVisible({
      timeout: 20_000,
    });
    if ((await btn.getAttribute('aria-expanded')) !== 'true') {
      await btn.click();
    }
    await expect(btn).toHaveAttribute('aria-expanded', 'true', { timeout: 15_000 });
    await this.page
      .locator('.p-datatable-loading-overlay, .p-datatable-loading')
      .first()
      .waitFor({ state: 'hidden', timeout: 30_000 })
      .catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async bindSystemSku(sku: string): Promise<Record<string, unknown> | null> {
    await this.expandPlatformDetail();
    await expect(
      this.page.getByText(/System SKU/i).first(),
      'Kolom System SKU',
    ).toBeVisible({ timeout: 20_000 });
    await this.page
      .getByText(/no data available in table/i)
      .first()
      .waitFor({ state: 'hidden', timeout: 30_000 })
      .catch(() => undefined);

    const skuCell = this.page
      .locator('.p-datatable-tbody tr td, table tbody tr td')
      .filter({ has: this.page.locator('.multiselect, [role="combobox"], input') })
      .first();
    if (await skuCell.isVisible().catch(() => false)) {
      await skuCell.click();
      await this.page.waitForTimeout(400);
    }

    const combobox = this.page
      .locator(
        [
          '[aria-placeholder="Select Product"]',
          '[aria-placeholder*="System SKU"]',
          '[aria-placeholder*="Select SKU"]',
          '[aria-placeholder*="Choose"]',
          '.p-datatable-tbody .multiselect-search',
          '.multiselect-search',
        ].join(', '),
      )
      .locator('visible=true')
      .first();

    await expect(combobox, 'Combobox System SKU / Select Product').toBeVisible({
      timeout: 25_000,
    });

    const updateResponse = this.page.waitForResponse(
      (response) =>
        /sales-order-detail/.test(response.url()) &&
        ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox).catch(async () => {
      await combobox.click();
    });
    await combobox.fill('').catch(() => undefined);
    await combobox.fill(sku).catch(async () => {
      await combobox.pressSequentially(sku, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
    await expect(option, `Opsi System SKU ${sku}`).toBeVisible({
      timeout: 25_000,
    });
    await option.click();

    const response = await updateResponse.catch(() => null);
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_200);
    if (!response) return null;
    return (await response.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
  }

  async setTransactionDateViaApi(display: string): Promise<{
    ok: boolean;
    status: number;
    body: string;
  }> {
    const so = await this.fetchSalesOrderApi();
    const id = this.currentEditId();
    const auth = await readAuthFromPage(this.page);
    if (!so || !id || !auth.token) {
      return { ok: false, status: 0, body: 'missing so/id/token' };
    }
    const payload = {
      with_quotation: so.with_quotation ?? 0,
      store_id: so.store_id,
      currency_id: so.currency_id,
      exchange_rate: so.exchange_rate,
      shipping_platform_system_id: so.shipping_platform_system_id,
      customer_id: Number(
        (so.customer as { id?: number } | undefined)?.id ?? so.customer_id,
      ),
      transaction_date: display,
    };
    const res = await this.page.request.put(
      `${getApiUrl()}/omnichannel/sales-order/${id}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        data: payload,
      },
    );
    const body = await res.text();
    if (res.ok()) {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await dismissStagingBanner(this.page);
      await this.expandPlatformDetail();
    }
    return { ok: res.ok(), status: res.status(), body: body.slice(0, 500) };
  }

  async readCode(): Promise<string> {
    const input = this.page.locator('#code').first();
    if (await input.isVisible().catch(() => false)) {
      return (await input.inputValue()).trim();
    }
    return (
      this.page.url().match(/SO-[A-Z0-9]+/i)?.[0] ??
      ((await this.page.locator('h1, .page-title').first().innerText().catch(() => '')) ?? '')
        .match(/SO-[A-Z0-9]+/i)?.[0] ??
      ''
    );
  }
}
