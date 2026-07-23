import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  TRANSFER_INBOUND_DATALIST_PATH,
  TransferInboundPage,
} from '../../helpers/transfer-inbound';

/**
 * Transfer Inbound — satu TC receive atas fixture TE existing.
 * Company: lumicharmsid (153)
 *
 * Fixture: TFE-5TU41QH5 (ship already Approved / Delivery In transit).
 * Alur: search → Show → Broken/Lost → Approve.
 * Description (standing rule): "automation playwright"
 */
test.describe('Transfer Inbound — Receive Approve', () => {
  const teCode = 'TFE-5TU41QH5';
  const sku001 = 'AUTO-SKU001';
  const sku002 = 'AUTO-SKU002';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: TRANSFER_INBOUND_DATALIST_PATH,
    });
  });

  test('[@TC-TIB-001] Search TE → Show → Broken/Lost → Approve', async ({
    page,
  }) => {
    test.setTimeout(420_000);

    const tib = new TransferInboundPage(page);
    await tib.gotoDatalist();
    await tib.assertInDatalist(teCode);
    await tib.openShowFromDatalistByCode(teCode);
    await expect(tib.codeInput).toHaveValue(teCode);

    // AUTO-SKU002 Broken Items = 2; AUTO-SKU001 Lost Items = 1
    await tib.setBrokenItemsForSku(sku002, 2);
    await tib.setLostItemsForSku(sku001, 1);

    await tib.clickApproveReceive();
    await tib.assertApprovedOrDeliveredInDatalist(teCode);
  });
});
