import { test } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Inspect Master Data in lumicharmsid', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/accounting/product-profit-loss',
  });

  const { token } = await readAuthFromPage(page);
  const authHeaders = {
    Authorization: 'Bearer ' + token,
    'Company-Id': '110',
    'Content-Type': 'application/json',
  };

  // Inspect SCM products
  const prodResp = await page.request.get('https://api.staging.olshoperp.com/api/scm/product?length=10', { headers: authHeaders });
  const prodData = await prodResp.json();
  console.log('Sample Products:', prodData);

  // Inspect Suppliers
  const suppResp = await page.request.get('https://api.staging.olshoperp.com/api/scm/supplier/select2', { headers: authHeaders });
  const suppData = await suppResp.json();
  console.log('Sample Suppliers:', suppData);

  // Inspect Stores
  const storeResp = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/store/select2', { headers: authHeaders });
  const storeData = await storeResp.json();
  console.log('Sample Stores:', storeData);

  // Inspect Customers
  const custResp = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/customer/select2', { headers: authHeaders });
  const custData = await custResp.json();
  console.log('Sample Customers:', custData);
});
