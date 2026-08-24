import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Search via .dt-search input on unassign-wave', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  const dtSearch = page.locator('.dt-search input, input.dt-input').first();
  console.log('dtSearch visible:', await dtSearch.isVisible());

  await dtSearch.click();
  await dtSearch.fill('SO-5U7TQKCP');
  await dtSearch.press('Enter');
  await page.waitForTimeout(3000);

  const rows = await page.locator('table tbody tr').allInnerTexts();
  console.log('Rows found with .dt-search:', rows);

  // Check Advanced Filter button
  const advFilterBtn = page.locator('button:has-text("Advanced Filter"), .buttons-searchBuilder').first();
  console.log('advFilterBtn visible:', await advFilterBtn.isVisible());
  if (await advFilterBtn.isVisible()) {
    await advFilterBtn.click();
    await page.waitForTimeout(1000);
    const addCondBtn = page.locator('button.dtsb-add, button:has-text("Add Condition")').first();
    console.log('addCondBtn visible:', await addCondBtn.isVisible());
  }
});
