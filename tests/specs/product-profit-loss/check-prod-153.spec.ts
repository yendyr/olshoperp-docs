import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check Product Create in Lumi Charms (153)', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/accounting/product-profit-loss',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153'; // Real ID for Lumi Charms.id
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const ts = Date.now();
  const sku = 'LUMI-PPL-' + ts;
  const productName = 'Lumi Charms PPL ' + ts;

  const catRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-category', { headers });
  const categoryId = (await catRes.json()).data?.[0]?.id || 4053;

  const unitRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-unit', { headers });
  const stockUnitId = (await unitRes.json()).data?.[0]?.id || 36;

  const prodRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/product', {
    headers,
    data: {
      sku: sku,
      name: productName,
      category_id: categoryId,
      stock_unit_id: stockUnitId,
      conversion_rate: 1,
      product_coa_group_id: 50,
      benchmark_price: 80000,
      condition: 'Brand New',
    }
  });
  const prodJson = await prodRes.json();
  console.log('Product Response in Lumi Charms 153:', prodRes.status(), prodJson);
});
