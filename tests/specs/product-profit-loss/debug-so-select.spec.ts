import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('Debug select product in Sales Order 2519646', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: '/businessdevelopment/sales-order-general/edit/2519646',
  });

  page.on('response', async (response) => {
    if (response.url().includes('sales-order-detail') || response.url().includes('sales-order')) {
      console.log('HTTP Response:', response.request().method(), response.url(), response.status());
      try {
        console.log('Body:', JSON.stringify(await response.json()));
      } catch (e) {}
    }
  });

  await page.goto('https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/2519646');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(2000);

  const prodSelect = page.locator('.custom-multiselect').filter({ hasText: /Select Product/i }).first();
  await prodSelect.click({ force: true });
  await page.waitForTimeout(500);

  const prodSearch = prodSelect.locator('input.multiselect-search, input[type="text"]').first();
  await prodSearch.fill('LUMI-CRAWL-1787447920177');
  await page.waitForTimeout(1500);

  const prodOpt = page.locator('.multiselect-option').filter({ hasText: /LUMI-CRAWL-1787447920177/i }).first();
  await prodOpt.click({ force: true });
  await page.waitForTimeout(3000);
});
