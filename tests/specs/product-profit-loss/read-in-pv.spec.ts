import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Read Inbound 131633 PrimeVue Details', async ({ page }) => {
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

  const res = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/131633/mutation-inbound-detail/primevue?disable_inbound=false', {
    headers,
    data: {
      draw: 1,
      columns: [],
      order: [],
      start: 0,
      length: 10,
      search: { value: '', regex: false }
    }
  });
  const json = await res.json();
  console.log('Inbound 131633 PrimeVue Lines:', JSON.stringify(json.data, null, 2));
});
