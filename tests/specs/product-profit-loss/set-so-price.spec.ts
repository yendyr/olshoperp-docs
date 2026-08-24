import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Update detail price to 100.000 with type_sales_order general', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/businessdevelopment/sales-order-general/edit/2519646',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Get current details
  const soResBefore = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/2519646', { headers });
  const soJsonBefore = await soResBefore.json();
  const detail = soJsonBefore.data.sales_order_details[0];
  console.log('Detail ID to update:', detail.id);

  // Update detail line with unit price 100.000 and type_sales_order: general
  const updateRes = await page.request.put('https://api.staging.olshoperp.com/api/omnichannel/sales-order/2519646/sales-order-detail/' + detail.id, {
    headers,
    data: {
      type_sales_order: 'general',
      product_id: 92420,
      sales_order_quantity: 1,
      sales_order_quantity_unit_id: 34,
      each_price_before_discount_before_vat: 100000,
      sales_discount: 0,
      taxes: [
        {
          id: null,
          tax_id: 25,
          value: 12,
          included: true,
          coefficient: true
        }
      ]
    }
  });

  const updateJson = await updateRes.json();
  console.log('Update detail response:', JSON.stringify(updateJson, null, 2));

  // Fetch updated SO
  const soRes = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/2519646', { headers });
  const soJson = await soRes.json();
  const soData = soJson.data;

  console.log('=== HASIL PERHITUNGAN SALES ORDER GENERAL ===');
  console.log('Sales Order Code:', soData.code);
  console.log('Status Transaksi:', soData.transaction_status_formatted || soData.transaction_status);
  console.log('Customer:', soData.customer?.name);
  console.log('Store:', soData.store?.name);
  console.log('Warehouse Process:', soData.warehouse_process?.name);
  console.log('Grand Total Before VAT:', soData.grand_total_before_vat);
  console.log('Grand Total After VAT:', soData.grand_total_after_vat);
  console.log('Total VAT:', soData.total_vat);
  console.log('Detail Lines:', JSON.stringify(soData.sales_order_details?.map((d: any) => ({
    id: d.id,
    sku: d.product?.sku,
    name: d.product_sku_name,
    order_qty: d.order_quantity,
    each_price_before_discount_before_vat: d.each_price_before_discount_before_vat,
    each_price_after_vat: d.each_price_after_vat,
    vat_rate: d.vat,
    price_vat: d.price_vat,
    vat_included: d.vat_included,
    taxes: d.sales_order_detail_tax
  })), null, 2));
});
