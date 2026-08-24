import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Inspect SO-5U7TQKCP for unassign wave criteria', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/businessdevelopment/sales-order-general',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    Accept: 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/2519646', { headers });
  const json = await res.json();
  const so = json.data;

  console.log('SO Details:', {
    id: so.id,
    code: so.code,
    type_sales_order: so.type_sales_order,
    transaction_status: so.transaction_status,
    unassign_wave_status: so.unassign_wave_status,
    prevent_auto_approve: so.prevent_auto_approve,
    details: so.sales_order_details?.map((d: any) => ({
      id: d.id,
      prepared_to_out: d.prepared_to_out_quantity,
      processed_to_out: d.processed_to_out_quantity,
    }))
  });
});
