import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import { PURCHASE_ORDER_DATALIST_PATH } from '../../helpers/purchase-order';
import { createPoWithPrDraft } from '../../scenarios/purchase-order.scenario';

/**
 * TC-PO-CREATE-001 — Create PO with PR, supplier PT. SUPPLIER IDR, status Draft.
 * Langkah hidup di scenario createPoWithPrDraft (satu sumber kebenaran dengan
 * flow spec) — file ini hanya data + sesi. Company: lumicharmsid (153).
 */
test.describe('Purchase Order — Create with PR', () => {
  test('[@TC-PO-CREATE-WITH-PR] Create PO with PR dari available products', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    const supplierName = 'PT. SUPPLIER IDR';
    const productLines = [
      { sku: 'SKUSINGLE-001', qty: 100 },
      { sku: 'SKU-ALT-UNT-001', qty: 5 },
      { sku: 'SKU-SPIDOL-biru', qty: 10 },
      { sku: 'SKU-EMBER-merah', qty: 90 },
    ];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });
    await page.goto(PURCHASE_ORDER_DATALIST_PATH, { waitUntil: 'domcontentloaded' });

    await createPoWithPrDraft(page, supplierName, productLines);
  });
});
