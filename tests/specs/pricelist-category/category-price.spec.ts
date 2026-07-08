import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PRICELIST_CATEGORY_DATALIST_PATH,
  PricelistCategoryPage,
} from '../../helpers/pricelist-category';

/**
 * Pricelist Category (Category Price) — lumicharmsid (153)
 * Route: /businessdevelopment/pricelist-category
 */
test.describe('Pricelist Category — lumicharmsid (153)', () => {
  const formData = {
    code: 'rtl02',
    categoryName: 'retail standard price 2',
    margin: {
      endPrice: 100_000,
      marginType: 'percentage' as const,
      marginValue: 20,
    },
  };
  const grosirSuperData = {
    code: 'GRS05',
    categoryName: 'Grosir Super Price 5',
    margin: {
      endPrice: 500_000,
      marginType: 'percentage' as const,
      marginValue: 15,
    },
  };

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRICELIST_CATEGORY_DATALIST_PATH,
    });
  });

  test('membuat template skema kategori harga baru dengan konfigurasi margin persentase', async ({
    page,
  }) => {
    const categoryPrice = new PricelistCategoryPage(page);

    const mode = await categoryPrice.openCreateOrVerifyExisting(formData.code);

    if (mode === 'create') {
      await categoryPrice.fillBasicInformation(formData.code, formData.categoryName);
      await categoryPrice.fillMarginPriceConfiguration(formData.margin);
      await categoryPrice.assertAppliedStoreEmpty();
      await categoryPrice.clickSaveAll();
    }

    await categoryPrice.searchDatalist(formData.code);
    await categoryPrice.assertCategoryPriceInDatalist(
      formData.code,
      formData.categoryName,
    );

    await page.waitForTimeout(5_000);
  });

  test('membuat template skema kategori harga baru dengan konfigurasi margin persentase (Data Grosir Super)', async ({
    page,
  }) => {
    const categoryPrice = new PricelistCategoryPage(page);

    const mode = await categoryPrice.openCreateOrVerifyExisting(grosirSuperData.code);

    if (mode === 'create') {
      await categoryPrice.fillBasicInformation(
        grosirSuperData.code,
        grosirSuperData.categoryName,
      );
      await categoryPrice.fillMarginPriceConfiguration(grosirSuperData.margin);
      await categoryPrice.assertAppliedStoreEmpty();
      await categoryPrice.clickSaveAll();
    }

    await categoryPrice.searchDatalist(grosirSuperData.code);
    await categoryPrice.assertCategoryPriceInDatalist(
      grosirSuperData.code,
      grosirSuperData.categoryName,
    );

    await page.waitForTimeout(5_000);
  });
});
