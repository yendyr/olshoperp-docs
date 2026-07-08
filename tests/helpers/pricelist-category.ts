import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './company-access';

export const PRICELIST_CATEGORY_DATALIST_PATH =
  '/businessdevelopment/pricelist-category';
export const PRICELIST_CATEGORY_CREATE_PATH =
  '/businessdevelopment/pricelist-category/create';

export type MarginPriceConfig = {
  endPrice: number;
  marginType: 'percentage' | 'amount';
  marginValue: number;
};

export type CategoryPriceFormData = {
  code: string;
  categoryName: string;
  margin: MarginPriceConfig;
};

export class PricelistCategoryPage {
  constructor(private readonly page: Page) {}

  async gotoDatalist(): Promise<void> {
    await this.page.goto(PRICELIST_CATEGORY_DATALIST_PATH, {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(this.page);
    await expect(this.page.getByRole('table').first()).toBeVisible({
      timeout: 45_000,
    });
    await expect(this.createButton).toBeVisible({ timeout: 45_000 });
  }

  async openCreateForm(): Promise<void> {
    const createLink = this.createButton;
    await createLink.scrollIntoViewIfNeeded();

    try {
      await Promise.all([
        this.page.waitForURL(/\/businessdevelopment\/pricelist-category\/create/, {
          timeout: 30_000,
        }),
        createLink.click(),
      ]);
    } catch {
      await this.page.goto(PRICELIST_CATEGORY_CREATE_PATH, {
        waitUntil: 'domcontentloaded',
      });
    }

    await expect(this.codeInput).toBeVisible({ timeout: 45_000 });
  }

  async openCreateOrVerifyExisting(code: string): Promise<'create' | 'exists'> {
    await this.gotoDatalist();
    await this.datalistSearchInput.fill(code);
    await this.page.waitForTimeout(1_500);

    if (await this.isCodeVisibleInDatalist(code)) {
      return 'exists';
    }

    await this.openCreateForm();
    return 'create';
  }

  async fillBasicInformation(code: string, categoryName: string): Promise<void> {
    await this.codeInput.fill(code);
    await this.categoryNameInput.fill(categoryName);
  }

  async fillMarginPriceConfiguration(margin: MarginPriceConfig): Promise<void> {
    await this.expandMarginPriceConfiguration();
    await this.endPriceInput.fill(String(margin.endPrice));
    await this.endPriceInput.blur();
    await this.page.waitForTimeout(500);

    await this.assertMarginTypeIs(margin.marginType);
    await this.marginValueInput.fill(String(margin.marginValue));
  }

  private async expandMarginPriceConfiguration(): Promise<void> {
    const section = this.page.getByRole('button', {
      name: 'Margin Price Configuration',
      exact: true,
    });
    await section.scrollIntoViewIfNeeded();

    if ((await section.getAttribute('aria-expanded')) !== 'true') {
      await section.click();
    }

    await expect(section).toHaveAttribute('aria-expanded', 'true');
  }

  async assertMarginTypeIs(marginType: 'percentage' | 'amount'): Promise<void> {
    const label = marginType === 'percentage' ? 'Percentage' : 'Amount';
    const multiselect = this.marginTypeMultiselect;

    await expect(multiselect).toBeVisible();

    const alreadySelected = await expect(multiselect)
      .toHaveAccessibleName(new RegExp(`^${label}$`, 'i'))
      .then(() => true)
      .catch(() => false);

    if (alreadySelected) {
      return;
    }

    await multiselect.click();
    await this.page
      .locator('.multiselect-option:visible')
      .filter({ hasText: new RegExp(`^${label}$`, 'i') })
      .first()
      .click();
    await this.endPriceInput.click();
    await expect(multiselect).toHaveAccessibleName(new RegExp(`^${label}$`, 'i'));
  }

  async assertAppliedStoreEmpty(): Promise<void> {
    await this.expandBasicInformation();

    const storeMultiselect = this.appliedStoreMultiselect;
    const multiselectVisible = await storeMultiselect.isVisible().catch(() => false);

    if (multiselectVisible) {
      await expect(storeMultiselect.locator('.multiselect-tag')).toHaveCount(0);
      return;
    }

    // Default create form: is_all_company=true, applied_store=[] — store picker dapat tidak tampil.
    await expect(this.showForAllCompanyCheckbox).toBeChecked();
  }

  private async expandBasicInformation(): Promise<void> {
    const section = this.page.getByRole('button', {
      name: 'Basic Information',
      exact: true,
    });
    await section.scrollIntoViewIfNeeded();

    if ((await section.getAttribute('aria-expanded')) !== 'true') {
      await section.click();
    }

    await expect(section).toHaveAttribute('aria-expanded', 'true');
  }

  async clickSaveAll(): Promise<void> {
    const saveAllButton = this.page.getByRole('button', {
      name: 'Save All',
      exact: true,
    });
    const saveButton = this.page.getByRole('button', { name: 'Save', exact: true });

    if (await saveAllButton.isVisible().catch(() => false)) {
      await saveAllButton.scrollIntoViewIfNeeded();
      await this.clickSaveWithApiWait(saveAllButton);
      return;
    }

    await saveButton.scrollIntoViewIfNeeded();
    await this.clickSaveWithApiWait(saveButton);
  }

  async searchDatalist(query: string): Promise<void> {
    await this.gotoDatalist();
    await this.datalistSearchInput.fill(query);
    await this.page.waitForTimeout(1_500);
  }

  async assertCategoryPriceInDatalist(
    code: string,
    categoryName: string,
  ): Promise<void> {
    const row = this.page.getByRole('row').filter({ hasText: code });
    await expect(row).toBeVisible({ timeout: 45_000 });
    await expect(row).toContainText(categoryName);
  }

  async isCodeVisibleInDatalist(code: string): Promise<boolean> {
    return this.page
      .getByRole('row')
      .filter({ hasText: code })
      .isVisible()
      .catch(() => false);
  }

  private async clickSaveWithApiWait(saveButton: Locator): Promise<void> {
    const saveResponse = this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/businessdevelopment/pricelist-category') &&
        ['POST', 'PUT'].includes(response.request().method()),
      { timeout: 90_000 },
    );

    await saveButton.click();

    const response = await saveResponse;
    const body = (await response.json().catch(() => null)) as {
      status?: { error?: number; message?: string };
    } | null;

    if (body?.status?.error) {
      throw new Error(
        `Save Category Price gagal: ${body.status.message ?? JSON.stringify(body)}`,
      );
    }

    await this.page.waitForURL(/\/businessdevelopment\/pricelist-category\/?$/, {
      timeout: 90_000,
    });
  }

  private get createButton(): Locator {
    return this.page.getByRole('link', { name: 'Create', exact: true });
  }

  private get datalistSearchInput(): Locator {
    return this.page.getByRole('searchbox').first();
  }

  private get codeInput(): Locator {
    return this.page.getByPlaceholder('e.g: SHPRC');
  }

  private get categoryNameInput(): Locator {
    return this.page.getByPlaceholder('e.g: Shopee Price');
  }

  private get marginConfigPanel(): Locator {
    return this.page
      .getByRole('button', { name: 'Margin Price Configuration', exact: true })
      .locator('xpath=following-sibling::*[1]');
  }

  private get endPriceInput(): Locator {
    return this.marginConfigPanel.getByPlaceholder('End Margin Price');
  }

  private get marginTypeMultiselect(): Locator {
    return this.marginConfigPanel.getByRole('combobox').first();
  }

  private get marginValueInput(): Locator {
    return this.marginConfigPanel.getByPlaceholder('Margin Percentage/Amount').first();
  }

  private get basicInfoPanel(): Locator {
    return this.page
      .getByRole('button', { name: 'Basic Information', exact: true })
      .locator('xpath=following-sibling::*[1]');
  }

  private get appliedStoreMultiselect(): Locator {
    return this.basicInfoPanel.locator('.custom-multiselect').first();
  }

  private get showForAllCompanyCheckbox(): Locator {
    return this.basicInfoPanel.getByRole('checkbox');
  }
}
