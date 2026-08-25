import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check select2-product for LUMI-CRAWL-1787447920177', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/businessdevelopment/sales-order-general',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order-detail/select2-product?type_sales_order=general&owned_by=&q=LUMI-CRAWL-1787447920177', { headers });
  const json = await res.json();
  console.log('Search result for SKU:', JSON.stringify(json.data, null, 2));
});
