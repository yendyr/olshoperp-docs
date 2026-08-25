import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Discover valid COA group', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/accounting/product-profit-loss',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '110';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const prodRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product?length=5', { headers });
  const prodJson = await prodRes.json();
  console.log('Sample product from list:', prodJson.data?.[0]?.product_coa_group_id, prodJson.data?.[0]);

  const coaRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-product-coa-group', { headers });
  const coaJson = await coaRes.json();
  console.log('Available COA groups:', coaJson.data);
});
