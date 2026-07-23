import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SALES_INVOICE_DATALIST_PATH,
  SalesInvoicePage,
} from '../../helpers/sales-invoice';

/**
 * Sales Invoice — customer Supplier China + Outstanding SO SKUSINGLE-194/195.
 * Company: lumicharmsid (153)
 */
test.describe('Sales Invoice — China + Outstanding SO', () => {
  test.describe.configure({ timeout: 480_000 });

  test('[@TC-SINV-001] Create → Customer China → Outstanding SO Use → Open → Approve', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SALES_INVOICE_DATALIST_PATH,
    });

    const si = new SalesInvoicePage(page);
    await si.gotoDatalist();
    await si.deleteAutomationDrafts();

    await si.gotoDatalist();
    const code = await si.openCreateAndWaitForEdit();
    expect(code.length).toBeGreaterThan(0);

    await si.selectCustomer('supplier china');
    await si.fillDescription('automation playwright');
    await si.clickSaveAllAndWait();

    await si.useOutstandingSalesOrderSkus([
      'SKUSINGLE-194',
      'SKUSINGLE-195',
    ]);

    await si.assertSkusInDetail(['SKUSINGLE-194', 'SKUSINGLE-195']);

    // Wajib Approved supaya muncul di Outstanding SI (AR / CBR seed)
    await si.setOpenAndWait();
    await si.approveFromForm('automation playwright');
    await si.assertApprovedInDatalist(code);

    console.log(
      JSON.stringify({
        invoiceCode: code,
        customer: 'Supplier China',
        skus: ['SKUSINGLE-194', 'SKUSINGLE-195'],
        status: 'Approved',
        result: 'PASS',
      }),
    );
  });
});
