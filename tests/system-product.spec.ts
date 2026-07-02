import { test } from '@playwright/test';
import { login, switchCompanyByCode } from './helpers/company-access';
import { SystemProductPage } from './helpers/system-product';

/**
 * System Product — Master System Product (Datalist System Product)
 * Company: lumicharmsid (ID 153)
 * Route staging: /supplychain/product
 *
 * Selectors derived from olshoperp-frontend staging bundles:
 * - FormProductComponent-AGY4RYok.js → #sku, #name, multiselect placeholders
 * - VariantForm-D9eAyqQe.js → variant "e.g: Flavour", options "Choose Option"
 * - DatalistProductComponent-CiucyEY6.js → Create button, datalist route
 */

test.describe.serial('System Product — lumicharmsid (153)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await switchCompanyByCode(page, 'lumicharmsid');
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
      if (mode === 'edit') {
        await systemProduct.openCreateOrEditBySku('SKU-EMBER');
      }

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
});
