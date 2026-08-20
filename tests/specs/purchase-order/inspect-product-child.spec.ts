import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Inspect Product Child & Tax Details', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/supplychain/product' });

  const result = await page.evaluate(async () => {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    const headers = { Authorization: 'Bearer ' + auth.token, Accept: 'application/json' };

    // Get child product SKU-PO-VAT-TEST01
    const pRes = await fetch('https://api.staging.olshoperp.com/api/supplychain/product?q=SKU-PO-VAT-TEST01', { headers });
    const pList = await pRes.json();

    const details = [];
    for (const item of pList?.data || []) {
      const dRes = await fetch('https://api.staging.olshoperp.com/api/supplychain/product/' + item.id, { headers });
      const detail = await dRes.json();
      details.push({
        id: detail.data?.id,
        sku: detail.data?.sku,
        name: detail.data?.name,
        tax: detail.data?.tax,
        product_tax: detail.data?.product_tax,
        product_taxes: detail.data?.product_taxes,
        taxes: detail.data?.taxes,
      });
    }

    return details;
  });

  console.log('=== PRODUCT DETAILS WITH TAXES ===\n', JSON.stringify(result, null, 2));
});