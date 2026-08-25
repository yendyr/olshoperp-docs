import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Read Purchase Inbound 131633 details', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/new-purchase-inbound',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/131633', { headers });
  const json = await res.json();
  const d = json.data;
  console.log('Inbound Summary:', {
    id: d.id,
    code: d.code,
    supplier_id: d.supplier_id,
    supplier_name: d.supplier?.name,
    transaction_status: d.transaction_status,
    transaction_status_formatted: d.transaction_status_formatted,
    details_count: d.inventory_in_details?.length,
    details: d.inventory_in_details?.map((i: any) => ({
      id: i.id,
      product_id: i.product_id,
      sku_name: i.product_sku_name,
      quantity: i.quantity,
      transaction_reference_id: i.transaction_reference_id,
      transaction_reference_text: i.transaction_reference_text,
      purchase_order_id: i.purchase_order_detail?.purchase_order_id,
      purchase_order_code: i.purchase_order_detail?.purchase_order?.code,
    }))
  });
});
