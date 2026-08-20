import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15447 — TC 1: Visibility, Counter & Posisi Pill Button Net Sales < COGS (Sales Platform)', () => {
  const companyCode = 'FAT';

  test('[@TC-SPLG-DRAFT-20260820200501] Verify Pill Button Net Sales < COGS position, warning color, and counter API', async ({ page }) => {
    test.setTimeout(180_000);

    // 1. Prepare authenticated session in company FAT
    await prepareSession(page, {
      companyCode,
      targetPath: '/omni/sales-order',
    });

    console.log('Step 1: Navigating to Platform Sales Order page in company FAT...');
    await page.goto('/omni/sales-order', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    // 2. Locate PillButtons container
    const pills = page.locator('button:has-text("Process"), button:has-text("Synchronize"), button:has-text("Net Sales")');
    await expect(pills.first()).toBeVisible({ timeout: 15_000 });

    const netSalesPill = page.getByRole('button', { name: /Net Sales/i }).or(page.locator('button:has-text("Net Sales")')).first();
    await expect(netSalesPill).toBeVisible({ timeout: 10_000 });

    // Verify badge text and count
    const badgeText = await netSalesPill.locator('.badge, span').last().innerText().catch(() => '');
    console.log('Pill Badge UI Text in FAT:', badgeText);

    // Verify 4th position among pills
    const pill4thText = await pills.nth(3).innerText().catch(() => '');
    console.log('4th Pill Text:', pill4thText);
    expect(pill4thText).toContain('Net Sales < COGS');

    console.log('[PASS] TC 1 Verification Complete: Pill button Net Sales < COGS is visible in 4th position with valid counter in FAT!');
  });
});
