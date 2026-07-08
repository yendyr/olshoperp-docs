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

  async assertAndEnsureSalesCategory(expectedLabel: string): Promise<void> {
    const combobox = this.salesCategoryCombobox;
    const pattern = this.labelToFlexiblePattern(expectedLabel);
    const current = await this.getMultiselectSelectedLabel(combobox);

    if (pattern.test(current)) {
      return;
    }

    await this.skuInput.click();
    await combobox.scrollIntoViewIfNeeded();
    await combobox.click();
    await expect(combobox).toHaveAttribute('aria-expanded', 'true', { timeout: 15_000 });

    // List panjang — ketik "Hobbies" lalu pilih opsi exact dari master data DEV-STG.
    await combobox.pressSequentially('Hobbies', { delay: 80 });
    await this.page.waitForTimeout(500);

    const option = this.page.getByRole('option', { name: expectedLabel, exact: true });
    await expect(option, `Opsi Sales Category "${expectedLabel}" harus ada`).toBeVisible({
      timeout: 15_000,
    });
    await option.click();

    await this.skuInput.click();
    await this.page.waitForTimeout(300);

    const selected = await this.getMultiselectSelectedLabel(combobox);
    expect(selected, `Sales Category harus "${expectedLabel}"`).toMatch(pattern);
  }

  async assertAndEnsureProductCoaGroup(expectedLabel: string): Promise<void> {
    await this.assertComboboxFilled(
      this.productCoaGroupCombobox,
      PRODUCT_COA_GROUP_LABEL,
    );
    await this.ensureComboboxValue(this.productCoaGroupCombobox, expectedLabel);
    await this.fillAssetCategoryIfRequired();
  }

  async clearProductAliasName(): Promise<void> {
    await this.productAliasNameInput.scrollIntoViewIfNeeded();
    await this.productAliasNameInput.fill('');
    await expect(this.productAliasNameInput).toHaveValue('');
  }

  async clearTagging(): Promise<void> {
    const tags = this.taggingMultiselect.locator('.multiselect-tag');

    while ((await tags.count()) > 0) {
      const removeButton = tags
        .first()
        .locator('.multiselect-tag-remove, .multiselect-tag-remove-icon');
      await removeButton.click();
      await this.page.waitForTimeout(300);
    }

    await expect(tags).toHaveCount(0);
  }

  async setTagging(tag: string): Promise<void> {
    const combobox = this.taggingCombobox;
    await combobox.scrollIntoViewIfNeeded();
    await combobox.click();
    await combobox.fill(tag).catch(async () => {
      await combobox.pressSequentially(tag, { delay: 50 });
    });
    await this.page.waitForTimeout(300);

    const option = this.page.getByRole('option', { name: new RegExp(tag, 'i') }).first();
    if (await option.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await option.click();
    } else {
      await this.dropdownOptions.filter({ hasText: tag }).first().click();
    }

    await expect(this.taggingMultiselect).toContainText(tag);
  }

  async selectRandomProductCoaGroup(): Promise<string> {
    const combobox = this.productCoaGroupCombobox;
    const multiselect = this.getMultiselectFor(combobox);

    await combobox.scrollIntoViewIfNeeded();
    await combobox.click();
    await expect(combobox).toHaveAttribute('aria-expanded', 'true', { timeout: 15_000 });

    const options = multiselect
      .locator('.multiselect-dropdown .multiselect-option')
      .filter({ hasNotText: 'No results found' });
    await expect(options.first()).toBeVisible({ timeout: 20_000 });

    const count = await options.count();
    const eligibleIndexes: number[] = [];

    for (let index = 0; index < count; index++) {
      const label = await this.normalizeOptionLabel(options.nth(index));
      if (label && !this.isBlockedCoaGroupOption(label)) {
        eligibleIndexes.push(index);
      }
    }

    const pool =
      eligibleIndexes.length > 0
        ? eligibleIndexes
        : Array.from({ length: count }, (_, index) => index);
    const randomIndex = pool[Math.floor(Math.random() * pool.length)];
    const selectedOption = options.nth(randomIndex);

    await selectedOption.click();
    await this.skuInput.click();
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(300);
    await this.fillAssetCategoryIfRequired();

    const selectedCoa = await this.getMultiselectSelectedLabel(combobox);
    expect(selectedCoa).not.toMatch(/choose product coa group/i);
    expect(selectedCoa.length).toBeGreaterThan(0);

    return selectedCoa;
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

  private async normalizeOptionLabel(option: Locator): Promise<string> {
    const text = (await option.innerText()).trim();
    return text.split('\n').map((line) => line.trim()).find(Boolean) ?? '';
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
    const saveButton = this.page
      .getByRole('button', { name: 'Save', exact: true })
      .last();
    await saveButton.scrollIntoViewIfNeeded();

    const coaLabel = await this.getMultiselectSelectedLabel(this.productCoaGroupCombobox);
    expect(coaLabel, 'Product Coa Group harus terisi sebelum save').not.toMatch(
      /choose product coa group/i,
    );
    expect(coaLabel.length).toBeGreaterThan(0);

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

    const enableVariationsLabel = this.page.getByText('Enable Variations', {
      exact: true,
    });
    await enableVariationsLabel.scrollIntoViewIfNeeded();
  }

  async enableVariations(): Promise<void> {
    const enableVariationsLabel = this.page.getByText('Enable Variations', {
      exact: true,
    });
    await expect(enableVariationsLabel).toBeVisible({ timeout: 20_000 });
    await enableVariationsLabel.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < 3; attempt++) {
      if (await this.variantTypeDropdown.isVisible().catch(() => false)) {
        break;
      }

      await enableVariationsLabel.click({ force: true });
      await this.page.waitForTimeout(700);

      if (await this.variantTypeDropdown.isVisible().catch(() => false)) {
        break;
      }

      const box = await enableVariationsLabel.boundingBox();
      if (box) {
        await this.page.mouse.click(box.x - 18, box.y + box.height / 2);
      }
      await this.page.waitForTimeout(700);
    }

    await this.page.waitForTimeout(1_500);
    await this.openVariantEditorIfNeeded();
    await this.waitForVariantInputs();
  }

  private async openVariantEditorIfNeeded(): Promise<void> {
    if (await this.variantTypeDropdown.isVisible().catch(() => false)) {
      return;
    }

    const addVariant = this.page
      .locator('div.border-dashed, button, a, div')
      .filter({ hasText: /Add New Variant|Add Variant/i })
      .locator('visible=true')
      .first();

    if (await addVariant.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await addVariant.scrollIntoViewIfNeeded();
      await addVariant.click({ force: true });
      await this.page.waitForTimeout(2_000);
      return;
    }

    const fallbackAddVariant = this.page
      .getByText(/Add New Variant|Add Variant/i)
      .locator('visible=true')
      .first();

    if (await fallbackAddVariant.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await fallbackAddVariant.click();
      await this.page.waitForTimeout(2_000);
    }
  }

  private async waitForVariantInputs(): Promise<void> {
    for (let attempt = 0; attempt < 6; attempt++) {
      if (await this.variantTypeDropdown.isVisible().catch(() => false)) {
        await expect(this.variantTypeDropdown).toBeVisible();
        return;
      }

      await this.page.mouse.wheel(0, 500);
      await this.page.waitForTimeout(500);
      await this.openVariantEditorIfNeeded();
    }

    await expect(this.variantTypeDropdown).toBeVisible({ timeout: 30_000 });
  }

  async selectVariantType(variantName: string): Promise<void> {
    await this.variantTypeDropdown.click();
    await this.page.waitForTimeout(300);

    const listboxOption = this.page.getByRole('option', { name: variantName, exact: true });
    if (await listboxOption.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await listboxOption.click();
    } else {
      await this.dropdownOptions.filter({ hasText: variantName }).first().click();
    }

    await this.page.waitForTimeout(1_000);
  }

  async selectVariantOptions(options: string[]): Promise<void> {
    const optionsContainer = this.page
      .locator('.multiselect')
      .filter({ has: this.variantOptionsDropdown })
      .first();

    for (const option of options) {
      await this.variantOptionsDropdown.click();
      await this.page.waitForTimeout(300);

      const listboxOption = this.page.getByRole('option', {
        name: option,
        exact: true,
      });
      if (await listboxOption.isVisible({ timeout: 5_000 }).catch(() => false)) {
        await listboxOption.click();
      } else {
        await this.dropdownOptions.filter({ hasText: option }).first().click();
      }
    }

    for (const option of options) {
      await expect(optionsContainer).toContainText(option);
    }
  }

  async clickSaveAll(): Promise<void> {
    const saveAllButton = this.page
      .getByRole('button', { name: 'Save All', exact: true })
      .last();
    await saveAllButton.scrollIntoViewIfNeeded();
    await saveAllButton.click();
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
        [
          '[placeholder="e.g: Flavour"]',
          '[aria-placeholder="e.g: Flavour"]',
          '.multiselect-search[aria-placeholder*="Flavour"]',
          '[placeholder*="Flavour"]',
          '[placeholder*="Flavor"]',
          '[aria-placeholder*="Flavour"]',
          '[aria-placeholder*="Flavor"]',
        ].join(', '),
      )
      .locator('visible=true')
      .first();
  }

  private get variantOptionsDropdown(): Locator {
    return this.page
      .locator(
        [
          '[placeholder="Choose Option"]',
          '[aria-placeholder="Choose Option"]',
          '.multiselect-search[aria-placeholder*="Choose Option"]',
          '[placeholder*="Choose Option"]',
          '[aria-placeholder*="Choose Option"]',
        ].join(', '),
      )
      .locator('visible=true')
      .first();
  }

  private get dropdownOptions(): Locator {
    return this.page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' });
  }

  private get salesCategoryCombobox(): Locator {
    return this.page.locator('[aria-placeholder="Choose Category"]').first();
  }

  private get productCoaGroupCombobox(): Locator {
    return this.page
      .locator('[aria-placeholder="Choose Product Coa Group"]')
      .first();
  }

  private get productAliasNameInput(): Locator {
    return this.page.getByPlaceholder('e.g: Alias Name Product');
  }

  private get taggingCombobox(): Locator {
    return this.page.locator('[aria-placeholder="Choose Tagging"]').first();
  }

  private get taggingMultiselect(): Locator {
    return this.page.locator('.multiselect').filter({ has: this.taggingCombobox }).first();
  }

  private getMultiselectFor(combobox: Locator): Locator {
    return this.page.locator('.multiselect').filter({ has: combobox }).first();
  }

  private async getMultiselectSelectedLabel(combobox: Locator): Promise<string> {
    const multiselect = this.getMultiselectFor(combobox);
    const singleLabel = multiselect.locator('.multiselect-single-label');

    if (await singleLabel.isVisible().catch(() => false)) {
      return (await singleLabel.textContent())?.trim() ?? '';
    }

    const comboboxText = (await combobox.textContent())?.trim() ?? '';
    if (comboboxText && !/choose (category|product coa group|tagging)/i.test(comboboxText)) {
      return comboboxText;
    }

    return (await multiselect.textContent())?.trim() ?? '';
  }

  private async assertComboboxFilled(
    combobox: Locator,
    label: string,
  ): Promise<void> {
    await expect(combobox, `${label} should be visible`).toBeVisible();

    const text = await this.getMultiselectSelectedLabel(combobox);
    expect(text, `${label} should be auto-filled`).not.toMatch(
      /choose (category|product coa group|tagging)/i,
    );
    expect(text.length, `${label} should have a selected value`).toBeGreaterThan(0);
  }

  private labelToFlexiblePattern(expectedLabel: string): RegExp {
    const parts = expectedLabel
      .split(/\s*&\s*/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length <= 1) {
      return new RegExp(
        `^${expectedLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
        'i',
      );
    }

    return new RegExp(`^${parts.join('.*')}$`, 'i');
  }

  private async ensureComboboxValue(
    combobox: Locator,
    expectedLabel: string,
  ): Promise<void> {
    const pattern = this.labelToFlexiblePattern(expectedLabel);
    const multiselect = this.getMultiselectFor(combobox);
    const current = await this.getMultiselectSelectedLabel(combobox);

    if (pattern.test(current)) {
      return;
    }

    await this.skuInput.click();
    await combobox.click();
    await expect(combobox).toHaveAttribute('aria-expanded', 'true');

    const searchToken = expectedLabel.replace(/&/g, '').trim();
    await combobox.fill(searchToken).catch(async () => {
      await combobox.pressSequentially(searchToken, { delay: 50 });
    });
    await this.page.waitForTimeout(500);

    const scopedOptions = multiselect.getByRole('option', { name: pattern });
    const globalOption = this.page.getByRole('option', { name: pattern }).first();
    const multiselectOption = this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: pattern })
      .first();

    if (await scopedOptions.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await scopedOptions.first().click();
    } else if (await globalOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await globalOption.click();
    } else {
      await multiselectOption.click({ timeout: 20_000 });
    }

    await this.page.waitForTimeout(500);
    await this.skuInput.click();

    const selected = await this.getMultiselectSelectedLabel(combobox);
    expect(
      selected,
      `Dropdown harus menampilkan "${expectedLabel}" setelah dipilih`,
    ).toMatch(pattern);
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
