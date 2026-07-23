import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  TRANSACTION_HISTORY_PATH,
  TransactionHistoryPage,
} from '../../helpers/transaction-history';

const SEED_SKU = 'AUTO-SKU001';

/**
 * BETA - Transaction History — view shell + filter building/type + search.
 * Company: lumicharmsid (153)
 * Read-only report (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Transaction History — View then Filter', () => {
  test.describe.configure({ timeout: 300_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: TRANSACTION_HISTORY_PATH,
    });
  });

  test('[@TC-TRXH-001] Shell filter + kolom utama', async ({ page }) => {
    const report = new TransactionHistoryPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
    await report.assertVisibleColumns();
  });

  test('[@TC-TRXH-002] Filter Building Gayungsari + Apply', async ({
    page,
  }) => {
    const report = new TransactionHistoryPage(page);
    await report.gotoReport();

    const label = await report.filterBuildingAndApply('Gayungsari');
    expect(label.length).toBeGreaterThan(0);

    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('[@TC-TRXH-003] Filter Transaction Type Stock Addition', async ({
    page,
  }) => {
    const report = new TransactionHistoryPage(page);
    await report.gotoReport();
    await report.filterTransactionTypeAndApply('Stock Addition');

    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('[@TC-TRXH-004] Search AUTO-SKU001 + link Trx. Code', async ({
    page,
  }) => {
    const report = new TransactionHistoryPage(page);
    await report.gotoReport();
    await report.filterBuildingAndApply('Gayungsari');

    await report.searchSku(SEED_SKU);
    await report.assertTrxCodeLinkOnFirstMatchingRow(SEED_SKU);
  });
});
