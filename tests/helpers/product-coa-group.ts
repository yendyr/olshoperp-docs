import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const PCG_DATALIST_PATH = '/accounting/product-coa-group';
export const PCG_EDIT_PATH_PATTERN =
  /\/accounting\/product-coa-group\/edit\/\d+/;

/** Binding wajib Purchased Item (Return Expense optional — dilewati). */
export const PURCHASED_ITEM_COA_PLACEHOLDERS = [
  'Choose Sales COA',
  'Choose Sales Return COA',
  'Choose COGS COA',
  'Choose Inventory COA',
  'Choose Operational Expense COA',
  'Choose Inventory Adjustment COA',
  'Choose Return Inventory COA',
  'Choose Unbilled Goods COA',
  'Choose Work In Progress COA',
] as const;

/**
 * POM Product COA Group (FA Master).
 * Selector: tests/pom-registry/product-coa-group.yaml
 */
export class ProductCoaGroupPage {
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

  get nameInput(): Locator {
    return this.page.locator('#name');
  }

  get typeCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Option');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#description');
  }

  get defaultSwitch(): Locator {
    return this.page
      .locator('#BasicInformation div.flex')
      .filter({
        has: this.page.getByText('Set as Default System Product', {
          exact: true,
        }),
      })
      .locator('input[type="checkbox"]')
      .first();
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#BasicInformation div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(PCG_DATALIST_PATH, 'link');
  }

  async assertDatalistShell(): Promise<void> {
    await expect(this.datalist.createButton('link')).toBeVisible({
      timeout: 30_000,
    });
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /^code$/i }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(headers.filter({ hasText: /^name$/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /^type$/i }).first()).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/accounting\/product-coa-group\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  async ensureSwitch(sw: Locator, checked: boolean): Promise<void> {
    await expect(sw).toBeVisible({ timeout: 15_000 });
    const isOn = await sw.isChecked().catch(() => false);
    if (isOn !== checked) {
      await sw.click({ force: true });
      if (checked) {
        await expect(sw).toBeChecked({ timeout: 10_000 });
      } else {
        await expect(sw).not.toBeChecked({ timeout: 10_000 });
      }
    }
  }

  async selectType(typeLabel: string): Promise<void> {
    const listResponse = this.page
      .waitForResponse(
        (response) =>
          response.request().method() === 'GET' &&
          response.url().includes('/transaction-coa-list') &&
          response.url().includes('type_id='),
        { timeout: 60_000 },
      )
      .catch(() => null);

    await this.multiselect.selectOption(this.typeCombobox, typeLabel, {
      exact: true,
      typeToFilter: typeLabel,
    });

    await listResponse;
    // Binding section muncul setelah type
    await expect(
      this.page.getByText(/COA Binding|Sales COA|Choose Sales COA/i).first(),
    ).toBeVisible({ timeout: 45_000 });
    await this.page.waitForTimeout(800);
  }

  /**
   * Pastikan Multiselect COA terisi. Skip jika sudah ada nilai (prefill).
   */
  async ensureCoaFilled(placeholder: string): Promise<void> {
    const combobox = this.multiselect.comboboxByAriaPlaceholder(placeholder);
    await expect(combobox, placeholder).toBeVisible({ timeout: 30_000 });

    const selected = await this.multiselect.selectedLabel(combobox);
    if (selected && !/^choose\b/i.test(selected) && selected.length > 0) {
      return;
    }

    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(500);

    const option = this.multiselect
      .visibleOptions()
      .filter({ hasNotText: /No results|No available/i })
      .first();
    await expect(option, `Opsi untuk ${placeholder}`).toBeVisible({
      timeout: 45_000,
    });
    await option.click();
    await this.page.waitForTimeout(400);
  }

  async fillRequiredCoaBindings(): Promise<void> {
    for (const placeholder of PURCHASED_ITEM_COA_PLACEHOLDERS) {
      const combobox = this.page.locator(
        `[aria-placeholder="${placeholder}"]`,
      );
      // Beberapa binding bisa belum render jika type beda — skip jika tidak ada
      if ((await combobox.count()) === 0) {
        continue;
      }
      await this.ensureCoaFilled(placeholder);
    }
  }

  async fillCreatePurchasedItem(data: {
    code: string;
    name: string;
    description?: string;
  }): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    await this.selectType('Purchased Item');
    await this.ensureSwitch(this.defaultSwitch, false);
    await this.ensureSwitch(this.activeSwitch, true);
    await this.fillRequiredCoaBindings();
    await this.descriptionInput.fill(
      data.description ?? 'automation playwright',
    );
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname;
        return /\/accounting\/product-coa-group\/?$/.test(path);
      },
      { timeout: 120_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Product COA Group gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(PCG_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris PCG ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(PCG_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Basic Information');
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async updateNameAndDescription(
    name: string,
    description = 'automation playwright',
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/accounting\/product-coa-group\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()),
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.form.clickSaveAll();

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (!response.ok() || body?.status?.error) {
        throw new Error(
          `Update PCG gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertInDatalist(code: string, name?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `PCG ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    if (name) {
      await expect(row).toContainText(name);
    }
  }
}
