import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Inspect API URL and Product Taxes', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/supplychain/product' });

  // Listen to network responses
  const responses: string[] = [];
  page.on('response', async res => {
    if (res.url().includes('product') || res.url().includes('tax') || res.url().includes('purchase-order')) {
      responses.push(res.url());
    }
  });

  await page.goto('/supplychain/purchase-order/edit/2563', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const debug = await page.evaluate(() => {
    return {
      title: document.title,
      text: document.body.innerText.slice(0, 1500),
    };
  });

  console.log('PO 2563 Page Text:\n', debug.text);
  console.log('API URLs triggered:\n', responses.slice(0, 10));
});