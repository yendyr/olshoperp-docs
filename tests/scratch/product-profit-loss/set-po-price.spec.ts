import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Update PO detail price 80000', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/purchase-order/edit/2635',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const updateRes = await page.request.put('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635/purchase-order-detail/31592', {
    headers,
    data: {
      purchase_order_id: 2635,
      product_id: 92420,
      order_quantity: 1,
      order_quantity_unit_id: 34,
      each_price: 80000,
      each_price_before_discount_before_vat: 80000,
      purchase_discount: 0,
      taxes: [
        {
          tax_id: 23,
          value: 10,
          included: false,
          coefficient: false
        }
      ]
    }
  });

  console.log('Update detail price to 80000 status:', updateRes.status(), await updateRes.json());

  // Check PO Header after price update
  const poRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635', { headers });
  const poJson = await poRes.json();
  console.log('PO 2635 Summary:', {
    code: poJson.data.code,
    status: poJson.data.transaction_status_formatted,
    grand_total_before_vat: poJson.data.grand_total_before_vat,
    grand_total_after_vat: poJson.data.grand_total_after_vat,
    details: poJson.data.purchase_order_details.map((d: any) => ({
      sku_name: d.product_sku_name,
      qty: d.order_quantity,
      each_price_before_vat: d.each_price_before_vat,
      each_price_after_vat: d.each_price_after_vat,
      vat: d.vat,
      vat_included: d.vat_included,
    }))
  });
});
