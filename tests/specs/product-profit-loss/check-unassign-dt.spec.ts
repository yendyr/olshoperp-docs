import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check unassign-wave with datatable params', async ({ page }) => {
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

  const res = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/unassign-wave?draw=1&columns%5B0%5D%5Bdata%5D=transaction_date_formatted&columns%5B0%5D%5Bname%5D=transaction_date&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=true&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&start=0&length=10&search%5Bvalue%5D=SO-5U7TQKCP&search%5Bregex%5D=false', { headers });
  const json = await res.json();
  console.log('Unassign wave datatable response:', JSON.stringify(json, null, 2));
});
