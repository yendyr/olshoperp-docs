import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const MUTATION_TRANSFER_EXTERNAL_DATALIST_PATH =
  '/supplychain/mutation-transfer-external';
export const MUTATION_TRANSFER_EXTERNAL_EDIT_PATH_PATTERN =
  /\/supplychain\/mutation-transfer-external\/edit\/\d+/;

/**
 * POM External Transfer (mutation-transfer-external).
 * Selector: tests/pom-registry/mutation-transfer-external.yaml
 *
 * UI+API: /supplychain/mutation-transfer-external · prefix TFE*
 * Origin + Destination · Select Product → transfer-external-middle-detail/bulk-fifo
 * Transit: in transit → delivered (approve 2 tahap — di luar scope CREATE/UPDATE).
 */
export class MutationTransferExternalPage {
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
    return this.multiselect
      .comboboxByAriaPlaceholder('Choose Origin')
      .or(this.multiselect.comboboxByAriaPlaceholder('Choose Building Origin'))
      .first();
  }

  get destinationCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Location');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#BasicInformation textarea').first();
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
    await this.datalist.gotoAndWait(
      MUTATION_TRANSFER_EXTERNAL_DATALIST_PATH,
      'link',
    );
  }

  async openCreateForm(): Promise<'create' | 'edit'> {
    await this.datalist.clickCreate('link');

    const raced = await Promise.race([
      this.page
        .waitForURL(MUTATION_TRANSFER_EXTERNAL_EDIT_PATH_PATTERN, {
          timeout: 90_000,
        })
        .then(() => 'edit' as const),
      this.page
        .waitForURL(/\/supplychain\/mutation-transfer-external\/create$/, {
          timeout: 90_000,
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
    await expect(this.originCombobox).toBeVisible({ timeout: 45_000 });

    const autoEdit = await this.page
      .waitForURL(MUTATION_TRANSFER_EXTERNAL_EDIT_PATH_PATTERN, {
        timeout: 10_000,
      })
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
    await this.page.waitForTimeout(600);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Minimal 1 Origin').toBeVisible({ timeout: 25_000 });
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(1_000);
    return text;
  }

  async ensureDestinationSelected(): Promise<string> {
    const current = await this.multiselect.selectedLabel(
      this.destinationCombobox,
    );
    if (current && !/^choose|^e\.g:/i.test(current) && current.length > 2) {
      return current;
    }

    await this.multiselect.open(this.destinationCombobox);
    await this.page.waitForTimeout(800);
    const option = this.multiselect.visibleOptions().first();
    await expect(option, 'Minimal 1 Destination (Location)').toBeVisible({
      timeout: 25_000,
    });
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
    await this.descriptionInput.fill(text);
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        return (
          pathname === '/api/supplychain/mutation-transfer-external' ||
          pathname.endsWith('/supplychain/mutation-transfer-external')
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
        `Save External Transfer gagal: ${body?.status?.message ?? JSON.stringify(body) ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(MUTATION_TRANSFER_EXTERNAL_EDIT_PATH_PATTERN, {
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
    await expect(row, `Baris External Transfer ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const codeLink = row
      .getByRole('link', { name: code, exact: true })
      .or(
        row.locator(
          `a[href*="/supplychain/mutation-transfer-external/edit/"]`,
        ),
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

    await expect(this.page).toHaveURL(
      MUTATION_TRANSFER_EXTERNAL_EDIT_PATH_PATTERN,
      { timeout: 45_000 },
    );
    await dismissStagingBanner(this.page);
    await this.expandBasicInformation();
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async clickSaveAllAndWait(): Promise<void> {
    const waitPut = () =>
      this.page.waitForResponse(
        (response) =>
          /\/mutation-transfer-external\/\d+/.test(response.url()) &&
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
          `Update External Transfer gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
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
    await expect(row, `External Transfer ${code} di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (descriptionSnippet) {
      await expect(row).toContainText(descriptionSnippet);
    }
  }

  /** Select Product → transfer-external-middle-detail/bulk-fifo. */
  async selectFirstAvailableProduct(): Promise<string> {
    await this.expandProductTransferDetail();
    const combobox = this.selectProductCombobox;
    await expect(combobox).toBeVisible({ timeout: 45_000 });

    const bulkResponse = this.page.waitForResponse(
      (response) =>
        response.request().method() === 'POST' &&
        /transfer-external-middle-detail\/bulk-fifo/.test(response.url()),
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
