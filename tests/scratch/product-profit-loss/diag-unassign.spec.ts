import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Diagnose SO-5U7TQKCP in unassign-wave', async ({ page }) => {
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
  form.append('columns[0][data]', 'transaction_date_formatted');
  form.append('columns[0][name]', 'transaction_date');
  form.append('columns[0][searchable]', 'true');
  form.append('columns[0][orderable]', 'true');
  form.append('columns[0][search][value]', '');
  form.append('columns[0][search][regex]', 'false');

  form.append('columns[1][data]', 'code_formatted');
  form.append('columns[1][name]', 'code');
  form.append('columns[1][searchable]', 'true');
  form.append('columns[1][orderable]', 'true');
  form.append('columns[1][search][value]', 'SO-5U7TQKCP');
  form.append('columns[1][search][regex]', 'false');

  const res = await page.request.post('https://api.staging.olshoperp.com/api/omnichannel/unassign-wave', {
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: form.toString()
  });

  const json = await res.json();
  console.log('Search in column[1] (code_formatted) count:', json.data?.length);
  console.log('Search result:', JSON.stringify(json.data?.map((d: any) => ({ id: d.id, code: d.code, name: d.code_formatted })), null, 2));
});
