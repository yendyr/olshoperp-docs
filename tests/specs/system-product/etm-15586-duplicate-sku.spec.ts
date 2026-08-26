import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

const COMPANY_CODE = 'DEV-STG';
const BASE_SKU = 'SKUPENSIL01';
const PARENT_SKU = `${BASE_SKU}-(PARENT)`;
const STOCKED_CHILD_SKU = `${BASE_SKU}-doraemon`;

/**
 * Helper to get all child SKU codes listed in the variant table on edit page.
 */
async function getVariantTableSkuCodes(page: Page): Promise<string[]> {
  const table = page.locator('table tbody');
  await expect(table).toBeVisible({ timeout: 20_000 });
  const rows = table.locator('tr');
  const count = await rows.count();
  const skus: string[] = [];

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const inputs = row.locator('input[type="text"], input:not([type="checkbox"])');
    const inputCount = await inputs.count();
    for (let k = 0; k < inputCount; k++) {
      const val = (await inputs.nth(k).inputValue().catch(() => '')).trim();
      if (val && val.startsWith('SKU') && !val.includes('(PARENT)')) {
        skus.push(val);
        break;
      }
    }
  }

  return skus;
}

/**
 * Custom helper to select an option from Vue multiselect.
 */
async function selectOptionInMultiselect(page: Page, multiselect: Locator, optionText: string): Promise<void> {
  await multiselect.scrollIntoViewIfNeeded();
  await multiselect.click();
  await page.waitForTimeout(500);

  const optLoc = page
    .locator('.multiselect-option, [role="option"]')
    .filter({ hasText: new RegExp(`^${optionText}$`, 'i') })
    .first();

  if (await optLoc.isVisible({ timeout: 5_000 }).catch(() => false)) {
    await optLoc.scrollIntoViewIfNeeded().catch(() => undefined);
    await optLoc.click({ force: true });
    await page.waitForTimeout(300);
    return;
  }

  const textLoc = page.getByText(optionText, { exact: true }).filter({ visible: true }).first();
  await textLoc.scrollIntoViewIfNeeded().catch(() => undefined);
  await textLoc.click({ force: true });
  await page.waitForTimeout(300);
}

/**
 * Custom helper to add a Variant Group with specific options on the Edit page.
 */
async function addVariantGroupCustom(page: Page, variantTypeName: string, options: string[]): Promise<void> {
  console.log(`Menambahkan variant group "${variantTypeName}" dengan opsi [${options.join(', ')}]...`);

  const addVariantBtn = page
    .getByText('Add New Variant', { exact: true })
    .or(page.getByText('Add Variant', { exact: true }))
    .first();
  await addVariantBtn.scrollIntoViewIfNeeded();
  await addVariantBtn.click({ force: true });
  await page.waitForTimeout(1_000);

  const emptyType = page.locator('[aria-placeholder*="Flavour"], [placeholder*="Flavour"]').last();
  await expect(emptyType, 'Input Variant Type baru harus visible').toBeVisible({ timeout: 15_000 });
  await emptyType.scrollIntoViewIfNeeded();
  await emptyType.click();
  await page.waitForTimeout(500);

  const typeOpt = page
    .locator('.multiselect-option, [role="option"]')
    .filter({ hasText: new RegExp(`^${variantTypeName}$`, 'i') })
    .first();

  await typeOpt.scrollIntoViewIfNeeded().catch(() => undefined);
  await typeOpt.click({ force: true });
  await page.waitForTimeout(1_000);

  const groupRow = emptyType.locator('xpath=ancestor::div[contains(@class,"grid") or contains(@class,"flex") or contains(@class,"items-center")][1]');
  const optionsMultiselect = groupRow.locator('.multiselect').last();
  await expect(optionsMultiselect, `Multiselect opsi untuk "${variantTypeName}" harus visible`).toBeVisible({ timeout: 15_000 });

  for (const optText of options) {
    await selectOptionInMultiselect(page, optionsMultiselect, optText);
  }

  await page.keyboard.press('Escape').catch(() => undefined);
  await page.waitForTimeout(500);
}

/**
 * Helper to delete a specific variant group using the trash icon on its specific container row.
 */
async function removeVariantGroupByName(page: Page, variantTypeName: string): Promise<void> {
  console.log(`Menghapus variant group "${variantTypeName}" via ikon sampah...`);
  
  const groupRow = page
    .locator('div')
    .filter({ has: page.getByText(variantTypeName, { exact: true }) })
    .filter({ has: page.locator('button, [data-icon*="trash"], [class*="trash"]') })
    .last();

  const trashBtn = groupRow
    .locator('button')
    .filter({ has: page.locator('svg, [data-icon*="trash"], [class*="trash"]') })
    .first();

  if (await trashBtn.isVisible({ timeout: 4_000 }).catch(() => false)) {
    await trashBtn.click();
    await page.waitForTimeout(1_000);
    return;
  }

  const allTrash = page.locator('button:has([data-icon*="trash"]), button:has(.fa-trash)');
  if ((await allTrash.count()) > 0) {
    await allTrash.last().click();
    await page.waitForTimeout(1_000);
    return;
  }

  throw new Error(`Ikon sampah untuk variant group "${variantTypeName}" tidak ditemukan`);
}

test.describe('ETM-15586 — Fase 3: Variant Group Mutation on Stocked Child & Verification', () => {
  test.setTimeout(360_000);

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: COMPANY_CODE,
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });
  });

  test('[@TC-ETM-15586-FASE3] Mutasi Variant Group pada SKUPENSIL01 dengan child berstok (SKUPENSIL01-doraemon)', async ({ page }) => {
    const sp = new SystemProductPage(page);

    // Step 1: Buka halaman edit SKUPENSIL01-(PARENT)
    console.log(`Membuka halaman Edit untuk produk ${PARENT_SKU}...`);
    await sp.searchDatalist(PARENT_SKU);
    const editLink = page.locator('table tbody tr a[href*="/product/edit/"]').first();
    await expect(editLink, `Link Edit untuk ${PARENT_SKU} harus ditemukan di datalist`).toBeVisible({ timeout: 20_000 });
    const href = await editLink.getAttribute('href');

    if (href) {
      console.log(`Navigasi langsung ke URL edit: ${href}...`);
      await page.goto(`https://staging.olshoperp.com${href}`);
    } else {
      await editLink.click();
    }

    await page.waitForLoadState('networkidle');
    await sp.scrollToProductDetails();

    // Cek SKU child awal sebelum mutasi Fase 3
    const skusBeforeFase3 = await getVariantTableSkuCodes(page);
    console.log('SKU child pada tabel variasi sebelum Fase 3:', skusBeforeFase3);

    // Step 2: Tambah Variant Group 'Panjang' (10cm, 30cm, 45cm) -> Save All
    console.log('Fase 3 Step A: Menambahkan Variant Group "Panjang" (10cm, 30cm, 45cm)...');
    await addVariantGroupCustom(page, 'Panjang', ['10cm', '30cm', '45cm']);

    console.log('Klik Save All setelah menambahkan Panjang...');
    const confirm1 = await sp.clickSaveAllWithExpandConfirm();
    console.log('Popup confirm leftover/expand dipicu & disetujui?', confirm1);
    await page.waitForTimeout(2_000);

    const skusAfterAddPanjang = await getVariantTableSkuCodes(page);
    console.log('SKU child setelah tambah Panjang:', skusAfterAddPanjang);

    // Step 3: Hapus Variant Group 'Panjang' via ikon sampah presisi -> Save All
    console.log('Fase 3 Step B: Menghapus Variant Group "Panjang" via ikon sampah...');
    await removeVariantGroupByName(page, 'Panjang');

    console.log('Klik Save All setelah menghapus Panjang...');
    const confirm2 = await sp.clickSaveAllWithExpandConfirm();
    console.log('Popup confirm leftover/expand dipicu & disetujui?', confirm2);
    await page.waitForTimeout(2_000);

    // Step 4: Verifikasi Akhir & Assertion
    const finalSkus = await getVariantTableSkuCodes(page);
    console.log('=== HASIL EKSEKUSI FASE 3 ===');
    console.log('Final SKU codes in variant table:', finalSkus);

    // Cek duplikasi SKU code
    const skuCounts: Record<string, number> = {};
    for (const code of finalSkus) {
      skuCounts[code] = (skuCounts[code] || 0) + 1;
    }
    const duplicates = Object.keys(skuCounts).filter((code) => skuCounts[code] > 1);

    console.log('SKU Counts:', skuCounts);
    console.log('Duplicate SKUs found:', duplicates);

    // Step 5: Cek Datalist System Product untuk child berstok (SKUPENSIL01-doraemon)
    await page.goto(`https://staging.olshoperp.com${SYSTEM_PRODUCT_DATALIST_PATH}`);
    await page.waitForLoadState('networkidle');
    await sp.searchDatalist(STOCKED_CHILD_SKU);
    await page.waitForTimeout(2_000);

    const datalistRows = page.locator('table tbody tr').filter({ hasText: STOCKED_CHILD_SKU });
    const datalistCount = await datalistRows.count();
    console.log(`Jumlah baris "${STOCKED_CHILD_SKU}" di datalist:`, datalistCount);

    // Assertions
    expect(
      duplicates,
      `[BUG ETM-15586] Ditemukan duplicate SKU code pada tabel variasi: ${JSON.stringify(duplicates)}. Seharusnya tidak ada duplikasi.`
    ).toEqual([]);

    expect(
      datalistCount,
      `[BUG ETM-15586] Ditemukan ${datalistCount} baris di datalist untuk "${STOCKED_CHILD_SKU}". Seharusnya maksimal 1 baris.`
    ).toBeLessThanOrEqual(1);

    console.log('✅ TEST PASSED — Tidak ditemukan duplicate SKU code setelah mutasi variant group pada child berstok.');
  });
});
