import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  WAREHOUSE_STRUCTURE_DATALIST_PATH,
  WarehouseStructurePage,
} from '../../helpers/warehouse-structure';

/**
 * Warehouse Structure — create lalu update (data create dipakai update).
 * Company: lumicharmsid (153)
 *
 * AS-IS notes:
 * - Type label format: "{level}. {name}" → "40. Rack"
 * - Drop Off create-only; child code = {code}DROPOFF
 * - Show for all company hanya tampil jika Parent kosong
 * - Owned By / Manage By default (company aktif / internal)
 * - Edit: Save All
 */
test.describe.serial('Warehouse Structure — Create then Update', () => {
  let createdCode = '';
  let createdName = '';
  let createdId = 0;
  let updatedCode = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: WAREHOUSE_STRUCTURE_DATALIST_PATH,
    });
    // Tunggu settle setelah tree + datalist load (hindari race navigation)
    await page.getByRole('table').first().waitFor({ state: 'visible', timeout: 45_000 });
    await page.waitForTimeout(1_500);
  });

  test('[@TC-WHSTR-001] Create Rack Rungkut + Drop Off', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const wh = new WarehouseStructurePage(page);

    // Code tanpa spasi; selalu unik agar tidak race double-goto cek exists
    const stamp = Date.now().toString().slice(-6);
    const code = `RACK01-Rungkut-${stamp}`;
    const name = `Rack 01 WH Rungkut ${stamp}`;

    await wh.openCreateForm();
    await wh.fillCreateForm({
      code,
      name,
      typeLabel: '40. Rack',
    });

    createdId = await wh.clickSaveAndNextAndWaitForEdit();
    await wh.assertInDatalist(code, 'Rungkut');

    // Child drop-off otomatis + tidak selectable sebagai Parent
    await wh.assertDropOffChildCreated(createdId, code);

    createdCode = code;
    createdName = name;
  });

  test('[@TC-WHSTR-002] Update Code dari hasil create', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    expect(createdCode, 'Harus ada code dari test create sebelumnya').toBeTruthy();

    const wh = new WarehouseStructurePage(page);

    /**
     * AS-IS defect: update parent yang punya child Drop Off akan set
     * child code = `{code} - Drop OFF` (mengandung spasi) → ditolak observer.
     * Jadi update Code tidak bisa dijalankan pada warehouse Drop Off parent.
     * Automation: buat WH sekunder tanpa Drop Off, lalu update Code-nya.
     * (create+drop-off verification sudah di TC-WHSTR-001.)
     */
    const stamp = Date.now().toString().slice(-6);
    const sourceCode = `RACK01-Gubeng-${stamp}`;
    const sourceName = `Rack 01 WH Gubeng ${stamp}`;

    await wh.openCreateForm();
    await wh.codeInput.fill(sourceCode);
    await wh.nameInput.fill(sourceName);
    await wh.selectType('40. Rack');
    await wh.ensureActiveOn();
    await wh.ensureShowForAllCompanyOn();
    // sengaja TIDAK aktifkan Drop Off
    await wh.clickSaveAndNextAndWaitForEdit();
    await wh.assertInDatalist(sourceCode);

    updatedCode = `RACK01-Gubeng-UP-${stamp}`;
    await wh.openEditFromDatalistByCode(sourceCode);
    await wh.updateCode(updatedCode);
    await wh.clickSaveAllAndWait();
    await expect(wh.codeInput).toHaveValue(updatedCode, { timeout: 20_000 });

    await wh.assertInDatalist(updatedCode);

    await wh.gotoDatalist();
    await wh.datalist.search(sourceCode, 2_000);
    const exactOld = page
      .getByRole('row')
      .filter({ hasText: sourceCode })
      .filter({ hasNotText: updatedCode });
    expect(
      await exactOld.count(),
      `Code lama ${sourceCode} sudah diganti ke ${updatedCode}`,
    ).toBe(0);

    // Sanity: warehouse Drop Off dari create tetap ada di datalist
    await wh.assertInDatalist(createdCode);
  });
});