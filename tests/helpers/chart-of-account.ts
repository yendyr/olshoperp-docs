import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const COA_DATALIST_PATH = '/accounting/chart-of-account';
export const COA_CREATE_PATH = '/accounting/chart-of-account/create';
export const COA_EDIT_PATH_PATTERN = /\/accounting\/chart-of-account\/edit\/\d+/;

export type CoaFormData = {
  code: string;
  name: string;
  classLabel?: string;
  description?: string;
};

/**
 * POM COA — Chart of Account (FA Master).
 * Selector: tests/pom-registry/chart-of-account.yaml
 */
export class ChartOfAccountPage {
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

  get parentCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Parent');
  }

  get classCombobox(): Locator {
    return this.multiselect.comboboxByAriaPlaceholder('Choose Class');
  }

  get descriptionInput(): Locator {
    return this.page.getByPlaceholder(
      /e\.g:\s*This chart of account describe/i,
    );
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#ChartOfAccount div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(COA_DATALIST_PATH, 'link');
  }

  async assertDatalistShell(): Promise<void> {
    await expect(this.datalist.createButton('link')).toBeVisible({
      timeout: 30_000,
    });
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /code/i }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(headers.filter({ hasText: /class/i }).first()).toBeVisible();
    await expect(headers.filter({ hasText: /position/i }).first()).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/accounting\/chart-of-account\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Chart of Account');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    await expect(sw).toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  /** Pilih Class — prefer label jika diberikan, else opsi pertama. */
  async selectClass(preferLabel?: string): Promise<string> {
    const combobox = this.classCombobox;
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(700);

    if (preferLabel) {
      await combobox.fill(preferLabel).catch(async () => {
        await combobox.pressSequentially(preferLabel, { delay: 40 });
      });
      await this.page.waitForTimeout(800);
    }

    let option = this.multiselect
      .visibleOptions()
      .filter({
        hasText: preferLabel ? new RegExp(preferLabel, 'i') : /.*/,
      })
      .first();

    if (!(await option.isVisible().catch(() => false))) {
      // Clear filter → ambil opsi pertama apa pun
      if (preferLabel) {
        await combobox.fill('').catch(() => undefined);
        await this.page.waitForTimeout(600);
      }
      option = this.multiselect.visibleOptions().first();
    }

    await expect(option, 'Opsi Class COA').toBeVisible({ timeout: 45_000 });
    const label = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(300);
    return label;
  }

  async fillCreateForm(data: CoaFormData): Promise<string> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    const classLabel = await this.selectClass(data.classLabel);
    await this.descriptionInput.fill(
      data.description ?? 'automation playwright',
    );
    await this.ensureActiveOn();
    return classLabel;
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname;
        return /\/accounting\/chart-of-account\/?$/.test(path);
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save COA gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(COA_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris COA ${code}`).toBeVisible({ timeout: 45_000 });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(COA_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Chart of Account');
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
          /\/accounting\/chart-of-account\/\d+/.test(response.url()) &&
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
          `Update COA gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
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
    await expect(row, `COA ${code} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (name) {
      await expect(row).toContainText(name);
    }
  }
}
