import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './company-access';

export const SYSTEM_PRODUCT_DATALIST_PATH = '/supplychain/product';
export const SYSTEM_PRODUCT_CREATE_PATH = '/supplychain/product/create';

const SALES_CATEGORY_LABEL = 'Sales Category';
const PRODUCT_COA_GROUP_LABEL = 'Product Coa Group';

export class SystemProductPage {
  constructor(private readonly page: Page) {}

  async gotoDatalist(): Promise<void> {
    await this.page.goto(SYSTEM_PRODUCT_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.createButton).toBeVisible({ timeout: 45_000 });
    await expect(this.page.getByRole('table').first()).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.createButton.click();
    await this.page.waitForURL(/\/supplychain\/product\/create/, {
      timeout: 45_000,
    });
    await expect(this.skuInput).toBeVisible();
  }

  async openCreateOrEditBySku(sku: string): Promise<'create' | 'edit'> {
    await this.gotoDatalist();
    await this.datalistSearchInput.fill(sku);
    await this.page.waitForTimeout(1_500);

    const existingSku = this.page.getByRole('link', { name: sku, exact: true });
    if (await existingSku.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const editPath = await existingSku.getAttribute('href');
      if (editPath) {
        await this.page.goto(editPath, { waitUntil: 'domcontentloaded' });
      } else {
        await Promise.all([
          this.page.waitForURL(/\/supplychain\/product\/edit\/\d+/, {
            timeout: 90_000,
          }),
          existingSku.click(),
        ]);
      }

      await expect(
        this.page.getByRole('button', { name: 'Save All', exact: true }),
      ).toBeVisible({ timeout: 45_000 });
      return 'edit';
    }

    await this.openCreateForm();
    return 'create';
  }

  async fillBasicInformation(sku: string, name: string): Promise<void> {
    await this.skuInput.fill(sku);
    await this.nameInput.fill(name);
    await this.nameInput.blur();
    await this.page.waitForTimeout(1_500);
  }

  async assertSalesCategoryAutoFilled(): Promise<void> {
    await this.assertComboboxFilled(this.salesCategoryCombobox, SALES_CATEGORY_LABEL);
  }

  async assertProductCoaGroupAutoFilled(): Promise<void> {
    await this.assertComboboxFilled(
      this.productCoaGroupCombobox,
      PRODUCT_COA_GROUP_LABEL,
    );
  }

  async selectRandomProductCoaGroup(): Promise<string> {
    const combobox = this.productCoaGroupCombobox;
    await combobox.click();

    const options = this.dropdownOptions;
    await expect(options.first()).toBeVisible({ timeout: 20_000 });

    const count = await options.count();
    const eligibleIndexes: number[] = [];

    for (let index = 0; index < count; index++) {
      const label = (await options.nth(index).innerText()).trim();
      if (!this.isBlockedCoaGroupOption(label)) {
        eligibleIndexes.push(index);
      }
    }

    const pool =
      eligibleIndexes.length > 0
        ? eligibleIndexes
        : Array.from({ length: count }, (_, index) => index);
    const randomIndex = pool[Math.floor(Math.random() * pool.length)];
    const selectedOption = options.nth(randomIndex);
    const label = (await selectedOption.innerText()).trim();

    await selectedOption.click();
    await this.skuInput.click();
    await this.fillAssetCategoryIfRequired();
    await expect(combobox).not.toHaveAccessibleName(/choose product coa group/i);

    return label;
  }

  async clickSaveWithCoaRetry(
    sku: string,
    name: string,
    maxAttempts = 8,
  ): Promise<void> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) {
        await this.gotoDatalist();
        await this.openCreateForm();
        await this.fillBasicInformation(sku, name);
        await this.selectRandomProductCoaGroup();
        await this.assertSalesCategoryAutoFilled();
      }

      try {
        await this.clickSave();
        return;
      } catch (error) {
        const message = String(error);
        const retryable =
          message.includes('COA Group') ||
          message.includes('coa group') ||
          message.includes('asset category');

        if (!retryable || attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }
  }

  private isBlockedCoaGroupOption(label: string): boolean {
    return /BOM|WIP|Assembly|Fix Asset|Header BOM|Return Expense/i.test(label);
  }

  private async fillAssetCategoryIfRequired(): Promise<void> {
    const assetCategory = this.page.getByPlaceholder('Choose Asset Category');

    if (!(await assetCategory.isVisible({ timeout: 2_000 }).catch(() => false))) {
      return;
    }

    await assetCategory.click();

    const options = this.dropdownOptions;
    await expect(options.first()).toBeVisible({ timeout: 20_000 });
    await options.first().click();
    await this.skuInput.click();
  }

  async clickSave(): Promise<void> {
    const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
    await saveButton.scrollIntoViewIfNeeded();
    await expect(this.productCoaGroupCombobox).not.toHaveAccessibleName(
      /choose product coa group/i,
    );

    const saveResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/supplychain/product') &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await saveButton.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: Record<string, unknown>;
    } | null;

    if (body?.status?.error) {
      throw new Error(
        `Save System Product gagal: ${body.status.message ?? JSON.stringify(body.data ?? body)}`,
      );
    }

    await this.waitForBasicInformationSaved();
  }

  async scrollToProductDetails(): Promise<void> {
    const productDetails = this.page.getByRole('button', {
      name: 'Product Details',
      exact: true,
    });
    await productDetails.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < 3; attempt++) {
      if ((await productDetails.getAttribute('aria-expanded')) === 'true') {
        break;
      }

      await productDetails.click();
      await this.page.waitForTimeout(1_000);
    }

    await expect(productDetails).toHaveAttribute('aria-expanded', 'true', {
      timeout: 20_000,
    });
  }

  async enableVariations(): Promise<void> {
    const toggle = this.enableVariationsToggle;
    await toggle.scrollIntoViewIfNeeded();

    if (!(await toggle.isChecked())) {
      await toggle.click({ force: true });
    }

    await expect(toggle).toBeChecked();
    await this.openVariantEditorIfNeeded();
    await expect(this.variantTypeDropdown).toBeVisible({ timeout: 20_000 });
  }

  private async openVariantEditorIfNeeded(): Promise<void> {
    if (await this.variantTypeDropdown.isVisible().catch(() => false)) {
      return;
    }

    const addVariant = this.page
      .locator('div')
      .filter({ hasText: 'Add New Variant' })
      .last();

    await addVariant.scrollIntoViewIfNeeded();
    await addVariant.click();
    await this.page.waitForTimeout(2_000);
  }

  async selectVariantType(variantName: string): Promise<void> {
    await this.variantTypeDropdown.click();
    await this.dropdownOptions
      .filter({ hasText: variantName })
      .first()
      .click();
    await this.page.waitForTimeout(1_000);
  }

  async selectVariantOptions(options: string[]): Promise<void> {
    const optionsContainer = this.page
      .locator('.multiselect')
      .filter({ has: this.variantOptionsDropdown })
      .first();

    for (const option of options) {
      await this.variantOptionsDropdown.click();
      await this.dropdownOptions
        .filter({ hasText: option })
        .first()
        .click();
    }

    for (const option of options) {
      await expect(optionsContainer).toContainText(option);
    }
  }

  async clickSaveAll(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save All', exact: true }).click();
    await this.waitForVariantSaveCompleted();
  }

  async searchDatalist(query: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalistSearchInput.fill(query);
    await this.page.waitForTimeout(1_500);
  }

  async assertSkuVisibleInDatalist(sku: string): Promise<void> {
    await expect(
      this.page.getByRole('link', { name: sku, exact: true }),
    ).toBeVisible({
      timeout: 45_000,
    });
  }

  async assertSkusVisibleInDatalist(skus: string[]): Promise<void> {
    for (const sku of skus) {
      await this.assertSkuVisibleInDatalist(sku);
    }
  }

  async areSkusVisibleInDatalist(skus: string[]): Promise<boolean> {
    for (const sku of skus) {
      const visible = await this.page
        .getByRole('link', { name: sku, exact: true })
        .isVisible()
        .catch(() => false);

      if (!visible) {
        return false;
      }
    }

    return true;
  }

  private get createButton(): Locator {
    return this.page.getByRole('link', { name: 'Create', exact: true });
  }

  private get datalistSearchInput(): Locator {
    return this.page.getByRole('searchbox').first();
  }

  private get skuInput(): Locator {
    return this.page.locator('#sku');
  }

  private get nameInput(): Locator {
    return this.page.locator('#name');
  }

  private get enableVariationsToggle(): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByText('Enable Variations', { exact: true }) })
      .locator('input[type="checkbox"]')
      .first();
  }

  private get variantTypeDropdown(): Locator {
    return this.page
      .locator(
        '[placeholder="e.g: Flavour"], [aria-placeholder="e.g: Flavour"], .multiselect-search[aria-placeholder*="Flavour"]',
      )
      .first();
  }

  private get variantOptionsDropdown(): Locator {
    return this.page
      .locator(
        '[placeholder="Choose Option"], [aria-placeholder="Choose Option"], .multiselect-search[aria-placeholder*="Choose Option"]',
      )
      .first();
  }

  private get dropdownOptions(): Locator {
    return this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' });
  }

  private get salesCategoryCombobox(): Locator {
    return this.page.getByRole('combobox').nth(0);
  }

  private get productCoaGroupCombobox(): Locator {
    return this.page.getByRole('combobox').nth(1);
  }

  private async assertComboboxFilled(
    combobox: Locator,
    label: string,
  ): Promise<void> {
    await expect(combobox, `${label} should be auto-filled`).toBeVisible();
    await expect(
      combobox,
      `${label} should not show empty placeholder`,
    ).not.toHaveAccessibleName(/choose (category|product coa group)/i);
    await expect(
      combobox,
      `${label} should have a selected value`,
    ).toHaveAccessibleName(/.+/);
  }

  private async waitForBasicInformationSaved(): Promise<void> {
    await this.page.waitForURL(/\/supplychain\/product\/edit\/\d+/, {
      timeout: 90_000,
    });
    await expect(
      this.page.getByRole('button', { name: 'Save All', exact: true }),
    ).toBeVisible({ timeout: 45_000 });
  }

  private async waitForVariantSaveCompleted(): Promise<void> {
    await expect(
      this.page.getByRole('button', { name: 'Save All', exact: true }),
    ).toBeEnabled({ timeout: 60_000 });

    const successToast = this.page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /success|saved|berhasil/i });

    if (await successToast.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(successToast.first()).toBeVisible();
    }
  }
}
