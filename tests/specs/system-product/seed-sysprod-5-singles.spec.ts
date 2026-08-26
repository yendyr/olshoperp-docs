import { test, expect } from '@playwright/test';
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

const products = [
  { sku: 'AUTO-SKU001', name: 'Produk Automation 1' },
  { sku: 'AUTO-SKU002', name: 'Produk Automation 2' },
  { sku: 'AUTO-SKU003', name: 'Produk Automation 3' },
  { sku: 'AUTO-SKU004', name: 'Produk Automation 4' },
  { sku: 'AUTO-SKU005', name: 'Produk Automation 5' },
] as const;

test.describe.serial('System Product — seed 5 single SKUs (one-off)', () => {
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
      let action: 'created' | 'updated' | 'skipped' = 'skipped';
      let coaConfirmed = false;

      if (mode === 'create') {
        await sp.fillBasicInformation(product.sku, product.name);
        await sp.assertSalesCategoryAutoFilled();
        await sp.assertAndEnsureSalesCategory('Hobbies & Collections');
        await sp.assertAndEnsureProductCoaGroup('Purchased Item');
        await sp.clickSave();
        action = 'created';
        coaConfirmed = true;
      } else {
        const nameInput = page.locator('#name');
        await expect(nameInput).toBeVisible({ timeout: 30_000 });
        const currentName = (await nameInput.inputValue()).trim();

        // Pastikan COA = Purchased Item di edit mode
        await sp.assertAndEnsureProductCoaGroup('Purchased Item');
        coaConfirmed = true;

        if (currentName !== product.name) {
          await nameInput.fill(product.name);
          await nameInput.blur();
          await page.waitForTimeout(500);
          await sp.clickSaveAllForHeaderUpdate();
          action = 'updated';
        } else {
          action = 'skipped';
        }
      }

      await sp.searchDatalist(product.sku);
      await sp.assertSkuVisibleInDatalist(product.sku);

      // eslint-disable-next-line no-console
      console.log(
        'SEED_RESULT',
        JSON.stringify({
          sku: product.sku,
          name: product.name,
          mode,
          action,
          coa: coaConfirmed ? 'Purchased Item' : 'unknown',
          status: 'success',
        }),
      );
    });
  }
});
