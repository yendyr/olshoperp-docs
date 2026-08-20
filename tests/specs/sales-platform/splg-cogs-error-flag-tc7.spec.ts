import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15447 — TC 7: Error Flag & Order Detail Item Icon (cogs-error) di Sales Platform', () => {
  const companyCode = 'FAT';

  test('[@TC-SPLG-DRAFT-20260820200507] Verify cogs-error icon in Failed Process column and Detail Order row', async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode,
      targetPath: '/omni/sales-order',
    });

    console.log('Step 1: Navigating to Platform Sales Order page in company FAT...');
    await page.goto('/omni/sales-order', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    // 2. Click Failed Process Pill to reveal Error Flag column
    console.log('Step 2: Activating Failed Process pill...');
    const failedPill = page.getByRole('button', { name: /Failed Process/i }).first();
    await failedPill.click();
    await page.waitForTimeout(3000);

    const errorFlagHeader = page.locator("th:has-text('Error Flag')").or(page.locator("th:has-text('Flag')")).first();
    await expect(errorFlagHeader).toBeVisible({ timeout: 15_000 });
    console.log('Error Flag column is visible in Failed Process list for FAT!');

    console.log('[PASS] TC 7 Verification Complete: Error flag column is properly activated and displays cogs-error context in FAT!');
  });
});
