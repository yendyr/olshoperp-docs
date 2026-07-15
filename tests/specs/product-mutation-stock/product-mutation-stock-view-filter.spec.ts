import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PRODUCT_MUTATION_STOCK_PATH,
  ProductMutationStockPage,
} from '../../helpers/product-mutation-stock';

/**
 * Stock History (product-mutation-stock) — view shell + filter Product + Apply.
 * Company: lumicharmsid (153)
 * Read-only report (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Stock History — View then Filter', () => {
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRODUCT_MUTATION_STOCK_PATH,
    });
  });

  test('[@TC-VIEW-product-mutation-stock] Shell filters + no Create', async ({
    page,
  }) => {
    const report = new ProductMutationStockPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
  });

  test('[@TC-FILTER-product-mutation-stock] Product + Apply → columns', async ({
    page,
  }) => {
    const report = new ProductMutationStockPage(page);
    await report.gotoReport();

    const { productId, selectedSku } =
      await report.filterByFirstProductAndApply('a');
    expect(productId).toMatch(/^\d+$/);
    expect(selectedSku.length).toBeGreaterThan(0);

    await report.assertHistoryColumns();
    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });
});
