import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SALES_INVOICE_DATALIST_PATH,
  SalesInvoicePage,
} from '../../helpers/sales-invoice';

/**
 * Approve SI seed yang sudah dibuat (TC-SINV-001) agar eligible Outstanding SI / AR / CBR.
 * Company: lumicharmsid (153)
 */
test.describe('Sales Invoice — Approve existing', () => {
  test.describe.configure({ timeout: 300_000 });

  test('[@TC-SINV-001-APPROVE] Open → Approve SI-5TVBTC4Y', async ({ page }) => {
    const code = 'SI-5TVBTC4Y';

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SALES_INVOICE_DATALIST_PATH,
    });

    const si = new SalesInvoicePage(page);
    await si.openEditFromDatalistByCode(code);

    // Idempotent: kalau sudah Approved, assert & selesai
    const alreadyApproved = await page
      .getByText(/approved/i)
      .filter({ visible: true })
      .first()
      .isVisible()
      .catch(() => false);
    const approveVisible = await si.formApproveButton
      .isVisible()
      .catch(() => false);

    if (alreadyApproved && !approveVisible) {
      await si.assertApprovedInDatalist(code);
      console.log(
        JSON.stringify({
          invoiceCode: code,
          status: 'Approved',
          note: 'already approved',
          result: 'PASS',
        }),
      );
      return;
    }

    await si.setOpenAndWait();
    await si.approveFromForm('automation playwright');
    await si.assertApprovedInDatalist(code);

    console.log(
      JSON.stringify({
        invoiceCode: code,
        status: 'Approved',
        result: 'PASS',
      }),
    );
  });
});
