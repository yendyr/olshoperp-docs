import type { Page } from '@playwright/test';
import { PurchaseInboundPage } from '../helpers/purchase-inbound';
import { assertNoBlocker, type ProductLine } from './support';

/**
 * Scenario Purchase Inbound — implementasi runnable TC origin:
 *   - createPiFromPoOpen      → Implements: TC-PI-CREATE-001
 *   - approvePiFromShow       → Implements: TC-PI-APPROVE-001
 */

export const PI_SCENARIO_TCS = {
  createPiFromPoOpen: 'TC-PI-CREATE-001',
  approvePiFromShow: 'TC-PI-APPROVE-001',
} as const;

/**
 * Create Purchase Inbound dari Available Purchase Order milik supplier:
 * checklist SKU outstanding (difilter kode PO), bulk Use, isi Inbound Qty,
 * Save All → status Open.
 */
export async function createPiFromPoOpen(
  page: Page,
  supplierName: string,
  lines: ProductLine[],
  poCode?: string,
): Promise<{ piCode: string }> {
  const pi = new PurchaseInboundPage(page);
  const skus = lines.map((line) => line.sku);

  await pi.gotoDatalist();
  await pi.openCreateForm();
  const piCode = await pi.ensureInboundHeaderSaved(supplierName);
  await assertNoBlocker(page, 'setelah PI header tersimpan');

  await pi.selectSupplier(supplierName);
  await pi.openAvailablePurchaseOrderModal();
  // UI ≥2026-08: bulk Use bisa tetap disabled meski baris ter-ceklis — pakai
  // Use per-baris; tiap Use membuka dialog "Create Inbound Product" tempat
  // inbound qty di-set langsung (tidak perlu isi qty lagi di tabel detail).
  for (const line of lines) {
    await pi.clickUseOnOutstandingRow(line.sku, poCode, line.qty);
  }
  await assertNoBlocker(page, 'setelah PI Use outstanding PO per baris');
  await pi.waitForInboundDetailRowCount(skus.length);

  await pi.clickSaveAll();
  await assertNoBlocker(page, 'setelah PI Save All');
  await pi.assertInboundOpenInDatalist(piCode);

  return { piCode };
}

/** Approve PI dari halaman show (checklist biru) → status Approved di datalist. */
export async function approvePiFromShow(page: Page, piCode: string): Promise<void> {
  const pi = new PurchaseInboundPage(page);

  await pi.openShowFromDatalistByTrxCode(piCode);
  await pi.clickApproveFromShow();
  await assertNoBlocker(page, 'setelah PI approve');
  await pi.gotoDatalist();
  await pi.assertInboundApprovedInDatalist(piCode);
}
