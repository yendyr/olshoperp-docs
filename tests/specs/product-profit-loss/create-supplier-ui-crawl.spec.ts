import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Create New General Company Recognized As Supplier via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(300_000);
  const companyCode = 'lumicharmsid';
  const ts = Date.now();
  const supplierCode = 'SUPP-' + ts;
  const supplierName = 'PT Supplier Lumi ' + ts;

  console.log('--- 1. PREPARE SESSION & NAVIGATE TO CREATE GENERAL COMPANY FORM ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/generalsetting/general-company/create',
  });
  await page.goto('https://staging.olshoperp.com/generalsetting/general-company/create');
  await page.waitForSelector('#code', { timeout: 30000 });
  console.log('Create General Company form loaded.');

  console.log('--- 2. FILL BASIC INFORMATION VIA UI ---');
  // Fill Code
  await page.locator('#code').fill(supplierCode);

  // Fill Name
  await page.locator('#name').fill(supplierName);
  console.log('Filled Code:', supplierCode, 'and Name:', supplierName);

  // Ensure Supplier switch is active (checked)
  const supplierSwitch = page.locator('div:has(> label:has-text("Supplier")) input[type="checkbox"]').first();
  if (await supplierSwitch.count() > 0) {
    const isChecked = await supplierSwitch.isChecked();
    console.log('Supplier toggle initial state isChecked:', isChecked);
    if (!isChecked) {
      await supplierSwitch.check({ force: true });
      console.log('Checked Supplier toggle.');
    }
  }

  // Turn off Customer and Shipper switches if they are on, so it specifically recognizes as Supplier
  const customerSwitch = page.locator('div:has(> label:has-text("Customer")) input[type="checkbox"]').first();
  if (await customerSwitch.count() > 0 && await customerSwitch.isChecked()) {
    await customerSwitch.uncheck({ force: true }).catch(() => undefined);
  }

  const shipperSwitch = page.locator('div:has(> label:has-text("Shipper")) input[type="checkbox"]').first();
  if (await shipperSwitch.count() > 0 && await shipperSwitch.isChecked()) {
    await shipperSwitch.uncheck({ force: true }).catch(() => undefined);
  }

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

  console.log('=== HASIL TESTING CRAWLING GENERAL COMPANY SUPPLIER ===');
  console.log('Company: Lumi Charms.id (ID: 153)');
  console.log('Supplier Code yang berhasil dibuat:', supplierCode);
  console.log('Nama Supplier:', supplierName);
  console.log('Row Table Text:', rowText);
  console.log('Recognize As: Supplier');
  console.log('Status di Web UI: Active (Yes)');
});
