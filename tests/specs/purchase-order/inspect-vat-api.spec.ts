import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Inspect Product via API', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/supplychain/product' });

  const info = await page.evaluate(async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    const res = await fetch('/api/supplychain/product?q=SKU-PO-VAT-TEST01', {
      headers: { Authorization: 'Bearer ' + token, 'Accept': 'application/json' }
    });
    const list = await res.json();
    let detail = null;
    if (list?.data?.[0]?.id) {
      const dRes = await fetch('/api/supplychain/product/' + list.data[0].id, {
        headers: { Authorization: 'Bearer ' + token, 'Accept': 'application/json' }
      });
      detail = await dRes.json();
    }
    return { list, detail };
  });

  console.log('=== PRODUCT DETAIL VIA API ===');
  console.log(JSON.stringify(info, null, 2));
});