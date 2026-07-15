import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const MUTATION_TRANSFER_SCRAP_DATALIST_PATH =
  '/supplychain/mutation-transfer-scrap';
export const MUTATION_TRANSFER_SCRAP_EDIT_PATH_PATTERN =
  /\/supplychain\/mutation-transfer-scrap\/edit\/\d+/;

/**
 * POM Transfer Broken / Transfer Scrap (mutation-transfer-scrap).
 * Selector: tests/pom-registry/mutation-transfer-scrap.yaml
 *
 * UI: Transfer Broken · /supplychain/mutation-transfer-scrap · prefix TFS*
 * AS-IS: TIDAK ada fetchDefaultValues auto-create — wajib isi Origin+Destination.
 * Description disabled on edit (is_edit). Detail: Select Product → bulk-fifo scrap.
 */
export class MutationTransferScrapPage {
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
      .or(this.page.getByPlaceholder('Automatically generate by system'))
      .first();
  }

  get originCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Building Origin');
  }

  get destinationCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Location');
  }

  get descriptionInput(): Locator {
    return this.page
      .getByPlaceholder('Add description or notes...')
      .or(this.page.locator('#BasicInformation textarea'))
      .first();
  }

  get selectProductCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Select Product');
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

  async gotoDatalist(): Promise<void> {
    // AS-IS: DataList Scrap TIDAK punya slot Create (beda TFI) — jangan assert Create
    await this.page.goto(MUTATION_TRANSFER_SCRAP_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.datalist.table).toBeVisible({ timeout: 45_000 });
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    // AS-IS: create via deep-link (tidak ada tombol Create di datalist)
    await this.page.goto(`${MUTATION_TRANSFER_SCRAP_DATALIST_PATH}/create`, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);

    const raced = await Promise.race([
      this.page
        .waitForURL(MUTATION_TRANSFER_SCRAP_EDIT_PATH_PATTERN, {
          timeout: 15_000,
        })
        .then(() => 'edit' as const)
        .catch(() => null),
      this.page
        .waitForURL(/\/supplychain\/mutation-transfer-scrap\/create$/, {
          timeout: 45_000,
        })
        .then(() => 'create' as const),
    ]);

    if (raced === 'edit') {
      await this.expandBasicInformation();
      await expect(this.codeInput).not.toHaveValue('', { timeout: 30_000 });
      return 'edit';
    }

    await this.expandBasicInformation();
    await expect(this.originCombobox).toBeVisible({ timeout: 45_000 });
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

  async expandProductTransferDetail(): Promise<void> {
    const btn = this.page.getByRole('button', {
      name: /Product Transfer Detail/i,
    });
    await expect(btn.first()).toBeVisible({ timeout: 45_000 });
    if ((await btn.first().getAttribute('aria-expanded')) !== 'true') {
      await btn.first().click();
      await this.page.waitForTimeout(700);
    }
  }

  async ensureOriginSelected(): Promise<string> {
    const current = await this.multiselect.selectedLabel(this.originCombobox);
    if (current && !/^choose|^e\.g:/i.test(current) && current.length > 2) {
      return current;
    }

    await this.multiselect.open(this.originCombobox);
    await this.page.waitForTimeout(800);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Minimal 1 Building Origin').toBeVisible({
      timeout: 25_000,
    });
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(1_200);
    return text;
  }

  /**
   * Origin In Transit / DropOFF / Outrack + Destination yang label-nya Scrap.
   * AS-IS store Scrap Controller: generateCode tetap TFI (bukan TFS) — di luar scope FE.
   */
  async ensureOriginAndScrapDestination(): Promise<{
    origin: string;
    destination: string;
  }> {
    const searchTerms = ['In Transit', 'DropOFF', 'Outrack', 'Transit'];

    for (const term of searchTerms) {
      await this.multiselect.open(this.originCombobox);
      await this.originCombobox.fill('');
      await this.originCombobox.pressSequentially(term, { delay: 40 });
      await this.page.waitForTimeout(1_200);

      const count = await this.multiselect.visibleOptions().count();
      if (count === 0) {
        await this.page.keyboard.press('Escape').catch(() => undefined);
        continue;
      }

      const maxTry = Math.min(count, 6);
      for (let i = 0; i < maxTry; i++) {
        await this.multiselect.open(this.originCombobox);
        let shown = await this.multiselect.visibleOptions().count();
        if (shown === 0) {
          await this.originCombobox.fill('');
          await this.originCombobox.pressSequentially(term, { delay: 40 });
          await this.page.waitForTimeout(1_000);
          shown = await this.multiselect.visibleOptions().count();
        }
        if (i >= shown) break;

        const opt = this.multiselect.visibleOptions().nth(i);
        const originText = ((await opt.textContent()) ?? '').trim();
        await opt.click();
        await this.page.waitForTimeout(1_500);

        await this.multiselect.open(this.destinationCombobox);
        // Filter opsi Scrap (select2 scrap destination AS-IS tidak ketat)
        await this.destinationCombobox.fill('');
        await this.destinationCombobox.pressSequentially('Scrap', { delay: 40 });
        await this.page.waitForTimeout(1_200);

        const destOpt = this.multiselect
          .visibleOptions()
          .filter({ hasText: /scrap/i })
          .first();
        const destOk = await destOpt
          .isVisible({ timeout: 5_000 })
          .catch(() => false);
        if (destOk) {
          const destText = ((await destOpt.textContent()) ?? '').trim();
          await destOpt.click();
          await this.page.waitForTimeout(800);
          return { origin: originText, destination: destText };
        }

        await this.page.keyboard.press('Escape').catch(() => undefined);
      }
    }

    throw new Error(
      'Tidak ada pair Origin + Destination Scrap (cari In Transit/DropOFF → WH Scrap*)',
    );
  }

  async ensureDestinationSelected(): Promise<string> {
    const current = await this.multiselect.selectedLabel(
      this.destinationCombobox,
    );
    if (current && !/^choose|^e\.g:/i.test(current) && current.length > 2) {
      return current;
    }

    await this.multiselect.open(this.destinationCombobox);
    await this.page.waitForTimeout(1_000);
    const option = this.multiselect.visibleOptions().first();
    await expect(
      option,
      'Minimal 1 Location Destination (scrap)',
    ).toBeVisible({ timeout: 30_000 });
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(800);
    return text;
  }

  async setTransactionDateFiscalFallback(): Promise<void> {
    const targetDisplay = '09-07-2026 12:00:00';
    const dpInput = this.transactionDateInput;
    await expect(dpInput).toBeVisible({ timeout: 15_000 });
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
        if (!input) return;
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

  async fillDescription(text: string): Promise<void> {
    await expect(this.descriptionInput).toBeVisible({ timeout: 15_000 });
    if (await this.descriptionInput.isDisabled().catch(() => false)) {
      return;
    }
    await this.descriptionInput.fill(text);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/mutation-transfer-scrap' ||
          pathname.endsWith('/supplychain/mutation-transfer-scrap')
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
        `Save Transfer Broken gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(MUTATION_TRANSFER_SCRAP_EDIT_PATH_PATTERN, {
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

  async gotoEditUrl(editUrl: string): Promise<void> {
    await this.page.goto(editUrl, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Transfer Broken ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const codeLink = row
      .getByRole('link', { name: code, exact: true })
      .or(
        row.locator(`a[href*="/supplychain/mutation-transfer-scrap/edit/"]`),
      )
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

    await expect(this.page).toHaveURL(MUTATION_TRANSFER_SCRAP_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async clickSaveAllAndWait(): Promise<void> {
    const waitPut = () =>
      this.page.waitForResponse(
        (response) =>
          /\/mutation-transfer-scrap\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('detail'),
        { timeout: 90_000 },
      );

    let saveResponse = waitPut().catch(() => null);
    await this.form.clickSaveAll();
    let response = await saveResponse;

    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      const msg = String(body?.status?.message ?? '');
      if (/duplicate request/i.test(msg)) {
        await this.page.waitForTimeout(3_500);
        saveResponse = waitPut().catch(() => null);
        await this.form.clickSaveAll();
        response = await saveResponse;
      }
    }

    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number | string; message?: string };
      } | null;
      if (!response.ok() || Number(body?.status?.error ?? 0)) {
        throw new Error(
          `Update Transfer Broken gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  /** AS-IS: description locked on edit — update via status Open jika tersedia. */
  async ensureStatusOpen(): Promise<void> {
    const open = this.page.locator('#open');
    if (!(await open.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }
    if (await open.isChecked().catch(() => false)) {
      return;
    }

    const put = this.page
      .waitForResponse(
        (response) =>
          /\/mutation-transfer-scrap\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('detail'),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await open.check({ force: true });
    await put;
    await waitForSuccessToast(this.page, 8_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertInDatalist(
    code: string,
    descriptionSnippet?: string,
  ): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.searchInput.fill('');
    await this.page.waitForTimeout(800);
    await this.datalist.search(code, 2_000);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Transfer Broken ${code} di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  /** Select Product → transfer-scrap-middle-detail/bulk-fifo. */
  async selectFirstAvailableProduct(): Promise<string> {
    await this.expandProductTransferDetail();
    const combobox = this.selectProductCombobox;
    await expect(combobox).toBeVisible({ timeout: 45_000 });

    const bulkResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /transfer-scrap-middle-detail\/bulk-fifo/.test(response.url()),
      { timeout: 90_000 },
    );

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(800);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Opsi Select Product (available di origin)').toBeVisible(
      { timeout: 45_000 },
    );

    const strong = option.locator('strong').first();
    const sku = (
      (await strong.textContent().catch(() => '')) ??
      (await option.textContent()) ??
      ''
    ).trim();
    await option.click();

    const response = await bulkResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number | string; message?: string };
    } | null;
    if (!response.ok() || Number(body?.status?.error ?? 0)) {
      throw new Error(
        `Select Product gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await waitForSuccessToast(this.page, 15_000).catch(() => undefined);
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.page.mouse.click(8, 8).catch(() => undefined);
    await this.page.waitForTimeout(1_200);
    return sku.split(/\s+/)[0] || sku.slice(0, 32);
  }

  async assertDetailHasProduct(skuToken: string): Promise<void> {
    await this.expandProductTransferDetail();
    const token = skuToken.slice(0, 32).trim();
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tableRow = this.page
      .locator(
        '#DatalistDetail .p-datatable-tbody tr, #DatalistDetail tbody tr',
      )
      .filter({ hasText: new RegExp(escaped, 'i') })
      .locator('visible=true')
      .first();
    await expect(
      tableRow,
      `Product ${token} harus ada di Product Transfer Detail table`,
    ).toBeVisible({ timeout: 45_000 });
  }
}
