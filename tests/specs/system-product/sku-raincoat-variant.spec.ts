import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * TC: SKU-RAINCOAT — variant 2 warna (hitam, merah)
 * Company: lumicharmsid (153)
 * Satu alur linear — tidak loop ulang dari awal.
 */
test.describe('System Product — SKU-RAINCOAT variant', () => {
  test('[@TC-SYSPROD-RAINCOAT] Membuat SKU variant Warna hitam + merah (SKU-RAINCOAT)', async ({
    page,
  }) => {
    const parentSku = 'SKU-RAINCOAT';
    const productName = 'Jas Hujan';
    const variantColors = ['hitam', 'merah'];
    const expectedSkus = [
      parentSku,
      `${parentSku}-hitam`,
      `${parentSku}-merah`,
    ];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });

    const systemProduct = new SystemProductPage(page);

    await systemProduct.gotoDatalist();
    await systemProduct.searchDatalist(parentSku);

    if (await systemProduct.areSkusVisibleInDatalist(expectedSkus)) {
      await systemProduct.assertSkusVisibleInDatalist(expectedSkus);
      return;
    }

    const mode = await systemProduct.openCreateOrEditBySku(parentSku);

    if (mode === 'create') {
      await systemProduct.fillBasicInformation(parentSku, productName);
      await systemProduct.selectRandomProductCoaGroup();
      await systemProduct.assertSalesCategoryAutoFilled();
      await systemProduct.clickSaveWithCoaRetry(parentSku, productName);
    }

    const blockerToast = page
      .locator('.toastify, [class*="toast"]')
      .filter({ hasText: /fiscal period|error|gagal|failed|tidak dapat/i });
    if (await blockerToast.isVisible({ timeout: 2_000 }).catch(() => false)) {
      const msg = await blockerToast.first().textContent();
      throw new Error(`BLOCKER: tidak dapat lanjut — ${msg?.trim() ?? 'validasi backend'}`);
    }

    await systemProduct.scrollToProductDetails();
    await systemProduct.enableVariations();
    await systemProduct.selectVariantType('Warna');
    await systemProduct.selectVariantOptions(variantColors);
    await systemProduct.clickSaveAll();

    if (await blockerToast.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const msg = await blockerToast.first().textContent();
      throw new Error(`BLOCKER setelah Save All — ${msg?.trim() ?? 'validasi backend'}`);
    }

    await systemProduct.searchDatalist(parentSku);
    await systemProduct.assertSkusVisibleInDatalist(expectedSkus);
  });
});
