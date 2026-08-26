import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_INVOICE_DATALIST_PATH,
  PurchaseInvoicePage,
} from '../../helpers/purchase-invoice';

/**
 * Approve PI-6A5DC78E dari form detail: Show → Open → Approve → datalist Approved.
 */
test.describe('Purchase Invoice — Approve from form PI-6A5DC78E', () => {
  test.describe.configure({ timeout: 300_000 });

  const code = 'PI-6A5DC78E';

  test('Show → Open → Approve → status Approved di datalist', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_INVOICE_DATALIST_PATH,
    });

    const pi = new PurchaseInvoicePage(page);
    await pi.openEditFromDatalistByCode(code);
    await pi.setOpenAndWait();
    const result = await pi.approveFromForm('automation playwright');
    await pi.assertApprovedInDatalist(code);

    console.log(
      JSON.stringify({
        code,
        message: result.message ?? null,
        status: 'Approved',
        result: 'PASS',
      }),
    );

    expect(true).toBeTruthy();
  });
});
