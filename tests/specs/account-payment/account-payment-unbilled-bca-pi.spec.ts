import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ACCOUNT_PAYMENT_DATALIST_PATH,
  AccountPaymentPage,
} from '../../helpers/account-payment';

/**
 * Account Payment — supplier Unbilled Goods + Bank BCA 001 + PI-6960CB30.
 * Company: lumicharmsid (153)
 */
test.describe('Account Payment — Unbilled + BCA + PI', () => {
  test.describe.configure({ timeout: 480_000 });

  test('[@TC-APAY-001] Supplier → Bank BCA 001 Use → Outstanding PI Use → Open → Approve', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ACCOUNT_PAYMENT_DATALIST_PATH,
    });

    const ap = new AccountPaymentPage(page);
    await ap.gotoDatalist();
    // Bebaskan reserved fund Bank BCA dari draft run sebelumnya
    await ap.deleteAutomationDrafts();
    await ap.gotoDatalist();
    const code = await ap.openCreateAndWaitForEdit();
    expect(code.length).toBeGreaterThan(0);

    await ap.selectSupplier('pt unbilled goods');
    await ap.fillDescription('automation playwright');

    await ap.useCashBankByLabel('Bank BCA 001');
    await ap.useOutstandingPurchaseInvoice('PI-6960CB30');
    await ap.syncSourceAmountWithPiDetail('PI-6960CB30');

    await ap.assertPaymentHasBankAndPi('Bank BCA 001', 'PI-6960CB30');

    await ap.setOpenAndWait();
    await ap.approveFromForm('automation playwright');
    await ap.assertApprovedInDatalist(code);

    console.log(
      JSON.stringify({
        paymentCode: code,
        supplier: 'PT. Unbilled Goods',
        cashBank: 'Bank BCA 001',
        pi: 'PI-6960CB30',
        status: 'Approved',
        result: 'PASS',
      }),
    );
  });
});
