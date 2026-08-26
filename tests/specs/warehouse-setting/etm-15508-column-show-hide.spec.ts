import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ETM_15508_RESULTS_DIR,
  WAREHOUSE_SETTING_PATH,
  WarehouseSettingPage,
  type ColumnPanelMetrics,
} from '../../helpers/warehouse-setting';

/**
 * ETM-15508 — Warehouse Setting: modal Column Show/Hide terpotong
 * saat hasil global search sedikit.
 *
 * Mapping langkah kartu → POM (halaman tetap /supplychain/setting):
 * 1. Buka Warehouse Setting              → gotoDatalist
 * 2. All rows (search kosong)            → rowCount
 * 3. Buka Column Show/Hide (baseline)    → openColumnShowHide + measure
 * 4. Tutup modal                         → closeColumnShowHide
 * 5. Global search KEBOAN (1 baris)      → searchAndWait
 * 6. Buka Column Show/Hide lagi          → openColumnShowHide + measure
 * 7. Bandingkan tidak terpotong (AC-02)  → assert vs baseline
 * 8. Clear search, buka modal (AC-04)    → clearSearch + open
 * 9. Toggle 1 kolom saat 1 baris (AC-05) → checkbox click
 */

type RunDump = {
  card: string;
  menu: string;
  route: string;
  company: string;
  searchTerm: string;
  rowCountAll: number;
  rowCountSearch: number;
  baseline: ColumnPanelMetrics;
  afterSearch: ColumnPanelMetrics;
  afterClear: ColumnPanelMetrics | null;
  toggleWorked: boolean | null;
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

test.describe.configure({ retries: 0 });

test.describe.serial('ETM-15508 Warehouse Setting Column Show/Hide clip', () => {
  test('[@ETM-15508] Modal Column Show/Hide tidak terpotong saat hasil search 1 baris', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    fs.mkdirSync(path.join(ETM_15508_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });

    const notes: string[] = [];
    const setting = new WarehouseSettingPage(page);

    await prepareSession(page, {
      companyCode: 'FAT',
      targetPath: WAREHOUSE_SETTING_PATH,
    });
    await setting.gotoDatalist();

    const rowCountAll = await setting.rowCount();
    expect(rowCountAll, 'Precondition: datalist all rows harus ada data').toBeGreaterThan(
      1,
    );

    // AC-01 — all rows, modal penuh
    const baselinePanel = await setting.openColumnShowHide();
    const baseline = await setting.measurePanel(baselinePanel);
    await setting.screenshotPanel('01-all-rows-modal.png');
    await setting.closeColumnShowHide();

    expect(
      setting.isClipped(baseline),
      `AC-01 FAIL: modal all-rows terpotong ${JSON.stringify(baseline)}`,
    ).toBeFalsy();
    expect(baseline.checkboxCount, 'Panel Columns Show/Hide harus berisi opsi kolom').toBeGreaterThan(0);

    // AC-02 — search KEBOAN (fallback token unik jika KEBOAN tidak ada)
    let searchTerm = 'KEBOAN';
    await setting.searchAndWait(searchTerm);
    let rowCountSearch = await setting.rowCount();
    if (rowCountSearch !== 1) {
      notes.push(
        `Search KEBOAN menghasilkan ${rowCountSearch} baris — fallback token baris pertama (AC-03).`,
      );
      await setting.clearSearch();
      searchTerm = await setting.firstRowSearchToken();
      await setting.searchAndWait(searchTerm);
      rowCountSearch = await setting.rowCount();
    }

    expect(
      rowCountSearch,
      `Hasil search "${searchTerm}" harus sedikit (1–3 baris)`,
    ).toBeGreaterThan(0);
    expect(rowCountSearch).toBeLessThanOrEqual(3);

    const searchPanel = await setting.openColumnShowHide();
    const afterSearch = await setting.measurePanel(searchPanel);
    await setting.screenshotPanel('02-search-few-rows-modal.png');

    const clippedAfterSearch = setting.isClipped(afterSearch);
    const heightDropped =
      baseline.height > 0 && afterSearch.height < baseline.height * 0.55;

    fs.writeFileSync(
      path.join(ETM_15508_RESULTS_DIR, 'measurements-ac02.json'),
      JSON.stringify(
        { searchTerm, rowCountAll, rowCountSearch, baseline, afterSearch, clippedAfterSearch, heightDropped },
        null,
        2,
      ),
    );

    // AC-05 — isi modal tetap bisa diklik (toggle Data Owner, lalu kembalikan)
    let toggleWorked: boolean | null = null;
    const dataOwnerItem = page.getByRole('listitem').filter({ hasText: 'Data Owner' });
    if (await dataOwnerItem.count()) {
      const header = page.getByRole('columnheader', { name: /data owner/i });
      const beforeVisible = await header.isVisible().catch(() => false);
      await dataOwnerItem.click();
      await page.waitForTimeout(500);
      const afterVisible = await header.isVisible().catch(() => false);
      toggleWorked = afterVisible !== beforeVisible;
      if (toggleWorked) {
        await dataOwnerItem.click();
        await page.waitForTimeout(300);
      } else {
        notes.push('Klik listitem Data Owner tidak mengubah kolom tabel.');
      }
    }

    await setting.closeColumnShowHide();

    // AC-04 — clear search, modal tetap normal
    await setting.clearSearch();
    const clearPanel = await setting.openColumnShowHide();
    const afterClear = await setting.measurePanel(clearPanel);
    await setting.screenshotPanel('03-cleared-search-modal.png');
    await setting.closeColumnShowHide();

    const clippedAfterClear = setting.isClipped(afterClear);
    const failClip = clippedAfterSearch || heightDropped;
    const verdict: 'PASS' | 'FAIL' =
      failClip || clippedAfterClear || toggleWorked === false ? 'FAIL' : 'PASS';

    const dump: RunDump = {
      card: 'ETM-15508',
      menu: 'Warehouse Setting',
      route: WAREHOUSE_SETTING_PATH,
      company: 'FAT (112)',
      searchTerm,
      rowCountAll,
      rowCountSearch,
      baseline,
      afterSearch,
      afterClear,
      toggleWorked,
      verdict,
      notes,
    };
    fs.writeFileSync(
      path.join(ETM_15508_RESULTS_DIR, 'measurements.json'),
      JSON.stringify(dump, null, 2),
    );

    expect(
      clippedAfterSearch,
      `AC-02 FAIL: modal terpotong setelah search "${searchTerm}" (1–3 baris). metrics=${JSON.stringify(afterSearch)}`,
    ).toBeFalsy();
    expect(
      heightDropped,
      `AC-02 FAIL: tinggi modal anjlok vs baseline (all=${baseline.height}px, search=${afterSearch.height}px)`,
    ).toBeFalsy();
    expect(
      clippedAfterClear,
      `AC-04 FAIL: modal terpotong setelah clear search. metrics=${JSON.stringify(afterClear)}`,
    ).toBeFalsy();
    if (toggleWorked !== null) {
      expect(toggleWorked, 'AC-05 FAIL: checkbox kolom tidak merespons klik').toBeTruthy();
    }
  });
});
