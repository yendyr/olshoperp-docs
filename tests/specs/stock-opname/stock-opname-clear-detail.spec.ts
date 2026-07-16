import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  STOCK_OPNAME_DATALIST_PATH,
  StockOpnamePage,
} from '../../helpers/stock-opname';

/**
 * Hapus semua product di Opname Detail SP-6A56E465 → detail kosong.
 * Company: lumicharmsid (153)
 */
const TARGET_CODE = 'SP-6A56E465';

test.describe('Stock Opname — Clear Opname Detail', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: STOCK_OPNAME_DATALIST_PATH,
    });
  });

  test(`[@TC-SOPNAME-004] ${TARGET_CODE} hapus semua product detail`, async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const so = new StockOpnamePage(page);
    await so.openEditFromDatalistByCode(TARGET_CODE);
    await expect(so.codeInput).toHaveValue(TARGET_CODE, { timeout: 30_000 });

    await so.clearAllOpnameDetailRows();
    await so.assertOpnameDetailEmpty();
  });
});
