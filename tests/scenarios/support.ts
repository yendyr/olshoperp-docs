import type { Page } from '@playwright/test';

/**
 * Util bersama untuk scenario layer.
 * Scenario = implementasi runnable dari SATU TC origin per menu (lihat header tiap file).
 * Spec single-menu dan spec flow sama-sama memanggil scenario yang sama —
 * urutan langkah TC hanya hidup di satu tempat.
 */

export async function assertNoBlocker(page: Page, context: string): Promise<void> {
  const blockerToast = page
    .locator('.toastify, [class*="toast"]')
    .filter({ hasText: /error|gagal|failed|tidak dapat|cannot|required/i })
    .filter({ hasNotText: /fiscal period/i });
  if (await blockerToast.isVisible({ timeout: 1_500 }).catch(() => false)) {
    const msg = await blockerToast.first().textContent();
    throw new Error(`BLOCKER (${context}): ${msg?.trim() ?? 'validasi backend'}`);
  }
}

export type ProductLine = { sku: string; qty: number };
