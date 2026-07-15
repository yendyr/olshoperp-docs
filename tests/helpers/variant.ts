import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const VARIANT_DATALIST_PATH = '/supplychain/variant';
export const VARIANT_EDIT_PATH_PATTERN = /\/supplychain\/variant\/edit\/\d+/;

export type VariantFormData = {
  code: string;
  name: string;
  options: string[];
  description?: string;
};

/**
 * POM Variant Group — SCM Master Data.
 * Selector dari pom-registry/variant.yaml.
 */
export class VariantPage {
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

  get optionCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Option');
  }

  get optionMultiselectRoot(): Locator {
    return this.multiselect.multiselectRoot(this.optionCombobox);
  }

  get optionTags(): Locator {
    return this.optionMultiselectRoot.locator('.multiselect-tag');
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#VariantGroup div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(VARIANT_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/supplychain\/variant\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Variant Group');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Tambah Option Name: ketik lalu Enter (createOption tags mode).
   */
  async addOptionByEnter(optionName: string): Promise<void> {
    const combobox = this.optionCombobox;
    await combobox.scrollIntoViewIfNeeded();
    await combobox.click();
    await combobox.fill(optionName).catch(async () => {
      await combobox.pressSequentially(optionName, { delay: 40 });
    });
    await this.page.waitForTimeout(400);

    // Prefer create-option row jika muncul, else Enter
    const createOpt = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: new RegExp(optionName, 'i') })
      .first();
    if (await createOpt.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await createOpt.click({ force: true });
    } else {
      await combobox.press('Enter');
    }

    await expect(
      this.optionTags.filter({ hasText: optionName }).first(),
      `Tag option "${optionName}" harus muncul`,
    ).toBeVisible({ timeout: 15_000 });
  }

  async removeOptionTag(optionName: string): Promise<void> {
    const tag = this.optionTags.filter({ hasText: optionName }).first();
    await expect(tag, `Tag "${optionName}" sebelum dihapus`).toBeVisible({
      timeout: 15_000,
    });
    const remove = tag.locator('.multiselect-tag-remove, .multiselect-tag-remove-icon').first();
    await remove.click();
    await this.page.waitForTimeout(400);
    await expect(
      this.optionTags.filter({ hasText: optionName }),
      `Tag "${optionName}" sudah dihapus`,
    ).toHaveCount(0);
  }

  async fillCreateForm(data: VariantFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);

    for (const opt of data.options) {
      await this.addOptionByEnter(opt);
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
        /\/supplychain\/variant\/?$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Variant Group gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(VARIANT_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Variant Group ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(VARIANT_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Variant Group');
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async updateBasicFields(data: { code: string; name: string }): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/variant\/\d+/.test(response.url()) &&
          ['PUT', 'POST'].includes(response.request().method()) &&
          !response.url().includes('inline-update-option'),
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
          `Update Variant Group gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(
    code: string,
    options?: { name?: string; optionPresent?: string; optionAbsent?: string },
  ): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Variant Group ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (options?.name) {
      await expect(row).toContainText(options.name);
    }
    if (options?.optionPresent) {
      await expect(row).toContainText(options.optionPresent);
    }
    if (options?.optionAbsent) {
      await expect(row).not.toContainText(options.optionAbsent);
    }
  }
}
