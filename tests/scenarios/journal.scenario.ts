import type { Page } from '@playwright/test';
import { JournalPage } from '../helpers/journal';

/**
 * Scenario Journal — implementasi runnable TC origin:
 *   - verifyAutoJournalFromPayment → Implements: TC-JRN-005
 *     (mirror sisi AP dari TC-JRN-004 yang mengcover sisi AR)
 */

export const JRN_SCENARIO_TCS = {
  verifyAutoJournalFromPayment: 'TC-JRN-005',
} as const;

/**
 * Verifikasi auto-journal yang terbit dari Account Payment Approved:
 * status Approved, TYPE "Payment to Supplier" (assert prefix — kolom TYPE sering
 * ter-truncate), Transaction Reference = kode payment, dan ledger memuat COA
 * cash/bank yang dipakai payment.
 */
export async function verifyAutoJournalFromPayment(
  page: Page,
  journalCode: string,
  paymentCode: string,
  bankAccountHint: string,
): Promise<void> {
  const journal = new JournalPage(page);

  await journal.gotoDatalist();
  await journal.assertApprovedInDatalist(journalCode);
  await journal.assertTypeInDatalist(journalCode, 'Payment to Supplier');

  await journal.openEditFromDatalistByCode(journalCode);
  await journal.assertTransactionReferenceOnForm(paymentCode);
  await journal.assertLedgerHasAccount(bankAccountHint);
}
