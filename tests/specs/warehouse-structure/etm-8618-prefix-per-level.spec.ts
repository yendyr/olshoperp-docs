import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  WAREHOUSE_STRUCTURE_DATALIST_PATH,
  WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN,
  WarehouseStructurePage,
} from '../../helpers/warehouse-structure';

/**
 * ETM-8618 — Prefix Type Child Warehouse Generator per level.
 *
 * Mapping TC → POM:
 * | # | Langkah TC | Method | Halaman |
 * | 1 | Create | openCreateForm | create |
 * | 2 | Header Drop Off OFF | fillCreateHeaderWithoutDropOff | create |
 * | 3 | Isi generator | expandChildWarehouseGenerator + fillGeneratorRow | create |
 * | 4 | Save & Next | clickSaveAndNextCaptureBody / clickSaveAndNextAndWaitForEdit | edit (sukses) / create (error) |
 * | 5 | Cek child | waitForGeneratedChildByPrefix | API select2 |
 * | 6 | Edit existing | openEditFromDatalistByCode + assertGeneratorHiddenOnEdit | edit |
 *
 * Company: lumicharmsid (153)
 */
test.describe.serial('ETM-8618 Prefix Type per Warehouse Level', () => {
  let mixParentCode = '';
  let mixChildCount = 0;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: WAREHOUSE_STRUCTURE_DATALIST_PATH,
    });
    await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 45_000 });
    await page.waitForTimeout(1_000);
  });

  test('[@TC-ETM-8618-01] Prefix Type berbeda per level Numeric + Alphabet + Numeric', async ({
    page,
  }) => {
    test.setTimeout(360_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);
    const code = `WHPX-${stamp}`;
    const name = `WH Prefix Mix ${stamp}`;

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code,
      name,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();

    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'LT',
      amount: '2',
      prefixType: 'Numeric',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(1, {
      levelSearch: 'Rack',
      prefix: 'RK',
      amount: '2',
      prefixType: 'Alphabet',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(2, {
      levelSearch: 'Shelf',
      prefix: 'SH',
      amount: '2',
      prefixType: 'Numeric',
    });

    const saved = await wh.clickSaveAndNextCaptureBody();
    expect(saved.ok, `Save TC-01 ditolak: ${saved.message}`).toBeTruthy();
    await page.waitForURL(WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN, { timeout: 60_000 });

    await wh.waitForGeneratedChildByPrefix('LT', code);
    await wh.waitForGeneratedChildByPrefix('RK', code);
    await wh.waitForGeneratedChildByPrefix('SH', code);

    mixParentCode = code;
    mixChildCount = await wh.countSelect2ByQuery(code);
    expect(mixChildCount, 'Parent + child generator harus > 1').toBeGreaterThan(1);

    await wh.assertInDatalist(code);
  });

  test('[@TC-ETM-8618-02] Prefix Type seragam Numeric tetap bisa dipakai', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);
    const code = `WHPXUNI-${stamp}`;

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code,
      name: `WH Prefix Uniform ${stamp}`,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();
    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'AA',
      amount: '2',
      prefixType: 'Numeric',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(1, {
      levelSearch: 'Rack',
      prefix: 'BB',
      amount: '2',
      prefixType: 'Numeric',
    });

    const saved = await wh.clickSaveAndNextCaptureBody();
    expect(saved.ok, `Save TC-02 ditolak: ${saved.message}`).toBeTruthy();
    await page.waitForURL(WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN, { timeout: 60_000 });
    await wh.waitForGeneratedChildByPrefix('AA', code);
    await wh.waitForGeneratedChildByPrefix('BB', code);
    await wh.assertInDatalist(code);
  });

  test('[@TC-ETM-8618-03] Warehouse existing tidak berubah — generator hanya di create', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const wh = new WarehouseStructurePage(page);
    expect(mixParentCode, 'TC-03 butuh parent dari TC-01').toBeTruthy();

    const beforeCount = await wh.countSelect2ByQuery(mixParentCode);
    await wh.openEditFromDatalistByCode(mixParentCode);
    await wh.assertGeneratorHiddenOnEdit();
    await wh.clickSaveAllAndWait();

    const afterCount = await wh.countSelect2ByQuery(mixParentCode);
    expect(afterCount, 'Jumlah warehouse existing tidak boleh bertambah karena edit').toBe(
      beforeCount,
    );
    await wh.assertInDatalist(mixParentCode);
  });

  test('[@TC-ETM-8618-04] Prefix unique dan alphabet tetap ditolak', async ({ page }) => {
    test.setTimeout(240_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);
    const code = `WHPXVAL-${stamp}`;

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code,
      name: `WH Prefix Validasi ${stamp}`,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();
    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'QADUP',
      amount: '2',
      prefixType: 'Numeric',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(1, {
      levelSearch: 'Rack',
      prefix: 'QADUP',
      amount: '2',
      prefixType: 'Alphabet',
    });

    const dup = await wh.clickSaveAndNextCaptureBody();
    expect(dup.ok, 'Skenario A harus ditolak').toBeFalsy();
    expect(dup.message, 'Pesan unique').toMatch(/prefix must be unique/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);

    await wh.generatorRows.nth(0).locator('[placeholder="Prefix"]').fill('QA12');
    await wh.generatorRows.nth(1).locator('[placeholder="Prefix"]').fill('QABZ');

    const alpha = await wh.clickSaveAndNextCaptureBody();
    expect(alpha.ok, 'Skenario B harus ditolak').toBeFalsy();
    expect(alpha.message, 'Pesan alphabet').toMatch(/prefix must be alphabet/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });
});
