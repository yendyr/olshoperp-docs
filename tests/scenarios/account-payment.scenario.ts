import type { Page } from '@playwright/test';
import { AccountPaymentPage } from '../helpers/account-payment';
import { assertNoBlocker } from './support';

/**
 * Scenario Account Payment (Supplier Payment) — implementasi runnable TC origin:
 *   - createPaymentWithInvoice → Implements: TC-APAY-001
 *   - approvePayment           → Implements: TC-APAY-002
 */

export const APAY_SCENARIO_TCS = {
  createPaymentWithInvoice: 'TC-APAY-001',
  approvePayment: 'TC-APAY-002',
} as const;

/**
 * Create Account Payment: pilih supplier, pakai sumber dana Cash/Bank,
 * alokasikan Outstanding Purchase Invoice, samakan source amount dengan nilai
 * invoice, lalu simpan sebagai Draft.
 */
export async function createPaymentWithInvoice(
  page: Page,
  supplierName: string,
  bankLabel: string,
  invoiceCode: string,
): Promise<{ paymentCode: string }> {
  const ap = new AccountPaymentPage(page);

  await ap.gotoDatalist();
  const paymentCode = await ap.openCreateAndWaitForEdit();
  await assertNoBlocker(page, 'setelah header Account Payment tersimpan');

  await ap.selectSupplier(supplierName);
  await ap.fillDescription();

  await ap.useCashBankByLabel(bankLabel);
  await assertNoBlocker(page, 'setelah pilih Cash/Bank');

  await ap.useOutstandingPurchaseInvoice(invoiceCode);
  await assertNoBlocker(page, 'setelah alokasi Outstanding Purchase Invoice');

  // Source amount harus sama dengan total alokasi invoice supaya payment balanced
  // (syarat approve — jurnal Dr AP / Cr Cash-Bank harus seimbang).
  await ap.syncSourceAmountWithPiDetail(invoiceCode);
  await ap.assertPaymentHasBankAndPi(bankLabel, invoiceCode);

  return { paymentCode };
}

/** Payment → radio Open → Approve dari form → Approved (auto-journal terbit). */
export async function approvePayment(page: Page, paymentCode: string): Promise<void> {
  const ap = new AccountPaymentPage(page);

  await ap.setOpenAndWait();
  await assertNoBlocker(page, 'setelah Account Payment set Open');

  await ap.approveFromForm();
  await assertNoBlocker(page, 'setelah Account Payment approve');
  await ap.assertApprovedInDatalist(paymentCode);
}

/** Kode journal yang otomatis terbentuk dari payment Approved. */
export async function getLinkedJournalCode(
  page: Page,
  paymentCode: string,
): Promise<string> {
  return new AccountPaymentPage(page).getLinkedJournalCodeFromDatalist(paymentCode);
}
