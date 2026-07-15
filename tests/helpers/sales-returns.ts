import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';

export const SALES_RETURNS_DATALIST_PATH = '/supplychain/sales-returns';
export const SALES_RETURNS_EDIT_PATH_PATTERN =
  /\/supplychain\/sales-returns\/edit\/\d+/;

/**
 * POM Sales Return — SCM Gudang (`supplychain-sales-returns`).
 * Selector: tests/pom-registry/sales-returns.yaml
 *
 * Fungsi: scan SO (post-outbound + invoice) → isi Restock/Broken/Lost → Finance Complete.
 * API mutation: accounting/sales-returns · datalist: omnichannel/sales-returns
 */
export class SalesReturnsPage {
  readonly datalist: OlshopDatalist;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get warehouseCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select WH Location');
  }

  get locationCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select CCTV Location');
  }

  get scanInput(): Locator {
    // ScanForm: FormInput + Submit di form terpusat
    return this.page
      .locator('form')
      .filter({ has: this.page.getByRole('button', { name: /^Submit$/i }) })
      .locator('input')
      .first();
  }

  get submitScanButton(): Locator {
    return this.page.getByRole('button', { name: /^Submit$/i }).first();
  }

  get platformPill(): Locator {
    return this.page.getByText('Sales Platform Returns', { exact: false }).first();
  }

  get resetButton(): Locator {
    return this.page.getByRole('button', { name: /^Reset$/i }).first();
  }

  async gotoDatalist(): Promise<void> {
    await this.page.goto(SALES_RETURNS_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await dismissStagingBanner(this.page);
    await expect(this.scanInput).toBeVisible({ timeout: 45_000 });
    await expect(this.warehouseCombobox).toBeVisible({ timeout: 45_000 });
  }

  async assertShellVisible(): Promise<void> {
    // Breadcrumb "Sales Return" di topbar sering aria-hidden — assert form shell
    await expect(this.scanInput).toBeVisible({ timeout: 30_000 });
    await expect(this.submitScanButton).toBeVisible();
    await expect(this.warehouseCombobox).toBeVisible();
    await expect(this.locationCombobox).toBeVisible();
    await expect(this.platformPill).toBeVisible();
    // Tidak ada Create klasik — scan-based
    const createCount = await this.page
      .getByRole('link', { name: /^Create$/i })
      .count();
    expect(createCount, 'Sales Return SCM tanpa link Create klasik').toBe(0);
  }

  async ensureWarehouseAndLocation(): Promise<void> {
    await this.selectFirstMultiselectIfEmpty(
      this.warehouseCombobox,
      'Select WH Location',
    );
    await this.selectFirstMultiselectIfEmpty(
      this.locationCombobox,
      'Select CCTV Location',
    );
  }

  private async selectFirstMultiselectIfEmpty(
    combobox: Locator,
    label: string,
  ): Promise<void> {
    const current = await this.multiselect.selectedLabel(combobox);
    if (
      current.length > 0 &&
      !/^choose\b|^select\b/i.test(current) &&
      !/no warehouse|no cctv/i.test(current)
    ) {
      // Sudah terisi (localStorage preferensi) — tetap valid jika bukan placeholder
      const looksPlaceholder =
        /select wh location|select cctv location/i.test(current);
      if (!looksPlaceholder) {
        return;
      }
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(800);
    const opt = this.multiselect.visibleOptions().first();
    await expect(opt, `${label} harus punya opsi`).toBeVisible({
      timeout: 30_000,
    });
    await opt.click();
    await this.page.waitForTimeout(400);
    await this.multiselect.assertFilled(combobox, label);
  }

  async togglePlatformReturns(): Promise<void> {
    await this.platformPill.click();
    await this.page.waitForTimeout(1_500);
  }

  /**
   * Ambil Sales Order code dari baris datalist (kolom order).
   * Prefer baris tanpa SR / platform unused.
   */
  async pickSalesOrderCodeFromTable(): Promise<string | null> {
    await this.page.waitForTimeout(1_200);
    const rows = this.page.locator('tbody tr').filter({
      hasNotText: /no data available|no matching/i,
    });
    const count = await rows.count();
    if (count === 0) {
      return null;
    }

    // Prefer explicit SO-* token di body tabel
    const bodyText = (await this.page.locator('table tbody').innerText().catch(() => '')) || '';
    const soMatch = bodyText.match(/\bSO[-A-Z0-9]+\b/i);
    if (soMatch) {
      return soMatch[0];
    }

    const row = rows.first();
    const cells = row.locator('td');
    const cellCount = await cells.count();
    for (let i = 0; i < Math.min(cellCount, 6); i++) {
      const text = ((await cells.nth(i).innerText()) || '').trim();
      if (!text || /not authorized|^-$/i.test(text)) continue;
      const match = text.match(/[A-Z0-9][A-Z0-9\-_.]{4,}/i);
      if (match) {
        return match[0];
      }
    }
    return null;
  }

  /**
   * CREATE via scan SO. Return edit URL + SR code jika sukses.
   * Throw dengan pesan jelas jika scan ditolak / tidak ada SO.
   */
  async createByScan(orderCode: string): Promise<{
    editUrl: string;
    srCode: string;
  }> {
    await this.ensureWarehouseAndLocation();

    const createResp = this.page.waitForResponse(
      (r) =>
        r.request().method() === 'POST' &&
        /accounting\/sales-returns\/?$/.test(r.url()) &&
        !r.url().includes('/details'),
      { timeout: 60_000 },
    );

    await this.scanInput.fill(orderCode);
    await this.submitScanButton.click();

    const resp = await createResp;
    const body = await resp.json().catch(() => null);
    if (!resp.ok() || body?.status?.error) {
      const msg =
        body?.status?.message ||
        body?.message ||
        `HTTP ${resp.status()} create Sales Return gagal`;
      throw new Error(`CREATE scan ditolak: ${msg}`);
    }

    await expect(this.page).toHaveURL(SALES_RETURNS_EDIT_PATH_PATTERN, {
      timeout: 60_000,
    });
    await dismissStagingBanner(this.page);

    const srCode = await this.readSrCode();
    return { editUrl: this.page.url(), srCode };
  }

  async readSrCode(): Promise<string> {
    const label = this.page.getByText(/Sales Return No:/i).first();
    await expect(label).toBeVisible({ timeout: 45_000 });
    const text = (await label.innerText()) || '';
    const match = text.match(/SR[-\w]*/i);
    if (match) {
      return match[0];
    }
    // fallback dari header stock_mutation di halaman
    const anySr = this.page.getByText(/\bSR[-A-Z0-9]+\b/i).first();
    if (await anySr.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const t = (await anySr.innerText()) || '';
      const m = t.match(/SR[-A-Z0-9]+/i);
      if (m) return m[0];
    }
    throw new Error('Sales Return code (SR*) tidak ditemukan di edit page');
  }

  /**
   * Bind dokumen open (Continue Sales Return) dari datalist.
   */
  async openFirstEditableFromDatalist(): Promise<string> {
    await this.gotoDatalist();

    // Prefer Continue (open) lalu Show (approved)
    const actionIcon = this.page
      .locator('tbody')
      .locator(
        '.fa-list-check, [data-icon="list-check"], .fa-up-right-from-square, [data-icon="up-right-from-square"]',
      )
      .first();

    if (await actionIcon.isVisible({ timeout: 10_000 }).catch(() => false)) {
      await actionIcon.scrollIntoViewIfNeeded();
      await actionIcon.click({ force: true });
    } else {
      // Fallback: klik baris dengan SR* lalu cari button di action
      const srRow = this.page
        .locator('tbody tr')
        .filter({ hasText: /\bSR[-A-Z0-9]+/i })
        .first();
      if (!(await srRow.isVisible({ timeout: 5_000 }).catch(() => false))) {
        throw new Error(
          'Datalist Sales Return: tidak ada open SR (Continue) di lumicharmsid',
        );
      }
      await srRow.locator('td').last().locator('button, a, svg').first().click({
        force: true,
      });
    }

    await expect(this.page).toHaveURL(SALES_RETURNS_EDIT_PATH_PATTERN, {
      timeout: 60_000,
    });
    await dismissStagingBanner(this.page);
    return this.readSrCode();
  }

  async gotoEditUrl(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await dismissStagingBanner(this.page);
    await expect(this.page).toHaveURL(SALES_RETURNS_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
  }

  async assertEditPageReady(): Promise<void> {
    await expect(this.page.getByText(/Order Details/i).first()).toBeVisible({
      timeout: 45_000,
    });
    await expect(this.page.getByText(/Sales Return No:/i).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      this.page.getByText(/Restock Qty/i).first(),
    ).toBeVisible({ timeout: 45_000 });
    // SCM: Complete (Finance) tidak muncul
    const complete = this.page.getByRole('button', { name: /^Complete$/i });
    await expect(complete).toHaveCount(0);
  }

  /** Restock NumberSpinner row — first editable spinner in table body. */
  restockSpinnerPlus(): Locator {
    // Kolom Restock Qty: InputGroup Text plus di tbody
    return this.page
      .locator('tbody .input-group, tbody [class*="InputGroup"], tbody')
      .locator('.fa-plus, [data-icon="plus"]')
      .first();
  }

  restockSpinnerInput(): Locator {
    return this.page.locator('tbody input[type="number"]').first();
  }

  /**
   * UPDATE: ubah distribusi Restock/Lost agar PATCH details terpicu.
   * AS-IS: jika Restock sudah = Product Qty, plus disabled (available=0) —
   *        isi Restock=0 + Lost=1 (satu debounce) lalu toast Finance.
   */
  async updateRestockQty(): Promise<void> {
    await this.assertEditPageReady();

    const inputs = this.page.locator('tbody input[type="number"]');
    await expect(inputs.first()).toBeVisible({ timeout: 15_000 });
    const inputCount = await inputs.count();
    expect(inputCount, 'Butuh Restock (+ Lost) NumberSpinner').toBeGreaterThanOrEqual(2);

    const restockInput = inputs.nth(0);
    const lostInput = inputs.nth(1);
    const restockBefore = Number((await restockInput.inputValue()) || '0');
    const lostBefore = Number((await lostInput.inputValue()) || '0');

    const patchPromise = this.page.waitForResponse(
      (r) =>
        r.request().method() === 'PATCH' &&
        /accounting\/sales-returns\/\d+\/details\/\d+/.test(r.url()),
      { timeout: 45_000 },
    );

    // Prefer redistribusi Restock↔Lost (available sering 0 saat Restock penuh)
    if (restockBefore > 0) {
      await restockInput.click();
      await restockInput.fill('0');
      await this.page.waitForTimeout(150);
      await lostInput.click();
      await lostInput.fill(String(lostBefore + restockBefore));
      await lostInput.blur();
    } else if (lostBefore > 0) {
      await lostInput.click();
      await lostInput.fill('0');
      await this.page.waitForTimeout(150);
      await restockInput.click();
      await restockInput.fill(String(lostBefore));
      await restockInput.blur();
    } else {
      await restockInput.click();
      await restockInput.fill('1');
      await restockInput.blur();
    }

    const resp = await patchPromise;
    expect(resp.ok(), 'PATCH Restock/Lost Qty harus OK').toBeTruthy();

    const toast = this.page
      .locator('.toastify, [class*="toast"]')
      .filter({
        hasText: /Return data saved|Waiting for Finance|success|saved/i,
      });
    await expect(toast.first()).toBeVisible({ timeout: 15_000 });
  }
}
