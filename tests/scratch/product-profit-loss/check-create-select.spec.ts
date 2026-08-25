import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check create-select response for SO 2519646 and SKU 92420', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/businessdevelopment/sales-order-general/edit/2519646',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
  };

  const form = new URLSearchParams();
  form.append('sales_order_id', '2519646');
  form.append('product_id', '92420');

  const res = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/sales-order-detail/create-select', {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: form.toString()
  });

  const json = await res.json();
  console.log('create-select API status:', res.status());
  console.log('create-select API Response:', JSON.stringify(json, null, 2));
});
