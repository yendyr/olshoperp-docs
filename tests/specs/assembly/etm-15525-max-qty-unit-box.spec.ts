import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { ASSEMBLY_DATALIST_PATH, AssemblyPage } from '../../helpers/assembly';

/**
 * ETM-15525 — Max Assembly Qty & QTY vs alternative unit BOX
 *
 * Mapping TC → POM:
 * | # | Langkah TC | Method | Halaman |
 * | 1 | Create + Select ASS-CHARMBUN | openCreateForm / addFinishGoodsBySku | edit |
 * | 2 | Catat Max (PCS) | readMaxAssemblyQty | edit |
 * | 3 | Ganti UNIT BOX | setUnitOnDetailRow | edit |
 * | 4 | Catat Max / QTY | readMaxAssemblyQty / readQtyFromDetailRow | edit |
 * | 5 | QTY oversized + Open | setQtyOnDetailRow + trySetOpen | edit |
 *
 * Company: DEV-STG (13)
 * Data: ASS-R, COMP-R1/COMP-R2 @ 500 PCS, BOX=10 PCS
 *
 * TC docs: qa-docs/supplychain-assembly/ETM-15525/test-cases/ */
const FG_SKU = 'ASS-R';
const COMPANY = 'DEV-STG';

test.describe.serial('ETM-15525 Assembly Max Qty / Unit BOX', () => {
  let assemblyCode = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: ASSEMBLY_DATALIST_PATH,
    });
  });

  test('[@TC-ETM-15525-01] Max Assembly Qty terhitung ulang PCS → BOX', async ({
    page,
  }) => {
    test.setTimeout(360_000);
    const as = new AssemblyPage(page);

    await as.gotoDatalist();
    const mode = await as.openCreateForm();
    await as.ensureBuildingOriginSelected();
    await as.ensureTypeSelected('Assembly');
    await as.fillDescription(`ETM-15525 TC01 ${Date.now().toString().slice(-6)}`);

    if (mode === 'create') {
      await as.clickSaveAndNextAndWaitForEdit();
    } else {
      await as.clickSaveAllAndWait();
    }

    assemblyCode = await as.readGeneratedCode();
    expect(assemblyCode.toUpperCase()).toMatch(/^AS/);

    const added = await as.addFinishGoodsBySku(FG_SKU);
    expect(added, `SKU ${FG_SKU} harus tersedia di Select Product (DEV-STG)`).toBeTruthy();

    const maxPcs = await as.readMaxAssemblyQty(FG_SKU);
    expect(maxPcs, 'Max Assembly Qty (PCS) terbaca').not.toBeNull();
    expect(
      maxPcs!,
      `Max PCS diharapkan ≈500 (stok komponen), actual=${maxPcs}`,
    ).toBeGreaterThanOrEqual(400);
    expect(maxPcs!).toBeLessThanOrEqual(600);

    // Inline UNIT di baris ASS-R — label UI = "Box" (bukan string "BOX")
    const unitBefore = await as.readUnitLabelFromDetailRow(FG_SKU);
    expect(unitBefore, 'UNIT awal harus Pieces/PCS').toMatch(/piece|pcs/i);

    await as.setUnitOnDetailRow('Box', FG_SKU);
    const unitAfter = await as.readUnitLabelFromDetailRow(FG_SKU);
    expect(unitAfter, 'UNIT setelah inline harus Box').toMatch(/box/i);

    const maxBox = await as.readMaxAssemblyQty(FG_SKU);
    expect(maxBox, 'Max Assembly Qty (BOX) terbaca').not.toBeNull();
    expect(
      maxBox!,
      `Max BOX harus ≈50 (bukan tetap ${maxPcs}), actual=${maxBox}`,
    ).toBeGreaterThanOrEqual(40);
    expect(maxBox!).toBeLessThanOrEqual(60);
    expect(
      maxBox!,
      'Max BOX tidak boleh sama dengan Max PCS (bug tidak terhitung ulang)',
    ).not.toBe(maxPcs!);
  });

  test('[@TC-ETM-15525-02] Field QTY ikut terkonversi saat unit → BOX', async ({
    page,
  }) => {
    test.setTimeout(360_000);
    expect(assemblyCode, 'Butuh Assembly dari TC-01').toBeTruthy();

    const as = new AssemblyPage(page);
    await as.openEditFromDatalistByCode(assemblyCode);
    await as.expandAssemblyDetail();

    // Kembali ke Pieces dulu bila masih Box dari TC-01
    const unitNow = await as.readUnitLabelFromDetailRow(FG_SKU);
    if (!/piece|pcs/i.test(unitNow)) {
      await as.setUnitOnDetailRow('Pieces', FG_SKU);
    }
    await page.waitForTimeout(800);

    const maxPcs = await as.readMaxAssemblyQty(FG_SKU);
    expect(maxPcs).not.toBeNull();
    await as.setQtyOnDetailRow(maxPcs!, FG_SKU);

    const qtyPcs = await as.readQtyFromDetailRow(FG_SKU);
    expect(qtyPcs, 'QTY (PCS) terbaca').not.toBeNull();
    expect(qtyPcs!).toBeGreaterThan(0);

    await as.setUnitOnDetailRow('Box', FG_SKU);
    await page.waitForTimeout(1_000);

    const qtyBox = await as.readQtyFromDetailRow(FG_SKU);
    expect(qtyBox, 'QTY (BOX) terbaca setelah ganti unit').not.toBeNull();

    const expectedBox = Math.floor(qtyPcs! / 10);
    expect(
      qtyBox!,
      `AC REOPEN: QTY harus terkonversi PCS→BOX (≈${expectedBox}), bukan tetap ${qtyPcs}. actual=${qtyBox}`,
    ).toBeLessThanOrEqual(expectedBox + 1);
    expect(qtyBox!).toBeGreaterThanOrEqual(Math.max(1, expectedBox - 1));
    expect(
      qtyBox!,
      'QTY BOX tidak boleh sama dengan QTY PCS (belum terkonversi)',
    ).not.toBe(qtyPcs!);
  });

  test('[@TC-ETM-15525-03] Open ditolak jika QTY BOX melebihi stok komponen', async ({
    page,
  }) => {
    test.setTimeout(360_000);
    expect(assemblyCode, 'Butuh Assembly dari TC-01').toBeTruthy();

    const as = new AssemblyPage(page);
    await as.openEditFromDatalistByCode(assemblyCode);
    await as.expandAssemblyDetail();

    await as.setUnitOnDetailRow('Box', FG_SKU);
    // Oversize: 500 BOX >> kapasitas ≈50
    await as.setQtyOnDetailRow(500, FG_SKU);
    await as.clickSaveAllAndWait().catch(() => undefined);

    const result = await as.trySetOpen();

    expect(
      result.ok,
      `Open harus ditolak untuk QTY 500 BOX. message=${result.message}`,
    ).toBeFalsy();
    expect(
      result.draftChecked || /stock|stok|bom|tidak|insufficient|enough|fail|error/i.test(result.message),
      `Harus Draft atau pesan stok. draft=${result.draftChecked} msg=${result.message}`,
    ).toBeTruthy();
    await expect(as.draftRadio).toBeChecked({ timeout: 15_000 });
  });
});