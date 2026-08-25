import type { Page } from '@playwright/test';
import { PurchaseOrderPage } from '../helpers/purchase-order';
import { assertNoBlocker, type ProductLine } from './support';

/**
 * Scenario Purchase Order — implementasi runnable TC origin:
 *   - createPoWithPrOpen      → Implements: TC-PO-CREATE-001 (varian: langsung Open,
 *                               bukan Draft — recall TC-PO-UPDATE-001 untuk set Open)
 *   - approvePoFromDatalist   → Implements: TC-PO-UPDATE-002
 */

export const PO_SCENARIO_TCS = {
  createPoWithPrDraft: 'TC-PO-CREATE-001',
  createPoWithPrOpen: 'TC-PO-CREATE-001 + TC-PO-UPDATE-001',
  approvePoFromDatalist: 'TC-PO-UPDATE-002',
} as const;

async function createPoWithPr(
  page: Page,
  supplierName: string,
  lines: ProductLine[],
  status: 'draft' | 'open',
): Promise<{ poCode: string }> {
  const po = new PurchaseOrderPage(page);
  const skus = lines.map((line) => line.sku);

  // UI baru (≥2026-08): Create auto-membuat draft PO dan langsung mendarat di
  // halaman edit (Save & Next tidak ada lagi) — kode PO dibaca dari halaman.
  await po.openCreateForm();
  await po.assertTransactionDateAutoFilled();
  await po.assertPaymentTypeAutoFilled();
  await po.selectSupplier(supplierName);
  await po.selectWithPr();

  const poCode = await po.getCurrentTransactionCode();
  await assertNoBlocker(page, 'setelah landing edit PO auto-draft');

  await po.openAvailableProductsModal();
  await po.checkOutstandingRows(skus);
  await po.clickBulkUseAboveOutstandingTable();
  await assertNoBlocker(page, 'setelah PO bulk Use outstanding PR');

  for (const line of lines) {
    await po.fillPoQtyForSku(line.sku, line.qty);
  }

  if (status === 'open') {
    await po.selectOpenStatus();
  } else {
    await po.selectDraftStatus();
  }
  await po.clickSaveAll();
  await assertNoBlocker(page, 'setelah PO Save All');

  if (status === 'open') {
    await po.assertPoStatusOpenInDatalist(poCode);
  } else {
    await po.assertPoStatusDraftInDatalist(poCode);
  }

  return { poCode };
}

/**
 * Implements: TC-PO-CREATE-001 — create PO With PR dari outstanding PR,
 * simpan sebagai Draft.
 */
export async function createPoWithPrDraft(
  page: Page,
  supplierName: string,
  lines: ProductLine[],
): Promise<{ poCode: string }> {
  return createPoWithPr(page, supplierName, lines, 'draft');
}

/**
 * Varian flow: TC-PO-CREATE-001 + TC-PO-UPDATE-001 — sama seperti Draft
 * tapi langsung set radio Open sebelum Save All.
 */
export async function createPoWithPrOpen(
  page: Page,
  supplierName: string,
  lines: ProductLine[],
): Promise<{ poCode: string }> {
  return createPoWithPr(page, supplierName, lines, 'open');
}

/** Approve PO ber-status Open dari ikon approve di datalist → Approved. */
export async function approvePoFromDatalist(page: Page, poCode: string): Promise<void> {
  const po = new PurchaseOrderPage(page);

  await po.clickApproveFromDatalist(poCode);
  await assertNoBlocker(page, 'setelah PO approve');
  await po.assertPoStatusApprovedInDatalist(poCode);
}
