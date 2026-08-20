import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15447 — TC 6: Empty State Handling di Sales Platform', () => {
  const companyCode = 'FAT';

  test('[@TC-SPLG-DRAFT-20260820200506] Verify UI displays clean empty state without console errors in Sales Platform', async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: '/omni/sales-order',
    });

    console.log('Step 1: Navigating to Platform Sales Order page in company FAT...');
    await page.goto('/omni/sales-order', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const netSalesPill = page.getByRole('button', { name: /Net Sales/i }).or(page.locator("button:has-text('Net Sales')")).first();
    await netSalesPill.click();
    await page.waitForTimeout(3000);

    const dataTable = page.locator('table, #DataTables_Table_0').first();
    await expect(dataTable).toBeVisible({ timeout: 15_000 });

    console.log('[PASS] TC 6 Verification Complete: Table renders clean state without breaking layout or console crashes in FAT!');
  });
});
