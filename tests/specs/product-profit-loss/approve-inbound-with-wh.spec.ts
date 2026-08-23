import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseInboundPage } from '../../helpers/purchase-inbound';

test.describe.configure({ retries: 0 });

test('TC-APPROVE-INBOUND-CRAWL: Set Level-20 Warehouse & Approve Purchase Inbound IN-5U7ODE9M via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const inId = '131633';
  const inCode = 'IN-5U7ODE9M';
  const poCode = 'PO-6A8A5BF6';
  const sku = 'LUMI-CRAWL-1787447920177';
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

  console.log('--- 2. SELECT LEVEL-20 WAREHOUSE DESTINATION ---');
  const whCombobox = piPage.locationDestinationCombobox;
  await expect(whCombobox).toBeVisible({ timeout: 15000 });
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
    console.log('Selected Warehouse Destination:', validWarehouseName);
  }

  await page.waitForTimeout(1500);

  // Click Save All
  console.log('Clicking Save All on header...');
  const saveAllBtn = page.getByRole('button', { name: /Save All|Save/i }).first();
  if (await saveAllBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveAllBtn.click({ force: true });
    await page.waitForTimeout(3000);
    console.log('Clicked Save All.');
  }

  console.log('--- 3. CLICK APPROVE BUTTON (UI CRAWLING) ---');
  await piPage.clickApproveFromShow();
  console.log('Clicked Approve button and confirmed in modal.');

  await page.waitForTimeout(3000);

  console.log('--- 4. VERIFY APPROVAL IN BACKEND API ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/mutation-inbound/' + inId, { headers });
  const inData = (await res.json()).data;

  console.log('=== HASIL APPROVAL PURCHASE INBOUND ===');
  console.log('1. Company: Lumi Charms.id (ID: 153)');
  console.log('2. Inbound Code:', inData.code);
  console.log('3. Supplier:', inData.supplier?.name);
  console.log('4. Warehouse Destination:', inData.destination?.name);
  console.log('5. Source PO:', poCode);
  console.log('6. SKU:', sku);
  console.log('7. Status Transaksi:', inData.transaction_status_formatted || inData.transaction_status);

  expect(inData.transaction_status).toBe('approved');
  console.log('STATUS INBOUND BERHASIL APPROVED!');
});
