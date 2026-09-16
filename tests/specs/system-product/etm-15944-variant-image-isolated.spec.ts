import path from 'path';
import { expect, test } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

/**
 * ETM-15944 — [System Product] Upload Gambar pada Spesifik Varian Meng-update
 * Seluruh Varian Child Lainnya saat Default Variant Aktif
 *
 * Environment: Staging
 * Company: Dev Staging (ID: 13, code: DEV-STG)
 * User: playwright@gmail.com
 *
 * TC Reference: qa-docs/system-product/test-cases/TC-SYSPROD-DRAFT-20260916140800.md
 */
test.describe('ETM-15944 — System Product Variant Image Isolation', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'DEV-STG',
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });
  });

  test('[@PENDING-20260916140800][@ETM-15944] Upload gambar pada spesifik varian child hanya meng-update varian tersebut tanpa menimpa varian child lain', async ({
    page,
  }) => {
    const systemProduct = new SystemProductPage(page);
    const parentSku = 'SKU-TRUZV1';
    const productName = 'TRUZZ TRSR DOLL';
    const variantOptions = ['yellow', 'white'];

    // 1. Cari produk bervarian di datalist Dev Staging (13)
    await systemProduct.gotoDatalist();
    await systemProduct.searchDatalist(parentSku);

    const existingSkuLink = page
      .getByRole('link', { name: parentSku, exact: true })
      .first();

    if (await existingSkuLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      const editHref = await existingSkuLink.getAttribute('href');
      if (editHref) {
        await page.goto(editHref, { waitUntil: 'domcontentloaded' });
      } else {
        await existingSkuLink.click();
      }
    } else {
      await systemProduct.openCreateForm();
      await systemProduct.fillBasicInformation(parentSku, productName);
      await systemProduct.selectRandomProductCoaGroup();
      await systemProduct.assertSalesCategoryAutoFilled();
      await systemProduct.clickSaveWithCoaRetry(parentSku, productName);

      await systemProduct.scrollToProductDetails();
      await systemProduct.enableVariations();
      await systemProduct.selectVariantType('Colours');
      await systemProduct.selectVariantOptions(variantOptions);
      await systemProduct.clickSaveAll();

      await systemProduct.searchDatalist(parentSku);
      await page.getByRole('link', { name: parentSku, exact: true }).first().click();
    }

    // 2. Pastikan accordion Product Details terbuka
    const detailsAccordion = page.getByRole('button', {
      name: 'Product Details',
      exact: true,
    });
    if (await detailsAccordion.isVisible({ timeout: 5_000 }).catch(() => false)) {
      if ((await detailsAccordion.getAttribute('aria-expanded')) !== 'true') {
        await detailsAccordion.click();
        await page.waitForTimeout(700);
      }
    }

    // Scroll ke tabel daftar varian
    const variantTable = page.locator('table').filter({ hasText: /colours|variant sku/i }).first();
    await variantTable.scrollIntoViewIfNeeded();

    // Tunggu file inputs khusus di dalam tabel varian (bukan main photo di atas)
    const tableFileInputs = page.locator('table input.file-input[type="file"]');
    await expect(tableFileInputs.first()).toBeAttached({ timeout: 30_000 });
    const count = await tableFileInputs.count();
    expect(count, 'Harus ada minimal 2 SKU child pada tabel varian').toBeGreaterThanOrEqual(2);

    // Ambil data state awal tabel via API primevue datalist
    const currentUrl = page.url();
    const productIdMatch = currentUrl.match(/\/edit\/(\d+)/);
    const productId = productIdMatch ? productIdMatch[1] : '90242';

    const token = await page.evaluate(() => {
      const auth = localStorage.getItem('auth');
      return auth ? JSON.parse(auth).token : '';
    });

    const initialDataRes = await page.request.get(
      `https://api.staging.olshoperp.com/api/supplychain/product/${productId}/specification/index/primevue?id_menu=${productId}&start=0&length=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    );

    let initialRows: Array<{ id: number; image_blob: string | null }> = [];
    if (initialDataRes.status() === 200) {
      const json = await initialDataRes.json().catch(() => null);
      if (json?.data && Array.isArray(json.data)) {
        initialRows = json.data;
      }
    }

    const initialChild1Image = initialRows.length >= 2 ? initialRows[1]?.image_blob : null;

    // 3. Siapkan listener response untuk upload gambar varian child pertama
    const fixtureImagePath = path.join(
      process.cwd(),
      'tests',
      'fixtures',
      'sample-variant-image.png',
    );

    const updateResponsePromise = page.waitForResponse(
      (res) =>
        res.url().includes('/specification/inline-update-image/') &&
        res.status() === 200,
      { timeout: 30_000 },
    );

    const reloadResponsePromise = page.waitForResponse(
      (res) =>
        res.url().includes('/specification/index/primevue') &&
        res.request().method() === 'GET' &&
        res.status() === 200,
      { timeout: 30_000 },
    );

    // Upload file khusus ke varian child pertama di dalam tabel
    await tableFileInputs.first().setInputFiles(fixtureImagePath);

    // 4. Verifikasi API inline-update-image merespons sukses (200 OK)
    const updateRes = await updateResponsePromise;
    expect(updateRes.status(), 'API inline-update-image varian harus 200 OK').toBe(200);

    // 5. Verifikasi datalist varian primevue reload otomatis (200 OK)
    const reloadRes = await reloadResponsePromise;
    expect(reloadRes.status(), 'API datalist varian primevue harus 200 OK').toBe(200);

    const reloadData = (await reloadRes.json()) as {
      data?: Array<{
        id: number;
        sku?: string;
        image_blob?: string | null;
      }>;
    };
    const updatedRows = reloadData.data || [];
    expect(updatedRows.length).toBeGreaterThanOrEqual(2);

    const targetChild = updatedRows[0];
    const otherChild = updatedRows[1];

    // 6. Assert: Varian child pertama (target) memiliki gambar ter-update
    expect(targetChild.image_blob, 'Child pertama harus memiliki image_blob').toBeTruthy();
    expect(targetChild.image_blob, 'Child pertama harus merender tag <img>').toContain('<img');

    // 7. Assert KUNCI ETM-15944: Varian child kedua TIDAK tertimpa gambar varian pertama
    if (!initialChild1Image) {
      expect(
        otherChild.image_blob,
        'Child kedua tidak boleh tertimpa gambar dari child pertama saat child pertama diupload',
      ).toBeNull();
    } else {
      expect(
        otherChild.image_blob,
        'Child kedua tidak boleh berubah menjadi gambar child pertama',
      ).not.toBe(targetChild.image_blob);
    }

    // 8. Assert UI DOM: Verifikasi bahwa preview pada baris target tampil di browser
    const targetRow = page.locator('table tbody tr').first();
    await expect(targetRow.locator('img')).toBeVisible({ timeout: 10_000 });
  });
});
