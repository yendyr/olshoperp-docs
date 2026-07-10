import { test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * TC: Parent SKU bundle — detail variant + parent single BDL-TRUZ-SET01
 * Company: lumicharmsid (153)
 * Target: staging.olshoperp.com
 */
test.describe('System Product — bundle TRUZZ Doll Collectors Pack', () => {
  test('[@TC-SYSPROD-BUNDLE-001] Membuat parent SKU bundle dari detail variant + single parent', async ({
    page,
  }) => {
    test.setTimeout(600_000);

    const variantParent = {
      sku: 'SKU-TRUZV1',
      name: 'TRUZZ TRSR DOLL',
      colors: ['white', 'yellow'] as string[],
      expectedSkus: [
        'SKU-TRUZV1',
        'SKU-TRUZV1-white',
        'SKU-TRUZV1-yellow',
      ],
    };

    const bundleParent = {
      sku: 'BDL-TRUZ-SET01',
      name: 'Bundle TRUZZ Doll Collectors Pack',
      detailSkus: ['SKU-TRUZV1-white', 'SKU-TRUZV1-yellow'],
    };

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });

    const sp = new SystemProductPage(page);
    const blockerToast = page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /fiscal period|error|gagal|failed|tidak dapat/i });

    // --- Step 1: buat SKU variant (detail bundle) ---
    await sp.gotoDatalist();
    await sp.searchDatalist(variantParent.sku);

    if (!(await sp.areSkusVisibleInDatalist(variantParent.expectedSkus))) {
      const mode = await sp.openCreateOrEditBySku(variantParent.sku);

      if (mode === 'create') {
        await sp.fillBasicInformation(variantParent.sku, variantParent.name);
        await sp.selectRandomProductCoaGroup();
        await sp.assertSalesCategoryAutoFilled();
        await sp.clickSaveWithCoaRetry(variantParent.sku, variantParent.name);
      }

      if (await blockerToast.isVisible({ timeout: 2_000 }).catch(() => false)) {
        const msg = await blockerToast.first().textContent();
        throw new Error(`BLOCKER setelah save header variant: ${msg?.trim() ?? 'validasi'}`);
      }

      await sp.scrollToProductDetails();
      await sp.enableVariations();
      await sp.selectVariantTypeFromCandidates(['Colours', 'Warna', 'Color']);
      await sp.selectVariantOptions(variantParent.colors);
      await sp.clickSaveAll();

      if (await blockerToast.isVisible({ timeout: 3_000 }).catch(() => false)) {
        const msg = await blockerToast.first().textContent();
        throw new Error(`BLOCKER setelah Save All variant: ${msg?.trim() ?? 'validasi'}`);
      }
    }

    // Pastikan SKU detail variant sudah ada sebelum konfigurasi bundle
    await sp.searchDatalist(variantParent.sku);
    await sp.assertSkusVisibleInDatalist(variantParent.expectedSkus);

    // --- Step 2: buat SKU single parent bundle (tetap di halaman edit setelah save) ---
    await sp.gotoDatalist();
    await sp.searchDatalist(bundleParent.sku);

    const bundleMode = await sp.openCreateOrEditBySku(bundleParent.sku);

    if (bundleMode === 'create') {
      await sp.fillBasicInformation(bundleParent.sku, bundleParent.name);
      await sp.selectRandomProductCoaGroup();
      await sp.assertSalesCategoryAutoFilled();
      await sp.clickSaveWithCoaRetry(bundleParent.sku, bundleParent.name);
    }

    if (await blockerToast.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const msg = await blockerToast.first().textContent();
      throw new Error(`BLOCKER setelah save header bundle parent: ${msg?.trim() ?? 'validasi'}`);
    }

    // --- Step 3–7: konfigurasi bundle di halaman edit yang sama ---
    await sp.scrollToProductDetails();
    await sp.enableProductBundle();
    await sp.expandBundleProductPanel();

    for (const detailSku of bundleParent.detailSkus) {
      await sp.addBundleDetailProduct(detailSku);
    }

    await sp.activateProductBundle();
  });
});
