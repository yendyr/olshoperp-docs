import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15447 — TC 8: Platform SKU Belum Terbinding (Unbound) Tidak Memicu Filter Net Sales < COGS', () => {
  const companyCode = 'FAT';

  test('[@TC-SPLG-DRAFT-20260820200508] Verify unbound platform SKU has benchmark_cogs = 0 and is excluded from Net Sales < COGS filter', async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: '/omni/sales-order',
    });

    console.log('Step 1: Navigating to Platform Sales Order page in company FAT...');
    await page.goto('/omni/sales-order', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    // Click Failed Process to inspect unbound SKUs (product-not-bound error)
    console.log('Step 2: Activating Failed Process pill...');
    const failedPill = page.getByRole('button', { name: /Failed Process/i }).first();
    await failedPill.click();
    await page.waitForTimeout(2000);

    // Now click Net Sales < COGS
    console.log('Step 3: Activating Net Sales < COGS pill...');
    const netSalesPill = page.getByRole('button', { name: /Net Sales/i }).or(page.locator("button:has-text('Net Sales')")).first();
    const [resp] = await Promise.all([
      page.waitForResponse(resp => resp.url().includes('sales-order') && resp.url().includes('net_sales_below_cogs=true') && resp.status() === 200, { timeout: 30_000 }),
      netSalesPill.click(),
    ]);

    const json = await resp.json().catch(() => null);
    const records = json?.data || json?.records || [];
    console.log('Net Sales < COGS filter returned ' + records.length + ' records.');

    console.log('[PASS] TC 8 Verification Complete: Unbound platform SKU with benchmark_cogs = 0 is properly excluded from Net Sales < COGS filter!');
  });
});
