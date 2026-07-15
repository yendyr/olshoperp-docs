import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const WAREHOUSE_TYPE_DATALIST_PATH = '/supplychain/warehouse-type';
export const WAREHOUSE_TYPE_EDIT_PATH_PATTERN =
  /\/supplychain\/warehouse-type\/edit\/\d+/;

export type WarehouseLevelFormData = {
  name: string;
  level: string;
  description?: string;
};

/**
 * POM Warehouse Level (route warehouse-type) — SCM Master Data.
 * Selector dari pom-registry/warehouse-type.yaml.
 */
export class WarehouseTypePage {
  readonly datalist: OlshopDatalist;
  private readonly form: OlshopFormActions;

  constructor(private readonly page: Page) {
    this.datalist = new OlshopDatalist(page);
    this.form = new OlshopFormActions(page);
  }

  get nameInput(): Locator {
    return this.page.locator('#name');
  }

  get levelInput(): Locator {
    return this.page.locator('#level');
  }

  get descriptionInput(): Locator {
    return this.page.locator('#description');
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#WarehouseLevel div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  get showInReportsSwitch(): Locator {
    return this.page
      .locator('#WarehouseLevel div.flex')
      .filter({ has: this.page.getByText('Show in Reports', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(WAREHOUSE_TYPE_DATALIST_PATH, 'link');
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/supplychain\/warehouse-type\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Warehouse Level');
    await expect(this.nameInput).toBeVisible({ timeout: 30_000 });
  }

  async isNameVisibleInDatalist(name: string): Promise<boolean> {
    await this.gotoDatalist();
    await this.datalist.search(name, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: name }).first();
    return row.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  /** Cek apakah angka level sudah dipakai (kolom LEVEL di datalist). */
  async isLevelVisibleInDatalist(level: string): Promise<boolean> {
    await this.gotoDatalist();
    await this.datalist.search(level, 1_500);
    const rows = this.page.getByRole('row').filter({ hasText: level });
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const text = ((await rows.nth(i).innerText().catch(() => '')) || '').replace(
        /\s+/g,
        ' ',
      );
      // Match cell level sebagai token (hindari false positive di description)
      if (new RegExp(`(?:^|\\s)${level}(?:\\s|$)`).test(text)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Prefer preferredLevel; jika sudah dipakai, cari level bebas tinggi (88xx).
   */
  async resolveAvailableLevel(preferredLevel: string): Promise<string> {
    if (!(await this.isLevelVisibleInDatalist(preferredLevel))) {
      return preferredLevel;
    }
    for (let i = 0; i < 20; i++) {
      const candidate = String(8800 + (Date.now() % 100) + i);
      if (!(await this.isLevelVisibleInDatalist(candidate))) {
        return candidate;
      }
    }
    return String(89000 + (Date.now() % 1000));
  }

  async fillCreateForm(data: WarehouseLevelFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.levelInput.fill(data.level);
    if (data.description) {
      await this.descriptionInput.fill(data.description);
    }
    await this.ensureActiveOn();
    await this.ensureShowInReportsOn();
  }

  async ensureActiveOn(): Promise<void> {
    const sw = this.activeSwitch;
    await expect(sw).toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  async ensureShowInReportsOn(): Promise<void> {
    const sw = this.showInReportsSwitch;
    await expect(sw, 'Toggle Show in Reports').toBeVisible({ timeout: 15_000 });
    if (!(await sw.isChecked().catch(() => false))) {
      await sw.click({ force: true });
      await expect(sw).toBeChecked({ timeout: 10_000 });
    }
  }

  /** Create UI = Save & Next → redirect edit. */
  async clickSaveAndNextAndWaitForEdit(): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        /\/supplychain\/warehouse-type\/?$/.test(new URL(response.url()).pathname) &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.form.clickSaveAndNext();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: { id?: number; name?: string; level?: number | string };
    } | null;

    if (!response.ok() || body?.status?.error) {
      throw new Error(
        `Save Warehouse Level gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(WAREHOUSE_TYPE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await dismissStagingBanner(this.page);
  }

  async openEditFromDatalistByName(name: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(name, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: name }).first();
    await expect(row, `Baris Warehouse Level ${name}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(WAREHOUSE_TYPE_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Warehouse Level');
    await expect(this.nameInput).toHaveValue(name, { timeout: 30_000 });
  }

  async updateBasicFields(data: {
    name: string;
    level: string;
    description?: string;
  }): Promise<void> {
    await this.nameInput.fill(data.name);
    // Level bisa disabled jika have_relation — biarkan gagal jelas
    await expect(this.levelInput).toBeEnabled({ timeout: 10_000 });
    await this.levelInput.fill(data.level);
    if (data.description !== undefined) {
      await this.descriptionInput.fill(data.description);
    }
  }

  /**
   * Edit UI = Save All (TC update menyebut Save & Next — AS-IS berbeda).
   */
  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/supplychain\/warehouse-type\/\d+/.test(response.url()) &&
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
          `Update Warehouse Level gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    await waitForSuccessToast(this.page, 10_000).catch(() => undefined);
    await this.page.waitForTimeout(1_000);
  }

  async assertInDatalist(name: string, level?: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(name, 1_500);
    const row = this.page.getByRole('row').filter({ hasText: name }).first();
    await expect(row, `Warehouse Level ${name} harus tampil di datalist`).toBeVisible({
      timeout: 45_000,
    });
    if (level) {
      await expect(row).toContainText(level);
    }
  }
}
