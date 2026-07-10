import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * Dummy create — 2 Single + 1 Variant.
 * Company: lumicharmsid (153)
 * Data dibuat agent (bukan TC fixed SKU lama).
 *
 * Sumber: pom-registry/system-product.yaml + helpers/system-product.ts
 * (tanpa buka FE/BE di sesi ini).
 */
test.describe.serial('System Product — dummy create 2 single + 1 variant', () => {
  // Suffix tanggal agar tidak bentrok dengan SKU lama di staging
  const stamp = 'PW1007';
  const singleA = {
    sku: `SKU-${stamp}-SINGLE-A`,
    name: `Playwright Single A ${stamp}`,
  };
  const singleB = {
    sku: `SKU-${stamp}-SINGLE-B`,
    name: `Playwright Single B ${stamp}`,
  };
  const variant = {
    sku: `SKU-${stamp}-VAR`,
    name: `Playwright Variant ${stamp}`,
    colors: ['hitam', 'merah'] as string[],
    expectedSkus: [
      `SKU-${stamp}-VAR`,
      `SKU-${stamp}-VAR-hitam`,
      `SKU-${stamp}-VAR-merah`,
    ],
  };

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });
  });

  test('[@TC-SYSPROD-DUMMY-001] Create SKU Single A', async ({ page }) => {
    test.setTimeout(300_000);
    const sp = new SystemProductPage(page);

    const mode = await sp.openCreateOrEditBySku(singleA.sku);
    if (mode === 'create') {
      await sp.fillBasicInformation(singleA.sku, singleA.name);
      await sp.selectRandomProductCoaGroup();
      await sp.assertSalesCategoryAutoFilled();
      await sp.clickSaveWithCoaRetry(singleA.sku, singleA.name);
    }

    await sp.searchDatalist(singleA.sku);
    await sp.assertSkuVisibleInDatalist(singleA.sku);
  });

  test('[@TC-SYSPROD-DUMMY-002] Create SKU Single B', async ({ page }) => {
    test.setTimeout(300_000);
    const sp = new SystemProductPage(page);

    const mode = await sp.openCreateOrEditBySku(singleB.sku);
    if (mode === 'create') {
      await sp.fillBasicInformation(singleB.sku, singleB.name);
      await sp.selectRandomProductCoaGroup();
      await sp.assertSalesCategoryAutoFilled();
      await sp.clickSaveWithCoaRetry(singleB.sku, singleB.name);
    }

    await sp.searchDatalist(singleB.sku);
    await sp.assertSkuVisibleInDatalist(singleB.sku);
  });

  test('[@TC-SYSPROD-DUMMY-003] Create SKU Variant Warna hitam+merah', async ({
    page,
  }) => {
    test.setTimeout(420_000);
    const sp = new SystemProductPage(page);

    await sp.gotoDatalist();
    await sp.searchDatalist(variant.sku);
    if (await sp.areSkusVisibleInDatalist(variant.expectedSkus)) {
      await sp.assertSkusVisibleInDatalist(variant.expectedSkus);
      return;
    }

    const mode = await sp.openCreateOrEditBySku(variant.sku);
    if (mode === 'create') {
      await sp.fillBasicInformation(variant.sku, variant.name);
      await sp.selectRandomProductCoaGroup();
      await sp.assertSalesCategoryAutoFilled();
      await sp.clickSaveWithCoaRetry(variant.sku, variant.name);
    }

    const blockerToast = page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /fiscal period|error|gagal|failed|tidak dapat/i });
    if (await blockerToast.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const msg = await blockerToast.first().textContent();
      throw new Error(`BLOCKER setelah save header: ${msg?.trim() ?? 'validasi'}`);
    }

    await sp.scrollToProductDetails();
    await sp.enableVariations();
    await sp.selectVariantType('Warna');
    await sp.selectVariantOptions(variant.colors);
    await sp.clickSaveAll();

    if (await blockerToast.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const msg = await blockerToast.first().textContent();
      throw new Error(`BLOCKER setelah Save All variant: ${msg?.trim() ?? 'validasi'}`);
    }

    await sp.searchDatalist(variant.sku);
    await sp.assertSkusVisibleInDatalist(variant.expectedSkus);
  });
});
