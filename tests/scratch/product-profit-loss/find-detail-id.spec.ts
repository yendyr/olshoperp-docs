import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Find detail id of 131633', async ({ page }) => {
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

  const pvRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/131633/mutation-inbound-detail/primevue?disable_inbound=false', {
    headers,
    data: { draw: 1, columns: [], order: [], start: 0, length: 10, search: { value: '', regex: false } }
  });
  const pvData = await pvRes.json();
  console.log('PV Detail rows:', JSON.stringify(pvData.data, null, 2));
});
