import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Inspect Product & PO Detail', async ({ page }) => {
  await prepareSession(page, { companyCode: 'lumicharmsid', targetPath: '/supplychain/product' });

  // 1. Fetch product detail
  await page.goto('/supplychain/product', { waitUntil: 'domcontentloaded' });
  const searchInput = page.getByPlaceholder(/search|cari/i).first();
  await searchInput.fill('SKU-PO-VAT-TEST01');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);

  const editBtn = page.locator('button#updateButton, button.edit-button, a[href*="edit"]').first();
  await editBtn.click();
  await page.waitForURL(/\/supplychain\/product\/edit\/\d+/, { timeout: 30_000 });
  await page.waitForTimeout(2000);

  console.log('Product URL:', page.url());

  // Check section Purchase VAT
  const vatTables = page.locator('table');
  const count = await vatTables.count();
  for (let i = 0; i < count; i++) {
    const text = await vatTables.nth(i).innerText();
    if (text.includes('Tax') || text.includes('PPN') || text.includes('VAT') || text.includes('Purchase')) {
      console.log('=== Table ' + i + ' ===\n' + text);
    }
  }

  // 2. Fetch PO 2563 Detail
  await page.goto('/supplychain/purchase-order/edit/2563', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const poDetail = page.locator('#PurchaseOrderDetail, table').first();
  console.log('=== PO 2563 Detail Table ===\n' + await poDetail.innerText());
});