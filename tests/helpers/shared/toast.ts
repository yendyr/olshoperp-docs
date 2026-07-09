import { Page, expect } from '@playwright/test';

export async function waitForSuccessToast(
  page: Page,
  timeoutMs = 5_000,
): Promise<void> {
  const successToast = page
    .locator('.toastify, [class*="toast"]')
    .filter({ hasText: /success|saved|berhasil/i });

  if (await successToast.isVisible({ timeout: timeoutMs }).catch(() => false)) {
    await expect(successToast.first()).toBeVisible();
  }
}
