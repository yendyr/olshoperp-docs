import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const ASC_DATALIST_PATH = '/accounting/asset-category';
export const ASC_EDIT_PATH_PATTERN = /\/accounting\/asset-category\/edit\/\d+/;

export type AssetCategoryFormData = {
  code: string;
  name: string;
  description?: string;
  depreciationMethodLabel?: string;
  frequency?: number;
  totalDepreciation?: number;
  salvagePercent?: number;
  postingDate?: number;
};

/**
 * POM Asset Category — FA Master.
 * Selector: tests/pom-registry/asset-category.yaml
 */
export class AssetCategoryPage {
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
    return this.page.locator('#AssetCategory textarea').first();
  }

  get methodMultiselect(): Locator {
    return this.page.locator('#AssetCategory .multiselect').first();
  }

  get methodCombobox(): Locator {
    return this.methodMultiselect
      .locator('[aria-placeholder], .multiselect-search, .multiselect-placeholder')
      .first()
      .or(this.methodMultiselect);
  }

  async waitForDepreciationMethodsLoaded(): Promise<void> {
    const ms = this.methodMultiselect;
    await expect(ms).toBeVisible({ timeout: 30_000 });
    await expect
      .poll(
        async () => {
          const text = ((await ms.textContent()) ?? '').trim();
          return !/Loading/i.test(text);
        },
        { timeout: 45_000, message: 'Depreciation methods masih Loading' },
      )
      .toBe(true);
  }

  async selectDepreciationMethod(label: string): Promise<void> {
    await this.waitForDepreciationMethodsLoaded();
    const ms = this.methodMultiselect;
    const current = ((await ms.textContent()) ?? '').trim();
    if (new RegExp(label, 'i').test(current)) {
      return;
    }

    await ms.click();
    await this.page.waitForTimeout(400);

    const option = this.page
      .locator('.multiselect-dropdown:visible .multiselect-option, .multiselect-option:visible')
      .filter({ hasText: new RegExp(label, 'i') })
      .filter({ hasNotText: /No results|No available/i })
      .first();

    await expect(option, `Opsi method ${label}`).toBeVisible({ timeout: 20_000 });
    await option.click();
    await this.page.waitForTimeout(300);

    await expect
      .poll(async () => ((await ms.textContent()) ?? '').trim(), {
        timeout: 15_000,
        message: `Method harus jadi ${label}`,
      })
      .toMatch(new RegExp(label, 'i'));
  }

  get frequencyInput(): Locator {
    return this.page.locator('#frequency_of_depreciation');
  }

  get totalDepreciationInput(): Locator {
    return this.page.locator('#total_number_of_depreciation');
  }

  get salvageInput(): Locator {
    return this.page.locator('#salvage_value_percentage');
  }

  get postingDateInput(): Locator {
    return this.page.locator('#depreciation_posting_date');
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#AssetCategory div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get bulkDeleteButton(): Locator {
    return this.page.locator('button.delete-bulk').first();
  }

  get showDeletedSwitch(): Locator {
    return this.page.locator('#show_deleted_switch');
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(ASC_DATALIST_PATH, 'link');
  }

  async assertDatalistShell(): Promise<void> {
    await expect(this.datalist.createButton('link')).toBeVisible({
      timeout: 30_000,
    });
    const headers = this.datalist.table.getByRole('columnheader');
    await expect(headers.filter({ hasText: /code/i }).first()).toBeVisible({
      timeout: 30_000,
    });
    await expect(headers.filter({ hasText: /name/i }).first()).toBeVisible();
    await expect(
      headers.filter({ hasText: /depreciation method/i }).first(),
    ).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/accounting\/asset-category\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Asset Category');
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
    await this.waitForDepreciationMethodsLoaded();
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    await expect(sw).toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async fillCreateForm(data: AssetCategoryFormData): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    await this.descriptionInput.fill(
      data.description ?? 'automation playwright',
    );
    await this.selectDepreciationMethod(
      data.depreciationMethodLabel ?? 'Straight Line',
    );
    await this.frequencyInput.fill(String(data.frequency ?? 1));
    await this.totalDepreciationInput.fill(
      String(data.totalDepreciation ?? 12),
    );
    await this.salvageInput.fill(String(data.salvagePercent ?? 10));
    await this.postingDateInput.fill(String(data.postingDate ?? 1));
    await this.ensureActiveOn();
  }

  /** Create = Save All → redirect edit. */
  async clickSaveAllAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname;
        return /\/accounting\/asset-categories\/?$/.test(path);
      },
      { timeout: 90_000 },
    );

    await this.form.clickSaveAll();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Asset Category gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(ASC_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Asset Category').catch(() => undefined);
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.setShowDeletedData(false);
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Asset Category ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(ASC_EDIT_PATH_PATTERN, { timeout: 45_000 });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Asset Category');
    await expect(this.codeInput).toHaveValue(code, { timeout: 30_000 });
  }

  async updateNameMethodSalvage(data: {
    name: string;
    depreciationMethodLabel: string;
    salvagePercent: number;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.selectDepreciationMethod(data.depreciationMethodLabel);
    await this.salvageInput.fill(String(data.salvagePercent));
    await this.descriptionInput.fill('automation playwright');
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/accounting\/asset-categories\/\d+/.test(response.url()) &&
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
          `Update Asset Category gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertInDatalist(code: string, name?: string): Promise<void> {
    await this.gotoDatalist();
    await this.setShowDeletedData(false);
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Asset Category ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    if (name) {
      await expect(row).toContainText(name);
    }
  }

  async setShowDeletedData(on: boolean): Promise<void> {
    const sw = this.showDeletedSwitch;
    if (!(await sw.isVisible({ timeout: 5_000 }).catch(() => false))) {
      return;
    }
    const checked = await sw.isChecked().catch(() => false);
    if (checked !== on) {
      await sw.click({ force: true });
      await this.page.waitForTimeout(1_500);
    }
  }

  async softDeleteByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.setShowDeletedData(false);
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris ${code} untuk delete`).toBeVisible({
      timeout: 45_000,
    });

    const checkbox = row.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible({ timeout: 15_000 });
    if (!(await checkbox.isChecked().catch(() => false))) {
      await checkbox.check({ force: true });
    }
    await this.page.waitForTimeout(400);

    await expect(this.bulkDeleteButton).toBeVisible({ timeout: 15_000 });
    await this.bulkDeleteButton.scrollIntoViewIfNeeded();
    await this.bulkDeleteButton.click();

    const confirmDelete = this.page
      .getByRole('button', { name: /^Delete$/i })
      .last();
    await expect(confirmDelete).toBeVisible({ timeout: 15_000 });

    const deleteResponse = this.page.waitForResponse(
      (response) =>
        (response.url().includes('bulk-delete') ||
          /\/accounting\/asset-categories\/\d+/.test(response.url())) &&
        ['DELETE', 'POST'].includes(response.request().method()),
      { timeout: 90_000 },
    );

    await confirmDelete.click();
    const response = await deleteResponse;
    if (!response.ok()) {
      throw new Error(`Soft delete gagal: HTTP ${response.status()}`);
    }
    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertNotInActiveDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.setShowDeletedData(false);
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code });
    await expect(row, `${code} tidak boleh tampil (aktif)`).toHaveCount(0, {
      timeout: 45_000,
    });
  }

  async assertInDeletedDatalist(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.setShowDeletedData(true);
    await this.datalist.search(code, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Deleted ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
  }

  async openAuditLog(): Promise<void> {
    const nav = this.page.getByText('Audit Log', { exact: true }).first();
    await expect(nav).toBeVisible({ timeout: 20_000 });
    await nav.click();
    await expect(
      this.page.getByRole('heading', { name: /Audit Log/i }).first(),
    ).toBeVisible({ timeout: 20_000 });
  }
}
