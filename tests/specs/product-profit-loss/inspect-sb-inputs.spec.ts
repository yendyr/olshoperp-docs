import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Inspect SearchBuilder inputs', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  const advFilterBtn = page.locator('button:has-text("Advanced Filter"), .buttons-searchBuilder').first();
  await advFilterBtn.click();
  await page.waitForTimeout(1000);

  const criteria = page.locator('.dtsb-criteria').first();
  console.log('Criteria HTML:', await criteria.innerHTML());

  const dataSelect = criteria.locator('select.dtsb-data');
  await dataSelect.selectOption({ label: 'Trx. Code' });
  await page.waitForTimeout(1000);

  console.log('Criteria HTML after selecting Trx. Code:', await criteria.innerHTML());

  const inputCont = criteria.locator('.dtsb-inputCont input, input.dtsb-value, input[type="text"]').first();
  console.log('Input found:', await inputCont.count(), await inputCont.isVisible());
  await inputCont.fill('SO-5U7TQKCP');
  await page.waitForTimeout(3000);

  const rows = await page.locator('table tbody tr').allInnerTexts();
  console.log('Table rows after fill:', rows);
});
