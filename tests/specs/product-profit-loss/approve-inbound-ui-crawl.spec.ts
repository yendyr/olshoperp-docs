import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseInboundPage } from '../../helpers/purchase-inbound';

test.describe.configure({ retries: 0 });

test('TC-APPROVE-INBOUND-CRAWL: Approve Purchase Inbound IN-5U7ODE9M via Web UI Crawling (Company 153 - Lumi Charms.id)', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const inId = '131633';
  const inCode = 'IN-5U7ODE9M';
  const poCode = 'PO-6A8A5BF6';
  const sku = 'LUMI-CRAWL-1787447920177';

  console.log('--- 1. PREPARE SESSION & GOTO EDIT INBOUND ---');
  const piPage = new PurchaseInboundPage(page);
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/new-purchase-inbound/edit/' + inId,
  });

  await page.goto('https://staging.olshoperp.com/supplychain/new-purchase-inbound/edit/' + inId);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  console.log('--- 2. VERIFY TRANSACTION DETAILS BEFORE APPROVAL ---');
  const codeVal = await page.locator('#code').inputValue();
  expect(codeVal).toBe(inCode);
  console.log('Inbound Transaction Code:', codeVal);

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
  console.log('4. Source PO:', poCode);
  console.log('5. SKU:', sku);
  console.log('6. Status Transaksi:', inData.transaction_status_formatted || inData.transaction_status);

  expect(inData.transaction_status).toBe('approved');
  console.log('STATUS INBOUND BERHASIL APPROVED!');
});
