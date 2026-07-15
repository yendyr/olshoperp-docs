import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PRODUCT_MUTATION_PATH,
  ProductMutationPage,
} from '../../helpers/product-mutation';

/**
 * Product Mutation History — view shell + filter by Product.
 * Company: lumicharmsid (153)
 * Read-only report (tidak ada CREATE/UPDATE).
 */
test.describe.serial('Product Mutation History — View then Filter', () => {
  test.describe.configure({ timeout: 240_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRODUCT_MUTATION_PATH,
    });
  });

  test('[@TC-VIEW-product-mutation] Shell Product filter + no Create', async ({
    page,
  }) => {
    const report = new ProductMutationPage(page);
    await report.gotoReport();
    await report.assertReadOnlyShell();
  });

  test('[@TC-FILTER-product-mutation] Choose Product → history columns', async ({
    page,
  }) => {
    const report = new ProductMutationPage(page);
    await report.gotoReport();

    const { productId, selectedSku } = await report.filterByFirstProduct('a');
    expect(productId).toMatch(/^\d+$/);
    expect(selectedSku.length).toBeGreaterThan(0);

    await report.assertHistoryColumns();
    const { rowCount } = await report.assertRowsOrEmpty();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });
});
