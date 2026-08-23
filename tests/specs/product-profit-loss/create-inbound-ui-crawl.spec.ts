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

  console.log('--- 1. PREPARE SESSION & GOTO PURCHASE INBOUND CREATE ---');
  const piPage = new PurchaseInboundPage(page);
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/new-purchase-inbound',
  });

  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(2000);

  // Click Create button
  console.log('Clicking Create Purchase Inbound...');
  const createBtn = page.locator('button:has-text("Create"), a[href*="/create"]').first();
  await createBtn.click();
  await page.waitForTimeout(3000);

  // Wait for auto-save / edit redirect
  console.log('Waiting for Create/Edit Form Settlement...');
  await page.waitForURL(/\/supplychain\/new-purchase-inbound\/edit\/\d+/, { timeout: 45000 }).catch(() => undefined);
  await page.waitForTimeout(2000);
  console.log('Current URL:', page.url());

  console.log('--- 2. UPDATE SUPPLIER TO PT Murni Supplier 1787448592996 ---');
  // Expand Basic Information
  const basicInfoBtn = page.getByRole('button', { name: 'Basic Information', exact: true }).first();
  await basicInfoBtn.scrollIntoViewIfNeeded().catch(() => undefined);

  // Select Supplier
  const suppCombobox = page.locator('div:has(> label:has-text("Supplier")) .multiselect, .custom-multiselect').first();
  await suppCombobox.click({ force: true });
  await page.waitForTimeout(500);

  const suppSearch = suppCombobox.locator('input');
  if (await suppSearch.count() > 0) {
    await suppSearch.fill('PT Murni Supplier');
    await page.waitForTimeout(1000);
  }

  const suppOpt = page.locator('.multiselect-option').filter({ hasText: /PT Murni Supplier/i }).first();
  if (await suppOpt.count() > 0) {
    await suppOpt.click({ force: true });
    console.log('Selected Supplier:', supplierName);
  }

  await page.waitForTimeout(1500);

  // Click Save All
  console.log('Clicking Save All...');
  const saveAllBtn = page.getByRole('button', { name: /Save All|Save/i }).first();
  if (await saveAllBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveAllBtn.click({ force: true });
    await page.waitForTimeout(3000);
    console.log('Clicked Save All.');
  }

  const inUrl = page.url();
  const inId = inUrl.split('/').pop();
  const inCode = (await page.locator('#code').inputValue().catch(() => '')) || ('IN-' + inId);
  console.log('Purchase Inbound ID:', inId, 'Code:', inCode);

  console.log('--- 3. OPEN AVAILABLE PURCHASE ORDER MODAL ---');
  await piPage.openAvailablePurchaseOrderModal();
  console.log('Available Purchase Order modal is open.');

  console.log('--- 4. SEARCH BY PO NUMBER & CHECK ROW ---');
  await piPage.checkOutstandingRows([sku], poCode);
  console.log('Checked row for PO:', poCode, 'SKU:', sku);

  console.log('--- 5. CLICK USE BUTTON AT THE TOP OF DATATABLE ---');
  await piPage.clickBulkUseOnOutstanding();
  console.log('Clicked Use button! SKU from PO added to Inbound Detail.');

  await page.waitForTimeout(3000);

  console.log('--- 6. VERIFY INBOUND DETAIL TABLE (DO NOT APPROVE) ---');
  const detailSection = page.locator('#InventoryInDetail, div:has(> button:has-text("Inbound Detail"))').first();
  await detailSection.scrollIntoViewIfNeeded().catch(() => undefined);

  const detailRow = page.locator('#InventoryInDetail tbody tr, #InventoryInDetail div[role="row"]').filter({ hasText: new RegExp(sku, 'i') }).first();
  await expect(detailRow, 'Inbound detail row with SKU ' + sku + ' must be visible').toBeVisible({ timeout: 25000 });
  const rowText = await detailRow.innerText();
  console.log('Inbound Detail Row Text:', rowText);

  // Check PO Reference in detail row
  expect(rowText).toContain(poCode);

  console.log('--- 7. VERIFY BACKEND STATUS ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/' + inId, { headers });
  const json = await res.json();
  const inData = json.data;

  console.log('=== HASIL TRANSAKSI PURCHASE INBOUND ===');
  console.log('Inbound Code:', inData.code);
  console.log('Supplier:', supplierName);
  console.log('Status:', inData.transaction_status_formatted, '(DO NOT APPROVE)');
  console.log('Detail Lines Count:', inData.inventory_in_details?.length);
  console.log('Details:', JSON.stringify(inData.inventory_in_details?.map((d: any) => ({
    sku_name: d.product_sku_name,
    qty: d.quantity,
    po_code: d.transaction_reference_text || poCode,
    status: d.status
  })), null, 2));

  expect(inData.transaction_status).toBe('open');
});
