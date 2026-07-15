import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PRODUCT_GENERAL_CONFIGURATION_DATALIST_PATH,
  PRODUCT_GENERAL_CONFIGURATION_PATHS,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * Product General Configuration — create lalu update.
 * Shared FormProductComponent dengan System Product.
 * Company: lumicharmsid (153)
 *
 * Blocker familiar (reuse System Product):
 * - Sales Category autofill / ensure "Hobbies & Collections"
 * - Product Coa Group "Purchased Item" + Asset Category jika required
 * - clickSave URL harus PGC API (bukan /product full)
 */
test.describe.serial('Product General Configuration — Create then Update', () => {
  let createdSku = '';
  let createdName = '';
  let updatedSku = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRODUCT_GENERAL_CONFIGURATION_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-product-general-configuration] Create single SKU-KABEL', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const pgc = new SystemProductPage(page, PRODUCT_GENERAL_CONFIGURATION_PATHS);

    // Prefer TC SKU; jika sudah dipakai → unique (izin ubah test data)
    let sku = 'SKU-KABEL';
    let name = 'kabel tembaga asli';

    let mode = await pgc.openCreateOrEditBySku(sku);
    if (mode === 'edit') {
      await pgc.searchDatalist(sku);
      await pgc.assertSkuVisibleInDatalist(sku);
      createdSku = sku;
      createdName = name;
      return;
    }

    await pgc.fillBasicInformation(sku, name);
    await pgc.assertSalesCategoryAutoFilled();
    await pgc.assertAndEnsureSalesCategory('Hobbies & Collections');
    await pgc.assertAndEnsureProductCoaGroup('Purchased Item');
    await pgc.clearProductAliasName().catch(() => undefined);
    await pgc.clearTagging().catch(() => undefined);

    try {
      await pgc.clickSave();
    } catch (error) {
      const msg = String(error);
      if (!/already been taken|has already been taken/i.test(msg)) {
        throw error;
      }
      // SKU bentrok (ada di company lain / soft cache) → buat unik
      const stamp = Date.now().toString().slice(-6);
      sku = `SKU-KBL-${stamp}`;
      name = `kabel tembaga ${stamp}`;
      await pgc.gotoCreate();
      await pgc.fillBasicInformation(sku, name);
      await pgc.assertAndEnsureSalesCategory('Hobbies & Collections');
      await pgc.assertAndEnsureProductCoaGroup('Purchased Item');
      await pgc.clearProductAliasName().catch(() => undefined);
      await pgc.clearTagging().catch(() => undefined);
      await pgc.clickSave();
    }

    await pgc.searchDatalist(sku);
    await pgc.assertSkuVisibleInDatalist(sku);

    createdSku = sku;
    createdName = name;
  });

  test('[@TC-UPDATE-product-general-configuration] Update SKU + Retail Price', async ({
    page,
  }) => {
    test.setTimeout(360_000);

    expect(createdSku, 'Harus ada SKU dari test create sebelumnya').toBeTruthy();

    const pgc = new SystemProductPage(page, PRODUCT_GENERAL_CONFIGURATION_PATHS);
    await pgc.openCreateOrEditBySku(createdSku);

    const stamp = Date.now().toString().slice(-6);
    updatedSku = `SKU-KBL-UP-${stamp}`;

    await pgc.updateSku(updatedSku);
    await pgc.fillRetailPrice('125000');
    await pgc.clickSaveAllForHeaderUpdate();

    await pgc.searchDatalist(updatedSku);
    await pgc.assertSkuVisibleInDatalist(updatedSku);
  });
});
