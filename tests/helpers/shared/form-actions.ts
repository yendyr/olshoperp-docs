import { Locator, Page, expect } from '@playwright/test';

/**
 * Tombol aksi form umum OlshopERP.
 * Catatan: Save / Save All sering duplikat di halaman — pakai .last() sesuai pola Vue.
 */
export class OlshopFormActions {
  constructor(private readonly page: Page) {}

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save', exact: true }).last();
  }

  get saveAllButton(): Locator {
    return this.page.getByRole('button', { name: 'Save All', exact: true }).last();
  }

  get saveAndNextButton(): Locator {
    return this.page.getByRole('button', { name: 'Save & Next', exact: true }).last();
  }

  accordionSection(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  async expandAccordion(sectionName: string, maxAttempts = 3): Promise<void> {
    const section = this.accordionSection(sectionName);
    await section.scrollIntoViewIfNeeded();

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if ((await section.getAttribute('aria-expanded')) === 'true') {
        break;
      }
      await section.click();
      await this.page.waitForTimeout(1_000);
    }

    await expect(section).toHaveAttribute('aria-expanded', 'true', { timeout: 20_000 });
  }

  async clickSave(): Promise<void> {
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.saveButton.click();
  }

  async clickSaveAll(): Promise<void> {
    await this.saveAllButton.scrollIntoViewIfNeeded();
    await this.saveAllButton.click();
  }

  async clickSaveAndNext(): Promise<void> {
    await this.saveAndNextButton.scrollIntoViewIfNeeded();
    await this.saveAndNextButton.click();
  }
}
