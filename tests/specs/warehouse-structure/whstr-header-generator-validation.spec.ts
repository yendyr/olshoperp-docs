import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  WAREHOUSE_STRUCTURE_DATALIST_PATH,
  WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN,
  WarehouseStructurePage,
} from '../../helpers/warehouse-structure';

/**
 * Validasi Basic Information + Child Warehouse Generator.
 * Sumber TC: qa-docs/supplychain-warehouse-structure/WHSTR-validation/test-cases/ * Company: lumicharmsid (153)
 */
test.describe('WHSTR — Validasi Header & Generator', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: WAREHOUSE_STRUCTURE_DATALIST_PATH,
    });
    await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 45_000 });
    await page.waitForTimeout(800);
  });

  test('[@TC-WHSTR-VAL-01] Code invalid — max 50 dan tidak boleh spasi', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);

    await wh.openCreateForm();
    await wh.fillCreateHeaderCodeName({
      code: `WHLONG${'X'.repeat(50)}`,
      name: `WH Val Code ${stamp}`,
      typeLabel: '19. Building',
    });

    const tooLong = await wh.clickSaveAndNextCaptureBody();
    expect(tooLong.ok, `Kondisi A harus gagal: ${tooLong.message}`).toBeFalsy();
    expect(
      tooLong.message,
      'Kondisi A — error terkait Code max 50',
    ).toMatch(/code|50|greater than|may not be greater|max/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);

    await wh.codeInput.fill(`WH SP ${stamp}`);
    const withSpace = await wh.clickSaveAndNextCaptureBody();
    expect(withSpace.ok, `Kondisi B harus gagal: ${withSpace.message}`).toBeFalsy();
    expect(withSpace.message).toMatch(/code cannot contain spaces/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });

  test('[@TC-WHSTR-VAL-02] Name invalid — lebih dari 150 karakter', async ({ page }) => {
    test.setTimeout(180_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);

    await wh.openCreateForm();
    await wh.fillCreateHeaderCodeName({
      code: `WHNM${stamp}`,
      name: `N${'a'.repeat(150)}`,
      typeLabel: '19. Building',
    });

    const saved = await wh.clickSaveAndNextCaptureBody();
    expect(saved.ok, `Save harus gagal: ${saved.message}`).toBeFalsy();
    expect(saved.message, 'Error terkait Name max 150').toMatch(
      /name|150|greater than|may not be greater|max/i,
    );
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });

  test('[@TC-WHSTR-VAL-03] Type kosong — required', async ({ page }) => {
    test.setTimeout(180_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);

    await wh.openCreateForm();
    await wh.fillCreateHeaderCodeName({
      code: `WHTY${stamp}`,
      name: `WH Val Type ${stamp}`,
    });

    const typeLabel = await wh.readTypeSelectedLabel();
    expect(typeLabel, 'Type harus kosong').toMatch(/choose type|^$/i);

    const saved = await wh.clickSaveAndNextCaptureBody();
    expect(saved.ok, `Save harus gagal: ${saved.message}`).toBeFalsy();
    expect(saved.message, 'Error terkait Type').toMatch(
      /warehouse.space.type|type|required|must be filled|field is required/i,
    );
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });

  test('[@TC-WHSTR-VAL-04] Prefix duplicate exact di level berbeda', async ({ page }) => {
    test.setTimeout(240_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code: `WHDUP${stamp}`,
      name: `WH Dup Exact ${stamp}`,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();
    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'SAME',
      amount: '2',
      prefixType: 'Numeric',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(1, {
      levelSearch: 'Rack',
      prefix: 'SAME',
      amount: '2',
      prefixType: 'Alphabet',
    });

    const saved = await wh.clickSaveAndNextCaptureBody();
    expect(saved.ok, 'Duplicate prefix harus ditolak').toBeFalsy();
    expect(saved.message).toMatch(/prefix must be unique/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });

  test('[@TC-WHSTR-VAL-05] Prefix duplicate case-insensitive', async ({ page }) => {
    test.setTimeout(240_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code: `WHCSI${stamp}`,
      name: `WH Dup Case ${stamp}`,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();
    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'ABCD',
      amount: '2',
      prefixType: 'Numeric',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(1, {
      levelSearch: 'Rack',
      prefix: 'abcd',
      amount: '2',
      prefixType: 'Alphabet',
    });

    const saved = await wh.clickSaveAndNextCaptureBody();
    // Expected QA: unique case-insensitive. AS-IS BE: array_unique case-sensitive → save bisa sukses.
    expect(
      saved.ok,
      `Expected QA: save ditolak (unique case-insensitive). Actual: ok=${saved.ok} message="${saved.message}"`,
    ).toBeFalsy();
    expect(saved.message).toMatch(/prefix must be unique/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });

  test('[@TC-WHSTR-VAL-06] Prefix non-alphabet — huruf+angka lalu huruf+simbol', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code: `WHALP${stamp}`,
      name: `WH Non Alpha ${stamp}`,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();
    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'AB12',
      amount: '2',
      prefixType: 'Numeric',
    });

    const mixedNum = await wh.clickSaveAndNextCaptureBody();
    expect(mixedNum.ok, `Kondisi 1 harus gagal: ${mixedNum.message}`).toBeFalsy();
    expect(mixedNum.message).toMatch(/prefix must be alphabet/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);

    await wh.setGeneratorPrefix(0, 'AB@#');
    const mixedSym = await wh.clickSaveAndNextCaptureBody();
    expect(mixedSym.ok, `Kondisi 2 harus gagal: ${mixedSym.message}`).toBeFalsy();
    expect(mixedSym.message).toMatch(/prefix must be alphabet/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });

  test('[@TC-WHSTR-VAL-07] Prefix Type beda antar level — success', async ({ page }) => {
    test.setTimeout(300_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);
    const code = `WHMIX${stamp}`;

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code,
      name: `WH Mix Type ${stamp}`,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();
    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'MX',
      amount: '2',
      prefixType: 'Numeric',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(1, {
      levelSearch: 'Rack',
      prefix: 'MY',
      amount: '2',
      prefixType: 'Alphabet',
    });

    const saved = await wh.clickSaveAndNextCaptureBody();
    expect(saved.ok, `Save harus sukses: ${saved.message}`).toBeTruthy();
    await page.waitForURL(WAREHOUSE_STRUCTURE_EDIT_PATH_PATTERN, { timeout: 60_000 });
    await wh.waitForGeneratedChildByPrefix('MX', code);
    await wh.waitForGeneratedChildByPrefix('MY', code);
    await wh.assertInDatalist(code);
  });

  test('[@TC-WHSTR-VAL-08] Dua baris Numeric — satu prefix invalid', async ({ page }) => {
    test.setTimeout(240_000);
    const wh = new WarehouseStructurePage(page);
    const stamp = Date.now().toString().slice(-6);

    await wh.openCreateForm();
    await wh.fillCreateHeaderWithoutDropOff({
      code: `WHONE${stamp}`,
      name: `WH One Invalid ${stamp}`,
      typeLabel: '19. Building',
    });
    await wh.expandChildWarehouseGenerator();
    await wh.fillGeneratorRow(0, {
      levelSearch: 'Aisle',
      prefix: 'OKPRE',
      amount: '2',
      prefixType: 'Numeric',
    });
    await wh.addGeneratorRow();
    await wh.fillGeneratorRow(1, {
      levelSearch: 'Rack',
      prefix: 'BAD1',
      amount: '2',
      prefixType: 'Numeric',
    });

    const saved = await wh.clickSaveAndNextCaptureBody();
    expect(saved.ok, `Save harus gagal: ${saved.message}`).toBeFalsy();
    expect(saved.message).toMatch(/prefix must be alphabet/i);
    await expect(page).toHaveURL(/\/warehouse-structure\/create/);
  });
});