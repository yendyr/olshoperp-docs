import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_REQUISITION_DATALIST_PATH,
  PurchaseRequisitionPage,
} from '../../helpers/purchase-requisition';

/**
 * Purchase Requisition — lumicharmsid (153)
 * Route: /supplychain/purchase-requisition
 */
test.describe('Purchase Requisition — lumicharmsid (153)', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });
  });

  test('[@TC-PR-DRAFT] Membuat Purchase Requisition dengan 3 produk variant SPIDOL — status Open', async ({
    page,
  }) => {
    const pr = new PurchaseRequisitionPage(page);
    const spidolLines = [
      { sku: 'SKU-SPIDOL-biru', requestQty: 10 },
      { sku: 'SKU-SPIDOL-hitam', requestQty: 10 },
      { sku: 'SKU-SPIDOL-merah', requestQty: 10 },
    ];

    await pr.openCreateForm();
    await pr.assertTransactionDateAutoFilled();
    await pr.clickSaveAndNext();
    await pr.openPurchaseRequisitionDetailSection();
    await pr.addProductDetailLines(spidolLines);
    await pr.clickSaveAll();

    const trxCode = await pr.getCurrentTransactionCode();
    await pr.assertPrStatusOpenInDatalist(trxCode);
  });

  test('[@TC-PR-DRAFT] Membuat Purchase Requisition dengan 2 produk variant EMBER — status Open', async ({
    page,
  }) => {
    const pr = new PurchaseRequisitionPage(page);
    const emberLines = [
      { sku: 'SKU-EMBER-hitam', requestQty: 25 },
      { sku: 'SKU-EMBER-merah', requestQty: 25 },
    ];

    await pr.openCreateForm();
    await pr.assertTransactionDateAutoFilled();
    await pr.clickSaveAndNext();
    const trxCode = await pr.assertSaveAndNextSucceeded();
    await pr.openPurchaseRequisitionDetailSection();
    await pr.addProductDetailLines(emberLines);
    await pr.clickSaveAll();
    await pr.assertPrStatusOpenInDatalist(trxCode);
  });
});
