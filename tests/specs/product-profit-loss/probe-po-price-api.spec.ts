import { test } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('probe update po detail price methods', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/' });
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': '153',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const poId = 2638;
  const detailId = 31594;
  const payload = {
    purchase_order_id: poId,
    product_id: 92421, // may be wrong — fetch first
    order_quantity: 1,
    each_price: 80000,
    each_price_before_discount_before_vat: 80000,
    purchase_discount: 0,
    modalUpdate: true,
    taxes: [{ tax_id: 23, value: 10, included: false, coefficient: false }],
  };

  const po = await (
    await page.request.get(
      `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}`,
      { headers },
    )
  ).json();
  const line = po.data.purchase_order_details[0];
  console.log('line', {
    id: line.id,
    product_id: line.product_id,
    unit: line.order_quantity_unit_id,
    taxes: line.taxes || line.purchase_order_detail_tax,
    price: line.each_price,
  });

  payload.product_id = line.product_id;
  (payload as any).order_quantity_unit_id = line.order_quantity_unit_id;
  (payload as any).product_sku_name = line.product_sku_name;

  const urls = [
    {
      m: 'POST',
      u: `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}/purchase-order-detail/${line.id}`,
    },
    {
      m: 'PUT',
      u: `https://api.staging.olshoperp.com/api/supplychain/purchase-order-detail/${line.id}`,
    },
    {
      m: 'POST',
      u: `https://api.staging.olshoperp.com/api/supplychain/purchase-order-detail/${line.id}`,
    },
    {
      m: 'POST',
      u: `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}/purchase-order-detail/${line.id}/update`,
    },
  ];

  for (const t of urls) {
    const r =
      t.m === 'PUT'
        ? await page.request.put(t.u, { headers, data: payload })
        : await page.request.post(t.u, { headers, data: payload });
    const j = await r.json().catch(() => null);
    console.log(t.m, t.u.replace('https://api.staging.olshoperp.com', ''), r.status(), JSON.stringify(j).slice(0, 300));
  }

  const after = await (
    await page.request.get(
      `https://api.staging.olshoperp.com/api/supplychain/purchase-order/${poId}`,
      { headers },
    )
  ).json();
  console.log('after DPP', after.data.grand_total_before_vat, 'line price', after.data.purchase_order_details[0].each_price);
});
