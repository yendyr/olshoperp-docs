import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { SYSTEM_PRODUCT_DATALIST_PATH } from '../../helpers/system-product';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import { PRICELIST_CATEGORY_DATALIST_PATH } from '../../helpers/pricelist-category';
import { PURCHASE_ORDER_DATALIST_PATH, PurchaseOrderPage } from '../../helpers/purchase-order';
import { OlshopDatalist } from '../../helpers/shared';

/**
 * Smoke — verifikasi POM + registry untuk menu yang sudah punya helper.
 * Tag: @smoke — jalankan: npm run test:smoke
 */
const SMOKE_MENUS = [
  {
    name: 'System Product',
    path: SYSTEM_PRODUCT_DATALIST_PATH,
    createMode: 'link' as const,
    registry: 'pom-registry/system-product.yaml',
  },
  {
    name: 'Purchase Requisition',
    path: PURCHASE_REQUISITION_DATALIST_PATH,
    createMode: 'auto' as const,
    registry: 'pom-registry/purchase-requisition.yaml',
  },
  {
    name: 'Pricelist Category',
    path: PRICELIST_CATEGORY_DATALIST_PATH,
    createMode: 'link' as const,
    registry: 'pom-registry/pricelist-category.yaml',
  },
  {
    name: 'Purchase Order',
    path: PURCHASE_ORDER_DATALIST_PATH,
    createMode: 'link' as const,
    registry: 'pom-registry/purchase-order.yaml',
  },
];

test.describe('@smoke POM registry — datalist dapat dibuka', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: '/',
    });
  });

  for (const menu of SMOKE_MENUS) {
    test(`[@smoke] ${menu.name} — datalist + tombol Create`, async ({ page }) => {
      const datalist = new OlshopDatalist(page);
      await datalist.gotoAndWait(menu.path, menu.createMode);
      await expect(datalist.searchInput).toBeVisible();
      await expect(datalist.createButton(menu.createMode)).toBeEnabled();
    });
  }

  test('[@smoke] Purchase Order — form create terbuka', async ({ page }) => {
    const po = new PurchaseOrderPage(page);
    await po.gotoDatalist();
    await po.openCreateForm();
    await expect(po.supplierCombobox).toBeVisible();
    await expect(po.withoutPrRadio).toBeVisible();
    await expect(po.withPrRadio).toBeVisible();
  });
});
