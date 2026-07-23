import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const SO_GENERAL_DATALIST_PATH = '/businessdevelopment/sales-order-general';
export const SO_GENERAL_EDIT_PATH_PATTERN =
  /\/businessdevelopment\/sales-order-general\/edit\/\d+/;

export type SoDetailLine = {
  sku: string;
  qty: number;
  price: number;
};

/**
 * POM Dev - Sales Order (sales-order-general).
 * Menu: /businessdevelopment/sales-order-general
 * AS-IS create: fetchDefaultValues() sering auto-Save & Next → redirect edit.
 */
export class SalesOrderGeneralPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;
  private readonly multiselect: OlshopMultiselect;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
    this.multiselect = new OlshopMultiselect(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code').first();
  }

  get customerCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Customer');
  }

  get storeCombobox(): Locator {
    return this.multiselect
      .comboboxByAriaPlaceholder('Choose Store')
      .or(this.multiselect.comboboxByPlaceholderFragment('Choose Store'));
  }

  get shipperServiceCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Service');
  }

  get buyerNotesInput(): Locator {
    return this.page
      .locator('#BasicInformation textarea')
      .or(this.page.getByPlaceholder(/buyer|description|notes/i))
      .first();
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
  }

  get openStatusRadio(): Locator {
    return this.page.locator('#open');
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(SO_GENERAL_DATALIST_PATH, 'link');
  }

  async expandBasicInformation(): Promise<void> {
    await this.form.expandAccordion('Basic Information');
  }

  async expandSalesOrderDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /Sales Order Detail/i,
    });
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
  }

  /**
   * Buka Create — handle auto-redirect ke edit (default-values auto-submit).
   */
  async openCreateOrAutoEdit(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(SO_GENERAL_EDIT_PATH_PATTERN, { timeout: 90_000 })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/businessdevelopment\/sales-order-general\/create$/, {
          timeout: 90_000,
        })
        .then(() => 'create' as const),
    ]);

    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();

    if (raced === 'edit') {
      await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
      return 'edit';
    }

    // Masih create — tunggu auto-save default-values (maks 20s)
    const autoEdit = await this.page
      .waitForURL(SO_GENERAL_EDIT_PATH_PATTERN, { timeout: 20_000 })
      .then(() => true)
      .catch(() => false);

    if (autoEdit) {
      await dismissStagingBanner(this.page);
      await this.expandBasicInformation();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
      return 'edit';
    }

    await expect(this.customerCombobox).toBeVisible({ timeout: 45_000 });
    return 'create';
  }

  async selectCustomerFlexible(
    label: string,
    aliases: string[] = [],
  ): Promise<void> {
    await this.selectMultiselectByLabel(
      this.customerCombobox,
      label,
      'Customer',
      aliases,
    );
  }

  async selectStoreFlexible(label: string): Promise<void> {
    await this.selectMultiselectByLabel(this.storeCombobox, label, 'Store');
  }

  async selectShipperServiceFlexible(label: string): Promise<void> {
    await this.selectMultiselectByLabel(
      this.shipperServiceCombobox,
      label,
      'Shipper Service',
    );
  }

  /** Pilih opsi multiselect + tutup dropdown; support alias / partial search. */
  private async selectMultiselectByLabel(
    combobox: Locator,
    label: string,
    fieldName: string,
    searchAliases: string[] = [],
  ): Promise<void> {
    await expect(combobox, fieldName).toBeVisible({ timeout: 30_000 });
    const pattern = new RegExp(
      label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'i',
    );

    const singleLabel = this.multiselect
      .multiselectRoot(combobox)
      .locator('.multiselect-single-label');
    const current = ((await singleLabel.textContent().catch(() => '')) ?? '').trim();
    if (pattern.test(current)) {
      return;
    }

    const queries = [
      label,
      ...searchAliases,
      label.replace(/^(PT\.?|CV\.?)\s*/i, '').trim(),
      ...label
        .split(/\s+/)
        .filter((t) => t.length > 3 && !/^(PT\.?|CV\.?)$/i.test(t))
        .slice(-2),
    ].filter((q, i, arr) => Boolean(q) && arr.indexOf(q) === i);

    let matchedOption: Locator | null = null;
    let lastOptionsText = '';

    for (const query of queries) {
      await this.multiselect.open(combobox);
      await combobox.fill('');
      await combobox.fill(query).catch(async () => {
        await combobox.pressSequentially(query, { delay: 40 });
      });
      await this.page.waitForTimeout(1_200);

      const options = this.page
        .locator('.multiselect-option:visible')
        .filter({ hasNotText: 'No results found' });
      const count = await options.count();
      const texts: string[] = [];
      for (let i = 0; i < count; i++) {
        texts.push(
          ((await options.nth(i).textContent()) ?? '').replace(/\s+/g, ' ').trim(),
        );
      }
      lastOptionsText = texts.join(' | ');

      let hit = options.filter({ hasText: pattern }).first();
      if (await hit.isVisible({ timeout: 1_500 }).catch(() => false)) {
        matchedOption = hit;
        break;
      }

      const tokens = label
        .replace(/^(PT\.?|CV\.?)\s*/i, '')
        .split(/\s+/)
        .filter((t) => t.length > 2);
      hit = options
        .filter({
          hasText: new RegExp(
            tokens
              .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
              .join('.*'),
            'i',
          ),
        })
        .first();
      if (await hit.isVisible({ timeout: 1_000 }).catch(() => false)) {
        matchedOption = hit;
        break;
      }
    }

    if (!matchedOption) {
      throw new Error(
        `${fieldName} "${label}" tidak ditemukan. Query: ${queries.join(', ')}. Opsi: ${lastOptionsText || '(kosong)'}`,
      );
    }

    await matchedOption.click();
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.waitForTimeout(400);
    await this.page
      .getByText(fieldName, { exact: false })
      .first()
      .click({ force: true })
      .catch(() => undefined);

    const selected = (
      (await singleLabel.textContent().catch(() => '')) ??
      (await this.multiselect.selectedLabel(combobox))
    ).trim();
    expect(selected.length, `${fieldName} harus terisi`).toBeGreaterThan(2);
    const softOk =
      pattern.test(selected) ||
      label
        .replace(/^(PT\.?|CV\.?)\s*/i, '')
        .split(/\s+/)
        .filter((t) => t.length > 3)
        .some((t) =>
          new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(
            selected,
          ),
        );
    expect(
      softOk,
      `${fieldName} selected="${selected}" vs expected "${label}"`,
    ).toBeTruthy();
  }

  async fillBuyerNotes(text: string): Promise<void> {
    // Buyer Notes di Other Information (accordion nested)
    const otherInfo = this.page.getByRole('button', {
      name: /Other Information/i,
    });
    if (await otherInfo.isVisible({ timeout: 3_000 }).catch(() => false)) {
      if ((await otherInfo.getAttribute('aria-expanded')) !== 'true') {
        await otherInfo.click();
        await this.page.waitForTimeout(500);
      }
    }

    const notes = this.page
      .locator('textarea')
      .filter({ hasNot: this.page.locator('[disabled]') })
      .first()
      .or(this.buyerNotesInput);

    if (await notes.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await notes.fill(text);
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname.endsWith('/omnichannel/sales-order') &&
          !pathname.includes('/sales-order-detail') &&
          !pathname.match(/\/sales-order\/\d+/)
        );
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();
    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;

    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Save SO gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(SO_GENERAL_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /omnichannel\/sales-order\/\d+/.test(response.url()) &&
          ['POST', 'PUT'].includes(response.request().method()) &&
          !response.url().includes('sales-order-detail') &&
          !response.url().includes('transaction-status') &&
          !response.url().includes('approve'),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();
    await saveResponse;
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async readGeneratedCode(): Promise<string> {
    await expect(this.codeInput).not.toHaveValue('', { timeout: 45_000 });
    return (await this.codeInput.inputValue()).trim();
  }

  async addProductViaSelectProduct(sku: string): Promise<void> {
    await this.expandSalesOrderDetail();

    let combobox = this.selectProductCombobox;
    if (!(await combobox.isVisible({ timeout: 8_000 }).catch(() => false))) {
      const root = this.page
        .locator('#SalesOrderDetail .multiselect')
        .filter({
          has: this.page.locator('[aria-placeholder="Select Product"]'),
        })
        .first();
      await root.click();
      combobox = root.locator('.multiselect-search').first();
    }

    const createResponse = this.page.waitForResponse(
      (response) =>
        /sales-order-detail\/create-select/.test(response.url()) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox);
    await combobox.fill('');
    await combobox.fill(sku).catch(async () => {
      await combobox.pressSequentially(sku, { delay: 40 });
    });
    await this.page.waitForTimeout(1_200);

    const option = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' })
      .filter({ hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })
      .first();
    await expect(option, `Product ${sku}`).toBeVisible({ timeout: 25_000 });
    await option.click();

    const response = await createResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;

    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Select Product ${sku} gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_200);
  }

  detailRowBySku(sku: string): Locator {
    return this.page
      .locator('#SalesOrderDetail .p-datatable-tbody tr, #SalesOrderDetail tbody tr')
      .filter({
        hasText: new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      })
      .first();
  }

  /**
   * Set SO QTY + PRICE: prefer modal (placeholder e.g: 10), fallback inline.
   */
  async setQtyAndPriceForSku(
    sku: string,
    qty: number,
    price: number,
  ): Promise<void> {
    await this.expandSalesOrderDetail();
    const row = this.detailRowBySku(sku);
    await expect(row, `Baris detail ${sku}`).toBeVisible({ timeout: 30_000 });

    const editBtn = row
      .locator(
        '#updateButton, button[class*="update"], button[title*="Edit" i], button[title*="Update" i]',
      )
      .first();

    if (await editBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await editBtn.click();
    } else {
      // Action column — icon button terakhir di baris
      const actionBtn = row.locator('td').last().locator('button').first();
      if (await actionBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await actionBtn.click();
      }
    }

    const soQty = this.page.getByPlaceholder('e.g: 10').first();
    const modalOpen = await soQty.isVisible({ timeout: 5_000 }).catch(() => false);

    if (modalOpen) {
      await soQty.click({ clickCount: 3 });
      await soQty.fill(String(qty));

      // Unit Price = enabled input (Highest/Lowest/Average disabled)
      const dialog = this.page.locator('body');
      const priceInput = dialog
        .locator('input:not([disabled]):not([type="checkbox"]):not([type="hidden"])')
        .filter({ hasNot: this.page.locator('[placeholder="e.g: 10"]') });

      // Ambil input enabled di blok Price (bukan qty / discount / tax)
      let filledPrice = false;
      const candidates = this.page.locator(
        'input:not([disabled]):not([type="checkbox"]):not([type="hidden"])',
      );
      const n = await candidates.count();
      for (let i = 0; i < n; i++) {
        const el = candidates.nth(i);
        if (!(await el.isVisible().catch(() => false))) continue;
        const ph = ((await el.getAttribute('placeholder')) ?? '').toLowerCase();
        if (ph.includes('e.g: 10') || ph.includes('discount') || ph.includes('highest') || ph.includes('lowest') || ph.includes('average')) {
          continue;
        }
        const context = await el
          .evaluate((node) => {
            let cur: HTMLElement | null = node.parentElement;
            for (let d = 0; d < 5 && cur; d++) {
              const firstLine = (cur.innerText ?? '').split('\n')[0] ?? '';
              if (/^Price\b/i.test(firstLine.trim())) return firstLine;
              cur = cur.parentElement;
            }
            return '';
          })
          .catch(() => '');
        if (/^Price\b/i.test(context.trim())) {
          await el.click({ clickCount: 3 });
          await el.fill(String(price));
          filledPrice = true;
          break;
        }
      }

      if (!filledPrice) {
        // Fallback: input enabled ke-2 di modal (setelah qty)
        const enabled = this.page.locator(
          'input:not([disabled]):not([type="checkbox"]):visible',
        );
        const count = await enabled.count();
        for (let i = 0; i < count; i++) {
          const el = enabled.nth(i);
          const ph = (await el.getAttribute('placeholder')) ?? '';
          if (ph === 'e.g: 10') continue;
          await el.click({ clickCount: 3 });
          await el.fill(String(price));
          filledPrice = true;
          break;
        }
      }

      expect(filledPrice, `Price untuk ${sku}`).toBeTruthy();
      void priceInput;

      const put = this.page.waitForResponse(
        (response) =>
          /sales-order\/\d+\/sales-order-detail\/\d+/.test(response.url()) &&
          ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
        { timeout: 60_000 },
      );

      const saveBtn = this.page
        .locator('[data-modal-save]')
        .or(this.page.getByRole('button', { name: /^Save$/i }).last());
      await expect(saveBtn).toBeVisible({ timeout: 10_000 });
      await saveBtn.click();
      await put;
      await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
      await this.page.waitForTimeout(800);
      return;
    }

    await this.inlineEditNumericCells(row, String(qty), String(price));
  }

  /** Inline-edit dua nilai numerik berurutan (SO QTY lalu PRICE). */
  private async inlineEditNumericCells(
    row: Locator,
    qty: string,
    price: string,
  ): Promise<void> {
    const values = [qty, price];
    const cells = row.locator('td');
    const count = await cells.count();
    let valueIndex = 0;

    for (let i = 0; i < count && valueIndex < values.length; i++) {
      const cell = cells.nth(i);
      const text = ((await cell.textContent()) ?? '').replace(/\s+/g, ' ').trim();
      // Target cell yang terlihat numerik / kosong editable
      if (text.length > 40) continue;
      if (text && !/^[\d.,\s-]+$/.test(text) && !/^0([.,]0+)?$/.test(text)) {
        continue;
      }

      await cell.dblclick().catch(() => cell.click());
      const input = row
        .locator('input.p-inputtext, input[type="text"]:not([type="checkbox"])')
        .first();
      if (!(await input.isVisible({ timeout: 700 }).catch(() => false))) {
        continue;
      }

      const put = this.page
        .waitForResponse(
          (response) =>
            /sales-order-detail/.test(response.url()) &&
            ['PUT', 'POST', 'PATCH'].includes(response.request().method()),
          { timeout: 30_000 },
        )
        .catch(() => null);

      await input.click({ clickCount: 3 });
      await input.fill(values[valueIndex]);
      await input.press('Tab');
      const response = await put;
      if (response) {
        valueIndex += 1;
        await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
        await this.page.waitForTimeout(400);
      } else {
        await this.page.keyboard.press('Escape').catch(() => undefined);
      }
    }

    if (valueIndex < values.length) {
      throw new Error(
        `Inline edit partial: set ${valueIndex}/${values.length} (qty/price)`,
      );
    }
  }

  async selectOpenStatus(): Promise<void> {
    await this.openStatusRadio.scrollIntoViewIfNeeded();

    const patchResponse = this.page
      .waitForResponse(
        (response) =>
          /sales-order\/\d+\/transaction-status/.test(response.url()) &&
          ['PATCH', 'POST', 'PUT'].includes(response.request().method()),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.openStatusRadio.click({ force: true });
    await patchResponse;
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await expect(this.openStatusRadio).toBeChecked({ timeout: 15_000 });
    await this.page.waitForTimeout(1_500);
  }

  async approveWithNote(note = 'automation playwright'): Promise<void> {
    const approveTrigger = this.page
      .locator('button.bg-info.border-info')
      .filter({
        has: this.page.locator('.fa-check-double, [class*="check-double"]'),
      })
      .or(this.page.locator('button.bg-info.border-info').last())
      .locator('visible=true')
      .first();

    await expect(approveTrigger, 'Tombol Approve SO').toBeVisible({
      timeout: 30_000,
    });
    await approveTrigger.scrollIntoViewIfNeeded();
    await approveTrigger.click();

    // HeadlessUI dialog root sering "hidden" di Playwright — target isi modal langsung
    const noteInput = this.page.getByPlaceholder(
      /why you are approving this transaction/i,
    );
    await expect(noteInput, 'Approval note textarea').toBeVisible({
      timeout: 15_000,
    });
    await noteInput.fill(note);

    const confirmApprove = this.page
      .getByRole('button', { name: /^Approve$/i })
      .last();
    await expect(confirmApprove).toBeVisible({ timeout: 10_000 });

    const approveResponse = this.page.waitForResponse(
      (response) =>
        /omnichannel\/sales-order\/\d+\/approve/.test(response.url()) &&
        response.request().method() === 'POST',
      { timeout: 180_000 },
    );

    const redirected = this.page
      .waitForURL(/\/businessdevelopment\/sales-order-general\/?$/, {
        timeout: 120_000,
      })
      .catch(() => undefined);

    await confirmApprove.click();

    const response = await approveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;

    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Approve SO gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await redirected;
    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.page.waitForTimeout(1_000);
  }

  async assertStatusInDatalist(
    code: string,
    statusPattern: RegExp,
  ): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(statusPattern);
  }

  /**
   * Full seed: create/edit header → details → Open → Approve.
   */
  async createApprovedSo(opts: {
    customer: string;
    customerAliases?: string[];
    store: string;
    shipperService: string;
    lines: SoDetailLine[];
    description?: string;
  }): Promise<string> {
    const description = opts.description ?? 'automation playwright';

    await this.gotoDatalist();
    const mode = await this.openCreateOrAutoEdit();

    if (mode === 'create') {
      await this.selectCustomerFlexible(opts.customer, opts.customerAliases);
      await this.selectStoreFlexible(opts.store);
      await this.selectShipperServiceFlexible(opts.shipperService);
      await this.fillBuyerNotes(description);
      await this.clickSaveAndNextAndWaitForEdit();
    } else {
      await this.selectCustomerFlexible(opts.customer, opts.customerAliases);
      await this.selectStoreFlexible(opts.store);
      await this.selectShipperServiceFlexible(opts.shipperService);
      await this.fillBuyerNotes(description);
      await this.clickSaveAllAndWait();
    }

    const code = await this.readGeneratedCode();

    for (const line of opts.lines) {
      await this.addProductViaSelectProduct(line.sku);
      await this.setQtyAndPriceForSku(line.sku, line.qty, line.price);
    }

    await this.selectOpenStatus();
    try {
      await this.approveWithNote(description);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`SO ${code} Open tapi approve gagal: ${message}`);
    }

    return code;
  }
}
