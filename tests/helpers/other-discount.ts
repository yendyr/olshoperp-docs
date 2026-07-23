import { Page, expect, Locator } from '@playwright/test';
import { OlshopDatalist, OlshopFormActions, OlshopMultiselect } from './shared';
import { dismissStagingBanner } from './shared/staging-banner';
import { waitForSuccessToast } from './shared/toast';

export const OTHER_DISCOUNT_DATALIST_PATH = '/omni/other-discount';
export const OTHER_DISCOUNT_EDIT_PATH_PATTERN =
  /\/omni\/other-discount\/edit\/\d+/;

/**
 * POM Other Discount — Omni / FA Master.
 * Selector: tests/pom-registry/other-discount.yaml
 */
export class OtherDiscountPage {
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

  get descriptionInput(): Locator {
    return this.page.locator('#description');
  }

  get expenseCoaCombobox(): Locator {
    return this.page.locator(
      '#OtherDiscount [aria-placeholder="Choose Other Discount COA"]',
    );
  }

  get allStoresRadio(): Locator {
    return this.page.locator('#radio-all-stores');
  }

  get appliedStoreRadio(): Locator {
    return this.page.locator('#radio-applied-store');
  }

  get storeCombobox(): Locator {
    return this.page.locator(
      '#OtherDiscount [aria-placeholder="Choose Store"]',
    );
  }

  get activeSwitch(): Locator {
    return this.page
      .locator('#OtherDiscount div.flex')
      .filter({ has: this.page.getByText('Active', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  async gotoDatalist(): Promise<void> {
    await this.datalist.gotoAndWait(OTHER_DISCOUNT_DATALIST_PATH, 'link');
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
      headers.filter({ hasText: /description/i }).first(),
    ).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.datalist.clickCreate('link');
    await this.page.waitForURL(/\/omni\/other-discount\/create/, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Other Discount');
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

  async selectFirstExpenseCoa(): Promise<string> {
    const combobox = this.expenseCoaCombobox;
    await expect(combobox, 'Other Discount COA').toBeVisible({
      timeout: 30_000,
    });
    await this.multiselect.open(combobox);
    await this.page.waitForTimeout(800);

    const option = this.multiselect
      .visibleOptions()
      .filter({ hasNotText: /No results|No available/i })
      .first();
    await expect(option, 'Opsi Other Discount COA').toBeVisible({
      timeout: 45_000,
    });
    const text = ((await option.textContent()) ?? '').trim();
    await option.click();
    await this.page.waitForTimeout(400);
    return text;
  }

  async fillCreateForm(data: {
    code: string;
    name: string;
    description?: string;
  }): Promise<void> {
    await this.codeInput.fill(data.code);
    await this.nameInput.fill(data.name);
    await this.selectFirstExpenseCoa();

    // AS-IS: default create is_all_stores=false → wajib set All Stores
    await this.allStoresRadio.check({ force: true });
    await expect(this.allStoresRadio).toBeChecked({ timeout: 10_000 });

    await this.descriptionInput.fill(
      data.description ?? 'automation playwright',
    );
    await this.ensureSwitch(this.activeSwitch, true);
  }

  async waitForFormHydrated(expectedCode?: string): Promise<void> {
    await expect(this.codeInput).toBeVisible({ timeout: 30_000 });
    if (expectedCode) {
      await expect(this.codeInput).toHaveValue(expectedCode, {
        timeout: 45_000,
      });
    } else {
      await expect
        .poll(async () => (await this.codeInput.inputValue()).trim(), {
          timeout: 45_000,
          message: 'Other Discount form belum terisi (fetchDetail)',
        })
        .not.toBe('');
    }
  }

  async clickSaveAndNextAndWaitForEdit(expectedCode: string): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const path = new URL(response.url()).pathname.replace(/\/$/, '');
        return /\/omnichannel\/other-discount$/.test(path);
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
        `Save Other Discount gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
      );
    }

    await this.page.waitForURL(OTHER_DISCOUNT_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await waitForSuccessToast(this.page, 5_000).catch(() => undefined);
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Other Discount');
    await this.waitForFormHydrated(expectedCode);
  }

  async openEditFromDatalistByCode(code: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalist.search(code, 1_500);

    const row = this.page.getByRole('row').filter({ hasText: code }).first();
    await expect(row, `Baris Other Discount ${code}`).toBeVisible({
      timeout: 45_000,
    });

    const editBtn = this.datalist.editButton(row).first();
    await expect(editBtn).toBeVisible({ timeout: 30_000 });
    await editBtn.click();

    await this.page.waitForURL(OTHER_DISCOUNT_EDIT_PATH_PATTERN, {
      timeout: 45_000,
    });
    await dismissStagingBanner(this.page);
    await this.form.expandAccordion('Other Discount');
    await this.waitForFormHydrated(code);
  }

  async updateNameAndDescription(
    name: string,
    description = 'automation playwright',
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
  }

  async setAppliedStores(storeNames: string[]): Promise<void> {
    await expect(this.appliedStoreRadio).toBeVisible({ timeout: 15_000 });
    await this.appliedStoreRadio.check({ force: true });
    await expect(this.appliedStoreRadio).toBeChecked({ timeout: 10_000 });
    await expect(this.storeCombobox).toBeVisible({ timeout: 15_000 });

    for (const storeName of storeNames) {
      const already =
        (await this.page
          .locator('#OtherDiscount .multiselect-tag')
          .filter({ hasText: new RegExp(storeName, 'i') })
          .count()
          .catch(() => 0)) > 0;

      if (already) continue;

      await this.multiselect.selectOption(this.storeCombobox, storeName, {
        exact: false,
        typeToFilter: storeName,
      });
      await this.page.waitForTimeout(500);
    }

    for (const storeName of storeNames) {
      await expect(
        this.page
          .locator(
            '#OtherDiscount .multiselect-tag, #OtherDiscount .multiselect',
          )
          .filter({ hasText: new RegExp(storeName, 'i') })
          .first(),
      ).toBeVisible({ timeout: 15_000 });
    }
  }

  async clickSaveAllAndWait(): Promise<void> {
    const saveResponse = this.page
      .waitForResponse(
        (response) =>
          /\/omnichannel\/other-discount\/\d+/.test(response.url()) &&
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
          `Update Other Discount gagal: ${body?.status?.message ?? `HTTP ${response.status()}`}`,
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
    await expect(row, `Other Discount ${code} harus tampil`).toBeVisible({
      timeout: 45_000,
    });
    if (name) {
      await expect(row).toContainText(name);
    }
  }
}
