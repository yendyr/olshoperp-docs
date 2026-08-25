import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import { createPrOpen } from '../../scenarios/purchase-requisition.scenario';

/**
 * TC: PR dengan SKU-RAINCOAT variant (hitam + merah) — status Open.
 * Langkah hidup di scenario createPrOpen (satu sumber kebenaran dengan flow
 * spec) — file ini hanya data + sesi. Company: lumicharmsid (153)
 */
test.describe('Purchase Requisition — SKU-RAINCOAT', () => {
  test('[@TC-PR-RAINCOAT] Membuat PR 2 produk RAINCOAT — status Open', async ({
    page,
  }) => {
    const productLines = [
      { sku: 'SKU-RAINCOAT-hitam', qty: 50 },
      { sku: 'SKU-RAINCOAT-merah', qty: 50 },
    ];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });

    await createPrOpen(page, productLines);
  });
});
