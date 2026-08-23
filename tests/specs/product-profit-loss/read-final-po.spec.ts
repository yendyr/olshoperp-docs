import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Read final PO 2635 details', async ({ page }) => {
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

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2635', { headers });
  const json = await res.json();
  const d = json.data;
  console.log('PO Code:', d.code);
  console.log('PO Status:', d.transaction_status_formatted, d.transaction_status);
  console.log('Grand Total Before VAT:', d.grand_total_before_vat);
  console.log('Grand Total After VAT:', d.grand_total_after_vat);
  console.log('Detail Lines:', JSON.stringify(d.purchase_order_details, null, 2));
});
