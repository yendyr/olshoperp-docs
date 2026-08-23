import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check middle details of IN-5U7ODE9M', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/new-purchase-inbound/edit/131633',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/131633/middle-detail', { headers });
  const json = await res.json();
  console.log('Middle Details:', JSON.stringify(json.data, null, 2));

  // Also check page UI
  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound/edit/131633');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  const detailRows = page.locator('#InventoryInDetail tbody tr');
  const count = await detailRows.count();
  console.log('Detail rows on UI count:', count);
  for (let i = 0; i < count; i++) {
    console.log('Row ' + i + ':', await detailRows.nth(i).innerText());
  }
});
