import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_INVOICE_DATALIST_PATH,
  PurchaseInvoicePage,
} from '../../helpers/purchase-invoice';

/**
 * Purchase Invoice — create dari inbound PO.
 * Supplier: pt supplier idr · PO: PO-6A589088 · Draft
 * Company: lumicharmsid (153)
 */
test.describe.serial('Purchase Invoice — Create from inbound', () => {
  test.describe.configure({ timeout: 360_000 });

  let invoiceCode = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_INVOICE_DATALIST_PATH,
    });
  });

  test('[@TC-PI-001] CREATE PI + Use PO-6A589088 → Draft di datalist', async ({
    page,
  }) => {
    const pi = new PurchaseInvoicePage(page);
    await pi.gotoDatalist();

    invoiceCode = await pi.ensureEditWithSupplier('pt supplier idr');
    expect(invoiceCode.length).toBeGreaterThan(0);

    await pi.openInboundTransactionModal();
    await pi.useInboundByPoCode('PO-6A589088');
    await pi.clickSaveAllAndWait();

    // Soft-check masih Draft di form jika radio terlihat
    if (await pi.draftRadio.isVisible().catch(() => false)) {
      await expect(pi.draftRadio).toBeChecked();
    }

    await pi.assertDraftInDatalist(invoiceCode);

    console.log(
      JSON.stringify({
        code: invoiceCode,
        supplier: 'pt supplier idr',
        po: 'PO-6A589088',
        status: 'Draft',
        result: 'PASS',
      }),
    );
  });
});
