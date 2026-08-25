import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check OrderProcessSetting in Lumi Charms', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/omni/unassign-wave',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    Accept: 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/scm/setting/order-process-setting', { headers }).catch(() => null);
  if (res && res.status() === 200) {
    console.log('OrderProcessSetting:', await res.json());
  } else {
    console.log('OrderProcessSetting status:', res ? res.status() : 'failed');
  }

  // Also query unassign wave without search filter to see what is currently in unassign wave
  const form = new URLSearchParams();
  form.append('draw', '1');
  form.append('start', '0');
  form.append('length', '25');

  const uRes = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/unassign-wave', {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: form.toString()
  });
  const uJson = await uRes.json();
  console.log('Unassign wave list total records:', uJson.recordsTotal);
  console.log('Unassign wave list data:', JSON.stringify(uJson.data?.map((r: any) => ({
    id: r.id,
    code: r.code,
    type: r.type_sales_order,
    status: r.transaction_status,
  })), null, 2));
});
