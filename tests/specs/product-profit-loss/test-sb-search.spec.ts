import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test.describe.configure({ retries: 0 });

test('Search SO-5U7TQKCP via SearchBuilder on Unassign Wave', async ({ page }) => {
  test.setTimeout(180_000);
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  // Click Add Condition in SearchBuilder
  console.log('Clicking Add Condition in SearchBuilder...');
  const addCondBtn = page.locator('button.dtsb-add, button:has-text("Add Condition")').first();
  await expect(addCondBtn).toBeVisible({ timeout: 15000 });
  await addCondBtn.click();
  await page.waitForTimeout(1000);

  // Select Column: Trx. Code
  console.log('Selecting Trx. Code in SearchBuilder...');
  const dataSelect = page.locator('select.dtsb-data').last();
  await dataSelect.selectOption({ label: 'Trx. Code' });
  await page.waitForTimeout(1000);

  // Type value: SO-5U7TQKCP
  console.log('Filling search value SO-5U7TQKCP...');
  const valInput = page.locator('input.dtsb-value, input.dtsb-input').last();
  await valInput.fill('SO-5U7TQKCP');
  await valInput.press('Enter');
  await page.waitForTimeout(4000);

  const rows = await page.locator('table tbody tr').allInnerTexts();
  console.log('Rows found after SearchBuilder:', rows);

  const row = page.locator('table tbody tr').filter({ hasText: /SO-5U7TQKCP/i }).first();
  await expect(row, 'Row for SO-5U7TQKCP').toBeVisible({ timeout: 15000 });
  console.log('Found row text:', await row.innerText());
});
