import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';
import { PurchaseOrderPage } from '../../helpers/purchase-order';

test('Approve Purchase Order PO-6A8A5BF6 via Web UI Crawling', async ({ page }) => {
  test.setTimeout(120_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const poCode = 'PO-6A8A5BF6';
  const poId = '2636';

  console.log('--- 1. PREPARE SESSION & OPEN PO DATALIST ---');
  const poPage = new PurchaseOrderPage(page);
  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/purchase-order',
  });

  await page.goto('https://staging.olshoperp.com/supplychain/purchase-order');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(2000);

  console.log('--- 2. SEARCH & APPROVE PO VIA UI ---');
  await poPage.clickApproveFromDatalist(poCode);
  await page.waitForTimeout(3000);

  console.log('--- 3. VERIFY APPROVED STATUS IN DATALIST ---');
  await poPage.assertPoStatusApprovedInDatalist(poCode);

  console.log('--- 4. VERIFY PO STATUS VIA BACKEND API ---');
  const { token } = await readAuthFromPage(page);
  const headers = {
    Authorization: 'Bearer ' + token,
    'Company-Id': companyId,
    'Content-Type': 'application/json',
  };

  const res = await page.request.get('https://api.staging.olshoperp.com/api/supplychain/purchase-order/' + poId, { headers });
  const json = await res.json();
  const d = json.data;
  console.log('PO Approval Status:', {
    id: d.id,
    code: d.code,
    transaction_status: d.transaction_status,
    transaction_status_formatted: d.transaction_status_formatted,
    grand_total_before_vat: d.grand_total_before_vat,
    grand_total_after_vat: d.grand_total_after_vat,
  });

  expect(d.transaction_status).toBe('approved');
  console.log('=== PURCHASE ORDER PO-6A8A5BF6 BERHASIL DIAPPROVE ===');
});
