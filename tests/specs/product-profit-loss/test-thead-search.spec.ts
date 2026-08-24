import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Search via thead input in unassign-wave', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  const theadInputs = page.locator('thead input[type="text"]');
  console.log('Thead inputs found:', await theadInputs.count());

  // Type in the first thead text input (which corresponds to Code column)
  const codeSearchInput = theadInputs.first();
  await codeSearchInput.click();
  await codeSearchInput.fill('SO-5U7TQKCP');
  await codeSearchInput.press('Enter');
  await page.waitForTimeout(3000);

  const rows = await page.locator('table tbody tr').allInnerTexts();
  console.log('Rows found after thead search:', rows);
});
