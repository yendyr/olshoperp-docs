import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PURCHASE_REQUISITION_DATALIST_PATH,
  PurchaseRequisitionPage,
} from '../../helpers/purchase-requisition';

test.describe('Purchase Requisition — Update Qty & Approve', () => {
  const trxCode = 'PR-6A4E067D';
  const targetSku = 'SKU-SPIDOL-hitam';
  const updatedQty = 25;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });
  });

  test('[@TC-PR-UPDATE-DRAFT] Update Request Qty SKU-SPIDOL-hitam jadi 25 lalu approve', async ({
    page,
  }) => {
    const pr = new PurchaseRequisitionPage(page);

    await pr.openEditFromDatalistByTrxCode(trxCode);
    await pr.openPurchaseRequisitionDetailSection();
    await pr.fillRequestQtyForSku(targetSku, updatedQty);
    await pr.ensureStatusOpenChecked();
    await pr.clickApprove();
    await pr.assertPrStatusApprovedInDatalist(trxCode);
  });
});
