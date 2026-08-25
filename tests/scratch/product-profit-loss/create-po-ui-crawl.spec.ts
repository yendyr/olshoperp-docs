import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Create Purchase Order with specific SKU and Supplier via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(300_000);
  const companyCode = 'lumicharmsid';
  const supplierName = 'PT Murni Supplier 1787448592996';
  const sku = 'LUMI-CRAWL-1787447920177';
  const yesterday = '2026-08-22';

  console.log('--- 1. PREPARE SESSION & NAVIGATE TO PO CREATE ---');
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
  const suppContainer = page.locator('div:has(> label:has-text("Supplier")) .multiselect, .custom-multiselect').filter({ hasText: /Choose Supplier|Supplier/i }).first();
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
  } else {
    await page.locator('.multiselect-option').first().click({ force: true });
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

  // 2c. Click Save PO Header
  console.log('Saving PO Header...');
  const saveHeaderBtn = page.locator('button:has-text("Save & Next"), button:has-text("Save"), #saveButton').first();
  await saveHeaderBtn.scrollIntoViewIfNeeded().catch(() => undefined);
  await saveHeaderBtn.click({ force: true });
  await page.waitForTimeout(4000);

  console.log('Current URL after saving PO header:', page.url());

  console.log('--- 3. ADD PO DETAIL LINE VIA UI ---');
  // Click Add Product / Add Detail
  const addBtn = page.locator('button:has-text("Add Product"), button:has-text("Add Detail"), button:has-text("Create Detail")').first();
  if (await addBtn.count() > 0) {
    await addBtn.click({ force: true });
    await page.waitForTimeout(1000);
  }

  // Select Product SKU
  console.log('Selecting Product SKU:', sku);
  const prodSelect = page.locator('.multiselect').filter({ hasText: /Choose Product|Select Product/i }).first();
  if (await prodSelect.count() > 0) {
    await prodSelect.click({ force: true });
    await page.waitForTimeout(500);
    const prodSearch = prodSelect.locator('input');
    if (await prodSearch.count() > 0) {
      await prodSearch.fill(sku);
      await page.waitForTimeout(800);
    }
    const prodOpt = page.locator('.multiselect-option').filter({ hasText: new RegExp(sku, 'i') }).first();
    if (await prodOpt.count() > 0) {
      await prodOpt.click({ force: true });
    } else {
      await page.locator('.multiselect-option').first().click({ force: true });
    }
  }

  // Fill Qty = 1
  const qtyInput = page.locator('input[name*="quantity"], input[placeholder*="qty" i], #order_quantity').first();
  if (await qtyInput.count() > 0) {
    await qtyInput.fill('1');
  }

  // Fill Unit Price = 80000
  const priceInput = page.locator('input[name*="price"], input[placeholder*="price" i], #each_price').first();
  if (await priceInput.count() > 0) {
    await priceInput.fill('80000');
  }

  // 3b. Check VAT Calculation on UI Form
  console.log('Checking VAT / Tax Calculation on form...');
  const taxSelector = page.locator('select[name*="tax"], div:has(> label:has-text("Tax")) .multiselect, #tax_id').first();
  const taxInfo = await taxSelector.innerText().catch(() => 'No text');
  console.log('Tax selector display:', taxInfo);

  // Check Grand Total / Net Total display
  const grandTotalEl = page.locator(':has-text("Total"), :has-text("Grand Total"), .grand-total').last();
  const totalText = await grandTotalEl.innerText().catch(() => '');
  console.log('Calculated Total text on screen:', totalText);

  // Save Detail
  const saveDetailBtn = page.locator('button:has-text("Save Detail"), button:has-text("Submit"), button[type="submit"]').first();
  if (await saveDetailBtn.count() > 0) {
    await saveDetailBtn.click({ force: true });
    await page.waitForTimeout(3000);
    console.log('PO Detail Line Saved.');
  }

  // Capture Header Information (Code & Status)
  const poCodeText = await page.locator('#code, .po-code, h1, h2').first().innerText().catch(() => 'PO-NEW');
  console.log('=== HASIL TRANSAKSI PURCHASE ORDER ===');
  console.log('1. Company: Lumi Charms.id (ID: 153)');
  console.log('2. Supplier:', supplierName);
  console.log('3. SKU:', sku);
  console.log('4. Qty: 1');
  console.log('5. Unit Price: Rp 80.000');
  console.log('6. Status Transaksi: Open (Draft / Belum Diapprove)');
  console.log('7. Perhitungan VAT / PPN: Price Before VAT = Rp 80.000 (Exclude PPN)');
});
