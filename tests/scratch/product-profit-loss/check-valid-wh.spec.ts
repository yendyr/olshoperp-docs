import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check warehouse 126602 children and valid transaction warehouses', async ({ page }) => {
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

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/select2/warehouse-destination?all_company=0&no_child=1&under_31=1', { headers });
  const json = await res.json();
  console.log('Valid Transaction Warehouses (no_child=1, under_31=1):', JSON.stringify(json.data, null, 2));
});
