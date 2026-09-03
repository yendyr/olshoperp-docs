import { test, expect } from '@playwright/test';

test.describe('ETM-15784 — Skip Wave Process Advanced Filter: Processing Date', () => {
  test('[@ETM-15784] Verify Processing Date filter with date operators on merdian.olshoperp.com', async ({ browser }) => {
    test.setTimeout(300_000);

    const page = await browser.newPage();
    const baseUrl = 'https://merdian.olshoperp.com';
    const email = 'yemimamerdian@gmail.com';
    const pass = '12345678';

    console.log('1. Navigating to login on', baseUrl);
    await page.goto(baseUrl + '/login', { waitUntil: 'networkidle' });

    await page.locator('input[placeholder="Email"]').first().fill(email);
    await page.locator('input[placeholder="Password"]').first().fill(pass);
    await page.locator('button:has-text("Sign In"), button:has-text("Login"), button[type="submit"]').first().click();
    console.log('Login submitted. Waiting for dashboard navigation...');
    await page.waitForTimeout(6000);

    console.log('2. Navigating to Skip Wave Process...');
    await page.goto(baseUrl + '/omni/skip-wave-process', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    const initialRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Initial rows count: ${initialRows.length}`);
    expect(initialRows.length).toBeGreaterThan(0);

    const openAdvFilterIfNeeded = async () => {
      const isSbVisible = await page.locator('.dtsb-searchBuilder').first().isVisible().catch(() => false);
      if (!isSbVisible) {
        await page.locator('button:has-text("Advanced Filter"), button.dtsb-searchBuilder').first().click();
        await page.waitForTimeout(1500);
      }
    };

    const setupProcessingDateCondition = async (conditionVal: string, value1?: string, value2?: string) => {
      await openAdvFilterIfNeeded();
      
      const clearBtn = page.locator('button.dtsb-clearAll').first();
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await page.waitForTimeout(1000);
      }

      const addBtn = page.locator('button.dtsb-add').first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(1000);
      }

      const dataSelect = page.locator('select.dtsb-data').first();
      await dataSelect.selectOption('5'); // Processing Date
      await page.waitForTimeout(1000);

      const condSelect = page.locator('select.dtsb-condition').first();
      await condSelect.selectOption(conditionVal);
      await page.waitForTimeout(1000);

      const valInputs = page.locator('.dtsb-criteria input');
      if (value1) {
        await valInputs.first().fill(value1);
        await valInputs.first().dispatchEvent('input');
        await valInputs.first().dispatchEvent('change');
      }
      if (value2 && (await valInputs.count()) > 1) {
        await valInputs.nth(1).fill(value2);
        await valInputs.nth(1).dispatchEvent('input');
        await valInputs.nth(1).dispatchEvent('change');
      }
      await page.waitForTimeout(2000);

      await page.locator('button:has-text("Advanced Filter")').first().click();
      await page.waitForTimeout(5000);
    };

    // Test 1: Operator Between (01-01-2026 to 31-12-2026)
    console.log('\n--- Test 1: Operator Between (01-01-2026 to 31-12-2026) ---');
    await setupProcessingDateCondition('between', '01-01-2026', '31-12-2026');
    const betweenRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Processing Date Between: ${betweenRows.length}`);
    expect(betweenRows.length).toBeGreaterThan(0);

    // Test 2: Operator Before (< 31-12-2026)
    console.log('\n--- Test 2: Operator Before (< 31-12-2026) ---');
    await setupProcessingDateCondition('<', '31-12-2026');
    const beforeRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Before 31-12-2026: ${beforeRows.length}`);
    expect(beforeRows.length).toBeGreaterThan(0);

    // Test 3: Operator After (> 01-01-2026)
    console.log('\n--- Test 3: Operator After (> 01-01-2026) ---');
    await setupProcessingDateCondition('>', '01-01-2026');
    const afterRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for After 01-01-2026: ${afterRows.length}`);
    expect(afterRows.length).toBeGreaterThan(0);

    // Test 4: Clear Filter
    console.log('\n--- Test 4: Clear Filter ---');
    await openAdvFilterIfNeeded();
    const clearBtn = page.locator('button.dtsb-clearAll').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(2000);
      await page.locator('button:has-text("Advanced Filter")').first().click();
      await page.waitForTimeout(4000);
      const resetRows = await page.locator('table tbody tr').allInnerTexts();
      console.log(`Rows returned after Clear: ${resetRows.length}`);
      expect(resetRows.length).toBe(initialRows.length);
    }

    console.log('\n[PASS] ETM-15784 Processing Date Advanced Filter verification completed successfully on merdian.olshoperp.com!');
    await page.close();
  });
});
