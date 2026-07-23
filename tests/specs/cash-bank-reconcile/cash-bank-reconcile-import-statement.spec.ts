import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  CASH_BANK_RECONCILE_DATALIST_PATH,
  CashBankReconcilePage,
} from '../../helpers/cash-bank-reconcile';

/**
 * Warm-up W4 — Import 1 baris bank statement (fondasi TC-CBRAM).
 * Company: lumicharmsid (153)
 *
 * Seed: BR-6A617F12 (W3 Open, Bank BCA 001, Period 23-07-2026)
 * File: Received 16000 tgl 23/07/2026 (match AR RC-5TWBHOUX / GL-5TWBI5XV amount)
 * Tidak assert auto-match di warm-up ini.
 */
test.describe('Cash/Bank Reconcile — Import bank statement', () => {
  test.describe.configure({ timeout: 360_000 });

  test('[@TC-CBR-002] BR-6A617F12 → Import Received 16000 → baris Bank Statement', async ({
    page,
  }) => {
    const code = 'BR-6A617F12';
    const fixture = path.join(
      process.cwd(),
      'tests/fixtures/cbr/bank-statement-ar-received-16000.xlsx',
    );

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: CASH_BANK_RECONCILE_DATALIST_PATH,
    });

    const cbr = new CashBankReconcilePage(page);
    await cbr.openEditFromDatalistByCode(code);
    await cbr.expandBankStatement();

    // API upload lebih stabil (UI file input sering tidak fire change tanpa klik Import panel)
    await cbr.importBankStatementViaApi(fixture);

    await cbr.assertBankStatementRow({
      dateHint: /23[-/]07[-/]2026/i,
      amountHint: /16\.000|16000/i,
    });

    console.log(
      JSON.stringify({
        reconcileCode: code,
        file: 'bank-statement-ar-received-16000.xlsx',
        received: 16000,
        date: '23/07/2026',
        result: 'PASS',
      }),
    );
  });
});
