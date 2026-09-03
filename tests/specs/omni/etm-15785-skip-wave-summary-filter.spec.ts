import { test, expect } from '@playwright/test';

test.describe('ETM-15785 — Skip Wave Process Advanced Filter: Skip Wave Summary', () => {
  test('[@ETM-15785] Verify Skip Wave Summary filter with string/alias operators on merdian.olshoperp.com', async ({ browser }) => {
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

    console.log('Sample Row 1 Text:', initialRows[0].replace(/\s+/g, ' ').trim().slice(0, 120));

    const openAdvFilterIfNeeded = async () => {
      const isSbVisible = await page.locator('.dtsb-searchBuilder').first().isVisible().catch(() => false);
      if (!isSbVisible) {
        await page.locator('button:has-text("Advanced Filter"), button.dtsb-searchBuilder').first().click();
        await page.waitForTimeout(1500);
      }
    };

    const setupSummaryCondition = async (conditionVal: string, value1?: string) => {
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
      await dataSelect.selectOption('6'); // Skip Wave Summary
      await page.waitForTimeout(1000);

      const condSelect = page.locator('select.dtsb-condition').first();
      await condSelect.selectOption(conditionVal);
      await page.waitForTimeout(1000);

      if (value1) {
        const valInputs = page.locator('.dtsb-criteria input, .dtsb-criteria textarea, .dtsb-criteria select.dtsb-value');
        if ((await valInputs.count()) > 0) {
          const tagName = await valInputs.first().evaluate(el => el.tagName);
          if (tagName === 'SELECT') {
            await valInputs.first().selectOption(value1);
          } else {
            await valInputs.first().fill(value1);
            await valInputs.first().dispatchEvent('input');
            await valInputs.first().dispatchEvent('change');
          }
        }
      }
      await page.waitForTimeout(2000);

      await page.locator('button:has-text("Advanced Filter")').first().click();
      await page.waitForTimeout(5000);
    };

    // Test 1: Operator Contains (contains / Completed)
    console.log('\n--- Test 1: Operator Contains (Completed) ---');
    await setupSummaryCondition('contains', 'Completed');
    const completedRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Skip Wave Summary Contains 'Completed': ${completedRows.length}`);
    expect(completedRows.length).toBeGreaterThan(0);
    for (const r of completedRows) {
      console.log('Result Row:', r.replace(/\s+/g, ' ').trim().slice(0, 100));
      expect(r.toLowerCase()).toContain('completed');
    }

    // Test 2: Operator Starts With (starts / Completed)
    console.log('\n--- Test 2: Operator Starts With (Completed) ---');
    await setupSummaryCondition('starts', 'Completed');
    const startsRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Starts With 'Completed': ${startsRows.length}`);
    expect(startsRows.length).toBeGreaterThan(0);

    // Test 3: Operator Not Contains (!contains / Completed)
    console.log('\n--- Test 3: Operator Not Contains (!contains / Completed) ---');
    await setupSummaryCondition('!contains', 'Completed');
    const notCompletedRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Not Contains 'Completed': ${notCompletedRows.length}`);

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

    console.log('\n[PASS] ETM-15785 Skip Wave Summary Advanced Filter verification completed successfully on merdian.olshoperp.com!');
    await page.close();
  });
});
