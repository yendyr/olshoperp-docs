import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Check Supplier in PO Select2', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/purchase-order/create',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const suppRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/select2-general-company?q=SUPP-ONLY', { headers });
  const suppJson = await suppRes.json();
  console.log('Supplier in PO select2 status:', suppRes.status(), suppJson);
});
