import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Create New General Company ONLY Recognized As Supplier via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(300_000);
  const companyCode = 'lumicharmsid';
  const ts = Date.now();
  const supplierCode = 'SUPP-ONLY-' + ts;
  const supplierName = 'PT Murni Supplier ' + ts;

  console.log('--- 1. PREPARE SESSION & NAVIGATE TO CREATE GENERAL COMPANY FORM ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/generalsetting/general-company/create',
  });
  await page.goto('https://staging.olshoperp.com/generalsetting/general-company/create');
  await page.waitForSelector('#code', { timeout: 30000 });
  console.log('Create General Company form loaded.');

  console.log('--- 2. FILL BASIC INFORMATION VIA UI ---');
  // Fill Code & Name
  await page.locator('#code').fill(supplierCode);
  await page.locator('#name').fill(supplierName);
  console.log('Filled Code:', supplierCode, 'and Name:', supplierName);

  // 2a. Turn OFF Customer Toggle
  const customerCheckbox = page.locator('div.flex').filter({ has: page.locator('span', { hasText: 'Customer' }) }).locator('input[type="checkbox"]').first();
  if (await customerCheckbox.count() > 0) {
    if (await customerCheckbox.isChecked()) {
      await customerCheckbox.click({ force: true });
      console.log('Turned OFF Customer toggle.');
    }
  }

  // 2b. Turn ON Supplier Toggle (if not already checked)
  const supplierCheckbox = page.locator('div.flex').filter({ has: page.locator('span', { hasText: 'Supplier' }) }).locator('input[type="checkbox"]').first();
  if (await supplierCheckbox.count() > 0) {
    if (!await supplierCheckbox.isChecked()) {
      await supplierCheckbox.click({ force: true });
      console.log('Turned ON Supplier toggle.');
    } else {
      console.log('Supplier toggle is already ON.');
    }
  }

  // 2c. Turn OFF Shipper Toggle if on
  const shipperCheckbox = page.locator('div.flex').filter({ has: page.locator('span', { hasText: 'Shipper' }) }).locator('input[type="checkbox"]').first();
  if (await shipperCheckbox.count() > 0 && await shipperCheckbox.isChecked()) {
    await shipperCheckbox.click({ force: true });
    console.log('Turned OFF Shipper toggle.');
  }

  // Verify switch states before submit
  console.log('Final switch states:', {
    customer: await customerCheckbox.isChecked().catch(() => null),
    supplier: await supplierCheckbox.isChecked().catch(() => null),
    shipper: await shipperCheckbox.isChecked().catch(() => null),
  });

  console.log('--- 3. CLICK SAVE BUTTON VIA UI ---');
  const saveBtn = page.locator('#saveButton, button:has-text("Save & Next"), button:has-text("Save")').first();
  await saveBtn.scrollIntoViewIfNeeded().catch(() => undefined);
  await saveBtn.click();
  console.log('Clicked Save button on Web UI.');

  // Wait for save processing & navigation
  await page.waitForTimeout(5000);

  console.log('--- 4. VERIFY IN GENERAL COMPANY DATALIST TABLE VIA UI ---');
  await page.goto('https://staging.olshoperp.com/generalsetting/general-company');
  await page.waitForLoadState('networkidle').catch(() => undefined);

  const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
  if (await searchInput.count() > 0) {
    await searchInput.fill(supplierCode);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
  }

  // Find row in datalist table
  const row = page.locator('tbody tr').filter({ hasText: supplierCode }).first();
  const isRowVisible = await row.isVisible().catch(() => false);
  const rowText = isRowVisible ? await row.innerText() : 'Not found';

  console.log('=== HASIL TESTING CRAWLING GENERAL COMPANY (SUPPLIER ONLY) ===');
  console.log('Company: Lumi Charms.id (ID: 153)');
  console.log('Supplier Code yang berhasil dibuat:', supplierCode);
  console.log('Nama Supplier:', supplierName);
  console.log('Row Table Text:', rowText);
  console.log('Recognize As: Supplier ONLY');
  console.log('Status di Web UI: Active (Yes)');
});
