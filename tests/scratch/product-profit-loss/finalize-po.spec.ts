import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Update PO Detail Unit Price to 80.000', async ({ page }) => {
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

  const updateRes = await page.request.put('https://api.staging.olshoperp.com/api/supplychain/purchase-order-detail/31592', {
    headers,
    data: {
      purchase_order_id: 2635,
      product_id: 92420,
      order_quantity: 1,
      order_quantity_unit_id: 34,
      product_sku_name: 'Produk Crawl Lumi 1787447920177',
      each_price: 80000,
      each_price_before_discount_before_vat: 80000,
      purchase_discount: 0,
      modalUpdate: true,
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

  // Save All on PO Header
  const saveAllRes = await page.request.put('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635', {
    headers,
    data: {
      transaction_date: '2026-08-23 09:30:59',
      supplier_id: 1539,
      payment_type_id: 8,
      currency_id: 1,
      exchange_rate: 1,
      with_pr: 0,
      transaction_status: 'open'
    }
  });
  console.log('Save All PO Header status:', saveAllRes.status());

  // Read updated PO summary
  const poRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635', { headers });
  const poJson = await poRes.json();
  const d = poJson.data;
  console.log('=== FINAL PO SUMMARY ===');
  console.log('Code:', d.code);
  console.log('Supplier:', d.supplier_id, 'PT Murni Supplier 1787448592996');
  console.log('Status:', d.transaction_status_formatted);
  console.log('Grand Total Before VAT (DPP):', d.grand_total_before_vat);
  console.log('Grand Total After VAT (Net):', d.grand_total_after_vat);
  console.log('Detail Lines:', JSON.stringify(d.purchase_order_details.map((l: any) => ({
    sku_name: l.product_sku_name,
    qty: l.order_quantity,
    unit_price_before_vat: l.each_price_before_vat,
    vat_percentage: l.vat,
    vat_included: l.vat_included,
    unit_price_after_vat: l.each_price_after_vat,
    total_line_before_vat: l.each_dpp_before_discount,
    total_vat_amount: l.price_vat,
    total_line_after_vat: l.price_after_vat
  })), null, 2));
});
