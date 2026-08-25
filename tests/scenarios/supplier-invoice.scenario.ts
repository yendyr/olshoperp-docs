import type { Page } from '@playwright/test';
import { PurchaseInvoicePage } from '../helpers/purchase-invoice';
import { assertNoBlocker } from './support';

/**
 * Scenario Supplier Invoice (menu UI: Purchase Invoice, route /accounting/supplier-invoice)
 * — implementasi runnable TC origin:
 *   - createSupplierInvoiceDraft → Implements: TC-PI-001
 *   - approveSupplierInvoice     → Implements: TC-PI-002
 *
 * Catatan prefix: `TC-PI-*` di menu ini = Purchase Invoice (accounting).
 * Jangan tertukar dengan `TC-PI-CREATE-001`/`TC-PI-APPROVE-001` di
 * supplychain-new-purchase-inbound (Purchase Inbound).
 */

export const SINV_SCENARIO_TCS = {
  createSupplierInvoiceDraft: 'TC-PI-001',
  approveSupplierInvoice: 'TC-PI-002',
} as const;

/**
 * Create Supplier Invoice dari inbound yang sudah approved: pilih supplier,
 * tarik inbound lewat modal Inbound Transaction (difilter kode PO), Save All
 * → status Draft.
 */
export async function createSupplierInvoiceDraft(
  page: Page,
  supplierName: string,
  poCode: string,
): Promise<{ invoiceCode: string }> {
  const si = new PurchaseInvoicePage(page);

  await si.gotoDatalist();
  // ensureEditWithSupplier sudah mencakup openCreateForm + selectSupplier +
  // fillDescription + simpan header — jangan panggil openCreateForm lagi
  // (akan membuat dokumen kedua dan meninggalkan draft orphan).
  const invoiceCode = await si.ensureEditWithSupplier(supplierName);
  await assertNoBlocker(page, 'setelah header Supplier Invoice tersimpan');

  await si.openInboundTransactionModal();
  await si.useInboundByPoCode(poCode);
  await assertNoBlocker(page, 'setelah Use inbound di Supplier Invoice');

  await si.clickSaveAllAndWait();
  await assertNoBlocker(page, 'setelah Supplier Invoice Save All');
  await si.assertDraftInDatalist(invoiceCode);

  return { invoiceCode };
}

/**
 * Supplier Invoice Draft → set radio Open (syarat Approve) → Approve dari form
 * → status Approved (jurnal AP terbit).
 */
export async function approveSupplierInvoice(
  page: Page,
  invoiceCode: string,
): Promise<void> {
  const si = new PurchaseInvoicePage(page);

  await si.openEditFromDatalistByCode(invoiceCode);
  await si.setOpenAndWait();
  await assertNoBlocker(page, 'setelah Supplier Invoice set Open');

  await si.approveFromForm();
  await assertNoBlocker(page, 'setelah Supplier Invoice approve');
  await si.assertApprovedInDatalist(invoiceCode);
}
