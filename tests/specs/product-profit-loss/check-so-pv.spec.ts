import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check SO detail primevue endpoint', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/businessdevelopment/sales-order-general',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/2519646/sales-order-detail/primevue', { headers });
  const json = await res.json();
  console.log('SO 2519646 PrimeVue rows:', JSON.stringify(json, null, 2));
});
