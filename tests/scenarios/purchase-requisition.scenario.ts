import type { Page } from '@playwright/test';
import { PurchaseRequisitionPage } from '../helpers/purchase-requisition';
import { assertNoBlocker, type ProductLine } from './support';

/**
 * Scenario Purchase Requisition — implementasi runnable TC origin:
 *   - createPrOpen            → Implements: TC-PR-CREATE-001 (data diparameterisasi)
 *   - approvePrFromDatalist   → Implements: TC-PR-UPDATE-002
 * Perubahan UX menu PR cukup di-update di sini (dan helper/POM) —
 * semua spec (single-menu maupun flow) yang me-recall scenario ini otomatis ikut.
 */

export const PR_SCENARIO_TCS = {
  createPrOpen: 'TC-PR-CREATE-001',
  approvePrFromDatalist: 'TC-PR-UPDATE-002',
} as const;

/** Create PR dari datalist, isi detail produk, Save All → status Open. */
export async function createPrOpen(
  page: Page,
  lines: ProductLine[],
): Promise<{ prCode: string }> {
  const pr = new PurchaseRequisitionPage(page);

  await pr.gotoDatalist();
  await pr.openCreateForm();
  await pr.assertTransactionDateAutoFilled();
  await pr.clickSaveAndNext();
  await assertNoBlocker(page, 'setelah PR Save & Next');

  const prCode = await pr.assertSaveAndNextSucceeded();

  await pr.openPurchaseRequisitionDetailSection();
  await pr.addProductDetailLines(
    lines.map((line) => ({ sku: line.sku, requestQty: line.qty })),
  );
  await assertNoBlocker(page, 'setelah input produk PR');

  await pr.clickSaveAll();
  await assertNoBlocker(page, 'setelah PR Save All');
  await pr.assertPrStatusOpenInDatalist(prCode);

  return { prCode };
}

/** Approve PR ber-status Open dari ikon approve di datalist → Approved. */
export async function approvePrFromDatalist(page: Page, prCode: string): Promise<void> {
  const pr = new PurchaseRequisitionPage(page);

  await pr.clickApproveFromDatalist(prCode);
  await assertNoBlocker(page, 'setelah PR approve');
  await pr.assertPrStatusApprovedInDatalist(prCode);
}
