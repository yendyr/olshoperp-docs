import { Page } from '@playwright/test';

/**
 * Tutup banner staging. Jangan pakai getByRole('button', { name: 'Close' }) saja —
 * bentrok dengan tombol "Closed" di datalist.
 */
export async function dismissStagingBanner(page: Page): Promise<void> {
  const closeButton = page.locator('button.btn-close[aria-label="Close"]').first();
  if (!(await closeButton.isVisible({ timeout: 1_500 }).catch(() => false))) {
    return;
  }

  await closeButton.click({ force: true, timeout: 5_000 }).catch(() => undefined);
  await page.waitForTimeout(200);
}
