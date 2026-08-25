import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Clean extra rows with id-so', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/businessdevelopment/sales-order-general/edit/2519646',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    Accept: 'application/json',
  };

  const toDelete = ['3193384', '3193385', '3193386'];
  for (const id of toDelete) {
    const res = await page.request.delete('https://api.staging.olshoperp.com/api/omnichannel/sales-order/2519646/sales-order-detail/' + id + '-so', { headers });
    console.log('Delete status for', id + '-so:', res.status());
  }

  // Load UI
  await page.goto('https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2519646');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  // Fetch SO
  const finalRes = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/2519646', { headers });
  const finalData = (await finalRes.json()).data;

  console.log('=== FINAL SALES ORDER GENERAL REPORT ===');
  console.log('Code:', finalData.code);
  console.log('Status:', finalData.transaction_status_formatted || finalData.transaction_status);
  console.log('Customer:', finalData.customer?.name);
  console.log('Store:', finalData.store?.name);
  console.log('Warehouse Process:', finalData.warehouse_process?.name);
  console.log('Grand Total Before VAT:', finalData.grand_total_before_vat);
  console.log('Grand Total After VAT:', finalData.grand_total_after_vat);
  console.log('Total VAT:', finalData.total_vat);
  console.log('Detail Count:', finalData.sales_order_details?.length);
  console.log('Detail Items:', JSON.stringify(finalData.sales_order_details?.map((d: any) => ({
    id: d.id,
    sku: d.product?.sku,
    name: d.product_sku_name,
    qty: d.order_quantity,
    unit_price: d.each_price_before_discount_before_vat,
    each_price_after_vat: d.each_price_after_vat,
    vat_percent: d.vat,
    vat_amount: d.price_vat,
    vat_included: d.vat_included,
    taxes: d.sales_order_detail_tax
  })), null, 2));
});
