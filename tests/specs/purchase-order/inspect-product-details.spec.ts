import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Inspect Product & Tax via API', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/supplychain/product' });

  const result = await page.evaluate(async () => {
    const authRaw = localStorage.getItem('auth');
    const auth = authRaw ? JSON.parse(authRaw) : {};
    const token = auth.token;
    const headers = {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'X-Company-Code': 'lumicharmsid',
    };

    // 1. Get Product list
    const pRes = await fetch('https://api.staging.olshoperp.com/api/supplychain/product?q=SKU-PO-VAT-TEST01', { headers });
    const pList = await pRes.json();

    let productDetail = null;
    if (pList?.data?.[0]?.id) {
      const pId = pList.data[0].id;
      const dRes = await fetch('https://api.staging.olshoperp.com/api/supplychain/product/' + pId, { headers });
      productDetail = await dRes.json();
    }

    // 2. Get All Taxes
    const tRes = await fetch('https://api.staging.olshoperp.com/api/accounting/tax', { headers });
    const taxes = await tRes.json().catch(() => null);

    return { productSummary: pList, productDetail, taxes };
  });

  console.log('=== PRODUCT DETAIL ===\n', JSON.stringify(result.productDetail, null, 2));
  console.log('=== ALL TAXES IN LUMICHARMSID ===\n', JSON.stringify(result.taxes?.data?.slice(0, 5), null, 2));
});