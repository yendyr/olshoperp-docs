import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * One-off seed: 5 System Product SKU type Single.
 * Company: lumicharmsid (153)
 * Hapus file ini setelah seed selesai jika tidak dibutuhkan lagi.
 */

test.describe.serial('System Product — seed 5 single SKUs (one-off)', () => {
  // Fixed stamp — jangan Date.now() di judul test (worker vs main beda title)
  const stamp = 'T202607160945';
  const products = [1, 2, 3, 4, 5].map((n) => {
    const suffix = String(n).padStart(2, '0');
    return {
      sku: `QA-AUTO-S${suffix}-${stamp}`,
      name: `QA Auto Single ${suffix}`,
    };
  });

  // eslint-disable-next-line no-console
  console.log('PLANNED_SKUS', JSON.stringify(products, null, 2));

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });
  });

  for (const product of products) {
    test(`[@SEED-SYSPROD-SINGLE] Create ${product.sku}`, async ({ page }) => {
      test.setTimeout(300_000);
      const sp = new SystemProductPage(page);

      const mode = await sp.openCreateOrEditBySku(product.sku);
      if (mode === 'create') {
        await sp.fillBasicInformation(product.sku, product.name);
        await sp.assertSalesCategoryAutoFilled();
        await sp.assertAndEnsureProductCoaGroup('Purchased Item');
        await sp.clickSave();
      }

      await sp.searchDatalist(product.sku);
      await sp.assertSkuVisibleInDatalist(product.sku);
      // eslint-disable-next-line no-console
      console.log('CREATED_OK', product.sku, product.name, 'COA=Purchased Item');
    });
  }
});
