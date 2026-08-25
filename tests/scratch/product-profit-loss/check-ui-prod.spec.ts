import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Verify Product Status created via UI crawling', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/product',
  });

  const { token } = await readAuthFromPage(page);
  const companyId = '153';
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/product?search[value]=LUMI-UI-1787447094028', { headers });
  const json = await res.json();
  console.log('Product Check Result:', json.data?.[0]?.sku, 'Status:', json.data?.[0]?.status, 'Status Formatted:', json.data?.[0]?.status_formatted);
});
