import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_INVOICE_DATALIST_PATH,
  PurchaseInvoicePage,
} from '../../helpers/purchase-invoice';

/**
 * Verifikasi hasil approve PI-6A5DC78E di datalist (sudah di-approve via form).
 */
test('verify PI-6A5DC78E Approved di datalist', async ({ page }) => {
  test.setTimeout(120_000);
  await prepareSession(page, {
    companyCode: 'lumicharmsid',
    targetPath: PURCHASE_INVOICE_DATALIST_PATH,
  });

  const code = 'PI-6A5DC78E';
  const pi = new PurchaseInvoicePage(page);
  await pi.assertApprovedInDatalist(code);

  console.log(
    JSON.stringify({
      code,
      status: 'Approved',
      result: 'PASS',
      note: 'Verified after form Open + Approve',
    }),
  );
  expect(true).toBeTruthy();
});
