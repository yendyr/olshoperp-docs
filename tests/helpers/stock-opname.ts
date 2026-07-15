import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const STOCK_OPNAME_DATALIST_PATH = '/supplychain/stock-opname';
export const STOCK_OPNAME_CREATE_PATH = '/supplychain/stock-opname/create';
export const STOCK_OPNAME_EDIT_PATH_PATTERN =
  /\/supplychain\/stock-opname\/edit\/\d+/;

/**
 * POM Stock Opname (SCM) — header + Opname Detail (Available Products / qty).
 */
export class StockOpnamePage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code');
  }

  get buildingCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Building');
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder('Add description or notes...');
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get availableProductsLink(): Locator {
    return this.page.getByText('Available Products', { exact: true });
  }

  /** Teleport panel Available Warehouse (AvailableWarehouse.vue). */
  availableProductsPanel(): Locator {
    return this.page
      .locator('div.fixed')
      .filter({
        has: this.page.getByPlaceholder(/find something/i),
      })
      .filter({
        has: this.page.locator('table'),
      })
      .first();
  }

  get adjustmentQtyInput(): Locator {
    // Modal Use Product — input Adjustment Quantity (#quantity)
    return this.page
      .locator('form')
      .filter({
        has: this.page.getByRole('heading', { name: 'Use Product', exact: true }),
      })
      .locator('#quantity')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(STOCK_OPNAME_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    // AS-IS: fetchDefaultValues() sering auto-submit → langsung ke edit
    const raced = await Promise.race([
      this.page
        .waitForURL(STOCK_OPNAME_EDIT_PATH_PATTERN, { timeout: 60_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/supplychain\/stock-opname\/create$/, { timeout: 60_000 })
        .then(() => 'create' as const),
    ]);

    await dismissStagingBanner(this.page);

    if (raced === 'edit') {
      await this.expandBasicInformation();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
      return 'edit';
    }

    await this.expandBasicInformation();
    await expect(
      this.buildingCombobox.or(
        this.page.locator('.multiselect').filter({
          has: this.page.locator('[aria-placeholder="Choose Building"]'),
        }),
      ).first(),
    ).toBeVisible({ timeout: 45_000 });

    // Tunggu possible late auto-redirect
    const autoEdit = await this.page
      .waitForURL(STOCK_OPNAME_EDIT_PATH_PATTERN, { timeout: 8_000 })
      .then(() => true)
      .catch(() => false);
    if (autoEdit) {
      await this.expandBasicInformation();
      return 'edit';
    }

    return 'create';
  }

  private async expandBasicInformation(): Promise<void> {
    const basic = this.page.getByRole('button', {
      name: 'Basic Information',
      exact: true,
    });
    await expect(basic).toBeVisible({ timeout: 45_000 });
    if ((await basic.getAttribute('aria-expanded')) !== 'true') {
      await basic.click();
      await this.page.waitForTimeout(700);
    }
  }

  async ensureBuildingOriginSelected(): Promise<string> {
    // Sudah terisi (autofill / single-label) → baca label
    const root = this.page
      .locator('div')
      .filter({
        has: this.page.getByText('Building Origin', { exact: false }),
      })
      .locator('.multiselect')
      .first();

    const single = root.locator('.multiselect-single-label');
    if (await single.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const label = ((await single.textContent()) ?? '').trim();
      if (label && !/choose building/i.test(label)) {
        return label;
      }
    }

    let combobox = this.buildingCombobox;
    if (!(await combobox.isVisible().catch(() => false))) {
      await root.click();
      combobox = root.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(600);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .first();
    await expect(
      option,
      'Minimal 1 Building Origin di dropdown',
    ).toBeVisible({ timeout: 25_000 });
    const optionText = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(500);
    return optionText;
  }

  async fillDescription(text: string): Promise<void> {
    await this.descriptionInput.fill(text);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/stock-opname' ||
          pathname.endsWith('/supplychain/stock-opname')
        );
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
      data?: { id?: number; code?: string };
    } | null;

    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Save Stock Opname gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(STOCK_OPNAME_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Stock Opname ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(STOCK_OPNAME_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async setStatusOpen(): Promise<void> {
    const open = this.openRadio;
    await expect(open).toBeVisible({ timeout: 15_000 });
    if (!(await open.isChecked().catch(() => false))) {
      // Radio @click="update('open')" — auto PUT
      const put = this.page
        .waitForResponse(
          (response) =>
            /\/supplychain\/stock-opname\/\d+/.test(response.url()) &&
            ['PUT', 'POST'].includes(response.request().method()),
          { timeout: 60_000 },
        )
        .catch(() => null);
      await open.check({ force: true });
      await put;
      await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
      await this.page.waitForTimeout(500);
    }
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/stock-opname\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update Stock Opname gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(code: string, descriptionSnippet?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Stock Opname ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  async expandOpnameDetail(): Promise<void> {
    const btn = this.page
      .getByRole('button', { name: /Opname Detail|Stock Opname Detail/i })
      .first();
    await expect(btn).toBeVisible({ timeout: 45_000 });
    if ((await btn.getAttribute('aria-expanded')) !== 'true') {
      await btn.click();
      await this.page.waitForTimeout(700);
    }
  }

  async openAvailableProductsModal(): Promise<void> {
    await this.expandOpnameDetail();
    await this.availableProductsLink.scrollIntoViewIfNeeded();

    const availableResponse = this.page
      .waitForResponse(
        (response) =>
          /available_products/i.test(response.url()) &&
          response.request().method() === 'GET',
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.availableProductsLink.click();
    await availableResponse;
    await this.page.waitForTimeout(1_500);

    const panel = this.availableProductsPanel();
    await expect(panel, 'Panel Available Products').toBeVisible({
      timeout: 45_000,
    });

    // DataTables kadang load async — tunggu baris data (bukan "No data")
    const anySku = panel.getByText(/LUMI|CHARM|TTK|[A-Z0-9]{4,}/i).first();
    await expect(anySku, 'Available products ter-load').toBeVisible({
      timeout: 60_000,
    });
  }

  /**
   * Ambil baris pertama di Available Products → Use → isi Adjustment Qty → Save.
   * Return teks SKU/product untuk assert di Opname Detail.
   */
  async useFirstAvailableProductWithQty(qty: string | number): Promise<string> {
    await this.openAvailableProductsModal();

    const panel = this.availableProductsPanel();

    // Action "Use" per baris (class use-button{modal_for})
    let useBtn = panel.locator('button[class*="use-button"]').first();
    if (!(await useBtn.isVisible({ timeout: 5_000 }).catch(() => false))) {
      // Scroll horizontal ke kolom aksi jika terpotong
      await panel.locator('.dataTables_scrollBody, .dt-scroll-body, table').first()
        .evaluate((el) => {
          el.scrollLeft = el.scrollWidth;
        })
        .catch(() => undefined);
      useBtn = panel.locator('button[class*="use-button"]').first();
    }

    // Fallback: centang baris pertama + bulk Use (tanpa qty di modal)
    if (!(await useBtn.isVisible({ timeout: 8_000 }).catch(() => false))) {
      return this.bulkUseFirstAvailableThenSetQty(qty);
    }

    const row = useBtn.locator('xpath=ancestor::tr[1]');
    const productCell = row.locator('td').nth(1);
    const productLabel = ((await productCell.textContent()) ?? '')
      .replace(/\s+/g, ' ')
      .trim();
    expect(productLabel.length, 'Label product tersedia').toBeGreaterThan(0);

    await useBtn.click();

    await expect(
      this.page.getByRole('heading', { name: 'Use Product', exact: true }),
    ).toBeVisible({ timeout: 20_000 });

    const qtyInput = this.adjustmentQtyInput;
    await expect(qtyInput).toBeVisible({ timeout: 15_000 });
    await qtyInput.click();
    await qtyInput.fill('');
    await qtyInput.fill(String(qty));

    const modalForm = this.page.locator('form').filter({
      has: this.page.getByRole('heading', { name: 'Use Product', exact: true }),
    });

    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const url = response.url();
        // AS-IS path: .../stock-opname/{id}/stock-opname-detail (tanpa trailing slash)
        return (
          /\/stock-opname\/\d+\/stock-opname-detail(?:\?|$)/.test(url) &&
          !url.includes('bulk')
        );
      },
      { timeout: 90_000 },
    );

    const saveBtn = modalForm
      .locator('button[type="submit"][data-modal-save], button[type="submit"]')
      .first();
    await expect(saveBtn).toBeVisible({ timeout: 10_000 });
    await saveBtn.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Add available product gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await expect(
      this.page.getByRole('heading', { name: 'Use Product', exact: true }),
    ).toBeHidden({ timeout: 30_000 });
    await this.page.waitForTimeout(1_500);

    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(500);

    return productLabel;
  }

  /**
   * Fallback: checkbox baris pertama → bulk Use → set Expected stock di Opname Detail.
   */
  async bulkUseFirstAvailableThenSetQty(qty: string | number): Promise<string> {
    const panel = this.availableProductsPanel();
    const row = panel.locator('table tbody tr').first();
    await expect(row, 'Minimal 1 available product').toBeVisible({
      timeout: 30_000,
    });

    const productCell = row.locator('td').nth(1);
    const productLabel = ((await productCell.textContent()) ?? '')
      .replace(/\s+/g, ' ')
      .trim();
    expect(productLabel.length).toBeGreaterThan(0);

    const checkbox = row.locator('input[type="checkbox"]').first();
    await checkbox.check({ force: true });
    await this.page.waitForTimeout(500);

    const bulkUse = panel.locator('button.tooltip-use').filter({ hasText: /Use/i }).first();
    await expect(bulkUse, 'Tombol bulk Use').toBeVisible({ timeout: 15_000 });

    const bulkResponse = this.page.waitForResponse(
      (response) =>
        /stock-opname-detail\/bulk-use|stock-opname\/\d+\/stock-opname-detail\/bulk-use/.test(
          response.url(),
        ) && response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await bulkUse.click();
    const response = await bulkResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Bulk Use available product gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);

    // Tutup panel Available Products
    await this.page.mouse.click(8, 8);
    await this.page.waitForTimeout(700);

    await this.setExpectedStockOnDetailRow(productLabel, qty);
    return productLabel;
  }

  /**
   * Assert baris product muncul di Opname Detail; optionally set Expected stock.
   */
  async assertDetailHasProduct(productSnippet: string): Promise<Locator> {
    await this.expandOpnameDetail();
    const detail = this.page.locator('#OpnameDetail, [id="OpnameDetail"]').first();
    const scope = (await detail.count()) ? detail : this.page;
    // Ambil token SKU (baris pertama teks sebelum newline / spasi panjang)
    const token =
      productSnippet.split(/\s{2,}|\n/)[0]?.trim().slice(0, 24) ||
      productSnippet.slice(0, 24);

    const row = scope
      .locator('.p-datatable-tbody tr, tbody tr')
      .filter({ hasText: token })
      .first();
    await expect(
      row,
      `Product "${token}" harus ada di Opname Detail`,
    ).toBeVisible({ timeout: 45_000 });
    return row;
  }

  async setExpectedStockOnDetailRow(
    productSnippet: string,
    expectedQty: string | number,
  ): Promise<void> {
    const row = await this.assertDetailHasProduct(productSnippet);

    // Expected stock sering sudah tampil sebagai input editable di PrimeDataTables
    let input = row.locator('input.p-inputtext, input[type="text"]').first();
    if (!(await input.isVisible({ timeout: 3_000 }).catch(() => false))) {
      const cell = row.locator('td').nth(3); // kira-kira kolom Expected stock
      await cell.dblclick().catch(() => cell.click());
      input = row.locator('input').first();
    }

    await expect(input, 'Expected stock input').toBeVisible({ timeout: 10_000 });

    const put = this.page
      .waitForResponse(
        (response) =>
          /stock-opname-detail/i.test(response.url()) &&
          ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await input.click({ clickCount: 3 });
    await input.fill(String(expectedQty));
    await input.press('Tab');
    await put;
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  opnameDetailSection(): Locator {
    return this.page.locator('#OpnameDetail, [id="OpnameDetail"]').first();
  }

  /**
   * Hapus semua baris Opname Detail (per-row delete) sampai kosong.
   * AS-IS: modal_bulk_delete=false → destroy langsung; tetap handle confirm jika muncul.
   * Hindari tombol mass-delete-sku (hapus SKU di semua dokumen).
   */
  async clearAllOpnameDetailRows(): Promise<void> {
    await this.expandOpnameDetail();
    const section = this.opnameDetailSection();
    const scope = (await section.count()) ? section : this.page;

    for (let attempt = 0; attempt < 25; attempt++) {
      const dataRows = scope
        .locator('.p-datatable-tbody tr')
        .filter({ hasNotText: /no (records|data)|empty/i });

      if ((await dataRows.count().catch(() => 0)) === 0) {
        break;
      }

      // Prefer row-delete default PrimeDataTables (class modal_for = datalistdetailoutbound)
      let deleteBtn = scope
        .locator('button.datalistdetailoutbound.tooltip-delete, button#deleteButton')
        .first();

      if (!(await deleteBtn.isVisible({ timeout: 2_000 }).catch(() => false))) {
        // Fallback: trash di baris yang BUKAN mass-delete-SKU tippy
        deleteBtn = dataRows
          .first()
          .locator('button.tooltip-delete')
          .filter({ hasNot: this.page.locator('[content*="all Stock Opname"]') })
          .first();
      }

      if (!(await deleteBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
        // Last resort: tombol delete pertama di baris pertama
        deleteBtn = dataRows.first().locator('button.tooltip-delete').first();
      }

      if (!(await deleteBtn.isVisible({ timeout: 3_000 }).catch(() => false))) {
        break;
      }

      const destroyResponse = this.page
        .waitForResponse(
          (response) =>
            /stock-opname-detail/i.test(response.url()) &&
            response.request().method() === 'DELETE',
          { timeout: 60_000 },
        )
        .catch(() => null);

      await deleteBtn.scrollIntoViewIfNeeded();
      await deleteBtn.click();

      // Confirm modal (jika ada) — baik row-delete maupun mass-delete
      const confirmDelete = this.page.getByRole('button', { name: /^Delete$/i }).last();
      if (await confirmDelete.isVisible({ timeout: 4_000 }).catch(() => false)) {
        // Jika dialog mass-delete-sku ke semua dokumen → Cancel, coba tombol lain
        const massWarn = this.page.getByText(/all Stock Opname/i).first();
        if (await massWarn.isVisible({ timeout: 1_000 }).catch(() => false)) {
          await this.page.getByRole('button', { name: /^Cancel$/i }).last().click();
          await this.page.waitForTimeout(500);
          // Klik delete default class datalistdetailoutbound di baris yang sama
          const alt = dataRows
            .first()
            .locator('button.datalistdetailoutbound')
            .first();
          if (await alt.isVisible({ timeout: 2_000 }).catch(() => false)) {
            await alt.click();
            const confirm2 = this.page.getByRole('button', { name: /^Delete$/i }).last();
            if (await confirm2.isVisible({ timeout: 3_000 }).catch(() => false)) {
              await confirm2.click();
            }
          } else {
            throw new Error(
              'Hanya menemukan mass-delete-SKU; tombol delete baris tidak tersedia',
            );
          }
        } else {
          await confirmDelete.click();
          await expect(confirmDelete).toBeHidden({ timeout: 60_000 });
        }
      }

      await destroyResponse;
      await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
      await this.page.waitForTimeout(1_200);
    }

    await this.assertOpnameDetailEmpty();
  }

  async assertOpnameDetailEmpty(): Promise<void> {
    await this.expandOpnameDetail();
    const section = this.opnameDetailSection();
    const scope = (await section.count()) ? section : this.page;

    const rows = scope
      .locator('.p-datatable-tbody tr')
      .filter({ hasNotText: /no (records|data)|empty/i })
      .filter({ has: this.page.locator('td') });

    // PrimeVue sering menampilkan 1 row empty-state — boleh jika teks "No"
    const count = await rows.count();
    if (count === 0) {
      return;
    }

    for (let i = 0; i < count; i++) {
      const text = ((await rows.nth(i).textContent()) ?? '').trim();
      if (/no (records|data|result)|empty/i.test(text) || text.length === 0) {
        continue;
      }
      // Baris produk biasanya punya SKU/angka availability
      if (/LUMI|CHARM|TTK|[A-Z]{2,}\d/i.test(text) && !/no records/i.test(text)) {
        throw new Error(`Opname Detail masih berisi baris: ${text.slice(0, 80)}`);
      }
    }
  }
}
