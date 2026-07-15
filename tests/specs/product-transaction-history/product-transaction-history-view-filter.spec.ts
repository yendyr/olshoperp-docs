import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PRODUCT_TRANSACTION_HISTORY_PATH,
  ProductTransactionHistoryPage,
} from '../../helpers/product-transaction-history';

/**
 * Product Transaction History — view shell + filter by Product.
 * Company: lumicharmsid (153)
 * Read-only dashboard (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Product Transaction History — View then Filter', () => {
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRODUCT_TRANSACTION_HISTORY_PATH,
    });
  });

  test('[@TC-VIEW-product-transaction-history] Shell filters + KPI + tabs', async ({
    page,
  }) => {
    const report = new ProductTransactionHistoryPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
  });

  test('[@TC-FILTER-product-transaction-history] Choose Product → KPI + Mutation', async ({
    page,
  }) => {
    const report = new ProductTransactionHistoryPage(page);
    await report.gotoReport();

    const { productId, selectedSku } = await report.filterByFirstProduct('a');
    expect(productId).toMatch(/^\d+$/);
    expect(selectedSku.length).toBeGreaterThan(0);

    await report.assertProductSkuFilled();
    await report.switchToMutationTab();
  });
});
