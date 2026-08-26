import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import { PURCHASE_ORDER_DATALIST_PATH } from '../../helpers/purchase-order';
import { PURCHASE_INVOICE_DATALIST_PATH } from '../../helpers/purchase-invoice';
import { createPrOpen, approvePrFromDatalist } from '../../scenarios/purchase-requisition.scenario';
import { createPoWithPrOpen, approvePoFromDatalist } from '../../scenarios/purchase-order.scenario';
import { createPiFromPoOpen } from '../../scenarios/purchase-inbound.scenario';
import { assertUnapprovedInboundNotSelectable } from '../../scenarios/supplier-invoice.scenario';

/**
 * CROSS-MENU NEGATIVE — gerbang antar menu: inbound yang belum approved tidak boleh
 * bisa ditarik ke Supplier Invoice.
 * TC: qa-docs/accounting-supplier-invoice/test-cases/TC-PI-DRAFT-20260826160000.md
 *
 * Pelengkap flow scm-ap-full: flow membuktikan jalur yang BOLEH (inbound approved →
 * bisa ditagih), TC ini membuktikan jalur yang TIDAK BOLEH.
 *
 * ARRANGE memakai scenario happy path sampai inbound Open — sengaja TIDAK di-approve.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Supplier Invoice — gerbang inbound approved', () => {
  const supplierName = 'PT. SUPPLIER IDR';
  const productLines = [{ sku: 'SKU-RAINCOAT-hitam', qty: 3 }];

  let poCode = '';
  let piCode = '';

  test('[@TC-SI-UNAPPROVED-INBOUND][arrange] PO approved + inbound Open (tidak di-approve)', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });

    const { prCode } = await createPrOpen(page, productLines);
    await approvePrFromDatalist(page, prCode);

    await page.goto(PURCHASE_ORDER_DATALIST_PATH, { waitUntil: 'domcontentloaded' });
    ({ poCode } = await createPoWithPrOpen(page, supplierName, productLines));
    await approvePoFromDatalist(page, poCode);

    // Inbound dibuat tapi SENGAJA dibiarkan Open — ini kondisi yang diuji.
    ({ piCode } = await createPiFromPoOpen(page, supplierName, productLines, poCode));
  });

  test('[@TC-SI-UNAPPROVED-INBOUND] Inbound Open tidak muncul di modal Inbound Transaction', async ({
    page,
  }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!poCode, 'Arrange gagal — tidak ada PO/inbound untuk diuji');

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_INVOICE_DATALIST_PATH,
    });

    const { invoiceCode, evidence } = await assertUnapprovedInboundNotSelectable(
      page,
      supplierName,
      poCode,
    );

    expect(invoiceCode, 'Supplier Invoice draft harus terbentuk').toMatch(/^PI-/i);

    await testInfo.attach('guard-evidence', {
      body: JSON.stringify({
        po_code: poCode,
        inbound_code: piCode,
        inbound_status: 'Open (belum approved)',
        supplier_invoice: invoiceCode,
        modal_state: evidence,
        rule: 'requirement §1 & §5 — eligible to invoice hanya inbound approved',
      }),
      contentType: 'application/json',
    });
  });
});
