import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseInboundPage } from '../../helpers/purchase-inbound';

test.describe.configure({ retries: 0 });

test('Fix Warehouse Destination and Approve Purchase Inbound IN-5U7ODE9M via Web UI Crawling', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const inId = '131633';
  const inCode = 'IN-5U7ODE9M';
  const poCode = 'PO-6A8A5BF6';
  const sku = 'LUMI-CRAWL-1787447920177';
  const supplierName = 'PT Murni Supplier 1787448592996';
  const validWarehouseName = 'WH Pusat Zona A1';

  console.log('--- 1. PREPARE SESSION & GOTO EDIT INBOUND ---');
  const piPage = new PurchaseInboundPage(page);
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/new-purchase-inbound/edit/' + inId,
  });

  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound/edit/' + inId);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  // Check if detail row exists, delete it so we can change warehouse destination
  const detailSection = page.locator('#InventoryInDetail');
  await detailSection.scrollIntoViewIfNeeded().catch(() => undefined);
  await page.waitForTimeout(1000);

  const existingRow = detailSection.locator('tbody tr').filter({ hasText: new RegExp(sku, 'i') }).first();
  if (await existingRow.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('Found existing detail row, deleting it to unlock warehouse change...');
    const deleteBtn = existingRow.locator('button:has-text("Delete"), button[class*="delete"], a:has-text("Delete")').first();
    if (await deleteBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const confirmModalBtn = page.getByRole('button', { name: /^Delete$|^Yes$/i }).last();
      await confirmModalBtn.click({ force: true });
      await page.waitForTimeout(3000);
    }
  }

  console.log('--- 2. UPDATE WAREHOUSE DESTINATION TO LEVEL 20 WAREHOUSE ---');
  const basicInfoBtn = page.getByRole('button', { name: 'Basic Information', exact: true }).first();
  await basicInfoBtn.scrollIntoViewIfNeeded().catch(() => undefined);

  const whCombobox = piPage.locationDestinationCombobox;
  await whCombobox.click({ force: true });
  await page.waitForTimeout(500);

  const whSearch = whCombobox.locator('input');
  if (await whSearch.count() > 0) {
    await whSearch.fill('WH Pusat Zona A1');
    await page.waitForTimeout(1000);
  }

  const whOpt = page.locator('.multiselect-option').filter({ hasText: /WH Pusat Zona A1|SBY-HUB/i }).first();
  if (await whOpt.count() > 0) {
    await whOpt.click({ force: true });
    console.log('Selected Valid Destination Warehouse:', validWarehouseName);
  }

  await page.waitForTimeout(1500);

  // Click Save All
  console.log('Clicking Save All on header...');
  const saveAllBtn = page.getByRole('button', { name: /Save All|Save/i }).first();
  if (await saveAllBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveAllBtn.click({ force: true });
    await page.waitForTimeout(3000);
    console.log('Saved header with valid warehouse.');
  }

  console.log('--- 3. PULL PO INTO INBOUND DETAIL VIA MODAL ---');
  await piPage.openAvailablePurchaseOrderModal();
  await piPage.searchOutstandingProducts(poCode);
  await page.waitForTimeout(2000);

  const modalContainer = page.locator('div.fixed.rounded, div[style*="calc(100vw - 520px)"]').last();
  const poRow = modalContainer.locator('tbody tr').filter({ hasText: new RegExp(poCode, 'i') }).first();
  await expect(poRow, 'PO Row in modal').toBeVisible({ timeout: 20000 });
  console.log('Found PO row in modal:', await poRow.innerText());

  const checkbox = poRow.locator('input[type="checkbox"]').first();
  await checkbox.check({ force: true });
  console.log('Checked checkbox on PO row.');
  await page.waitForTimeout(500);

  const bulkUseBtn = modalContainer.locator('button.tooltip-use, button:has-text("Use")').first();
  await bulkUseBtn.click({ force: true });
  console.log('Clicked Use button! Added SKU to Inbound Detail.');
  await page.waitForTimeout(3000);

  console.log('--- 4. CLICK APPROVE BUTTON ---');
  await piPage.clickApproveFromShow();
  console.log('Clicked Approve button and confirmed modal.');

  await page.waitForTimeout(3000);

  console.log('--- 5. VERIFY APPROVED STATUS IN BACKEND ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/' + inId, { headers });
  const inData = (await res.json()).data;

  console.log('=== HASIL AKHIR TRANSAKSI PURCHASE INBOUND ===');
  console.log('1. Company: Lumi Charms.id (ID: 153)');
  console.log('2. Inbound Code:', inData.code);
  console.log('3. Supplier:', inData.supplier?.name);
  console.log('4. Warehouse Destination:', inData.destination?.name);
  console.log('5. Source PO:', poCode);
  console.log('6. SKU:', sku);
  console.log('7. Status Transaksi:', inData.transaction_status_formatted || inData.transaction_status);

  expect(inData.transaction_status).toBe('approved');
  console.log('PURCHASE INBOUND BERHASIL DIAPPROVE!');
});
