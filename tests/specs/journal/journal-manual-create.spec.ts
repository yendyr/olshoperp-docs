import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  JOURNAL_DATALIST_PATH,
  JournalPage,
} from '../../helpers/journal';

/**
 * Journal manual — VIEW → CREATE (2 store + debit/credit + Open) → SEARCH.
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Journal — Manual Create', () => {
  test.describe.configure({ timeout: 360_000 });

  let journalCode = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: JOURNAL_DATALIST_PATH,
    });
  });

  test('[@TC-JRN-001] VIEW datalist shell + Create', async ({ page }) => {
    const jrn = new JournalPage(page);
    await jrn.gotoDatalist();
    await jrn.assertDatalistShell();
  });

  test('[@TC-JRN-002] CREATE manual journal + Open', async ({ page }) => {
    const jrn = new JournalPage(page);
    await jrn.gotoDatalist();
    journalCode = await jrn.openCreateAndWaitForEdit();
    expect(journalCode.length).toBeGreaterThan(0);

    // Step 2 — stores
    await jrn.selectStores(['store barang mahal', 'offline store lumi']);

    // Description sebelum Open (wajib; default "Default System")
    await jrn.fillDescription('automation playwright');

    // Step 3 — debit line
    await jrn.addLedgerLine({
      account: '1-10002',
      debit: '10000',
      description: 'automation playwright',
    });

    // Step 4 — credit line
    await jrn.addLedgerLine({
      account: '1-10003',
      credit: '10000',
      description: 'automation playwright',
    });

    // Step 5 — Open
    await jrn.setOpenAndWait();

    await expect(page).toHaveURL(/\/accounting\/journal\/edit\/\d+/);
    await expect(jrn.openRadio).toBeChecked();
  });

  test('[@TC-JRN-003] SEARCH journal code', async ({ page }) => {
    expect(journalCode, 'journalCode dari TC-JRN-002').toBeTruthy();
    const jrn = new JournalPage(page);
    await jrn.assertInDatalist(journalCode);
  });
});
