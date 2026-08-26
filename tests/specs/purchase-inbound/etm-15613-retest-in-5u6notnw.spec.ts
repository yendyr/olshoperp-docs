import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_INBOUND_DATALIST_PATH } from '../../helpers/purchase-inbound';

/**
 * Retest Spesifik Jira Card: ETM-15613
 * Dokumen Fixture: IN-5U6NOTNW
 * Target Colli Code: COL-6A86C722
 * Target SKU: AAA-S04
 */
test.describe('ETM-15613: Retest spesifik dokumen IN-5U6NOTNW & search COL-6A86C722', () => {
  test('[@TC-PI-SEARCH-COLLI-SPECIFIC] Test search Colli code COL-6A86C722 pada dokumen IN-5U6NOTNW', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const fixtureDoc = 'IN-5U6NOTNW';
    const targetColliCode = 'COL-6A86C722';
    const targetSku = 'AAA-S04';

    // 1. Prepare session DEV-STG
    await prepareSession(page, {
      companyCode: 'DEV-STG',
      targetPath: PURCHASE_INBOUND_DATALIST_PATH,
    });

    // 2. Buka langsung halaman edit IN-5U6NOTNW (ID 131550)
    await page.goto('/supplychain/new-purchase-inbound/edit/131550', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2_000);
    await expect(page.locator('#code, input[value="IN-5U6NOTNW"]').first()).toBeVisible({ timeout: 20_000 });

    // 3. Expand section Inbound Detail
    const inboundDetailBtn = page.getByRole('button', { name: 'Inbound Detail', exact: true }).first();
    if (await inboundDetailBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
      const isExpanded = await inboundDetailBtn.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await inboundDetailBtn.click();
        await page.waitForTimeout(1_500);
      }
    }

    // 4. Cari baris SKU AAA-S04 di tabel detail
    const detailTable = page.locator('#InventoryInDetail, table').filter({ hasText: /SKU|Quantity|Colli/i }).first();
    await expect(detailTable, 'Tabel Inbound Detail harus terlihat').toBeVisible({ timeout: 20_000 });

    const targetRow = detailTable.locator('tbody tr').filter({ hasText: targetSku }).first();
    await expect(targetRow, `Baris SKU ${targetSku} harus ada di dokumen ${fixtureDoc}`).toBeVisible({ timeout: 15_000 });

    // 5. Klik tombol Action 1 (edit product/colli) pada baris AAA-S04
    const firstActionBtn = targetRow.locator('td').last().locator('button').first();
    await firstActionBtn.click();
    await page.waitForTimeout(1_500);

    // 6. Verifikasi modal Update Inbound Product terbuka
    const heading = page.getByRole('heading', { name: 'Update Inbound Product' });
    await expect(heading, 'Heading modal Update Inbound Product harus terlihat').toBeVisible({ timeout: 15_000 });

    const portalRoot = page.locator('#headlessui-portal-root');
    const colliMultiselect = portalRoot.locator('.multiselect').last();
    await expect(colliMultiselect, 'Multiselect COLLI Code di modal harus terlihat').toBeVisible({ timeout: 10_000 });

    const inputSearch = colliMultiselect.locator('input').first();

    // Hitung total opsi colli sebelum difilter (baca dari dom .multiselect-option)
    await inputSearch.focus();
    await inputSearch.press('ArrowDown').catch(() => undefined);
    await page.waitForTimeout(500);

    const optionsBefore = page.locator('.multiselect-option');
    const optionsBeforeCount = await optionsBefore.count();
    const initialOptionTexts = await optionsBefore.allInnerTexts();

    console.log(`[ETM-15613] Opsi Colli di modal SEBELUM search (total ${optionsBeforeCount} opsi):`);
    console.log(initialOptionTexts.slice(0, 10));

    // 7. Fill keyword search 'COL-6A86C722'
    await inputSearch.fill(targetColliCode);
    await page.waitForTimeout(1_500);

    // Ambil opsi SETELAH search
    const optionsAfter = page.locator('.multiselect-option').filter({ hasNotText: 'No results found' });
    const optionCountAfter = await optionsAfter.count();
    const allOptionTexts = await optionsAfter.allInnerTexts();

    console.log(`\n======================================================`);
    console.log(`[ETM-15613 RETEST HASIL EKSEKUSI DATA STAGING]`);
    console.log(`Dokumen Fixture   : ${fixtureDoc}`);
    console.log(`Target SKU        : ${targetSku}`);
    console.log(`Keyword Search    : '${targetColliCode}'`);
    console.log(`Total Opsi SEBELUM Search : ${optionsBeforeCount}`);
    console.log(`Total Opsi SETELAH Search: ${optionCountAfter}`);
    console.log(`Daftar Opsi Colli yang Tampil SETELAH Search:`);
    allOptionTexts.forEach((txt, i) => console.log(`  [${i + 1}] ${txt.trim()}`));
    console.log(`======================================================\n`);

    // 8. HASIL RETEST BUG VS FIX:
    // Jika Bug Masih Ada (Actual ETM-15613): optionCountAfter = optionsBeforeCount (misal 12 opsi tetap tampil semua tanpa filter)
    // Jika Bug Sudah Fix (Expected ETM-15613): optionCountAfter < optionsBeforeCount (terfilter hanya 1 opsi 'COL-6A86C722')
    const isFiltered = optionCountAfter < optionsBeforeCount && allOptionTexts.some(txt => txt.includes('6A86C722') || txt.includes('COL-6A86C722'));

    if (isFiltered) {
      console.log(`[ETM-15613 RESULT]: FIX VERIFIED / PASS — Search colli BERHASIL memfilter list dari ${optionsBeforeCount} menjadi ${optionCountAfter}!`);
    } else {
      console.log(`[ETM-15613 RESULT]: BUG REPRODUCED / FAIL — Search colli '${targetColliCode}' TIDAK MEMFILTER LIST (tetap tampil ${optionCountAfter} opsi)!`);
    }

    expect(optionCountAfter, `Search colli '${targetColliCode}' seharusnya memfilter list (sebelum: ${optionsBeforeCount}, sesudah: ${optionCountAfter})`).toBeLessThan(optionsBeforeCount);
  });
});
