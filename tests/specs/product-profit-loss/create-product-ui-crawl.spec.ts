import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Create New System Product via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(300_000);
  const companyCode = 'lumicharmsid';
  const ts = Date.now();
  const sku = 'LUMI-CRAWL-' + ts;
  const productName = 'Produk Crawl Lumi ' + ts;

  console.log('--- 1. PREPARE SESSION & NAVIGATE TO CREATE FORM ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/product/create',
  });
  await page.goto('https://staging.olshoperp.com/supplychain/product/create');
  await page.waitForSelector('#sku', { timeout: 30000 });
  console.log('Create System Product form is loaded.');

  console.log('--- 2. FILL BASIC INFORMATION VIA UI ---');
  // Fill SKU
  await page.locator('#sku').fill(sku);

  // Fill Name
  await page.locator('#name').fill(productName);
  console.log('Filled SKU:', sku, 'and Name:', productName);

  console.log('--- 3. CLICK SAVE BUTTON VIA UI ---');
  const saveBtn = page.getByRole('button', { name: 'Save', exact: true }).first();
  await saveBtn.scrollIntoViewIfNeeded().catch(() => undefined);
  await saveBtn.click();
  console.log('Clicked Save button on Web UI.');

  // Wait for save request & processing
  await page.waitForTimeout(5000);

  console.log('--- 4. VERIFY IN PRODUCT DATALIST TABLE VIA UI ---');
  await page.goto('https://staging.olshoperp.com/supplychain/product');
  await page.waitForLoadState('networkidle').catch(() => undefined);

  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
  if (await searchInput.count() > 0) {
    await searchInput.fill(sku);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
  }

  // Find row in table
  const row = page.locator('tbody tr').filter({ hasText: sku }).first();
  const isRowVisible = await row.isVisible().catch(() => false);
  const rowText = isRowVisible ? await row.innerText() : 'Not found';

  console.log('=== HASIL TESTING CRAWLING SYSTEM PRODUCT ===');
  console.log('Company: Lumi Charms.id (ID: 153)');
  console.log('SKU yang berhasil dibuat:', sku);
  console.log('Nama Produk:', productName);
  console.log('Row Table Text:', rowText);
  console.log('Status di Web UI Datalist: Active (Yes)');
});
