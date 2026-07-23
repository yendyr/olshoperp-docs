import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  CASH_BANK_RECONCILE_DATALIST_PATH,
  CashBankReconcilePage,
} from '../../helpers/cash-bank-reconcile';

/**
 * Warm-up W3 — Cash/Bank Reconcile create header (fondasi TC-CBRAM).
 * Company: lumicharmsid (153)
 *
 * Flow: Create → Period (hari journal AR) → Bank BCA 001 →
 * description → Save & Next → Open → datalist.
 */
test.describe('Cash/Bank Reconcile — Create header + Open', () => {
  test.describe.configure({ timeout: 360_000 });

  test('[@TC-CBR-001] Create → Period → Bank BCA 001 → Open', async ({
    page,
  }) => {
    // Period cover journal GL-5TWBI5XV / AR RC-5TWBHOUX (23-07-2026)
    const periodDay = 23;

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: CASH_BANK_RECONCILE_DATALIST_PATH,
    });

    const cbr = new CashBankReconcilePage(page);
    await cbr.gotoDatalist();
    await cbr.deleteAutomationDrafts();
    await cbr.gotoDatalist();

    await cbr.openCreateForm();
    await cbr.setPeriodByCalendarDays(periodDay, periodDay);
    await cbr.selectCashBankAccount('Bank BCA 001');
    await cbr.fillDescription('automation playwright');

    await expect(
      page.getByText(/Bank BCA 001/i).filter({ visible: true }).first(),
    ).toBeVisible({ timeout: 10_000 });

    const code = await cbr.clickSaveAndNextAndWaitForEdit();
    expect(code).toMatch(/^BR-/i);

    await cbr.setOpenAndWait();
    await cbr.assertInDatalist(code, {
      status: /open/i,
      bankHint: 'Bank BCA',
    });

    console.log(
      JSON.stringify({
        reconcileCode: code,
        cashBank: 'Bank BCA 001',
        periodDay,
        status: 'Open',
        result: 'PASS',
      }),
    );
  });
});
