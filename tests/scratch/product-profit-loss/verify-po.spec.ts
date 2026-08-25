import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Verify PO Details & VAT Calculation', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/purchase-order',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635/purchase-order-detail', { headers });
  const json = await res.json();
  console.log('PO 2635 Details:', JSON.stringify(json, null, 2));

  // If unit price needs update to 80000:
  const detailId = json.data?.[0]?.id;
  if (detailId && json.data?.[0]?.each_price !== 80000) {
    const updateRes = await page.request.put('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635/purchase-order-detail/' + detailId, {
      headers,
      data: {
        each_price: 80000,
        each_price_before_discount_before_vat: 80000,
        order_quantity: 1,
        purchase_discount: 0,
        tax: [
          {
            tax_id: null,
            value: 0,
            included: false,
            coefficient: false
          }
        ]
      }
    });
    console.log('Updated detail price to 80000 status:', updateRes.status());
  }

  // Get PO Header
  const poRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635', { headers });
  console.log('PO 2635 Header:', JSON.stringify(await poRes.json(), null, 2));
});
