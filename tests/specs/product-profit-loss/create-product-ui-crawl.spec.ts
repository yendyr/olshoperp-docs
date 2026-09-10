import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Create SKU-PPL-RET-001 in lumicharmsid', async ({ page }) => {
  test.setTimeout(300_000);
  const companyCode = 'lumicharmsid';

  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/product/create',
  });

  await page.goto('https://staging.olshoperp.com/supplychain/product/create');
  await page.waitForSelector('#sku', { timeout: 30000 });
  await page.locator('#sku').fill('SKU-PPL-RET-001');
  await page.locator('#name').fill('Produk PPL Sales Return');

  const saveBtn = page.getByRole('button', { name: 'Save', exact: true }).first();
  await saveBtn.scrollIntoViewIfNeeded().catch(() => undefined);
  await saveBtn.click();
  await page.waitForTimeout(6000);

  await page.goto('https://staging.olshoperp.com/supplychain/product');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  const row = page.locator('tbody tr').filter({ hasText: 'SKU-PPL-RET-001' }).first();
  console.log('SKU SKU-PPL-RET-001 created:', await row.isVisible().catch(() => false));
});
