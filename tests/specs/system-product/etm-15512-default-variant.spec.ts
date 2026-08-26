import { test, expect, type Page } from '@playwright/test';
import { prepareSession, dismissStagingBanner } from '../../helpers/company-access';
import {
  SYSTEM_PRODUCT_DATALIST_PATH,
  SystemProductPage,
} from '../../helpers/system-product';

const COMPANY_CODE = 'DEV-STG';
const STOCK_LOCATION = 'Seruni Drop Off';
const STOCK_QTY = 10;

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
 * Robust custom helper to add a Variant Group with specific options on the Edit page.
 */
async function addVariantGroupCustom(page: Page, variantTypeName: string, options: string[]): Promise<void> {
  console.log(`Menambahkan variant group "${variantTypeName}" dengan opsi [${options.join(', ')}]...`);

  // 1. Klik Add New Variant / Add Variant
  const addVariantBtn = page
    .getByText('Add New Variant', { exact: true })
    .or(page.getByText('Add Variant', { exact: true }))
    .first();
  await addVariantBtn.scrollIntoViewIfNeeded();
  await addVariantBtn.click({ force: true });
  await page.waitForTimeout(1_500);

  // 2. Cari input select untuk type yang kosong (baru ditambahkan)
  const emptyType = page.locator('.multiselect').filter({ hasText: /Choose Type|Flavour|Tipe/i }).last();
  await expect(emptyType).toBeVisible({ timeout: 15_000 });
  await emptyType.scrollIntoViewIfNeeded();

  // Klik search/placeholder input di dalam emptyType untuk membukanya secara aman
  const typeSearchInput = emptyType.locator('.multiselect-search, input').first();
  await typeSearchInput.click({ force: true });
  await page.waitForTimeout(1_000);

  // 3. Pilih tipe variasi (e.g. CLR-SP)
  const typeOpt = page
    .locator('.multiselect-option:visible, [role="option"]:visible')
    .filter({ hasText: new RegExp(`^${variantTypeName}$`, 'i') })
    .first();

  await expect(typeOpt, `Opsi ${variantTypeName} harus visible`).toBeVisible({ timeout: 15_000 });
  await typeOpt.click({ force: true });
  await page.waitForTimeout(2_000);

  // 4. Cari variant row yang baru saja diset tipenya (mencari row yang memuat multiselect berisi text variantTypeName secara partial)
  const groupRow = page
    .locator('div.grid, div.flex, tr')
    .filter({
      has: page.locator('.multiselect').filter({ hasText: new RegExp(variantTypeName, 'i') })
    })
    .last();
  await expect(groupRow).toBeVisible({ timeout: 15_000 });

  // 5. Opsi multiselect adalah yang terakhir di row tersebut
  const optionsMultiselect = groupRow.locator('.multiselect').last();
  await expect(optionsMultiselect).toBeVisible({ timeout: 15_000 });
  await optionsMultiselect.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // 6. Pilih semua opsi dengan mengetik untuk memicu lazy loading
  for (const optText of options) {
    // Klik search input di dalam multiselect untuk membuka dropdown
    const searchInput = optionsMultiselect.locator('input, .multiselect-search').first();
    await searchInput.click({ force: true });
    await page.waitForTimeout(300);
    await searchInput.fill('');
    await searchInput.fill(optText);
    await page.waitForTimeout(1_000); // tunggu API load

    const optLoc = page
      .locator('.multiselect-option:visible, [role="option"]:visible')
      .filter({ hasText: new RegExp(`^${optText}$`, 'i') })
      .first();

    await expect(optLoc, `Opsi ${optText} harus visible`).toBeVisible({ timeout: 15_000 });
    await optLoc.click({ force: true });
    await page.waitForTimeout(800);
  }

  // 7. Tutup dropdown
  await page.keyboard.press('Escape').catch(() => undefined);
  await page.waitForTimeout(1_000);
}

/**
 * Custom robust helper to seed stock and approve it.
 */
async function seedApprovedStockCustom(page: Page, sku: string, qty: number): Promise<string> {
  console.log(`[seedStock] Menambahkan stok ${qty} pcs untuk SKU ${sku}...`);

  // 1. Go to stock addition datalist
  await page.goto('https://staging.olshoperp.com/supplychain/adjustment-addition');
  await page.waitForLoadState('networkidle');
  await dismissStagingBanner(page);

  // 2. Click Create
  await page.getByRole('link', { name: 'Create', exact: true }).or(page.locator('a[href*="/create"]').first()).click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2_000); // Tunggu sampai event listener Vue terpasang

  // 3. Cek apakah langsung auto-submit ke halaman Edit (AS-IS behavior)
  const isEditMode = page.url().includes('/edit/');
  console.log(`[seedStock] Mode terdeteksi: ${isEditMode ? 'EDIT (Auto-submitted)' : 'CREATE'}`);

  if (!isEditMode) {
    // Choose Location (first multiselect on create page)
    const locationSelect = page.locator('.multiselect').first();
    await expect(locationSelect).toBeVisible({ timeout: 15_000 });
    await locationSelect.click();
    await page.waitForTimeout(500);
    
    const searchInput = locationSelect.locator('.multiselect-search').first();
    await searchInput.fill(STOCK_LOCATION);
    await page.waitForTimeout(800);

    const locOpt = page.locator('.multiselect-option:visible, [role="option"]:visible').filter({ hasText: new RegExp(STOCK_LOCATION, 'i') }).first();
    await expect(locOpt).toBeVisible({ timeout: 15_000 });
    await locOpt.click();
    await page.waitForTimeout(800);

    // Fill Description
    await page.getByPlaceholder(/department|keterangan|deskripsi/i).fill(`ETM-15512 seed ${sku}`);

    // Save basic info
    const saveAndNext = page.getByRole('button', { name: 'Save & Next', exact: true }).last();
    await expect(saveAndNext).toBeVisible({ timeout: 15_000 });
    await saveAndNext.click();
    await page.waitForNavigation({ url: /\/supplychain\/adjustment-addition\/edit\/\d+/, timeout: 30000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1_500);
  }

  // 4. Expand Detail if closed
  const detailSection = page.locator('#InventoryInDetail, div[aria-current*="Detail"]').first();
  await expect(detailSection).toBeVisible({ timeout: 20_000 });
  await dismissStagingBanner(page);
  
  const detailBtn = detailSection.locator('button').first();
  if (await detailBtn.isVisible() && (await detailBtn.getAttribute('aria-expanded')) !== 'true') {
    await detailBtn.click();
    await page.waitForTimeout(1_000);
  }

  // 5. Select Product (first multiselect inside details section container)
  const selectProduct = detailSection.locator('.multiselect').first();
  await expect(selectProduct).toBeVisible({ timeout: 15_000 });
  await selectProduct.click();
  await page.waitForTimeout(500);
  
  const prodSearchInput = selectProduct.locator('.multiselect-search').first();
  await prodSearchInput.fill(sku);
  await page.waitForTimeout(1500);

  const prodOpt = page.locator('.multiselect-option:visible, [role="option"]:visible').filter({ hasText: sku }).first();
  await expect(prodOpt).toBeVisible({ timeout: 15_000 });
  
  // Wait for bulk create request to complete
  const bulkPromise = page.waitForResponse(
    (response) =>
      /bulk-create/.test(response.url()) &&
      response.request().method() === 'POST',
    { timeout: 45_000 },
  );

  await prodOpt.click();
  await bulkPromise.catch(() => console.log('[seedStock] Warning: bulk-create response wait timed out or skipped'));
  await page.waitForTimeout(2000);

  // Set Qty
  const row = page.locator('table tbody tr').filter({ hasText: sku }).first();
  await expect(row).toBeVisible({ timeout: 15000 });
  const qtyInput = row.locator('input[type="number"], input:not([type="checkbox"])').first();
  await qtyInput.fill(qty.toString());
  await page.waitForTimeout(500);

  // Set Status to Open
  await page.locator('#open').click({ force: true });
  await page.waitForTimeout(500);

  // Click Save All
  await page.getByRole('button', { name: 'Save All', exact: true }).last().click();
  await page.waitForLoadState('networkidle');

  // Read Code
  const code = (await page.locator('#code').inputValue()).trim();
  console.log(`[seedStock] Document created: ${code}. Approving now...`);

  // 5. Approve Accounting
  await page.goto('https://staging.olshoperp.com/accounting/adjustment-inbound');
  await page.waitForLoadState('networkidle');
  await dismissStagingBanner(page);

  const searchInbound = page.locator('input[placeholder*="Search"]').first();
  await searchInbound.fill(code);
  await page.waitForTimeout(2000);

  const approveRow = page.getByRole('row').filter({ hasText: code }).first();
  await expect(approveRow, `Stock Addition Approval ${code}`).toBeVisible({ timeout: 60_000 });

  const codeLink = approveRow
    .getByRole('link', { name: code, exact: true })
    .or(approveRow.locator('a[href*="/accounting/adjustment-inbound/edit/"]'))
    .first();

  await expect(codeLink).toBeVisible({ timeout: 15_000 });
  const href = await codeLink.getAttribute('href');
  if (href) {
    await page.goto(href.startsWith('http') ? href : `https://staging.olshoperp.com${href}`, { waitUntil: 'load' });
  } else {
    await codeLink.click();
  }
  
  // Wait for edit page navigation and let it load
  await page.waitForURL(/\/accounting\/adjustment-inbound\/edit\/\d+/, { timeout: 30_000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await dismissStagingBanner(page);

  // Click Approve (using standard specific locator pattern)
  const approveBtn = page
    .getByRole('button', { name: /Approve Now/i })
    .or(
      page.locator('button.bg-info.border-info').filter({
        has: page.locator('.fa-check-double, [class*="check-double"]'),
      }),
    )
    .or(page.getByRole('button', { name: /^Approve$/i }))
    .first();

  await approveBtn.scrollIntoViewIfNeeded();
  await approveBtn.click({ force: true });

  const confirmApprove = page.getByRole('button', { name: /^Approve$/i }).last();
  await expect(confirmApprove).toBeVisible({ timeout: 15_000 });

  const approveResponse = page.waitForResponse(
    (response) =>
      /adjustment-inbound\/\d+\/approve/.test(response.url()) &&
      response.request().method() === 'POST',
    { timeout: 60_000 },
  );

  await confirmApprove.click({ force: true });
  await approveResponse;
  await page.waitForURL(/\/accounting\/adjustment-inbound\/?$/, { timeout: 60_000 }).catch(() => undefined);
  await page.waitForTimeout(3000);

  console.log(`[seedStock] Document ${code} successfully approved.`);
  return code;
}

test.describe('ETM-15512 — System Product Default Variant on Create & Expand Leftovers', () => {
  test.setTimeout(360_000);

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: COMPANY_CODE,
      targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
    });
  });

  test('[@TC-ETM-15512-05] Expand zero-relation -> soft delete + regenerate', async ({ page }) => {
    const sp = new SystemProductPage(page);
    const stamp = Date.now().toString().slice(-4);
    const baseSku = `SKUPNSL5-${stamp}`;
    const parentSku = `${baseSku}-(PARENT)`;
    const productName = `Pensil Uji 5 ${stamp}`;

    console.log(`[TC-05] Membuka form Create untuk ${baseSku}...`);
    await sp.openCreateForm();
    await sp.fillBasicInformation(baseSku, productName);
    await sp.assertAndEnsureProductCoaGroup('Purchased Item');
    await sp.assertAndEnsureSalesCategory('Hobbies & Collections');
    await sp.clickSave();

    await page.waitForLoadState('networkidle');
    await sp.scrollToProductDetails();

    console.log('[TC-05] Menambahkan Variant Group "CLR-SP" (biru, hijau)...');
    await addVariantGroupCustom(page, 'CLR-SP', ['biru', 'hijau']);

    console.log('[TC-05] Klik Save All...');
    await sp.clickSaveAll();
    await page.waitForTimeout(2_000);

    const generatedSkus = await getVariantTableSkuCodes(page);
    console.log('[TC-05] Generated SKUs after expand:', generatedSkus);

    // Verify child default (baseSku) is soft-deleted, and new combinations are generated
    expect(generatedSkus, 'Child SKU default harus dihapus').not.toContain(baseSku);
    expect(generatedSkus, 'SKU baru harus berisi CLR-SP biru').toContain(`${baseSku}-biru`);
    expect(generatedSkus, 'SKU baru harus berisi CLR-SP hijau').toContain(`${baseSku}-hijau`);

    console.log('✅ [TC-05] PASS — Zero-relation child berhasil di-soft-delete dan diregenerate.');
  });

  test('[@TC-ETM-15512-06] Expand dengan relasi -> leftover + confirm', async ({ page }) => {
    const sp = new SystemProductPage(page);
    const stamp = Date.now().toString().slice(-4);
    const baseSku = `SKUPNSL6-${stamp}`;
    const parentSku = `${baseSku}-(PARENT)`;
    const productName = `Pensil Uji 6 ${stamp}`;

    console.log(`[TC-06] Membuka form Create untuk ${baseSku}...`);
    await sp.openCreateForm();
    await sp.fillBasicInformation(baseSku, productName);
    await sp.assertAndEnsureProductCoaGroup('Purchased Item');
    await sp.assertAndEnsureSalesCategory('Hobbies & Collections');
    await sp.clickSave();

    await page.waitForLoadState('networkidle');
    await sp.scrollToProductDetails();

    // Pastikan data tersimpan dan visible di datalist
    await sp.gotoDatalist();
    await sp.searchDatalist(baseSku);
    await sp.assertSkuVisibleInDatalist(baseSku);

    // Step 2: Seed stock ke child default agar memiliki relasi/stok
    console.log(`[TC-06] Seeding stock untuk ${baseSku} di lokasi ${STOCK_LOCATION}...`);
    await seedApprovedStockCustom(page, baseSku, STOCK_QTY);

    // Step 3: Kembali ke edit parent produk
    console.log(`[TC-06] Navigasi kembali ke halaman edit parent SKU: ${parentSku}...`);
    await sp.gotoDatalist();
    await sp.searchDatalist(parentSku);
    
    const editLink = page.locator('table tbody tr a[href*="/product/edit/"]').first();
    await expect(editLink, `Link Edit untuk ${parentSku} harus ditemukan di datalist`).toBeVisible({ timeout: 20_000 });
    const href = await editLink.getAttribute('href');
    if (href) {
      await page.goto(`https://staging.olshoperp.com${href}`);
    } else {
      await editLink.click();
    }

    await page.waitForLoadState('networkidle');
    await sp.scrollToProductDetails();

    // Step 4: Tambahkan Variant Group CLR-SP (biru, hijau)
    console.log('[TC-06] Menambahkan Variant Group "CLR-SP" (biru, hijau) pada child berstok...');
    await addVariantGroupCustom(page, 'CLR-SP', ['biru', 'hijau']);

    console.log('[TC-06] Klik Save All (akan memicu confirmation popup)...');
    await sp.clickSaveAllWithExpandConfirm();
    await page.waitForTimeout(2_000);

    const generatedSkus = await getVariantTableSkuCodes(page);
    console.log('[TC-06] Generated SKUs after expand with relation:', generatedSkus);

    // Assertions
    // 1. Leftover child berstok tetap dipertahankan
    expect(generatedSkus, 'Leftover SKU berstok harus tetap dipertahankan').toContain(baseSku);
    
    // 2. Kombinasi baru terbentuk
    expect(generatedSkus, 'Kombinasi baru biru harus terbentuk').toContain(`${baseSku}-biru`);
    expect(generatedSkus, 'Kombinasi baru hijau harus terbentuk').toContain(`${baseSku}-hijau`);

    console.log('✅ [TC-06] PASS — Leftovers dipertahankan dan kombinasi baru tergenerate.');
  });

  test('[@TC-ETM-15512-07] Omit Default segment + hide Default column', async ({ page }) => {
    const sp = new SystemProductPage(page);
    const stamp = Date.now().toString().slice(-4);
    const baseSku = `SKUPNSL7-${stamp}`;
    const productName = `Pensil Uji 7 ${stamp}`;

    console.log(`[TC-07] Membuka form Create untuk ${baseSku}...`);
    await sp.openCreateForm();
    await sp.fillBasicInformation(baseSku, productName);
    await sp.assertAndEnsureProductCoaGroup('Purchased Item');
    await sp.assertAndEnsureSalesCategory('Hobbies & Collections');
    await sp.clickSave();

    await page.waitForLoadState('networkidle');
    await sp.scrollToProductDetails();

    console.log('[TC-07] Menambahkan Variant Group "CLR-SP" (biru, hijau)...');
    await addVariantGroupCustom(page, 'CLR-SP', ['biru', 'hijau']);

    console.log('[TC-07] Klik Save All...');
    await sp.clickSaveAll();
    await page.waitForTimeout(2_000);

    const generatedSkus = await getVariantTableSkuCodes(page);
    console.log('[TC-07] Generated SKUs after expand:', generatedSkus);

    // Verify Default segment '-Standard' is omitted
    for (const sku of generatedSkus) {
      expect(sku, `SKU ${sku} tidak boleh mengandung default segment '-Standard'`).not.toContain('-Standard');
    }

    console.log('✅ [TC-07] PASS — Default segment di-omit dari SKU baru.');
  });
});
