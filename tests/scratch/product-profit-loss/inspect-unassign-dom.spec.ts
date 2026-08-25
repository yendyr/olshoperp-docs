import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Inspect Unassign Wave DOM', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  // Check how DataTablesV3 search input works
  const searchInputs = await page.locator('input').evaluateAll((els) => els.map(el => ({
    tagName: el.tagName,
    type: (el as HTMLInputElement).type,
    id: el.id,
    className: el.className,
    placeholder: (el as HTMLInputElement).placeholder,
    value: (el as HTMLInputElement).value,
  })));

  console.log('Search inputs on unassign-wave:', JSON.stringify(searchInputs, null, 2));

  // Find the column search input for Trx Code / code
  const thInputs = await page.locator('thead input').all();
  console.log('Thead inputs count:', thInputs.length);
});
