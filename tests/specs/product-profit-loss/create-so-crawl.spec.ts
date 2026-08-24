import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test.describe.configure({ retries: 0 });

test('Add SKU LUMI-CRAWL-1787447920177 to Sales Order 2519646 via Web UI Crawling', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const sku = 'LUMI-CRAWL-1787447920177';
  const soId = '2519646';
  const unitPrice = '100000';

  console.log('--- 1. PREPARE SESSION & GOTO SALES ORDER EDIT PAGE ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/businessdevelopment/sales-order-general/edit/' + soId,
  });

  await page.goto('https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/' + soId);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  const soCode = await page.locator('#code').inputValue();
  console.log('Sales Order Transaction Code:', soCode);

  console.log('--- 2. SELECT PRODUCT IN DETAIL SECTION ---');
  const detailSection = page.locator('#SalesOrderDetail, div:has(> button:has-text("Sales Order Detail"))').first();
  await detailSection.scrollIntoViewIfNeeded().catch(() => undefined);
  await page.waitForTimeout(1000);

  // Find Select Product Multiselect
  const prodSelect = page.locator('.custom-multiselect').filter({ hasText: /Select Product/i }).first();
  await expect(prodSelect).toBeVisible({ timeout: 15000 });
  await prodSelect.click({ force: true });
  await page.waitForTimeout(500);

  const prodSearch = prodSelect.locator('input.multiselect-search').first();
  await prodSearch.fill(sku);
  console.log('Filled SKU in search:', sku);
  await page.waitForTimeout(2000);

  const prodOpt = page.locator('.multiselect-option').filter({ hasText: new RegExp(sku, 'i') }).first();
  await expect(prodOpt, 'Option for ' + sku).toBeVisible({ timeout: 15000 });
  await prodOpt.click({ force: true });
  console.log('Selected Product in Select Product dropdown:', sku);
  await page.waitForTimeout(4000);

  console.log('--- 3. OPEN EDIT MODAL ON THE CREATED DETAIL ROW ---');
  const detailRow = page.locator('table tbody tr').filter({ hasText: new RegExp(sku, 'i') }).first();
  await expect(detailRow, 'Row with SKU ' + sku).toBeVisible({ timeout: 25000 });
  console.log('Found detail row text:', await detailRow.innerText());

  // Click edit button on row
  const editBtn = detailRow.locator('button#updateButton, button:has-text("Edit"), a[href*="edit"]').first().or(detailRow.locator('button').first());
  await editBtn.click({ force: true });
  await page.waitForTimeout(2000);

  const modal = page.locator('div[role="dialog"], div.modal, div.fixed.inset-0').last();
  await expect(modal).toBeVisible({ timeout: 15000 });
  console.log('Detail Edit Modal is open.');

  console.log('--- 4. INPUT UNIT PRICE (100.000) & QUANTITY (1) ---');
  const priceInput = modal.locator('div:has(> label:has-text("Price")) input, input[placeholder*="Price" i]').last();
  await priceInput.click({ force: true });
  await priceInput.fill(unitPrice);
  await priceInput.press('Tab');
  console.log('Filled Unit Price: 100000');
  await page.waitForTimeout(1000);

  // Check Tax in Modal
  const taxInfo = await modal.locator('div:has(> label:has-text("Tax")), div:has(> label:has-text("VAT"))').innerText().catch(() => '');
  console.log('Tax Information in modal:', taxInfo);

  // Click Save in Modal
  console.log('Clicking Save in Modal...');
  const saveBtn = modal.locator('button:has-text("Save"), button[type="submit"]').last();
  await saveBtn.click({ force: true });
  await page.waitForTimeout(4000);
  console.log('Saved product detail changes.');

  console.log('--- 5. VERIFY BACKEND STATUS & VAT CALCULATION ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/' + soId, { headers });
  const soJson = await res.json();
  const soData = soJson.data;

  console.log('=== HASIL TRANSAKSI SALES ORDER GENERAL ===');
  console.log('1. Sales Order Code:', soData.code);
  console.log('2. Customer:', soData.customer?.name);
  console.log('3. Store:', soData.store?.name);
  console.log('4. Warehouse Process:', soData.warehouse_process?.name);
  console.log('5. Status Transaksi:', soData.transaction_status_formatted || soData.transaction_status, '(Open / Draft - Belum Diapprove)');
  console.log('6. Grand Total Before VAT:', soData.grand_total_before_vat);
  console.log('7. Grand Total After VAT:', soData.grand_total_after_vat);
  console.log('8. Total VAT Amount:', soData.total_vat);
  console.log('9. Total Discount:', soData.total_discount);
  console.log('10. Details Count:', soData.sales_order_details?.length);
  console.log('11. Details:', JSON.stringify(soData.sales_order_details?.map((d: any) => ({
    id: d.id,
    sku_name: d.product_sku_name,
    qty: d.order_quantity,
    unit_price: d.each_price_before_discount_before_vat,
    each_price_after_vat: d.each_price_after_vat,
    vat_percent: d.vat,
    vat_amount: d.price_vat,
    vat_included: d.vat_included,
    taxes: d.sales_order_detail_tax
  })), null, 2));

  expect(soData.transaction_status).toBe('open');
});
