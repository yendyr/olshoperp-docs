import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Read Inbound 131633 Details', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/new-purchase-inbound',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/131633/mutation-inbound-detail', { headers });
  const json = await res.json();
  console.log('Inbound 131633 Details:', JSON.stringify(json, null, 2));
});
