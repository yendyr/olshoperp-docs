import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Intercept PrimeDataTable request on edit 131633', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/supplychain/new-purchase-inbound/edit/131633',
  });

  page.on('response', async (response) => {
    if (response.url().includes('mutation-inbound-detail')) {
      console.log('URL:', response.url());
      console.log('Method:', response.request().method());
      console.log('Status:', response.status());
      try {
        const json = await response.json();
        console.log('Response JSON:', JSON.stringify(json, null, 2));
      } catch (e) {}
    }
  });

  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound/edit/131633');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(4000);
});
