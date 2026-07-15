import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const DIMENSION_WEIGHT_DATALIST_PATH =
  '/supplychain/dimension-and-weight-label';
export const DIMENSION_WEIGHT_EDIT_PATH_PATTERN =
  /\/supplychain\/dimension-and-weight-label\/edit\/\d+/;

export type DimensionWeightFormData = {
  code: string;
  name: string;
  description?: string;
};

/**
 * POM Dimension & Weight Label — SCM Master Data.
 * Selector dari pom-registry/dimension-and-weight.yaml.
 */
export class DimensionAndWeightPage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
  }

  get codeInput(): Locator {
    return this.page.locator('#code');
  }

  get nameInput(): Locator {
    return this.page.locator('#name');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#DimensionWeight textarea').first();
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#DimensionWeight div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get showForAllCompanySwitch(): Locator {
    return this.page
      .locator('#DimensionWeight div.flex')
      .filter({ has: this.page.getByText('Show for all company', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(DIMENSION_WEIGHT_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(
      /\/supplychain\/dimension-and-weight-label\/create/,
      { timeout: 45_000 },
    );
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Dimension & Weight Label');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
  }

  async fillCreateForm(data: DimensionWeightFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    await this.ensureActiveOn();
    await this.ensureShowForAllCompanyOn();
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    await expect(sw).toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async ensureShowForAllCompanyOn(): Promise<void> {
    const sw = this.showForAllCompanySwitch;
    await expect(sw, 'Toggle Show for all company').toBeVisible({
      timeout: 15_000,
    });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/dimension-and-weight\/?$/.test(
          new URL(response.url()).pathname,
        ) && response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Dimension & Weight Label gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(DIMENSION_WEIGHT_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Dimension & Weight Label ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(DIMENSION_WEIGHT_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Dimension & Weight Label');
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
          /\/supplychain\/dimension-and-weight\/\d+/.test(response.url()) &&
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
          `Update Dimension & Weight Label gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(code: string, name?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(
      row,
      `Dimension & Weight Label ${code} harus tampil di datalist`,
    ).toBeVisible({ timeout: 45_000 });
    if (name) {
      await expect(row).toContainText(name);
    }
  }
}
