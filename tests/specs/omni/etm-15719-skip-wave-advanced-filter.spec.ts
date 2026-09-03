import { test, expect } from '@playwright/test';

test.describe('ETM-15719 — Skip Wave Process Advanced Filter Verification (merdian.olshoperp.com)', () => {
  const baseUrl = 'https://merdian.olshoperp.com';
  const email = 'yemimamerdian@gmail.com';
  const pass = '12345678';

  test('[@ETM-15719] Test Advanced Filter on Skip Wave Process via Web UI Crawling', async ({ page }) => {
    test.setTimeout(240_000);

    // 1. Navigate to Merdian Login
    console.log('Step 1: Navigating to', baseUrl + '/login');
    await page.goto(baseUrl + '/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Check if login form is displayed
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="Email"]').first();
    const passInput = page.locator('input[name="password"], input[type="password"]').first();
    const loginBtn = page.locator('button:has-text("Login"), button[type="submit"]').first();

    if (await emailInput.isVisible()) {
      console.log('Step 2: Performing login on Merdian...');
      await emailInput.fill(email);
      await passInput.fill(pass);
      await loginBtn.click();
      await page.waitForTimeout(5000);
      await page.waitForLoadState('networkidle').catch(() => undefined);
    }

    // 2. Navigate to Skip Wave Process
    console.log('Step 3: Navigating to /omni/skip-wave-process...');
    await page.goto(baseUrl + '/omni/skip-wave-process', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await page.screenshot({ path: 'tests/scratch/merdian-skip-wave-datalist.png', fullPage: true });

    // 3. Inspect Table rows
    const rows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Datalist loaded with ${rows.length} rows.`);
    if (rows.length > 0) {
      console.log('Sample row 1:', rows[0].replace(/\s+/g, ' ').trim());
    }

    // 4. Locate Advanced Filter button
    console.log('Step 4: Locating Advanced Filter button...');
    const advFilterBtn = page.locator('button:has-text("Advanced Filter"), button:has-text("Filter"), button.dtsb-searchBuilder, button.btn-secondary:has(svg)').first();
    const isAdvFilterVisible = await advFilterBtn.isVisible().catch(() => false);
    console.log('Is Advanced Filter button visible?', isAdvFilterVisible);

    if (isAdvFilterVisible) {
      await advFilterBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'tests/scratch/merdian-adv-filter-modal.png' });
    }

    // 5. Inspect SearchBuilder container / controls
    const sbContainer = page.locator('.dtsb-searchBuilder, .modal, [role="dialog"]').first();
    const isSbVisible = await sbContainer.isVisible().catch(() => false);
    console.log('SearchBuilder container visible?', isSbVisible);

    if (isSbVisible) {
      // Check available columns/fields in SearchBuilder
      const columnSelect = page.locator('select.dtsb-data, select[class*="data"]').first();
      if (await columnSelect.isVisible()) {
        const options = await columnSelect.locator('option').allTextContents();
        console.log('Available columns in SearchBuilder dropdown:', options.map(o => o.trim()).filter(Boolean));
      }
    }

    console.log('Search & crawling test completed safely without mutations on Merdian server.');
  });
});
