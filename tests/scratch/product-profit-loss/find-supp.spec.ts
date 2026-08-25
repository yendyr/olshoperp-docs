import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Find exact supplier ID', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/generalsetting/general-company',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/generalsetting/general-company', { headers });
  const json = await res.json();
  const list = json.data || [];
  const found = list.find((c: any) => c.code && c.code.includes('SUPP-ONLY'));
  console.log('Found Supplier:', found);
});
