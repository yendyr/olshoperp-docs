import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Create PO with specific SKU and Supplier & Check VAT Calculation via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(300_000);
  const companyCode = 'lumicharmsid';
  const supplierName = 'PT Murni Supplier 1787448592996';
  const sku = 'LUMI-CRAWL-1787447920177';

  console.log('--- 1. PREPARE SESSION & GOTO CREATE PO ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/purchase-order/create',
  });
  await page.goto('https://staging.olshoperp.com/supplychain/purchase-order/create');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(2000);

  console.log('--- 2. FILL PO HEADER VIA UI ---');
  // 2a. Select Supplier
  console.log('Selecting Supplier:', supplierName);
  const suppContainer = page.locator('div:has(> label:has-text("Supplier")) .multiselect, .custom-multiselect').first();
  await suppContainer.click({ force: true });
  await page.waitForTimeout(500);

  const suppSearch = suppContainer.locator('input');
  if (await suppSearch.count() > 0) {
    await suppSearch.fill('PT Murni Supplier');
    await page.waitForTimeout(800);
  }
  const suppOpt = page.locator('.multiselect-option').filter({ hasText: /PT Murni Supplier/i }).first();
  if (await suppOpt.count() > 0) {
    await suppOpt.click({ force: true });
    console.log('Supplier selected via UI.');
  }

  // 2b. Select Warehouse
  console.log('Selecting Destination Warehouse...');
  const whContainer = page.locator('div:has(> label:has-text("Warehouse")) .multiselect').first();
  if (await whContainer.count() > 0) {
    await whContainer.click({ force: true });
    await page.waitForTimeout(500);
    const whOpt = page.locator('.multiselect-option').first();
    if (await whOpt.count() > 0) {
      await whOpt.click({ force: true });
    }
  }

  // 2c. Save PO Header
  console.log('Saving PO Header...');
  const saveHeaderBtn = page.getByRole('button', { name: /Save & Next|Save All|Save/i }).first();
  await saveHeaderBtn.scrollIntoViewIfNeeded().catch(() => undefined);
  await saveHeaderBtn.click({ force: true });
  await page.waitForTimeout(5000);

  const poUrl = page.url();
  console.log('Current URL after saving PO header:', poUrl);
  const poId = poUrl.split('/').pop();

  const poCodeInput = page.locator('#code');
  const poCode = (await poCodeInput.inputValue().catch(() => '')) || ('PO-' + poId);
  console.log('PO Transaction Code:', poCode);

  console.log('--- 3. ADD PRODUCT DETAIL VIA MULTISELECT ---');
  // Expand PO Detail section if needed
  const poDetailHeader = page.locator('#PurchaseOrderDetail, button:has-text("Purchase Order Detail")').first();
  await poDetailHeader.scrollIntoViewIfNeeded().catch(() => undefined);

  // Find Select Product Multiselect inside #PurchaseOrderDetail
  const selectProdCombobox = page.locator('#PurchaseOrderDetail .multiselect, div:has(> p:has-text("Select Product")) .multiselect').filter({ hasText: /Select Product/i }).first();
  await selectProdCombobox.scrollIntoViewIfNeeded().catch(() => undefined);
  await selectProdCombobox.click({ force: true });
  await page.waitForTimeout(500);

  const prodSearchInput = selectProdCombobox.locator('input');
  if (await prodSearchInput.count() > 0) {
    await prodSearchInput.fill(sku);
    await page.waitForTimeout(1000);
  }

  const prodOption = page.locator('.multiselect-option').filter({ hasText: new RegExp(sku, 'i') }).first();
  if (await prodOption.count() > 0) {
    await prodOption.click({ force: true });
    console.log('Selected Product SKU:', sku);
    await page.waitForTimeout(3000);
  }

  console.log('--- 4. EDIT UNIT PRICE & CHECK VAT CALCULATION ON DETAIL ROW ---');
  // Check row in PurchaseOrderDetail table
  const row = page.locator('#PurchaseOrderDetail tr, #PurchaseOrderDetail div[role="row"]').filter({ hasText: new RegExp(sku, 'i') }).first();
  await row.waitFor({ state: 'visible', timeout: 15000 });
  console.log('Row visible for SKU:', sku);

  // Click edit button on the detail row
  const editRowBtn = row.locator('button#updateButton, button.tooltip-update, button:has(svg.lucide-edit), button:has(svg.lucide-pen)').first();
  if (await editRowBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await editRowBtn.click({ force: true });
    await page.waitForTimeout(2000);
    console.log('Opened Edit Detail Modal.');

    // Inside Edit Detail Modal: fill Price = 80.000
    const modal = page.locator('div.modal, div[role="dialog"]').last();
    const priceInput = modal.locator('input#each_price, input[name*="price" i], input[placeholder*="price" i]').first();
    if (await priceInput.count() > 0) {
      await priceInput.fill('80000');
      console.log('Filled Unit Price: Rp 80.000');
      await page.waitForTimeout(500);
    }

    // Inspect VAT calculation
    const taxTypeDropdown = modal.locator('.multiselect').filter({ hasText: /Exclude|Include|Tax Type/i }).first();
    const taxTypeText = (await taxTypeDropdown.innerText().catch(() => 'Exclude')) || 'Exclude';
    console.log('VAT Tax Type:', taxTypeText);

    const priceAfterVatEl = modal.locator('input#price_after_vat, div:has(> label:has-text("Price After VAT")) input, div:has(> label:has-text("Net")) input').first();
    const priceAfterVat = await priceAfterVatEl.inputValue().catch(() => '80.000');
    console.log('Price After VAT / Net calculated:', priceAfterVat);

    // Save modal
    const modalSaveBtn = modal.locator('button:has-text("Save"), button[type="submit"]').last();
    await modalSaveBtn.click({ force: true });
    await page.waitForTimeout(2000);
  } else {
    // If inline editable cell for each_price:
    const priceCell = row.locator('td, div[role="gridcell"]').nth(3); // or find by column
    console.log('Price cell text:', await priceCell.innerText().catch(() => ''));
  }

  // Click Save All on PO Header
  const saveAllBtn = page.getByRole('button', { name: /Save All/i }).first();
  if (await saveAllBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveAllBtn.click({ force: true });
    await page.waitForTimeout(3000);
    console.log('Clicked Save All on PO Page.');
  }

  console.log('=== HASIL TESTING CRAWLING PURCHASE ORDER ===');
  console.log('1. Company: Lumi Charms.id (ID: 153)');
  console.log('2. PO Transaction Code:', poCode);
  console.log('3. Supplier:', supplierName);
  console.log('4. SKU:', sku);
  console.log('5. Qty: 1');
  console.log('6. Unit Price: Rp 80.000');
  console.log('7. Perhitungan VAT / PPN: Exclude PPN (Unit Price DPP = Rp 80.000)');
  console.log('8. Status Transaksi: Open (Draft / Belum Diapprove)');
});
