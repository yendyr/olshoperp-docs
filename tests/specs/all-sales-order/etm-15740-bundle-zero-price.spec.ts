import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15740 / ETM-15733 — Extract SKU Bundle with Price = 0 in Order 371999', () => {
  const companyCode = 'FAT';

  test('[@TC-SPLG-DRAFT-20260902170801][@ETM-15740] Verify Extract on bundle with price 0 is rejected with 422 error', async ({ page }) => {
    test.setTimeout(180_000);

    // 1. Prepare session in company FAT and navigate to order 371999
    console.log('Step 1: Preparing session for company FAT...');
    await prepareSession(page, {
      companyCode,
      targetPath: '/businessdevelopment/all-sales-order/edit/371999',
    });

    console.log('Step 2: Navigating to /businessdevelopment/all-sales-order/edit/371999...');
    await page.goto('/businessdevelopment/all-sales-order/edit/371999', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.waitForTimeout(4000);

    // Take screenshot of initial state
    await page.screenshot({ path: 'tests/scratch/order-371999-initial.png', fullPage: true });

    // 2. Setup listener for extract-bundle API response
    let apiResponseStatus: number | null = null;
    let apiResponseBody: any = null;

    page.on('response', async (response) => {
      if (response.url().includes('extract-bundle')) {
        apiResponseStatus = response.status();
        try {
          apiResponseBody = await response.json();
          console.log('[API Response] extract-bundle:', apiResponseStatus, JSON.stringify(apiResponseBody));
        } catch (e) {
          console.log('[API Response] extract-bundle text:', apiResponseStatus, await response.text().catch(() => ''));
        }
      }
    });

    // 3. Locate the Extract button (fa-box-open SVG in bundle row)
    const extractIcon = page.locator('svg[data-icon="box-open"], svg.fa-box-open').first();
    await expect(extractIcon).toBeVisible({ timeout: 15_000 });

    console.log('Step 3: Clicking the Extract button (fa-box-open)...');
    await extractIcon.click();
    await page.waitForTimeout(3000);

    // 4. Capture screenshot after action
    await page.screenshot({ path: 'tests/scratch/order-371999-after-action.png', fullPage: true });

    // 5. Assert API Response
    expect(apiResponseStatus).toBe(422);
    expect(apiResponseBody?.status?.error).toBe(1);
    expect(apiResponseBody?.status?.message).toBe('Unable to extract this bundle, the price must be greater than zero.');

    console.log('[PASS] ETM-15740 validation confirmed: Extract was rejected with expected message:', apiResponseBody?.status?.message);
  });
});
