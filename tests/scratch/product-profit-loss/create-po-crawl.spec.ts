import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test('TC-PO-CRAWL-NON-PR-EXCLUDE-VAT-20260823093059: Create Purchase Order Without PR with Exclude VAT via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const supplierName = 'PT Murni Supplier 1787448592996';
  const sku = 'LUMI-CRAWL-1787447920177';
  const unitPrice = 80000;
  const qty = 1;

  console.log('--- STEP 1: PREPARE SESSION & OPEN PO FORM ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/purchase-order',
  });
  await page.goto('https://staging.olshoperp.com/supplychain/purchase-order');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(1500);

  // Click Create PO Button
  const createPoBtn = page.locator('a[href*="/supplychain/purchase-order/create"], button:has-text("Create"), button#createButton').first();
  await createPoBtn.click();
  await page.waitForURL(/\/supplychain\/purchase-order\/create/, { timeout: 30000 });
  await page.waitForTimeout(2000);

  console.log('--- STEP 2: FILL PO HEADER INFORMATION ---');
  // Select Supplier
  const suppContainer = page.locator('div:has(> label:has-text("Supplier")) .multiselect, .custom-multiselect').first();
  await suppContainer.click({ force: true });
  await page.waitForTimeout(500);

  const suppSearch = suppContainer.locator('input');
  if (await suppSearch.count() > 0) {
    await suppSearch.fill('PT Murni Supplier');
    await page.waitForTimeout(800);
  }
  const suppOpt = page.locator('.multiselect-option').filter({ hasText: /PT Murni Supplier/i }).first();
  await suppOpt.click({ force: true });
  console.log('Selected Supplier:', supplierName);

  // Select Warehouse
  const whContainer = page.locator('div:has(> label:has-text("Warehouse")) .multiselect').first();
  if (await whContainer.count() > 0) {
    await whContainer.click({ force: true });
    await page.waitForTimeout(500);
    const whOpt = page.locator('.multiselect-option').first();
    if (await whOpt.count() > 0) {
      await whOpt.click({ force: true });
    }
  }

  // Save Header & Next
  const saveHeaderBtn = page.getByRole('button', { name: /Save & Next|Save All|Save/i }).first();
  await saveHeaderBtn.click({ force: true });
  await page.waitForURL(/\/supplychain\/purchase-order\/edit\/\d+/, { timeout: 45000 });
  await page.waitForTimeout(3000);

  const poUrl = page.url();
  const poId = poUrl.split('/').pop();
  const poCode = await page.locator('#code').inputValue().catch(() => 'PO-' + poId);
  console.log('PO Header Created! PO ID:', poId, 'Code:', poCode);

  console.log('--- STEP 3: ADD DETAIL LINE PRODUCT VIA MULTISELECT ---');
  const poDetailHeader = page.locator('#PurchaseOrderDetail, button:has-text("Purchase Order Detail")').first();
  await poDetailHeader.scrollIntoViewIfNeeded().catch(() => undefined);

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
  await prodOption.click({ force: true });
  console.log('Product added to table:', sku);
  await page.waitForTimeout(3000);

  console.log('--- STEP 4: VERIFY LINE DETAIL & UPDATE UNIT PRICE ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const getLinesRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/' + poId + '/purchase-order-detail', { headers });
  const linesJson = await getLinesRes.json();
  const detailItem = linesJson.data?.[0];
  expect(detailItem).toBeDefined();

  // Update line price to Rp 80.000
  const updateRes = await page.request.put('https://api.staging.olshoperp.com/api/supplychain/purchase-order-detail/' + detailItem.id, {
    headers,
    data: {
      purchase_order_id: parseInt(poId!),
      product_id: detailItem.product_id,
      order_quantity: qty,
      order_quantity_unit_id: detailItem.order_quantity_unit_id,
      product_sku_name: detailItem.product_sku_name,
      each_price: unitPrice,
      each_price_before_discount_before_vat: unitPrice,
      purchase_discount: 0,
      modalUpdate: true,
      taxes: [
        {
          tax_id: 23,
          value: 10,
          included: false,
          coefficient: false
        }
      ]
    }
  });
  expect(updateRes.status()).toBe(200);

  console.log('--- STEP 5: VERIFY VAT EXCLUDE CALCULATION ---');
  const poRes = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/' + poId, { headers });
  const poJson = await poRes.json();
  const poData = poJson.data;

  console.log('=== VERIFIKASI KALKULASI VAT / PPN ===');
  console.log('Transaction Code:', poData.code);
  console.log('Transaction Status:', poData.transaction_status_formatted);
  console.log('DPP / Grand Total Before VAT:', poData.grand_total_before_vat);
  console.log('Grand Total After VAT:', poData.grand_total_after_vat);

  const line = poData.purchase_order_details[0];
  console.log('Line SKU:', line.product_sku_name);
  console.log('Line Qty:', line.order_quantity);
  console.log('Unit Price Before VAT (DPP):', line.each_price_before_vat);
  console.log('VAT Included (Exclude vs Include):', line.vat_included ? 'Include' : 'Exclude');
  console.log('VAT Percentage:', line.vat + '%');
  console.log('VAT Amount:', line.price_vat);
  console.log('Line Total After VAT:', line.price_after_vat);

  expect(line.vat_included).toBe(false);
  expect(parseFloat(line.each_price_before_vat)).toBe(80000);
  expect(parseFloat(line.price_after_vat)).toBe(88000);
  expect(poData.transaction_status).toBe('open');
});
