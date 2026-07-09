import { Page } from '@playwright/test';

/**
 * Tutup banner staging. Jangan pakai getByRole('button', { name: 'Close' }) saja —
 * bentrok dengan tombol "Closed" di datalist.
 */
export async function dismissStagingBanner(page: Page): Promise<void> {
  const closeButton = page.locator('button.btn-close[aria-label="Close"]');
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}
