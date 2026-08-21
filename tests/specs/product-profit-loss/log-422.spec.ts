import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Log 422 errors', async ({ page }) => {
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

  const ts = Date.now();
  const sku = 'SKU-PPL-' + ts;
  const productName = 'Produk Test PPL ' + ts;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const catRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-category', { headers });
  const categoryId = (await catRes.json()).data?.[0]?.id || 4053;

  const unitRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-unit', { headers });
  const stockUnitId = (await unitRes.json()).data?.[0]?.id || 36;

  const coaRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product/select2-product-coa-group', { headers });
  const coaGroupId = (await coaRes.json()).data?.[0]?.id || 67;

  const prodRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/product', {
    headers,
    data: {
      sku: sku,
      name: productName,
      category_id: categoryId,
      stock_unit_id: stockUnitId,
      conversion_rate: 1,
      product_coa_group_id: coaGroupId,
      benchmark_price: 80000,
      condition: 'Brand New',
    }
  });
  console.log('Product 422:', await prodRes.json());

  const suppRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/select2-general-company', { headers });
  const supplierId = (await suppRes.json()).data?.[0]?.id || 155;

  const whRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/warehouse/select2', { headers });
  const warehouseId = (await whRes.json()).data?.[0]?.id || 126602;

  const poRes = await page.request.post('https://api.staging.olshoperp.com/api/supplychain/purchase-order', {
    headers,
    data: {
      supplier_id: supplierId,
      transaction_date: yesterday,
      with_pr: 0,
      warehouse_id: warehouseId,
      currency_id: 1,
      exchange_rate: 1,
      payment_type: 1,
      transaction_status: 'Open',
    }
  });
  console.log('PO 422:', await poRes.json());
});
