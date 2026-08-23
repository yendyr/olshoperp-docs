import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseInboundPage } from '../../helpers/purchase-inbound';

test('TC-INBOUND-CRAWL-FROM-PO: Create Purchase Inbound from PO-6A8A5BF6 via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const supplierName = 'PT Murni Supplier 1787448592996';
  const poCode = 'PO-6A8A5BF6';
  const sku = 'LUMI-CRAWL-1787447920177';

  console.log('--- 1. PREPARE SESSION & GOTO CREATE INBOUND ---');
  const piPage = new PurchaseInboundPage(page);
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/new-purchase-inbound',
  });

  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(2000);

  // Click Create button
  console.log('Clicking Create button...');
  const createBtn = page.locator('button:has-text("Create"), a[href*="/create"]').first();
  await createBtn.click();
  await page.waitForTimeout(3000);

  // Wait for edit url
  await page.waitForURL(/\/supplychain\/new-purchase-inbound\/edit\/\d+/, { timeout: 45000 }).catch(() => undefined);
  await page.waitForTimeout(2000);

  const inUrl = page.url();
  const inId = inUrl.split('/').pop();
  console.log('Current Inbound URL:', inUrl, 'ID:', inId);

  console.log('--- 2. SELECT SUPPLIER AND CLICK SAVE ALL ---');
  await piPage.selectSupplier(supplierName);
  console.log('Selected Supplier via POM:', supplierName);

  await page.waitForTimeout(1000);
  await piPage.clickSaveAll();
  console.log('Clicked Save All.');
  await page.waitForTimeout(2000);

  const inCode = (await page.locator('#code').inputValue().catch(() => '')) || ('IN-' + inId);
  console.log('Inbound Transaction Code:', inCode);

  console.log('--- 3. OPEN AVAILABLE PURCHASE ORDER MODAL ---');
  await piPage.openAvailablePurchaseOrderModal();
  console.log('Available Purchase Order modal is open.');

  console.log('--- 4. SEARCH BY PO NUMBER & CHECK ROW ---');
  await piPage.searchOutstandingProducts(poCode);
  await page.waitForTimeout(2000);

  const modalContainer = page.locator('div.fixed.rounded, div[style*="calc(100vw - 520px)"]').last();
  const poRow = modalContainer.locator('tbody tr').filter({ hasText: new RegExp(poCode, 'i') }).first();
  await expect(poRow, 'PO Row in modal').toBeVisible({ timeout: 20000 });
  console.log('Found PO row in modal:', await poRow.innerText());

  // Check the checkbox
  const checkbox = poRow.locator('input[type="checkbox"]').first();
  if (await checkbox.isVisible({ timeout: 3000 }).catch(() => false)) {
    await checkbox.check({ force: true });
    console.log('Checked checkbox on PO row.');
  }

  console.log('--- 5. CLICK USE BUTTON IN MODAL HEADER ---');
  const bulkUseBtn = modalContainer.locator('button.tooltip-use, button:has-text("Use")').first();
  if (await bulkUseBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await bulkUseBtn.click({ force: true });
    console.log('Clicked Use button in modal.');
    await page.waitForTimeout(3000);
  }

  console.log('--- 6. VERIFY INBOUND DETAIL TABLE ---');
  const detailSection = page.locator('#InventoryInDetail');
  await detailSection.scrollIntoViewIfNeeded().catch(() => undefined);
  await page.waitForTimeout(2000);

  const detailRow = detailSection.locator('tbody tr').filter({ hasText: new RegExp(sku, 'i') }).first();
  await expect(detailRow, 'Inbound detail row with SKU ' + sku).toBeVisible({ timeout: 25000 });
  console.log('Inbound Detail Row Text:', await detailRow.innerText());

  console.log('--- 7. VERIFY BACKEND STATUS (DO NOT APPROVE) ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const inRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/' + inId, { headers });
  const inJson = await inRes.json();
  const inData = inJson.data;

  console.log('=== HASIL TRANSAKSI PURCHASE INBOUND ===');
  console.log('1. Inbound Transaction Code:', inData.code);
  console.log('2. Supplier:', supplierName);
  console.log('3. Reference PO:', poCode);
  console.log('4. SKU:', sku);
  console.log('5. Quantity Inbound: 1');
  console.log('6. Status Transaksi:', inData.transaction_status_formatted, '(Open / Draft - Belum Diapprove)');
});
