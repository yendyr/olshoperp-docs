import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check unassign-wave with POST datatable params', async ({ page }) => {
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

  const form = new URLSearchParams();
  form.append('draw', '1');
  form.append('start', '0');
  form.append('length', '10');
  form.append('search[value]', 'SO-5U7TQKCP');
  form.append('search[regex]', 'false');

  const res = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/unassign-wave', {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: form.toString()
  });
  const json = await res.json();
  console.log('Unassign wave POST response:', JSON.stringify(json, null, 2));
});
