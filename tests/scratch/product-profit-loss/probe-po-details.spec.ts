import { test } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('probe po 2638 2639 details', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/' });
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': '153',
    Accept: 'application/json',
  };
  for (const id of [2638, 2639]) {
    const r = await page.request.get(
      `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${id}`,
      { headers },
    );
    const j = await r.json();
    console.log('PO', id, j.data?.code, j.data?.transaction_status);
    console.log(
      'details',
      JSON.stringify(
        (j.data?.purchase_order_details || []).map((d: any) => ({
          id: d.id,
          sku: d.product?.sku,
          name: d.product_sku_name,
          qty: d.order_quantity,
          price: d.each_price,
        })),
      ),
    );
  }

  // product id for new sku
  const p = await page.request.get(
    'https://api.staging.olshoperp.com/api/supplychain/product?search[value]=LUMI-CRAWL-1787493585192',
    { headers },
  );
  const pj = await p.json();
  console.log(
    'product',
    (pj.data || []).map((x: any) => ({ id: x.id, sku: x.sku, name: x.name })),
  );
});
