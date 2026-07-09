import { Locator, Page, expect } from '@playwright/test';

/**
 * Komponen @vueform/multiselect di OlshopERP.
 * Selector utama: aria-placeholder pada input search di dalam .multiselect.
 */
export class OlshopMultiselect {
  constructor(private readonly page: Page) {}

  comboboxByAriaPlaceholder(placeholder: string): Locator {
    return this.page.locator(`[aria-placeholder="${placeholder}"]`).first();
  }

  comboboxByPlaceholderFragment(fragment: string): Locator {
    return this.page
      .locator(
        [
          `[placeholder*="${fragment}"]`,
          `[aria-placeholder*="${fragment}"]`,
          `.multiselect-search[aria-placeholder*="${fragment}"]`,
        ].join(', '),
      )
      .locator('visible=true')
      .first();
  }

  multiselectRoot(combobox: Locator): Locator {
    return this.page.locator('.multiselect').filter({ has: combobox }).first();
  }

  visibleOptions(page: Page = this.page): Locator {
    return page
      .locator('.multiselect-option:visible')
      .filter({ hasNotText: 'No results found' });
  }

  async selectedLabel(combobox: Locator): Promise<string> {
    const multiselect = this.multiselectRoot(combobox);
    const singleLabel = multiselect.locator('.multiselect-single-label');

    if (await singleLabel.isVisible().catch(() => false)) {
      return (await singleLabel.textContent())?.trim() ?? '';
    }

    const comboboxText = (await combobox.textContent())?.trim() ?? '';
    if (comboboxText && !/^choose\b/i.test(comboboxText)) {
      return comboboxText;
    }

    return (await multiselect.textContent())?.trim() ?? '';
  }

  async assertFilled(combobox: Locator, fieldLabel: string): Promise<void> {
    await expect(combobox, `${fieldLabel} should be visible`).toBeVisible();
    const text = await this.selectedLabel(combobox);
    expect(text, `${fieldLabel} should be auto-filled`).not.toMatch(/^choose\b/i);
    expect(text.length, `${fieldLabel} should have a selected value`).toBeGreaterThan(0);
  }

  async open(combobox: Locator): Promise<void> {
    await combobox.scrollIntoViewIfNeeded();
    await combobox.click();
    await expect(combobox).toHaveAttribute('aria-expanded', 'true', { timeout: 15_000 });
  }

  async selectOption(
    combobox: Locator,
    optionName: string,
    options?: { exact?: boolean; typeToFilter?: string },
  ): Promise<void> {
    await this.open(combobox);

    if (options?.typeToFilter) {
      await combobox.fill(options.typeToFilter).catch(async () => {
        await combobox.pressSequentially(options.typeToFilter!, { delay: 50 });
      });
      await this.page.waitForTimeout(500);
    }

    const exact = options?.exact ?? true;
    const listboxOption = this.page.getByRole('option', {
      name: optionName,
      exact,
    });

    if (await listboxOption.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await listboxOption.click();
      return;
    }

    const pattern = exact
      ? new RegExp(`^${optionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
      : new RegExp(optionName, 'i');

    await this.visibleOptions()
      .filter({ hasText: pattern })
      .first()
      .click({ timeout: 20_000 });
  }

  labelToFlexiblePattern(expectedLabel: string): RegExp {
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

  async ensureValue(
    combobox: Locator,
    expectedLabel: string,
    blurTarget?: Locator,
  ): Promise<void> {
    const pattern = this.labelToFlexiblePattern(expectedLabel);
    const current = await this.selectedLabel(combobox);

    if (pattern.test(current)) {
      return;
    }

    await this.open(combobox);
    const searchToken = expectedLabel.replace(/&/g, '').trim();
    await combobox.fill(searchToken).catch(async () => {
      await combobox.pressSequentially(searchToken, { delay: 50 });
    });
    await this.page.waitForTimeout(500);

    const multiselect = this.multiselectRoot(combobox);
    const scopedOptions = multiselect.getByRole('option', { name: pattern });
    const globalOption = this.page.getByRole('option', { name: pattern }).first();
    const multiselectOption = this.visibleOptions()
      .filter({ hasText: pattern })
      .first();

    if (await scopedOptions.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await scopedOptions.first().click();
    } else if (await globalOption.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await globalOption.click();
    } else {
      await multiselectOption.click({ timeout: 20_000 });
    }

    await this.page.waitForTimeout(300);
    if (blurTarget) {
      await blurTarget.click();
    }

    const selected = await this.selectedLabel(combobox);
    expect(selected, `Dropdown harus menampilkan "${expectedLabel}"`).toMatch(pattern);
  }
}
