import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check Outstanding PO API', async ({ page }) => {
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

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound-detail/outstanding?supplier_id=1539&inventory_in_id=131637', { headers });
  const json = await res.json();
  console.log('Outstanding PO lines for supplier 1539:', JSON.stringify(json, null, 2));

  // Check PO 2636 details
  const poRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/2636', { headers });
  console.log('PO 2636:', JSON.stringify(await poRes.json(), null, 2));
});
