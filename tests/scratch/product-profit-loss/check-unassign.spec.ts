import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check unassign-wave datalist', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/unassign-wave', { headers });
  const json = await res.json();
  console.log('Unassign wave data count:', json.data?.length);
  console.log('Unassign wave rows:', JSON.stringify(json.data?.map((r: any) => ({
    id: r.id,
    code: r.code,
    platform_order_id: r.platform_order_id,
    customer_name: r.customer_name,
    unassign_wave_status: r.unassign_wave_status,
    process_to_wave: r.process_to_wave
  })), null, 2));
});
