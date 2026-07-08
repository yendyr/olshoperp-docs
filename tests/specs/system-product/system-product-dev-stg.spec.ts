import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * System Product — DEV-STG (13)
 * Route: /supplychain/product
 *
 * Automation demo: SKU-PLUSHIE (single), SKU-TRUZV1 (variant 2 warna)
 */
test.describe.serial('System Product — DEV-STG (13)', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'DEV-STG',
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });
  });

  test('Skenario 1 — membuat SKU Single (SKU-PLUSHIE)', async ({ page }) => {
    const systemProduct = new SystemProductPage(page);
    const sku = 'SKU-PLUSHIE';
    const name = 'Woopy Plushie Fanmade';
    const salesCategory = 'Hobbies & Collections';

    const mode = await systemProduct.openCreateOrEditBySku(sku);

    if (mode === 'create') {
      await systemProduct.fillBasicInformation(sku, name);
      await systemProduct.assertAndEnsureProductCoaGroup('Purchased Item');
      await systemProduct.assertAndEnsureSalesCategory(salesCategory);
      await systemProduct.setTagging('Hiasan');
      await systemProduct.clickSave();
    }

    await systemProduct.searchDatalist(sku);
    await systemProduct.assertSkuVisibleInDatalist(sku);

    await page.waitForTimeout(1_000);
  });

  test('Skenario 2 — membuat SKU Variant 2 warna (SKU-TRUZV1)', async ({
    page,
  }) => {
    const systemProduct = new SystemProductPage(page);
    const parentSku = 'SKU-TRUZV1';
    const productName = 'TRUZZ TRSR DOLL';
    const variantOptions = ['yellow', 'white'];
    const expectedSkus = [
      parentSku,
      `${parentSku}-white`,
      `${parentSku}-yellow`,
    ];

    const mode = await systemProduct.openCreateOrEditBySku(parentSku);

    if (mode === 'create') {
      await systemProduct.fillBasicInformation(parentSku, productName);
      await systemProduct.selectRandomProductCoaGroup();
      await systemProduct.assertSalesCategoryAutoFilled();
      await systemProduct.clickSaveWithCoaRetry(parentSku, productName);

      await systemProduct.scrollToProductDetails();
      await systemProduct.enableVariations();
      await systemProduct.selectVariantType('Colours');
      await systemProduct.selectVariantOptions(variantOptions);
      await systemProduct.clickSaveAll();
    } else {
      await systemProduct.searchDatalist(parentSku);

      if (!(await systemProduct.areSkusVisibleInDatalist(expectedSkus))) {
        await systemProduct.openCreateOrEditBySku(parentSku);
        await systemProduct.scrollToProductDetails();
        await systemProduct.enableVariations();
        await systemProduct.selectVariantType('Colours');
        await systemProduct.selectVariantOptions(variantOptions);
        await systemProduct.clickSaveAll();
      }
    }

    await systemProduct.searchDatalist(parentSku);
    await systemProduct.assertSkusVisibleInDatalist(expectedSkus);

    await page.waitForTimeout(1_000);
  });
});
