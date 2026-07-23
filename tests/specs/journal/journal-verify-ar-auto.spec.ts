import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ACCOUNT_RECEIVE_DATALIST_PATH,
  AccountReceivePage,
} from '../../helpers/account-receive';
import {
  JOURNAL_DATALIST_PATH,
  JournalPage,
} from '../../helpers/journal';

/**
 * Warm-up W2 — verifikasi auto-journal dari Account Receive (fondasi TC-CBRAM).
 * Company: lumicharmsid (153)
 *
 * Seed: RC-5TWBHOUX (W1 / TC-ARCP-005 Approved).
 */
test.describe('Journal — verify auto from Account Receive', () => {
  test.describe.configure({ timeout: 300_000 });

  test('[@TC-JRN-004] AR RC-5TWBHOUX → journal Approved + Payment from Customer + Bank BCA', async ({
    page,
  }) => {
    const arCode = 'RC-5TWBHOUX';

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ACCOUNT_RECEIVE_DATALIST_PATH,
    });

    const ar = new AccountReceivePage(page);
    const journalCode = await ar.getLinkedJournalCodeFromDatalist(arCode);
    expect(journalCode.length).toBeGreaterThan(3);

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: JOURNAL_DATALIST_PATH,
    });

    const journal = new JournalPage(page);
    await journal.assertApprovedInDatalist(journalCode);
    await journal.assertTypeInDatalist(journalCode, 'Payment from Customer');

    await journal.openEditFromDatalistByCode(journalCode);
    await journal.assertTransactionReferenceOnForm(arCode);
    await journal.assertLedgerHasAccount('Bank BCA');

    console.log(
      JSON.stringify({
        receiveCode: arCode,
        journalCode,
        type: 'Payment from Customer',
        ledgerHint: 'Bank BCA',
        status: 'Approved',
        result: 'PASS',
      }),
    );
  });
});
