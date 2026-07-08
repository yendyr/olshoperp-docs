import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * System Product — Supply Chain
 * Company: lumicharmsid (153)
 * Route: /supplychain/product
 */
test.describe.serial('System Product — lumicharmsid (153)', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });
  });

  test('Skenario 1 — membuat SKU Single (SKU-BLENDER)', async ({ page }) => {
    const systemProduct = new SystemProductPage(page);
    const mode = await systemProduct.openCreateOrEditBySku('SKU-BLENDER');

    if (mode === 'create') {
      await systemProduct.fillBasicInformation('SKU-BLENDER', 'Blender');
      await systemProduct.assertSalesCategoryAutoFilled();
      await systemProduct.assertProductCoaGroupAutoFilled();
      await systemProduct.clickSave();
    }

    await systemProduct.searchDatalist('SKU-BLENDER');
    await systemProduct.assertSkuVisibleInDatalist('SKU-BLENDER');

    await page.waitForTimeout(5_000);
  });

  test('Skenario 1 — membuat SKU Single (SKU-GELAS)', async ({ page }) => {
    const systemProduct = new SystemProductPage(page);
    const mode = await systemProduct.openCreateOrEditBySku('SKU-GELAS');

    if (mode === 'create') {
      await systemProduct.fillBasicInformation('SKU-GELAS', 'Gelas');
      await systemProduct.assertAndEnsureSalesCategory('Home & Living');
      await systemProduct.assertAndEnsureProductCoaGroup('Purchased Item');
      await systemProduct.clearProductAliasName();
      await systemProduct.clearTagging();
      await systemProduct.clickSave();
    }

    await systemProduct.searchDatalist('SKU-GELAS');
    await systemProduct.assertSkuVisibleInDatalist('SKU-GELAS');

    await page.waitForTimeout(5_000);
  });

  test('Skenario 2 — membuat SKU Variant 4 warna (SKU-EMBER)', async ({
    page,
  }) => {
    const systemProduct = new SystemProductPage(page);
    const variantColors = ['biru', 'hijau', 'hitam', 'merah'];
    const expectedSkus = [
      'SKU-EMBER',
      'SKU-EMBER-biru',
      'SKU-EMBER-hijau',
      'SKU-EMBER-hitam',
      'SKU-EMBER-merah',
    ];

    const mode = await systemProduct.openCreateOrEditBySku('SKU-EMBER');

    if (mode === 'create') {
      await systemProduct.fillBasicInformation('SKU-EMBER', 'Ember');
      await systemProduct.selectRandomProductCoaGroup();
      await systemProduct.assertSalesCategoryAutoFilled();
      await systemProduct.clickSaveWithCoaRetry('SKU-EMBER', 'Ember');
    }

    await systemProduct.searchDatalist('SKU-EMBER');

    if (!(await systemProduct.areSkusVisibleInDatalist(expectedSkus))) {
      await systemProduct.openCreateOrEditBySku('SKU-EMBER');

      await systemProduct.scrollToProductDetails();
      await systemProduct.enableVariations();
      await systemProduct.selectVariantType('Warna');
      await systemProduct.selectVariantOptions(variantColors);
      await systemProduct.clickSaveAll();
    }

    await systemProduct.searchDatalist('SKU-EMBER');
    await systemProduct.assertSkusVisibleInDatalist(expectedSkus);

    await page.waitForTimeout(5_000);
  });

  test('Skenario — membuat SKU Variant 4 warna (SKU-SPIDOL)', async ({ page }) => {
    const systemProduct = new SystemProductPage(page);
    const parentSku = 'SKU-SPIDOL';
    const productName = 'Spidol Snowman Non-Permanent';
    const variantColors = ['biru', 'hijau', 'hitam', 'merah'];
    const expectedSkus = [
      parentSku,
      `${parentSku}-biru`,
      `${parentSku}-hijau`,
      `${parentSku}-hitam`,
      `${parentSku}-merah`,
    ];

    const mode = await systemProduct.openCreateOrEditBySku(parentSku);

    if (mode === 'create') {
      await systemProduct.fillBasicInformation(parentSku, productName);
      await systemProduct.selectRandomProductCoaGroup();
      await systemProduct.assertSalesCategoryAutoFilled();
      await systemProduct.clickSaveWithCoaRetry(parentSku, productName);
    }

    await systemProduct.searchDatalist(parentSku);

    if (!(await systemProduct.areSkusVisibleInDatalist(expectedSkus))) {
      await systemProduct.openCreateOrEditBySku(parentSku);

      await systemProduct.scrollToProductDetails();
      await systemProduct.enableVariations();
      await systemProduct.selectVariantType('Warna');
      await systemProduct.selectVariantOptions(variantColors);
      await systemProduct.clickSaveAll();
    }

    await systemProduct.searchDatalist(parentSku);
    await systemProduct.assertSkusVisibleInDatalist(expectedSkus);

    await page.waitForTimeout(1_000);
  });
});
