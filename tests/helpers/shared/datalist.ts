import { Locator, Page, expect } from '@playwright/test';
import { dismissStagingBanner } from './staging-banner';

export type DatalistCreateButtonMode = 'link' | 'button' | 'auto';

/**
 * Pola datalist OlshopERP — searchbox, table, tombol Create (link atau button).
 * Selector diverifikasi dari Vue (DataTablesV3 + TopBar), bukan POM generator.
 */
export class OlshopDatalist {
  constructor(private readonly page: Page) {}

  get searchInput(): Locator {
    return this.page.getByRole('searchbox').first();
  }

  get table(): Locator {
    return this.page.getByRole('table').first();
  }

  /** Create umumnya link; beberapa menu (PR) pakai button — mode auto mencoba keduanya. */
  createButton(mode: DatalistCreateButtonMode = 'auto'): Locator {
    const link = this.page.getByRole('link', { name: 'Create', exact: true });
    const button = this.page.locator('button:has-text("Create")');

    if (mode === 'link') {
      return link;
    }
    if (mode === 'button') {
      return button;
    }

    return link.or(button).first();
  }

  async gotoAndWait(path: string, createMode: DatalistCreateButtonMode = 'auto'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await dismissStagingBanner(this.page);
    await expect(this.table).toBeVisible({ timeout: 45_000 });
    await expect(this.createButton(createMode)).toBeVisible({ timeout: 45_000 });
  }

  async search(query: string, settleMs = 1_500): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(settleMs);
  }

  async clickCreate(createMode: DatalistCreateButtonMode = 'auto'): Promise<void> {
    const btn = this.createButton(createMode);
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
  }

  async assertRowContains(text: string): Promise<void> {
    await expect(this.page.getByRole('row').filter({ hasText: text }).first()).toBeVisible({
      timeout: 30_000,
    });
  }

  async assertLinkVisible(name: string, exact = true): Promise<void> {
    await expect(this.page.getByRole('link', { name, exact })).toBeVisible({
      timeout: 30_000,
    });
  }

  async isLinkVisible(name: string, exact = true): Promise<boolean> {
    return this.page
      .getByRole('link', { name, exact })
      .isVisible()
      .catch(() => false);
  }

  /** Edit/show per baris — `#updateButton` (PR, PO, dll.). */
  editButton(row?: Locator): Locator {
    return (row ?? this.page).locator('#updateButton');
  }
}
