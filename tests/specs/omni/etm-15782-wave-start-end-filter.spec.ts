import { test, expect } from '@playwright/test';

test.describe('ETM-15782 — Skip Wave Process Advanced Filter: Wave Start & End', () => {
  test('[@ETM-15782] Verify Wave Start & End filter with datetime operators on merdian.olshoperp.com', async ({ browser }) => {
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

    const openAdvFilterIfNeeded = async () => {
      const isSbVisible = await page.locator('.dtsb-searchBuilder').first().isVisible().catch(() => false);
      if (!isSbVisible) {
        await page.locator('button:has-text("Advanced Filter"), button.dtsb-searchBuilder').first().click();
        await page.waitForTimeout(1500);
      }
    };

    const setupWaveStartCondition = async (conditionVal: string, value1?: string, value2?: string) => {
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
      await dataSelect.selectOption('3'); // Wave Start & End
      await page.waitForTimeout(1000);

      const condSelect = page.locator('select.dtsb-condition').first();
      await condSelect.selectOption(conditionVal);
      await page.waitForTimeout(1000);

      if (value1) {
        const valInputs = page.locator('.dtsb-criteria input, .dtsb-criteria textarea');
        await valInputs.first().fill(value1);
        await valInputs.first().dispatchEvent('input');
        await valInputs.first().dispatchEvent('change');
        if (value2 && (await valInputs.count()) > 1) {
          await valInputs.nth(1).fill(value2);
          await valInputs.nth(1).dispatchEvent('input');
          await valInputs.nth(1).dispatchEvent('change');
        }
      }
      await page.waitForTimeout(2000);

      await page.locator('button:has-text("Advanced Filter")').first().click();
      await page.waitForTimeout(5000);
    };

    // Test 1: Operator Equals (= / 30-08-2026)
    console.log('\n--- Test 1: Operator Equals (= / 30-08-2026) ---');
    await setupWaveStartCondition('=', '30-08-2026');
    const equalsRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Wave Start Equals (30-08-2026): ${equalsRows.length}`);
    expect(equalsRows.length).toBeGreaterThan(0);
    for (const r of equalsRows) {
      console.log('Result Row:', r.replace(/\s+/g, ' ').trim().slice(0, 100));
      expect(r).toContain('30-08-2026');
    }

    // Test 2: Operator Before (< 31-12-2026)
    console.log('\n--- Test 2: Operator Before (< 31-12-2026) ---');
    await setupWaveStartCondition('<', '31-12-2026');
    const beforeRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Before 31-12-2026: ${beforeRows.length}`);
    expect(beforeRows.length).toBeGreaterThan(0);

    // Test 3: Operator Between (01-08-2026 to 31-08-2026)
    console.log('\n--- Test 3: Operator Between (01-08-2026 to 31-08-2026) ---');
    await setupWaveStartCondition('between', '01-08-2026', '31-08-2026');
    const betweenRows = await page.locator('table tbody tr').allInnerTexts();
    console.log(`Rows returned for Between (August 2026): ${betweenRows.length}`);
    expect(betweenRows.length).toBeGreaterThan(0);

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

    console.log('\n[PASS] ETM-15782 Wave Start & End Advanced Filter verification completed successfully on merdian.olshoperp.com!');
    await context.close();
  });
});
