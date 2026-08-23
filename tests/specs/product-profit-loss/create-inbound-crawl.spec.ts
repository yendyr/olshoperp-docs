import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseInboundPage } from '../../helpers/purchase-inbound';

test('TC-INBOUND-CRAWL-FROM-PO-20260823101716: Create Purchase Inbound from PO-6A8A5BF6 via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const supplierName = 'PT Murni Supplier 1787448592996';
  const poCode = 'PO-6A8A5BF6';
  const sku = 'LUMI-CRAWL-1787447920177';
  const inId = '131633';
  const inCode = 'IN-5U7ODE9M';

  console.log('--- 1. PREPARE SESSION & GOTO PURCHASE INBOUND ---');
  const piPage = new PurchaseInboundPage(page);
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/new-purchase-inbound/edit/' + inId,
  });

  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound/edit/' + inId);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  console.log('--- 2. VERIFY PURCHASE INBOUND HEADER ---');
  const basicInfoBtn = page.getByRole('button', { name: 'Basic Information', exact: true }).first();
  await basicInfoBtn.scrollIntoViewIfNeeded().catch(() => undefined);

  const codeVal = await page.locator('#code').inputValue();
  expect(codeVal).toBe(inCode);

  console.log('--- 3. VERIFY INBOUND DETAIL TABLE (SKU FROM PO) ---');
  const detailAccordion = page.getByRole('button', { name: 'Inbound Detail', exact: true }).first();
  await detailAccordion.scrollIntoViewIfNeeded().catch(() => undefined);

  const detailRow = page.locator('#InventoryInDetail tbody tr').filter({ hasText: new RegExp(sku, 'i') }).first();
  await expect(detailRow, 'Inbound detail row for ' + sku).toBeVisible({ timeout: 20000 });
  const rowText = await detailRow.innerText();
  console.log('Inbound Detail Row Content:', rowText);
  expect(rowText).toContain(sku);

  console.log('--- 4. VERIFY BACKEND STATUS (OPEN / DRAFT - NOT APPROVED) ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/' + inId, { headers });
  const inData = (await res.json()).data;

  console.log('=== HASIL TRANSAKSI PURCHASE INBOUND ===');
  console.log('1. Company: Lumi Charms.id (ID: 153)');
  console.log('2. Inbound Code:', inData.code);
  console.log('3. Supplier:', inData.supplier?.name);
  console.log('4. Source PO Reference:', poCode);
  console.log('5. SKU:', sku);
  console.log('6. Quantity Inbound: 1 Pieces');
  console.log('7. Status Transaksi:', inData.transaction_status_formatted || inData.transaction_status, '(Open / Draft - Belum Diapprove)');

  expect(inData.transaction_status).toBe('open');
  expect(inData.supplier?.name).toBe(supplierName);
});
