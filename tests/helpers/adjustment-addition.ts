import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ADJUSTMENT_ADDITION_DATALIST_PATH =
  '/supplychain/adjustment-addition';
export const ADJUSTMENT_ADDITION_CREATE_PATH =
  '/supplychain/adjustment-addition/create';
export const ADJUSTMENT_ADDITION_EDIT_PATH_PATTERN =
  /\/supplychain\/adjustment-addition\/edit\/\d+/;

/**
 * POM Stock Addition (SCM Adjustment Addition).
 * Selector: tests/pom-registry/adjustment-addition.yaml
 *
 * AS-IS: FormComponen.fetchDefaultValues() dapat auto-submit create
 * jika Location Destination default tersedia → langsung ke edit (code AI*).
 */
export class AdjustmentAdditionPage {
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

  get locationCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Location');
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder(
      /The Sales department is responsible/i,
    );
  }

  get transactionDateInput(): Locator {
    return this.page
      .locator('input.olshoperp-datepicker-input, input.p-datepicker-input')
      .first()
      .or(
        this.page
          .getByRole('combobox')
          .filter({ hasText: /\d{2}-\d{2}-\d{4}/ })
          .first(),
      );
  }

  get draftRadio(): Locator {
    return this.page.locator('#draft');
  }

  get openRadio(): Locator {
    return this.page.locator('#open');
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ADJUSTMENT_ADDITION_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(ADJUSTMENT_ADDITION_EDIT_PATH_PATTERN, { timeout: 60_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/supplychain\/adjustment-addition\/create$/, {
          timeout: 60_000,
        })
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
      this.locationCombobox.or(
        this.page.locator('.multiselect').filter({
          has: this.page.locator('[aria-placeholder="Choose Location"]'),
        }),
      ).first(),
    ).toBeVisible({ timeout: 45_000 });

    const autoEdit = await this.page
      .waitForURL(ADJUSTMENT_ADDITION_EDIT_PATH_PATTERN, { timeout: 8_000 })
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

  async expandStockAdditionDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: 'Stock Addition Detail',
      exact: true,
    });
    await expect(btn).toBeVisible({ timeout: 45_000 });
    if ((await btn.getAttribute('aria-expanded')) !== 'true') {
      await btn.click();
      await this.page.waitForTimeout(700);
    }
  }

  async ensureLocationDestinationSelected(): Promise<string> {
    const root = this.page
      .locator('div')
      .filter({
        has: this.page.getByText('Location Destination', { exact: false }),
      })
      .locator('.multiselect')
      .first();

    const single = root.locator('.multiselect-single-label');
    if (await single.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const label = ((await single.textContent()) ?? '').trim();
      if (label && !/choose location/i.test(label)) {
        return label;
      }
    }

    let combobox = this.locationCombobox;
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
      'Minimal 1 Location Destination di dropdown',
    ).toBeVisible({ timeout: 25_000 });
    const optionText = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(500);
    return optionText;
  }

  /** Pilih Location Destination yang mengandung fragment (mis. Gayungsari). */
  async selectLocationContaining(fragment: string): Promise<string> {
    await this.expandBasicInformation();
    const root = this.page
      .locator('div')
      .filter({
        has: this.page.getByText('Location Destination', { exact: false }),
      })
      .locator('.multiselect')
      .first();

    let combobox = this.locationCombobox;
    if (!(await combobox.isVisible().catch(() => false))) {
      await root.click();
      combobox = root.locator('.multiselect-search').first();
      await expect(combobox).toBeVisible({ timeout: 10_000 });
    }

    await this.multiselect.open(combobox);
    await combobox.fill(fragment).catch(async () => {
      await combobox.pressSequentially(fragment, { delay: 40 });
    });
    await this.page.waitForTimeout(900);
    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({ hasText: new RegExp(fragment, 'i') })
      .first();
    await expect(option, `Location containing ${fragment}`).toBeVisible({
      timeout: 30_000,
    });
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(800);
    return text;
  }

  /**
   * Seed stok di Location Destination via Stock Addition + approve Accounting.
   * Dipakai fixture Transfer Inbound (AUTO-SKU* di Gayungsari).
   */
  async seedApprovedStockAtLocation(opts: {
    locationFragment: string;
    skus: string[];
    qty: number;
    description?: string;
  }): Promise<string> {
    const description = opts.description ?? 'automation playwright';
    await this.gotoDatalist();
    const mode = await this.openCreateForm();
    await this.selectLocationContaining(opts.locationFragment);
    await this.setTransactionDateFiscalFallback().catch(() => undefined);
    await this.fillDescription(description);

    if (mode === 'create') {
      await this.clickSaveAndNextAndWaitForEdit();
    } else {
      await this.clickSaveAllAndWait();
    }

    for (const sku of opts.skus) {
      await this.addProductViaSelectProduct(sku);
      await this.setInQtyOnDetailRow(sku, opts.qty);
    }

    await this.setStatusOpen().catch(() => undefined);
    await this.clickSaveAllAndWait();
    const code = await this.readGeneratedCode();
    await this.approveViaAccountingMenu(code);
    return code;
  }

  /** Buka Stock Addition Approval (Accounting) lalu Approve dokumen AI*. */
  async approveViaAccountingMenu(code: string): Promise<void> {
    await this.page.goto('/accounting/adjustment-inbound', {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page.getByRole('table').first()).toBeVisible({
      timeout: 45_000,
    });

    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(600);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Stock Addition Approval ${code}`).toBeVisible({
      timeout: 60_000,
    });

    const codeLink = row
      .getByRole('link', { name: code, exact: true })
      .or(row.locator('a[href*="/accounting/adjustment-inbound/edit/"]'))
      .first();

    if (await codeLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const href = await codeLink.getAttribute('href');
      if (href) {
        await this.page.goto(href, { waitUntil: 'domcontentloaded' });
      } else {
        await codeLink.click();
      }
    } else {
      const editBtn = this.datalist.editButton(row).first();
      await expect(editBtn).toBeVisible({ timeout: 30_000 });
      await editBtn.click();
    }

    await expect(this.page).toHaveURL(
      /\/accounting\/adjustment-inbound\/edit\/\d+/,
      { timeout: 45_000 },
    );
    await dismissStagingBanner(this.page);

    const approveBtn = this.page
      .getByRole('button', { name: /Approve Now/i })
      .or(
        this.page.locator('button.bg-info.border-info').filter({
          has: this.page.locator('.fa-check-double, [class*="check-double"]'),
        }),
      )
      .or(this.page.getByRole('button', { name: /^Approve$/i }))
      .first();

    await approveBtn.scrollIntoViewIfNeeded();
    await expect(approveBtn, 'Tombol Approve (Accounting AI)').toBeVisible({
      timeout: 45_000,
    });
    await approveBtn.click();

    const confirmApprove = this.page
      .getByRole('button', { name: /^Approve$/i })
      .last();
    await expect(confirmApprove).toBeVisible({ timeout: 15_000 });

    const approveResponse = this.page.waitForResponse(
      (response) =>
        /adjustment-inbound\/\d+\/approve/.test(response.url()) &&
        response.request().method() === 'POST',
      { timeout: 120_000 },
    );

    const redirected = this.page
      .waitForURL(/\/accounting\/adjustment-inbound\/?$/, { timeout: 120_000 })
      .catch(() => undefined);

    await confirmApprove.click();
    const response = await approveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Approve Stock Addition gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }
    await redirected;
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    // Ending stock recalc setelah approve AI — beri waktu sebelum TE approve ship.
    await this.page.waitForTimeout(5_000);
  }

  async fillDescription(text: string): Promise<void> {
    await this.descriptionInput.fill(text);
  }

  /**
   * Set tanggal fiscal fallback agar stok seed terlihat di Available Products TE
   * (filter: latest_mutation.transaction_date <= TE.transaction_date).
   */
  async setTransactionDateFiscalFallback(): Promise<void> {
    const targetDisplay = '09-07-2026 12:00:00';
    const dpInput = this.transactionDateInput;
    if (!(await dpInput.isVisible({ timeout: 8_000 }).catch(() => false))) {
      return;
    }
    if (await dpInput.isDisabled().catch(() => false)) {
      return;
    }
    await dpInput.click({ clickCount: 3 });
    await dpInput.fill(targetDisplay);
    await dpInput.press('Enter');
    await dpInput.blur();
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(800);

    const shown = (await dpInput.inputValue().catch(() => '')).trim();
    if (!shown.startsWith('09-07-2026')) {
      await this.page.evaluate((value) => {
        const input = document.querySelector(
          'input.olshoperp-datepicker-input, input.p-datepicker-input',
        ) as HTMLInputElement | null;
        if (!input || input.disabled) return;
        input.focus();
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
        );
        input.blur();
      }, targetDisplay);
      await this.page.waitForTimeout(800);
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/adjustment-addition' ||
          pathname.endsWith('/supplychain/adjustment-addition')
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
        `Save Stock Addition gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(ADJUSTMENT_ADDITION_EDIT_PATH_PATTERN, {
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
    await expect(row, `Baris Stock Addition ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(ADJUSTMENT_ADDITION_EDIT_PATH_PATTERN, {
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
      const put = this.page
        .waitForResponse(
          (response) =>
            /\/adjustment-addition\/\d+/.test(response.url()) &&
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
          /\/adjustment-addition\/\d+/.test(response.url()) &&
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
          `Update Stock Addition gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
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
    await expect(
      row,
      `Stock Addition ${code} harus tampil di datalist`,
    ).toBeVisible({ timeout: 45_000 });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  /**
   * Tambah product via Multiselect "Select Product" (bulk-create).
   * AS-IS: product yang sudah dipakai di AI open lain → error "is used in an open Stock Addition".
   * Retry opsi berikutnya sampai sukses (max `maxAttempts`).
   */
  async addProductViaSelectProduct(
    skuQuery: string,
    maxAttempts = 8,
  ): Promise<string> {
    await this.expandStockAdditionDetail();

    let lastError = '';

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let combobox = this.selectProductCombobox;
      if (!(await combobox.isVisible({ timeout: 5_000 }).catch(() => false))) {
        const root = this.page
          .locator('#InventoryInDetail, [id="InventoryInDetail"]')
          .locator('.multiselect')
          .filter({
            has: this.page.locator('[aria-placeholder="Select Product"]'),
          })
          .first();
        await root.click();
        combobox = root.locator('.multiselect-search').first();
      }

      const bulkResponse = this.page.waitForResponse(
        (response) =>
          /adjustment-addition-detail\/\d+\/bulk-create/.test(response.url()) &&
          response.request().method() === 'POST',
        { timeout: 90_000 },
      );

      await this.multiselect.open(combobox);
      await combobox.fill('');
      await combobox.fill(skuQuery).catch(async () => {
        await combobox.pressSequentially(skuQuery, { delay: 40 });
      });
      await this.page.waitForTimeout(1_200);

      const options = this.page
        .locator('.multiselect-option:visible')
        .filter({ hasNotText: 'No results found' })
        .filter({ hasText: new RegExp(skuQuery, 'i') });

      const optionCount = await options.count();
      if (optionCount === 0) {
        throw new Error(`Tidak ada product di Select Product untuk query "${skuQuery}"`);
      }

      const optionIndex = Math.min(attempt, optionCount - 1);
      const option = options.nth(optionIndex);
      await expect(option).toBeVisible({ timeout: 15_000 });
      const strongSku = (
        (await option.locator('strong').first().textContent().catch(() => '')) ??
        ''
      ).trim();
      const optionText = ((await option.textContent()) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      const selectedSku =
        strongSku ||
        optionText.match(/^(LUMI\w+|CHARM[\w-]+|TTK[\w-]+|[A-Za-z0-9][A-Za-z0-9._-]{3,})/i)?.[1] ||
        skuQuery;
      await option.click();

      const response = await bulkResponse;
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;

      const errMsg = body?.status?.message ?? '';
      if (response.ok() && !Number(body?.status?.error ?? 0)) {
        await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
        await this.page.waitForTimeout(1_500);
        return selectedSku;
      }

      lastError = String(errMsg || `HTTP ${response.status()}`);
      // Tutup dropdown jika masih terbuka, coba SKU berikutnya
      await this.page.keyboard.press('Escape').catch(() => undefined);
      await this.page.waitForTimeout(600);

      if (!/is used in an open/i.test(lastError) && optionIndex >= optionCount - 1) {
        break;
      }
    }

    throw new Error(`Bulk-create detail gagal setelah ${maxAttempts} percobaan: ${lastError}`);
  }

  async assertDetailHasProduct(skuToken: string): Promise<Locator> {
    await this.expandStockAdditionDetail();
    const section = this.page
      .locator('#InventoryInDetail, [id="InventoryInDetail"]')
      .first();
    const scope = (await section.count()) ? section : this.page;
    const row = scope
      .locator('.p-datatable-tbody tr')
      .filter({ hasText: new RegExp(skuToken, 'i') })
      .first();
    await expect(
      row,
      `Product ${skuToken} harus ada di Stock Addition Detail`,
    ).toBeVisible({ timeout: 45_000 });
    return row;
  }

  async setInQtyOnDetailRow(
    skuToken: string,
    qty: string | number,
  ): Promise<void> {
    const row = await this.assertDetailHasProduct(skuToken);

    let input = row.locator('input.p-inputtext, input[type="text"]').first();
    if (!(await input.isVisible({ timeout: 3_000 }).catch(() => false))) {
      await row.locator('td').nth(3).dblclick().catch(() => undefined);
      input = row.locator('input').first();
    }

    await expect(input, 'In Qty input').toBeVisible({ timeout: 10_000 });

    const put = this.page
      .waitForResponse(
        (response) =>
          /adjustment-addition-detail/i.test(response.url()) &&
          ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await input.click({ clickCount: 3 });
    await input.fill(String(qty));
    await input.press('Tab');
    await put;
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }
}
