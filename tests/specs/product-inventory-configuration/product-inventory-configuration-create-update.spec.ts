import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PRODUCT_GENERAL_CONFIGURATION_DATALIST_PATH,
  PRODUCT_GENERAL_CONFIGURATION_PATHS,
  PRODUCT_INVENTORY_CONFIGURATION_DATALIST_PATH,
  PRODUCT_INVENTORY_CONFIGURATION_PATHS,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * Product Inventory Configuration — create (workaround) lalu update inventory.
 * Company: lumicharmsid (153)
 *
 * AS-IS FE: PIC Form.vue `showGeneral=false` → SKU/Name/Sales Category/COA tidak di create PIC.
 * Workaround: seed via Product General Configuration, verify di datalist PIC,
 * lalu update Inventory Management di PIC.
 */
test.describe.serial('Product Inventory Configuration — Create then Update', () => {
  let createdSku = '';

  test('[@TC-CREATE-product-inventory-configuration] Seed via PGC, appear on PIC datalist', async ({
    page,
  }) => {
    test.setTimeout(360_000);

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRODUCT_GENERAL_CONFIGURATION_DATALIST_PATH,
    });

    const stamp = Date.now().toString().slice(-6);
    let sku = `SKU-PIC-${stamp}`;
    let name = `PIC Stock Item ${stamp}`;

    const pgc = new SystemProductPage(page, PRODUCT_GENERAL_CONFIGURATION_PATHS);
    await pgc.gotoCreate();
    await expect(page.locator('#sku')).toBeVisible({ timeout: 60_000 });
    await pgc.fillBasicInformation(sku, name);
    await pgc.assertSalesCategoryAutoFilled();
    // Terima autofill (e.g. Home & Living / Product Accessories) — tidak wajib ganti
    await pgc.assertProductCoaGroupAutoFilled();
    await pgc.clearProductAliasName().catch(() => undefined);
    await pgc.clearTagging().catch(() => undefined);

    try {
      await pgc.clickSave();
    } catch (error) {
      const msg = String(error);
      if (!/already been taken|has already been taken/i.test(msg)) {
        throw error;
      }
      sku = `SKU-PIC-${Date.now().toString().slice(-6)}`;
      name = `PIC Stock ${Date.now().toString().slice(-4)}`;
      await pgc.gotoCreate();
      await pgc.fillBasicInformation(sku, name);
      await pgc.assertSalesCategoryAutoFilled();
      await pgc.assertProductCoaGroupAutoFilled();
      await pgc.clearProductAliasName().catch(() => undefined);
      await pgc.clearTagging().catch(() => undefined);
      await pgc.clickSave();
    }

    const pic = new SystemProductPage(page, PRODUCT_INVENTORY_CONFIGURATION_PATHS);
    await pic.gotoDatalist();
    await pic.searchDatalist(sku);
    await pic.assertSkuVisibleInDatalist(sku);

    createdSku = sku;
  });

  test('[@TC-UPDATE-product-inventory-configuration] Inventory Management ED + min stock', async ({
    page,
  }) => {
    test.setTimeout(360_000);

    expect(createdSku, 'Harus ada SKU dari create / seed sebelumnya').toBeTruthy();

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PRODUCT_INVENTORY_CONFIGURATION_DATALIST_PATH,
    });

    const pic = new SystemProductPage(
      page,
      PRODUCT_INVENTORY_CONFIGURATION_PATHS,
    );
    const mode = await pic.openCreateOrEditBySku(createdSku);
    expect(mode, 'SKU harus sudah ada di datalist PIC (edit)').toBe('edit');

    await pic.fillInventoryManagement({
      expiredDays: '30',
      minimumStockQty: '5',
    });
    await pic.clickSaveAllForHeaderUpdate();

    await pic.openCreateOrEditBySku(createdSku);
    await pic.assertInventoryManagement({
      expiredDays: '30',
      minimumStockQty: '5',
    });
  });
});
