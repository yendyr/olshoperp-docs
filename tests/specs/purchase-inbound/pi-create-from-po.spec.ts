import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_INBOUND_DATALIST_PATH } from '../../helpers/purchase-inbound';
import { createPiFromPoOpen } from '../../scenarios/purchase-inbound.scenario';

/**
 * TC-PI-CREATE-001 — Create Purchase Inbound dari Available Purchase Order
 * (PO approved). Langkah hidup di scenario createPiFromPoOpen (satu sumber
 * kebenaran dengan flow spec) — file ini hanya data + sesi.
 * Company: lumicharmsid (153)
 *
 * Catatan data staging:
 * - TC menulis "PT. Suplier Lumi 00 Texable" — nama AS-IS select2:
 *   "PT. Supplier Lumi 001 Taxable"
 * - Tanpa filter kode PO: outstanding pertama yang cocok per SKU yang dipakai.
 */
test.describe('Purchase Inbound — Create from approved PO', () => {
  test('[@TC-PI-CREATE-001] Create inbound dari Available PO — status Open', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    const supplierName = 'PT. Supplier Lumi 001 Taxable';
    const productLines = [
      { sku: 'SKUSINGLE-075', qty: 100 },
      { sku: 'SKU-ForeignCURR004-TAX', qty: 100 },
    ];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_INBOUND_DATALIST_PATH,
    });

    await createPiFromPoOpen(page, supplierName, productLines);
  });
});
