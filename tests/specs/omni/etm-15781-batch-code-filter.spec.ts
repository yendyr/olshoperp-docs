import { test, expect } from '@playwright/test';

test.describe('ETM-15781 — Skip Wave Process Advanced Filter: Batch Code', () => {
  test('[@ETM-15781] Verify Batch Code filter with string operators on merdian.olshoperp.com', async ({ browser }) => {
    test.setTimeout(300_000);

    const context = await browser.newContext();
    const page = await context.newPage();

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
    await page.waitForLoadState('networkidle').catch(() => undefined);

    console.log('2. Navigating to Skip Wave Process...');
    await page.goto(baseUrl + '/omni/skip-wave-process', { waitUntil: 'networkidle' });
    await page.waitForTimeout(5000);

    const initialRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Initial rows count: ${initialRows.length}`);
    expect(initialRows.length).toBeGreaterThan(0);

    const sampleBatchCode = 'SW-20260828094005123-IU';
    console.log('Target Batch Code:', sampleBatchCode);

    const openAdvFilterIfNeeded = async () => {
      const isSbVisible = await page.locator('.dtsb-searchBuilder').first().isVisible().catch(() => false);
      if (!isSbVisible) {
        await page.locator('button:has-text("Advanced Filter"), button.dtsb-searchBuilder').first().click();
        await page.waitForTimeout(1500);
      }
    };

    const setupBatchCodeCondition = async (conditionVal: string, valueText: string) => {
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
      await dataSelect.selectOption('2'); // batch code
      await page.waitForTimeout(1000);

      const condSelect = page.locator('select.dtsb-condition').first();
      await condSelect.selectOption(conditionVal);
      await page.waitForTimeout(1000);

      const valueEl = page.locator('.dtsb-criteria textarea, .dtsb-criteria input').first();
      await valueEl.fill(valueText);
      await valueEl.dispatchEvent('input');
      await valueEl.dispatchEvent('change');
      await valueEl.press('Enter');
      await page.waitForTimeout(3000);

      await page.locator('button:has-text("Advanced Filter")').first().click();
      await page.waitForTimeout(4000);
    };

    // Test 1: Equals (=)
    console.log('\n--- Test 1: Operator Equals (=) ---');
    await setupBatchCodeCondition('=', sampleBatchCode);
    const equalsRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Equals: ${equalsRows.length}`);
    expect(equalsRows.length).toBe(1);
    expect(equalsRows[0]).toContain(sampleBatchCode);

    // Test 2: Contains ("SW-20260828")
    console.log('\n--- Test 2: Operator Contains ("SW-20260828") ---');
    await setupBatchCodeCondition('contains', 'SW-20260828');
    const containsRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Contains: ${containsRows.length}`);
    expect(containsRows.length).toBeGreaterThan(0);
    for (const r of containsRows) {
      expect(r).toContain('SW-20260828');
    }

    // Test 3: Starts With ("SW-")
    console.log('\n--- Test 3: Operator Starts With ("SW-") ---');
    await setupBatchCodeCondition('starts', 'SW-');
    const startsRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Starts With: ${startsRows.length}`);
    expect(startsRows.length).toBeGreaterThan(0);
    for (const r of startsRows) {
      expect(r).toContain('SW-');
    }

    // Test 4: Not Equals (!=)
    console.log('\n--- Test 4: Operator Not (!=) ---');
    await setupBatchCodeCondition('!=', sampleBatchCode);
    const notRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Not (!= ${sampleBatchCode}): ${notRows.length}`);
    for (const r of notRows) {
      expect(r).not.toContain(sampleBatchCode);
    }

    // Test 5: Clear Filter
    console.log('\n--- Test 5: Clear Filter ---');
    await openAdvFilterIfNeeded();
    const clearBtn = page.locator('button.dtsb-clearAll').first();
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.waitForTimeout(2000);
      await page.locator('button:has-text("Advanced Filter")').first().click();
      await page.waitForTimeout(4000);
      const resetRows = await page.locator('table tbody tr').allInnerTexts();
      console.log(`Rows returned after Clear: ${resetRows.length}`);
    }

    console.log('\n[PASS] ETM-15781 Batch Code Advanced Filter verification completed successfully on merdian.olshoperp.com!');
    await context.close();
  });
});
