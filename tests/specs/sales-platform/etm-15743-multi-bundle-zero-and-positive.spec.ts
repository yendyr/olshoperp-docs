import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15743 — Multi-bundle kombinasi Price = 0 dan Price > 0 (Sales Platform)', () => {
  const companyCode = 'FAT';
  const orderId = 409573;
  const orderNumber = 'SO-68ABC8A4';
  const platformOrderId = '250825PWJS8GEK';

  test('[@TC-SPLG-DRAFT-20260902170804][@ETM-15743] Verify multi-bundle order with 12JPITBUNG-HL-blue (price 0) and 12JPITBUNG-HL-purple (price > 0)', async ({ page }) => {
    test.setTimeout(240_000);

    // 1. Prepare authenticated session in FAT
    console.log('Step 1: Preparing session for company FAT...');
    await prepareSession(page, {
      companyCode,
      targetPath: `/omni/sales-order/edit/${orderId}`,
    });

    console.log(`Step 2: Navigating to /omni/sales-order/edit/${orderId}...`);
    await page.goto(`/omni/sales-order/edit/${orderId}`, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.waitForTimeout(5000);

    // Initial screenshot
    await page.screenshot({ path: `tests/scratch/order-${orderId}-multi-bundle-initial.png`, fullPage: true });

    // Setup network listener for extract-bundle requests
    const extractResponses: Array<{ status: number; body: any; url: string }> = [];
    page.on('response', async (res) => {
      if (res.url().includes('extract-bundle')) {
        const status = res.status();
        let body: any = null;
        try {
          body = await res.json();
        } catch (e) {
          body = await res.text().catch(() => '');
        }
        extractResponses.push({ status, body, url: res.url() });
        console.log('[API extract-bundle response]:', status, JSON.stringify(body));
      }
    });

    // 2. Locate table rows
    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    console.log(`Total rows in order ${orderNumber}: ${rowCount}`);

    for (let i = 0; i < rowCount; i++) {
      const text = await rows.nth(i).innerText().catch(() => '');
      console.log(`  Row ${i}:`, text.replace(/\n+/g, ' | ').slice(0, 160));
    }

    // 3. Test Bundle 1: SKU 12JPITBUNG-HL-blue (Price = 0)
    console.log('\n--- Step 3: Testing SKU 12JPITBUNG-HL-blue (Price = 0) ---');
    const blueRow = page.locator('table tbody tr').filter({ hasText: '12JPITBUNG-HL-blue' }).first();
    const isBlueVisible = await blueRow.isVisible().catch(() => false);
    console.log('Row 12JPITBUNG-HL-blue visible?', isBlueVisible);
    expect(isBlueVisible).toBe(true);

    const blueExtractIcon = blueRow.locator('svg[data-icon="box-open"], svg.fa-box-open').first();
    await expect(blueExtractIcon).toBeVisible({ timeout: 10_000 });

    console.log('Clicking Extract on 12JPITBUNG-HL-blue (Price = 0)...');
    await blueExtractIcon.click();
    await page.waitForTimeout(4000);

    // Capture screenshot after blue extract
    await page.screenshot({ path: `tests/scratch/order-${orderId}-after-blue-extract.png`, fullPage: true });

    // Verify rejection for Price = 0
    const lastResBlue = extractResponses[extractResponses.length - 1];
    console.log('Result for 12JPITBUNG-HL-blue:', lastResBlue);
    expect(lastResBlue?.status).toBe(422);
    expect(lastResBlue?.body?.status?.message).toBe('Unable to extract this bundle, the price must be greater than zero.');

    // 4. Test Bundle 2: SKU 12JPITBUNG-HL-purple (Price > 0)
    console.log('\n--- Step 4: Testing SKU 12JPITBUNG-HL-purple (Price > 0) ---');
    const purpleRow = page.locator('table tbody tr').filter({ hasText: '12JPITBUNG-HL-purple' }).first();
    const isPurpleVisible = await purpleRow.isVisible().catch(() => false);
    console.log('Row 12JPITBUNG-HL-purple visible?', isPurpleVisible);
    expect(isPurpleVisible).toBe(true);

    const purpleExtractIcon = purpleRow.locator('svg[data-icon="box-open"], svg.fa-box-open').first();
    await expect(purpleExtractIcon).toBeVisible({ timeout: 10_000 });

    console.log('Clicking Extract on 12JPITBUNG-HL-purple (Price > 0)...');
    await purpleExtractIcon.click();
    await page.waitForTimeout(4000);

    // Capture screenshot after purple extract
    await page.screenshot({ path: `tests/scratch/order-${orderId}-after-purple-extract.png`, fullPage: true });

    // Verify success for Price > 0
    const lastResPurple = extractResponses[extractResponses.length - 1];
    console.log('Result for 12JPITBUNG-HL-purple:', lastResPurple);
    expect(lastResPurple?.status).toBe(200);
    expect(lastResPurple?.body?.status?.message).toBe('Sales order details successfully extracted');

    console.log('\n[PASS] ETM-15743 multi-bundle verification completed successfully!');
  });
});
