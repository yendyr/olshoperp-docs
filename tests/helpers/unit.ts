import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const UNIT_DATALIST_PATH = '/supplychain/unit';
export const UNIT_CREATE_PATH = '/supplychain/unit/create';
export const UNIT_EDIT_PATH_PATTERN = /\/supplychain\/unit\/edit\/\d+/;

export type UnitFormData = {
  code: string;
  name: string;
  unitClass: string;
  conversionRate: string;
  description?: string;
};

/**
 * POM Unit — SCM Master Data.
 * Selector dari pom-registry/unit.yaml (Form.vue + DataList.vue).
 */
export class UnitPage {
  private readonly datalist: OlshopDatalist;
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

  get unitClassCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Unit Class');
  }

  get conversionRateInput(): Locator {
    return this.page.getByPlaceholder(/e\.g:\s*1,234/i).or(
      this.page.locator('input[type="number"]').first(),
    );
  }

  get descriptionInput(): Locator {
    return this.page.locator('#Unit textarea').first();
  }

  get activeSwitch(): Locator {
    // Label "Active" + FormSwitch di sebelah kiri dalam baris flex
    return this.page
      .locator('#Unit div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get showForAllCompanySwitch(): Locator {
    return this.page
      .locator('#Unit div.flex')
      .filter({ has: this.page.getByText('Show for all company', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(UNIT_DATALIST_PATH, 'link');
  }

  /**
   * Cari code yang match pattern di datalist (mis. /^BOX-AT-/i).
   * Return code string dari baris pertama, atau null.
   */
  async findCodeInDatalist(pattern: RegExp): Promise<string | null> {
    await this.gotoDatalist();
    const filterToken = pattern.source.replace(/^\^/, '').replace(/\\-/g, '-').replace(/\$$/, '');
    await this.datalist.search(filterToken.replace(/[^A-Za-z0-9-]/g, '').slice(0, 12) || 'BOX-AT', 2_000);

    const rows = this.page.getByRole('row').filter({ hasText: pattern });
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const text = ((await rows.nth(i).innerText().catch(() => '')) || '').replace(/\s+/g, ' ');
      const match = text.match(pattern);
      if (match?.[0]) {
        // Ambil token code penuh (mis. BOX-AT-325336)
        const codeMatch = text.match(/BOX-AT-\d+/i) ?? text.match(pattern);
        if (codeMatch?.[0]) {
          return codeMatch[0];
        }
      }
    }
    return null;
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris unit ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn, `Tombol show/edit untuk ${code}`).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(UNIT_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Unit');
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async ensureShowForAllCompanyOn(): Promise<void> {
    const sw = this.showForAllCompanySwitch;
    await expect(sw, 'Toggle Show for all company').toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async updateBasicFields(data: {
    code: string;
    name: string;
    description?: string;
  }): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    if (data.description !== undefined) {
      await this.descriptionInput.fill(data.description);
    }
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/unit\/\d+/.test(response.url()) &&
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
          `Update Unit gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/supplychain\/unit\/create/, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Unit');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  /** Jika code sudah ada di datalist, return true (caller bisa ganti code). */
  async isCodeVisibleInDatalist(code: string): Promise<boolean> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    return row.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  async fillForm(data: UnitFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);

    await this.multiselect.ensureValue(this.unitClassCombobox, data.unitClass);

    await this.conversionRateInput.fill(data.conversionRate);

    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }

    await this.ensureActiveOn();
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    await expect(sw).toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/unit\/?$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { id?: number; code?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Unit gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(UNIT_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async assertUnitInDatalist(code: string, name?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Unit ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (name) {
      await expect(row).toContainText(name);
    }
  }
}
