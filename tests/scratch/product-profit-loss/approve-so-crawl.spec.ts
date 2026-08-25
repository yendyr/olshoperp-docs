import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test.describe.configure({ retries: 0 });

test('Change status to Open and Approve Sales Order SO-5U7TQKCP via Web UI Crawling', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const soId = '2519646';

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

  console.log('--- 2. CHANGE STATUS TO OPEN VIA RADIO BUTTON ---');
  const openRadio = page.locator('#open, input[type="radio"][value="open"]');
  await expect(openRadio).toBeVisible({ timeout: 15000 });
  await openRadio.click({ force: true });
  console.log('Clicked radio button Open.');
  await page.waitForTimeout(3000);

  console.log('--- 3. CLICK APPROVE BUTTON ---');
  const approveBtn = page.locator('button:has(svg[data-icon="check-double"]), button:has(svg.fa-check-double), button:has-text("Approve")').first();
  await expect(approveBtn, 'Approve Button').toBeVisible({ timeout: 15000 });
  await approveBtn.click({ force: true });
  console.log('Clicked Approve button.');
  await page.waitForTimeout(2000);

  console.log('--- 4. CONFIRM APPROVAL IN APPROVAL MODAL ---');
  const modal = page.locator('div[role="dialog"], div.modal, div.fixed.inset-0').last();
  await expect(modal).toBeVisible({ timeout: 15000 });

  const confirmApproveBtn = modal.locator('button:has-text("Approve"), button[type="submit"]').last();
  await expect(confirmApproveBtn).toBeVisible({ timeout: 10000 });
  await confirmApproveBtn.click({ force: true });
  console.log('Clicked confirm Approve in modal.');
  await page.waitForTimeout(5000);

  console.log('--- 5. VERIFY BACKEND STATUS ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    Accept: 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/omnichannel/sales-order/' + soId, { headers });
  const soJson = await res.json();
  const soData = soJson.data;

  console.log('=== HASIL TRANSAKSI SALES ORDER SETELAH APPROVE ===');
  console.log('1. Code:', soData.code);
  console.log('2. Status:', soData.transaction_status_formatted || soData.transaction_status);
  console.log('3. Approved At:', soData.approved_at);
  console.log('4. Customer:', soData.customer?.name);
  console.log('5. Grand Total Before VAT:', soData.grand_total_before_vat);
  console.log('6. Grand Total After VAT:', soData.grand_total_after_vat);
  console.log('7. Detail SKU:', soData.sales_order_details?.[0]?.product_sku_name, 'Qty:', soData.sales_order_details?.[0]?.order_quantity);

  expect(soData.transaction_status).toBe('approved');
});
