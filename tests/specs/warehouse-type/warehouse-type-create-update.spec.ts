import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  WAREHOUSE_TYPE_DATALIST_PATH,
  WarehouseTypePage,
} from '../../helpers/warehouse-type';

/**
 * Warehouse Level (warehouse-type) — create lalu update (data create dipakai update).
 * Company: lumicharmsid (153)
 *
 * TC notes AS-IS:
 * - Nama: lokasi Surabaya (Rungkut → update Gubeng)
 * - Level create prefer 88 (unique); update prefer 2 (fallback jika sudah dipakai)
 * - Create Save & Next; edit Save All (TC update tulis Save & Next)
 */
test.describe.serial('Warehouse Level — Create then Update', () => {
  let createdName = '';
  let createdLevel = '';
  let updatedName = '';
  let updatedLevel = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: WAREHOUSE_TYPE_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-warehouse-level] Create Warehouse Level Rungkut / Level 88', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const wh = new WarehouseTypePage(page);

    let name = 'Rungkut';
    if (await wh.isNameVisibleInDatalist(name)) {
      const stamp = Date.now().toString().slice(-6);
      name = `Rungkut AT-${stamp}`;
    }

    const level = await wh.resolveAvailableLevel('88');
    const description =
      'Hierarki gudang — area operasional logistik Surabaya (Rungkut)';

    await wh.openCreateForm();
    await wh.fillCreateForm({ name, level, description });
    await wh.clickSaveAndNextAndWaitForEdit();

    // Pastikan Show in Reports tetap ON di halaman edit
    await expect(wh.showInReportsSwitch).toBeChecked({ timeout: 15_000 });
    await expect(wh.activeSwitch).toBeChecked({ timeout: 10_000 });

    await wh.assertInDatalist(name, level);

    createdName = name;
    createdLevel = level;
  });

  test('[@TC-UPDATE-warehouse-level] Update Name + Level dari hasil create', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    expect(createdName, 'Harus ada name dari test create sebelumnya').toBeTruthy();

    const wh = new WarehouseTypePage(page);

    const stamp = Date.now().toString().slice(-6);
    updatedName = `Gubeng UP-${stamp}`;

    // TC steps: Level menjadi "2"; jika bentrok unique → fallback (cek sebelum buka edit)
    let levelCandidate = '2';
    if (levelCandidate === createdLevel) {
      // tetap 2 kalau create kebetulan juga 2 (jarang)
    } else if (await wh.isLevelVisibleInDatalist(levelCandidate)) {
      levelCandidate = await wh.resolveAvailableLevel('882');
    }
    updatedLevel = levelCandidate;

    await wh.openEditFromDatalistByName(createdName);
    await wh.updateBasicFields({
      name: updatedName,
      level: updatedLevel,
      description:
        'Hierarki gudang — area operasional logistik Surabaya (Gubeng, updated)',
    });

    // AS-IS edit button = Save All (bukan Save & Next)
    await wh.clickSaveAllAndWait();
    await expect(wh.nameInput).toHaveValue(updatedName, { timeout: 15_000 });
    await expect(wh.levelInput).toHaveValue(updatedLevel, { timeout: 15_000 });

    await wh.assertInDatalist(updatedName, updatedLevel);

    // Name lama tidak boleh jadi baris exact utama
    await wh.gotoDatalist();
    await wh.datalist.search(createdName, 1_500);
    const exactOld = page
      .getByRole('row')
      .filter({ hasText: createdName })
      .filter({ hasNotText: updatedName });
    expect(
      await exactOld.count(),
      `Name lama ${createdName} sudah diganti ke ${updatedName}`,
    ).toBe(0);
  });
});
