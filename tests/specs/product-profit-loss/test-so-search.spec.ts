import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Search SO-5U7TQKCP in unassign wave UI', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  // Print all search inputs
  const inputs = await page.locator('input').all();
  console.log('Total inputs on page:', inputs.length);

  // Type in the search input
  const search = page.locator('.dataTables_filter input, input[type="search"]').first();
  await search.click();
  await search.fill('SO-5U7TQKCP');
  await search.press('Enter');
  await page.waitForTimeout(3000);

  const rows = await page.locator('table tbody tr').allInnerTexts();
  console.log('Rows found:', rows);
});
