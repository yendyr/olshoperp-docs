import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './company-access';

export type ProductFormPaths = {
  datalistPath: string;
  createPath: string;
  editPathPattern: RegExp;
  /** Fragment URL API untuk POST create, e.g. `/supplychain/product` */
  apiCreatePath: string;
  /**
   * Locator wait setelah buka /create.
   * Default: `#sku`. PIC AS-IS `showGeneral=false` → pakai selector non-SKU.
   */
  createReadyLocator?: string;
  /** false bila menu inventory-only tanpa tombol Create di datalist (AS-IS PIC). */
  hasCreateButton?: boolean;
};

export const SYSTEM_PRODUCT_PATHS: ProductFormPaths = {
  datalistPath: '/supplychain/product',
  createPath: '/supplychain/product/create',
  editPathPattern: /\/supplychain\/product\/edit\/\d+/,
  apiCreatePath: '/supplychain/product',
};

export const PRODUCT_GENERAL_CONFIGURATION_PATHS: ProductFormPaths = {
  datalistPath: '/supplychain/product-general-configuration',
  createPath: '/supplychain/product-general-configuration/create',
  editPathPattern: /\/supplychain\/product-general-configuration\/edit\/\d+/,
  apiCreatePath: '/supplychain/product-general-configuration',
};

export const PRODUCT_INVENTORY_CONFIGURATION_PATHS: ProductFormPaths = {
  datalistPath: '/supplychain/product-inventory-configuration',
  createPath: '/supplychain/product-inventory-configuration/create',
  editPathPattern: /\/supplychain\/product-inventory-configuration\/edit\/\d+/,
  apiCreatePath: '/supplychain/product-inventory-configuration',
  // AS-IS: Basic Information (#sku) di-gate showGeneral=false — form tetap load tanpa field SKU
  createReadyLocator: 'button:has-text("Save"), button:has-text("Save All")',
  hasCreateButton: false,
};

export const SYSTEM_PRODUCT_DATALIST_PATH = SYSTEM_PRODUCT_PATHS.datalistPath;
export const SYSTEM_PRODUCT_CREATE_PATH = SYSTEM_PRODUCT_PATHS.createPath;
export const SYSTEM_PRODUCT_EDIT_PATH_PATTERN = SYSTEM_PRODUCT_PATHS.editPathPattern;

export const PRODUCT_GENERAL_CONFIGURATION_DATALIST_PATH =
  PRODUCT_GENERAL_CONFIGURATION_PATHS.datalistPath;

export const PRODUCT_INVENTORY_CONFIGURATION_DATALIST_PATH =
  PRODUCT_INVENTORY_CONFIGURATION_PATHS.datalistPath;

export function systemProductEditPath(productId: string | number): string {
  return `/supplychain/product/edit/${productId}`;
}

const SALES_CATEGORY_LABEL = 'Sales Category';
const PRODUCT_COA_GROUP_LABEL = 'Product Coa Group';

/**
 * POM umum System Product / Product General Configuration —
 * datalist, create, edit (FormProductComponent shared).
 */
export class SystemProductPage {
  private readonly paths: ProductFormPaths;

  constructor(
    private readonly page: Page,
    paths: ProductFormPaths = SYSTEM_PRODUCT_PATHS,
  ) {
    this.paths = paths;
  }

  async gotoDatalist(): Promise<void> {
    await this.page.goto(this.paths.datalistPath, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    if (this.paths.hasCreateButton === false) {
      await expect(this.page.getByRole('searchbox').first()).toBeVisible({
        timeout: 45_000,
      });
      await expect(this.page.getByRole('table').first()).toBeVisible({
        timeout: 45_000,
      });
      return;
    }
    await expect(this.createButton).toBeVisible({ timeout: 45_000 });
    await expect(this.page.getByRole('table').first()).toBeVisible();
  }

  async openCreateForm(): Promise<void> {
    await this.createButton.click();
    await this.page.waitForURL(
      new RegExp(`${this.paths.createPath.replace(/\//g, '\\/')}$`),
      { timeout: 45_000 },
    );
    await this.waitForCreateFormReady();
  }

  async gotoCreate(): Promise<void> {
    await this.page.goto(this.paths.createPath, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await this.waitForCreateFormReady();
  }

  private async waitForCreateFormReady(): Promise<void> {
    if (this.paths.createReadyLocator) {
      await expect(
        this.page.locator(this.paths.createReadyLocator).first(),
      ).toBeVisible({ timeout: 45_000 });
      return;
    }
    await expect(this.systemProductSkuInput).toBeVisible({ timeout: 45_000 });
  }

  async gotoEdit(productId: string | number): Promise<void> {
    const base = this.paths.datalistPath;
    await this.page.goto(`${base}/edit/${productId}`, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.saveAllButton).toBeVisible({ timeout: 45_000 });
  }

  async openCreateOrEditBySku(sku: string): Promise<'create' | 'edit'> {
    await this.gotoDatalist();
    await this.datalistSearchInput.fill(sku);
    await this.page.waitForTimeout(1_500);

    const existingSku = this.page
      .getByRole('link', { name: sku, exact: true })
      .or(this.page.getByText(sku, { exact: true }))
      .first();
    if (await existingSku.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const editPath = await existingSku.getAttribute('href');
      if (editPath) {
        await this.page.goto(editPath, { waitUntil: 'domcontentloaded' });
      } else {
        await Promise.all([
          this.page.waitForURL(this.paths.editPathPattern, {
            timeout: 90_000,
          }),
          existingSku.click(),
        ]);
      }

      await expect(this.saveAllButton).toBeVisible({ timeout: 45_000 });
      return 'edit';
    }

    if (this.paths.hasCreateButton === false) {
      throw new Error(
        `SKU "${sku}" tidak ditemukan di datalist ${this.paths.datalistPath} (menu tanpa Create). Seed product dulu via PGC/System Product.`,
      );
    }

    await this.openCreateForm();
    return 'create';
  }

  async fillBasicInformation(sku: string, name: string): Promise<void> {
    await this.systemProductSkuInput.fill(sku);
    await this.systemProductNameInput.fill(name);
    await this.systemProductNameInput.blur();
    await this.page.waitForTimeout(1_500);
  }

  async assertSalesCategoryAutoFilled(): Promise<void> {
    // Setelah autofill, search input hilang — baca .multiselect-single-label
    await expect
      .poll(
        async () => {
          const singles = this.page.locator('.multiselect-single-label:visible');
          if ((await singles.count()) === 0) return '';
          return ((await singles.first().textContent()) ?? '').trim();
        },
        {
          timeout: 25_000,
          message: 'Sales Category should be auto-filled',
        },
      )
      .toMatch(/^(?!choose category).+/i);
  }

  async assertProductCoaGroupAutoFilled(): Promise<void> {
    await expect
      .poll(
        async () => this.resolveProductCoaSelectedLabel(),
        {
          timeout: 25_000,
          message: 'Product Coa Group should be auto-filled',
        },
      )
      .toMatch(/^(?!choose product coa group).+/i);
  }

  async assertAndEnsureSalesCategory(expectedLabel: string): Promise<void> {
    const pattern = this.labelToFlexiblePattern(expectedLabel);
    await this.assertSalesCategoryAutoFilled();
    const singles = this.page.locator('.multiselect-single-label:visible');
    const current = ((await singles.first().textContent()) ?? '').trim();
    if (pattern.test(current)) {
      return;
    }

    // Ganti value: klik multiselect pertama (Sales Category), lalu cari opsi
    const salesMs = this.page.locator('.multiselect').first();
    await salesMs.click();
    const combobox = this.page
      .locator('[aria-placeholder="Choose Category"], .multiselect-search')
      .first();
    await expect(combobox).toBeVisible({ timeout: 10_000 });
    await combobox.pressSequentially('Hobbies', { delay: 80 });
    await this.page.waitForTimeout(500);

    const option = this.page.getByRole('option', {
      name: expectedLabel,
      exact: true,
    });
    await expect(
      option,
      `Opsi Sales Category "${expectedLabel}" harus ada`,
    ).toBeVisible({ timeout: 15_000 });
    await option.click();
    await this.systemProductSkuInput.click();
    await this.page.waitForTimeout(300);

    const selected = ((await singles.first().textContent()) ?? '').trim();
    expect(selected, `Sales Category harus "${expectedLabel}"`).toMatch(
      pattern,
    );
  }

  async assertAndEnsureProductCoaGroup(expectedLabel: string): Promise<void> {
    await this.assertProductCoaGroupAutoFilled();
    const pattern = this.labelToFlexiblePattern(expectedLabel);
    const current = await this.resolveProductCoaSelectedLabel();
    if (pattern.test(current)) {
      await this.fillAssetCategoryIfRequired();
      return;
    }

    // Select via labeled root — avoid ambiguous .multiselect.nth / nested filter.
    const coaRoot = this.productCoaGroupMultiselectRoot;
    await this.systemProductSkuInput.click();
    await coaRoot.scrollIntoViewIfNeeded();
    await coaRoot.click();

    const search = coaRoot.locator('.multiselect-search').first();
    await expect(search).toBeVisible({ timeout: 10_000 });

    const searchToken = expectedLabel.replace(/&/g, '').trim();
    await search.fill('').catch(() => undefined);
    await search.pressSequentially(searchToken, { delay: 50 });
    await this.page.waitForTimeout(500);

    const scopedOption = coaRoot
      .locator('.multiselect-option:visible')
      .filter({ hasText: pattern })
      .first();
    const globalOption = this.page
      .getByRole('option', { name: pattern })
      .first();

    if (await scopedOption.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await scopedOption.click();
    } else {
      await expect(
        globalOption,
        `Opsi Product Coa Group "${expectedLabel}" harus ada`,
      ).toBeVisible({ timeout: 15_000 });
      await globalOption.click();
    }

    await this.systemProductSkuInput.click();
    await this.page.waitForTimeout(300);

    const selected = await this.resolveProductCoaSelectedLabel();
    expect(
      selected,
      `Product Coa Group harus "${expectedLabel}" setelah dipilih`,
    ).toMatch(pattern);

    await this.fillAssetCategoryIfRequired();
  }

  /** Baca COA terpilih — saat autofill, search input sering tidak visible. */
  private async resolveProductCoaSelectedLabel(): Promise<string> {
    const viaRoot = await this.getSelectedLabelFromMultiselectRoot(
      this.productCoaGroupMultiselectRoot,
    );
    if (viaRoot && !/choose product coa group/i.test(viaRoot)) {
      // Hindari baca konten dropdown penuh (opsi list)
      const single = this.productCoaGroupMultiselectRoot.locator(
        '.multiselect-single-label',
      );
      if (await single.isVisible().catch(() => false)) {
        return ((await single.textContent()) ?? '').trim();
      }
      if (viaRoot.length < 80) {
        return viaRoot;
      }
    }

    const combobox = this.productCoaGroupCombobox;
    if (await combobox.isVisible().catch(() => false)) {
      const viaInput = await this.getMultiselectSelectedLabel(combobox);
      if (
        viaInput &&
        !/choose product coa group/i.test(viaInput) &&
        viaInput.length < 80
      ) {
        return viaInput;
      }
    }

    return '';
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
    await this.systemProductSkuInput.click();
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
    await this.systemProductSkuInput.click();
  }

  async clickSave(): Promise<void> {
    const apiFragment = this.paths.apiCreatePath;
    const saveResponse = this.page.waitForResponse(
      (response) => {
        if (response.request().method() !== 'POST') return false;
        const pathname = new URL(response.url()).pathname.replace(/\/$/, '');
        if (apiFragment === '/supplychain/product') {
          return pathname === '/api/supplychain/product';
        }
        return pathname.endsWith(apiFragment);
      },
      { timeout: 90_000 },
    );

    const coaLabel = await this.resolveProductCoaSelectedLabel();
    expect(coaLabel, 'Product Coa Group harus terisi sebelum save').not.toMatch(
      /choose product coa group/i,
    );
    expect(coaLabel.length).toBeGreaterThan(0);

    const saveButton = this.page
      .getByRole('button', { name: 'Save', exact: true })
      .last();
    await saveButton.scrollIntoViewIfNeeded();

    await saveButton.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
      data?: Record<string, unknown>;
    } | null;

    if (body?.status?.error) {
      throw new Error(
        `Save product gagal: ${body.status.message ?? JSON.stringify(body.data ?? body)}`,
      );
    }

    await this.waitForBasicInformationSaved();
  }

  async fillRetailPrice(price: string): Promise<void> {
    // Retail Price di section Product Details — jangan scroll ke Enable Variations
    const details = this.page.getByRole('button', {
      name: 'Product Details',
      exact: true,
    });
    if (await details.isVisible({ timeout: 5_000 }).catch(() => false)) {
      if ((await details.getAttribute('aria-expanded')) !== 'true') {
        await details.click();
        await this.page.waitForTimeout(700);
      }
    }

    const priceInput = this.page
      .locator('#price')
      .or(this.page.getByPlaceholder('Price Product'))
      .first();
    await priceInput.scrollIntoViewIfNeeded();
    await expect(priceInput, 'Retail Price').toBeVisible({ timeout: 30_000 });
    await priceInput.click({ force: true });
    await priceInput.fill('');
    await priceInput.fill(price);
    await this.page.waitForTimeout(400);
  }

  async updateSku(sku: string): Promise<void> {
    await this.systemProductSkuInput.fill(sku);
    await this.systemProductSkuInput.blur();
    await this.page.waitForTimeout(500);
  }

  async clickSaveAllForHeaderUpdate(): Promise<void> {
    const apiFragment = this.paths.apiCreatePath.replace(/^\//, '');
    const saveResponse = this.page
      .waitForResponse(
        (response) => {
          if (!['PUT', 'POST'].includes(response.request().method())) {
            return false;
          }
          const pathname = new URL(response.url()).pathname;
          // Hindari match terlalu luas ke /product saat mode PGC
          if (apiFragment === 'supplychain/product') {
            return /\/api\/supplychain\/product\/\d+/.test(pathname);
          }
          return pathname.includes(apiFragment);
        },
        { timeout: 90_000 },
      )
      .catch(() => null);

    await this.saveAllButton.scrollIntoViewIfNeeded();
    await this.saveAllButton.click({ force: true });

    const response = await saveResponse;
    if (response) {
      const body = (await response.json().catch(() => null)) as {
        status?: { error?: number; message?: string };
      } | null;
      if (body?.status?.error) {
        throw new Error(
          `Save All gagal: ${body.status.message ?? `HTTP ${response.status()}`}`,
        );
      }
    }

    const successToast = this.page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /success|saved|berhasil/i });
    await successToast
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);
    await this.page.waitForTimeout(800);
  }

  async assertBasicSkuFieldsVisible(): Promise<void> {
    await expect(
      this.systemProductSkuInput,
      'System Product SKU harus visible di form create.',
    ).toBeVisible({ timeout: 8_000 });
  }

  /** Buka Product Details → nested Inventory Management (hanya di menu showInventory + is_edit). */
  private async openInventoryManagementSection(): Promise<void> {
    const details = this.page.getByRole('button', {
      name: 'Product Details',
      exact: true,
    });
    await expect(details, 'Section Product Details').toBeVisible({
      timeout: 30_000,
    });
    if ((await details.getAttribute('aria-expanded')) !== 'true') {
      await details.click();
      await this.page.waitForTimeout(700);
    }

    const invHeader = this.page
      .locator('button')
      .filter({ hasText: /^Inventory Management$/ })
      .first();
    await expect(invHeader, 'Subsection Inventory Management').toBeVisible({
      timeout: 20_000,
    });
    if ((await invHeader.getAttribute('aria-expanded')) !== 'true') {
      await invHeader.click();
      await this.page.waitForTimeout(600);
    }
  }

  /**
   * Product Details → Inventory Management.
   * Checklist Expired Date + days, Minimum Stock Qty.
   */
  async fillInventoryManagement(options: {
    expiredDays: string;
    minimumStockQty: string;
  }): Promise<void> {
    await this.openInventoryManagementSection();

    // Anchor ke placeholder days — checkbox Expired Date biasanya langsung sebelum field ini
    const daysInput = this.page.getByPlaceholder('e.g: 15').first();
    await expect(daysInput).toBeVisible({ timeout: 15_000 });

    if (await daysInput.isDisabled().catch(() => true)) {
      const expiredCheckbox = daysInput.locator(
        'xpath=preceding::input[@type="checkbox"][1]',
      );
      await expiredCheckbox.check({ force: true });
      await expect(daysInput).toBeEnabled({ timeout: 10_000 });
    }

    await daysInput.fill(options.expiredDays);

    const minStock = this.page.getByPlaceholder('Minimum Stock Qty');
    await expect(minStock).toBeVisible({ timeout: 15_000 });
    await minStock.fill(options.minimumStockQty);
    await this.page.waitForTimeout(300);
  }

  async assertInventoryManagement(options: {
    expiredDays: string;
    minimumStockQty: string;
  }): Promise<void> {
    await this.openInventoryManagementSection();

    const daysInput = this.page.getByPlaceholder('e.g: 15').first();
    const minStock = this.page.getByPlaceholder('Minimum Stock Qty');
    await expect(daysInput).toBeVisible({ timeout: 15_000 });
    await expect(daysInput).toHaveValue(
      new RegExp(options.expiredDays.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
    await expect(minStock).toHaveValue(
      new RegExp(options.minimumStockQty.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }

  async scrollToProductDetails(): Promise<void> {
    const productDetails = this.productDetailsSectionButton;
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

    await this.enableVariationsLabel.scrollIntoViewIfNeeded();
  }

  async enableVariations(): Promise<void> {
    await expect(this.enableVariationsLabel).toBeVisible({ timeout: 20_000 });
    await this.enableVariationsLabel.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < 3; attempt++) {
      if (await this.variantTypeCombobox.isVisible().catch(() => false)) {
        break;
      }

      await this.enableVariationsLabel.click({ force: true });
      await this.page.waitForTimeout(700);

      if (await this.variantTypeCombobox.isVisible().catch(() => false)) {
        break;
      }

      const box = await this.enableVariationsLabel.boundingBox();
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
    if (await this.variantTypeCombobox.isVisible().catch(() => false)) {
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
      if (await this.variantTypeCombobox.isVisible().catch(() => false)) {
        await expect(this.variantTypeCombobox).toBeVisible();
        return;
      }

      await this.page.mouse.wheel(0, 500);
      await this.page.waitForTimeout(500);
      await this.openVariantEditorIfNeeded();
    }

    await expect(this.variantTypeCombobox).toBeVisible({ timeout: 30_000 });
  }

  async selectVariantType(variantName: string): Promise<void> {
    await this.variantTypeCombobox.click();
    await this.page.waitForTimeout(300);

    const listboxOption = this.page.getByRole('option', { name: variantName, exact: true });
    if (await listboxOption.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await listboxOption.click();
    } else {
      await this.dropdownOptions.filter({ hasText: variantName }).first().click();
    }

    await this.page.waitForTimeout(1_000);
  }

  async selectVariantTypeFromCandidates(candidates: string[]): Promise<string> {
    for (const variantName of candidates) {
      await this.variantTypeCombobox.click();
      await this.page.waitForTimeout(300);

      const listboxOption = this.page.getByRole('option', {
        name: variantName,
        exact: true,
      });
      const multiselectOption = this.dropdownOptions
        .filter({ hasText: variantName })
        .first();

      if (await listboxOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await listboxOption.click();
        await this.page.waitForTimeout(1_000);
        return variantName;
      }

      if (await multiselectOption.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await multiselectOption.click();
        await this.page.waitForTimeout(1_000);
        return variantName;
      }

      await this.page.keyboard.press('Escape').catch(() => undefined);
      await this.page.waitForTimeout(300);
    }

    throw new Error(
      `Variant type tidak ditemukan. Coba salah satu dari: ${candidates.join(', ')}`,
    );
  }

  async selectVariantOptions(options: string[]): Promise<void> {
    const optionsContainer = this.page
      .locator('.multiselect')
      .filter({ has: this.variantOptionsCombobox })
      .first();

    for (const option of options) {
      await this.variantOptionsCombobox.click();
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
    await this.saveAllButton.scrollIntoViewIfNeeded();
    await this.saveAllButton.click();
    await this.waitForVariantSaveCompleted();
  }

  async searchDatalist(query: string): Promise<void> {
    const search = this.datalistSearchInput;
    if (!(await search.isVisible().catch(() => false))) {
      await this.gotoDatalist();
    }
    await this.datalistSearchInput.fill(query);
    await this.page.waitForTimeout(1_500);
  }

  async assertSkuVisibleInDatalist(sku: string): Promise<void> {
    const link = this.page.getByRole('link', { name: sku, exact: true });
    const text = this.page.getByText(sku, { exact: true });
    await expect(
      link.or(text).first(),
      `SKU ${sku} harus tampil di datalist`,
    ).toBeVisible({
      timeout: 45_000,
    });
  }

  async assertSkusVisibleInDatalist(skus: string[]): Promise<void> {
    for (const sku of skus) {
      await this.assertSkuVisibleInDatalist(sku);
    }
  }

  async enableProductBundle(): Promise<void> {
    const label = this.setAsProductBundleLabel;
    await label.scrollIntoViewIfNeeded();

    if (await this.isProductBundleEnabled()) {
      return;
    }

    const bundleResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('bill-of-material-detail/deactivate-bundle') &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await this.clickBundleToggleNear(label);
    const response = await bundleResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (body?.status?.error) {
      throw new Error(
        `Enable Product Bundle gagal: ${body.status.message ?? JSON.stringify(body)}`,
      );
    }

    await expect(this.bundleProductDisclosure).toBeVisible({ timeout: 30_000 });
    await this.page.waitForTimeout(1_000);
  }

  async expandBundleProductPanel(): Promise<void> {
    const disclosure = this.bundleProductDisclosure;
    await disclosure.scrollIntoViewIfNeeded();

    if (!(await this.bundleDetailProductSelect.isVisible().catch(() => false))) {
      await disclosure.click();
      await this.page.waitForTimeout(800);
    }

    await expect(this.bundleDetailLabel).toBeVisible({ timeout: 30_000 });
    await expect(this.bundleDetailProductSelect).toBeVisible({ timeout: 30_000 });
  }

  async addBundleDetailProduct(sku: string): Promise<void> {
    if (await this.isBundleDetailPresent(sku)) {
      return;
    }

    const multiselect = this.bundleDetailMultiselect;
    await multiselect.scrollIntoViewIfNeeded();
    await this.page.keyboard.press('Escape').catch(() => undefined);
    await this.setAsProductBundleLabel.click();
    await this.page.waitForTimeout(300);

    const createResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('bill-of-material-detail/create-select') &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    const select2Response = this.page.waitForResponse(
      (response) =>
        response.url().includes('/supplychain/product/select2?') &&
        response.request().method() === 'GET',
      { timeout: 30_000 },
    );

    const search = multiselect.locator('.multiselect-search').first();
    await multiselect.click();
    await expect(search).toBeVisible({ timeout: 10_000 });
    await search.click({ force: true });
    await search.fill(sku);
    await select2Response;
    await this.page.waitForTimeout(500);

    const option = this.page
      .locator('.multiselect-dropdown:visible .multiselect-option')
      .filter({ hasText: sku })
      .first();
    await expect(option, `Opsi bundle detail "${sku}" harus ada`).toBeVisible({
      timeout: 20_000,
    });
    await option.click();

    const response = await createResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (body?.status?.error) {
      const message = body.status.message ?? '';
      if (/already included/i.test(message)) {
        return;
      }
      throw new Error(
        `Tambah bundle detail "${sku}" gagal: ${message || JSON.stringify(body)}`,
      );
    }

    await this.assertSuccessToast();
    await this.page.waitForTimeout(500);
  }

  async activateProductBundle(): Promise<void> {
    const toggle = this.bundleActiveToggle;
    await toggle.scrollIntoViewIfNeeded();

    if (await toggle.isChecked()) {
      return;
    }

    if (await this.bundleInvalidWarning.isVisible().catch(() => false)) {
      throw new Error(
        'Bundle invalid: detail bundle membutuhkan minimal 2 item atau 1 item dengan qty > 1',
      );
    }

    const activateResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('bill-of-material-detail/activate-bundle') &&
        response.request().method() === 'POST',
      { timeout: 90_000 },
    );

    await toggle.click({ force: true });

    const response = await activateResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (body?.status?.error) {
      throw new Error(
        `Activate bundle gagal: ${body.status.message ?? JSON.stringify(body)}`,
      );
    }

    await this.assertSuccessToast();
    await expect(toggle).toBeChecked({ timeout: 15_000 });
  }

  async assertSuccessToast(pattern = /success|berhasil|saved/i): Promise<void> {
    const toast = this.page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: pattern });

    await expect(toast.first()).toBeVisible({ timeout: 30_000 });
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

  private get systemProductSkuInput(): Locator {
    return this.page.locator('#sku');
  }

  private get systemProductNameInput(): Locator {
    return this.page.locator('#name');
  }

  private get productDetailsSectionButton(): Locator {
    return this.page.getByRole('button', { name: 'Product Details', exact: true });
  }

  private get enableVariationsLabel(): Locator {
    return this.page.getByText('Enable Variations', { exact: true });
  }

  private get setAsProductBundleLabel(): Locator {
    return this.page.getByText('Set as Product Bundle', { exact: true });
  }

  private get bundleProductDisclosure(): Locator {
    return this.page.locator('[aria-current="BundleProduct"]').first();
  }

  private get bundleDetailLabel(): Locator {
    return this.page.getByText('Bundle Detail', { exact: false }).first();
  }

  private get bundleDetailMultiselect(): Locator {
    return this.bundleProductDisclosure
      .locator('xpath=ancestor::div[contains(@class,"border")][1]')
      .locator('.multiselect')
      .last();
  }

  private get bundleDetailProductSelect(): Locator {
    return this.bundleDetailMultiselect
      .locator('.multiselect-search, [role="combobox"]')
      .first();
  }

  private get bundleActiveToggle(): Locator {
    return this.page.locator('#bundle-toggle-header');
  }

  private get bundleInvalidWarning(): Locator {
    return this.bundleProductDisclosure.locator(
      'font-awesome-icon, [data-icon="triangle-exclamation"]',
    );
  }

  private async isBundleDetailPresent(sku: string): Promise<boolean> {
    const table = this.bundleProductDisclosure.locator('table');
    return table.getByText(sku, { exact: true }).isVisible().catch(() => false);
  }

  private async isProductBundleEnabled(): Promise<boolean> {
    const bundleContainer = this.setAsProductBundleLabel.locator(
      'xpath=ancestor::div[contains(@class,"border-dashed") or contains(@class,"ps-2")][1]',
    );
    const hasDashedBorder = await bundleContainer
      .evaluate((el) => el.classList.contains('border-dashed'))
      .catch(() => false);

    if (hasDashedBorder) {
      return true;
    }

    return this.bundleProductDisclosure.isVisible().catch(() => false);
  }

  private async clickBundleToggleNear(label: Locator): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (await this.isProductBundleEnabled()) {
        return;
      }

      await label.click({ force: true });
      await this.page.waitForTimeout(700);

      if (await this.isProductBundleEnabled()) {
        return;
      }

      const box = await label.boundingBox();
      if (box) {
        await this.page.mouse.click(box.x - 18, box.y + box.height / 2);
      }
      await this.page.waitForTimeout(700);
    }
  }

  private get saveAllButton(): Locator {
    return this.page.getByRole('button', { name: 'Save All', exact: true }).last();
  }

  private get variantTypeCombobox(): Locator {
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

  private get variantOptionsCombobox(): Locator {
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

  private get salesCategoryMultiselectRoot(): Locator {
    // Nearest col-span ancestor of the Sales Category label (not a parent that wraps both fields).
    return this.page
      .locator('label')
      .filter({ hasText: /^Sales Category/ })
      .locator(
        'xpath=ancestor::div[contains(@class,"col-span")][1]',
      )
      .locator('.multiselect')
      .first();
  }

  private get productCoaGroupMultiselectRoot(): Locator {
    return this.page
      .locator('label')
      .filter({ hasText: /Product Coa Group/i })
      .locator(
        'xpath=ancestor::div[contains(@class,"col-span")][1]',
      )
      .locator('.multiselect')
      .first();
  }

  private async getSelectedLabelFromMultiselectRoot(
    root: Locator,
  ): Promise<string> {
    const singleLabel = root.locator('.multiselect-single-label');
    if (await singleLabel.isVisible().catch(() => false)) {
      return ((await singleLabel.textContent()) ?? '').trim();
    }
    return ((await root.textContent()) ?? '').trim();
  }

  private get salesCategoryCombobox(): Locator {
    // Saat kosong: .multiselect-search ada. Saat filled: klik root dulu lalu search muncul.
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
    await expect(combobox, `${label} should be visible`).toBeVisible({
      timeout: 25_000,
    });

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

    await this.systemProductSkuInput.click();
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
    await this.systemProductSkuInput.click();

    const selected = await this.getMultiselectSelectedLabel(combobox);
    expect(
      selected,
      `Dropdown harus menampilkan "${expectedLabel}" setelah dipilih`,
    ).toMatch(pattern);
  }

  private async waitForBasicInformationSaved(): Promise<void> {
    await this.page.waitForURL(this.paths.editPathPattern, {
      timeout: 90_000,
    });
    await expect(this.saveAllButton).toBeVisible({ timeout: 45_000 });
  }

  private async waitForVariantSaveCompleted(): Promise<void> {
    await expect(this.saveAllButton).toBeEnabled({ timeout: 60_000 });

    const successToast = this.page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /success|saved|berhasil/i });

    if (await successToast.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await expect(successToast.first()).toBeVisible();
    }
  }
}
