import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ACCOUNT_RECEIVE_DATALIST_PATH,
  AccountReceivePage,
} from '../../helpers/account-receive';

/**
 * Warm-up W1 — Account Receive create dasar (fondasi TC-CBRAM AR).
 * Company: lumicharmsid (153)
 *
 * Flow: Create → Customer Supplier China → Available SI Use →
 * Bank BCA 001 → sync amount → Open → Approve → datalist.
 */
test.describe('Account Receive — Create + SI + Cash/Bank + Approve', () => {
  test.describe.configure({ timeout: 480_000 });

  test('[@TC-ARCP-005] Create → PT Customer Lumi 001 → Available SI Use → Bank BCA 001 → Approve', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ACCOUNT_RECEIVE_DATALIST_PATH,
    });

    const ar = new AccountReceivePage(page);
    await ar.gotoDatalist();
    await ar.deleteAutomationDrafts();
    await ar.gotoDatalist();

    const code = await ar.openCreateAndWaitForEdit();
    expect(code.length).toBeGreaterThan(0);

    await ar.selectCustomer('PT. Customer Lumi 001');
    await ar.selectCurrency('IDR');
    await ar.fillDescription('automation playwright');
    await ar.clickSaveAllAndWait();

    // SI outstanding auto-pick (amount > 0)
    const usedSi = await ar.useAvailableSalesInvoices();
    expect(usedSi.length).toBeGreaterThan(0);

    // Receiving Destination sering auto-terisi (mis. Bank BCA Lumi Charms).
    // Pastikan Bank BCA 001 ada, lalu sync: hapus fund lain + samakan amount ke paid SI.
    const hasBca001 = await page
      .locator('#receiveDestination')
      .getByText(/Bank BCA 001|1-10015/i)
      .first()
      .isVisible()
      .catch(() => false);
    if (!hasBca001) {
      await ar.useCashBankByLabel('Bank BCA 001');
    }
    await ar.syncDestinationAmountWithSiDetail(usedSi[0]);

    await ar.assertReceiveHasBankAndSi('Bank BCA', usedSi[0]);

    await ar.setOpenAndWait();
    await ar.approveFromForm('automation playwright');
    await ar.assertApprovedInDatalist(code);

    console.log(
      JSON.stringify({
        receiveCode: code,
        customer: 'PT. Customer Lumi 001',
        cashBank: 'Bank BCA (001 or Lumi Charms)',
        salesInvoices: usedSi,
        status: 'Approved',
        result: 'PASS',
      }),
    );
  });
});
