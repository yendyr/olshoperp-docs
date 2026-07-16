import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { UNIT_DATALIST_PATH, UnitPage } from '../../helpers/unit';

/**
 * Unit (SCM Master) — update unit yang sudah dibuat (BOX-AT-*).
 * Company: lumicharmsid (153)
 */
test.describe('Unit — Update', () => {
  test('[@TC-UNIT-002] Update Code/Name + Show for all company', async ({
    page,
  }) => {
    test.setTimeout(240_000);

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: UNIT_DATALIST_PATH,
    });

    const unit = new UnitPage(page);
    const description = 'Satuan untuk kardus besar isi produk';

    // 1) Temukan BOX-AT-* dari create sebelumnya; jika hilang, create dulu
    let sourceCode = await unit.findCodeInDatalist(/BOX-AT-\d+/i);
    if (!sourceCode) {
      const stamp = Date.now().toString().slice(-6);
      sourceCode = `BOX-AT-${stamp}`;
      await unit.openCreateForm();
      await unit.fillForm({
        code: sourceCode,
        name: `Box Besar ${stamp}`,
        unitClass: 'Pieces',
        conversionRate: '1',
        description,
      });
      await unit.clickSaveAndNextAndWaitForEdit();
      await unit.assertUnitInDatalist(sourceCode);
    }

    // 2) Open show/edit
    await unit.openEditFromDatalistByCode(sourceCode);

    const stamp = Date.now().toString().slice(-6);
    const newCode = `BOX-UP-${stamp}`;
    const newName = `Box Updated ${stamp}`;

    // 3) Update Code + Name, pastikan description, aktifkan Show for all company
    await unit.updateBasicFields({
      code: newCode,
      name: newName,
      description,
    });
    await unit.ensureShowForAllCompanyOn();

    // 4) Save All (UI edit = "Save All"; TC menyebut "Save")
    await unit.clickSaveAllAndWait();
    await expect(unit.codeInput).toHaveValue(newCode, { timeout: 15_000 });

    // 5) Verifikasi datalist data terbaru; code lama tidak lagi jadi primary match
    await unit.assertUnitInDatalist(newCode, newName);

    const oldStillPrimary = await unit.isCodeVisibleInDatalist(sourceCode);
    // Setelah rename, code lama biasanya tidak tampil — boleh tetap ada jika soft-cache search partial
    if (oldStillPrimary && sourceCode !== newCode) {
      // Cari exact: baris yang mengandung sourceCode tapi bukan newCode
      await unit.gotoDatalist();
      await unit.datalist.search(sourceCode, 1_500);
      const exactOld = page
        .getByRole('row')
        .filter({ hasText: sourceCode })
        .filter({ hasNotText: newCode });
      expect(
        await exactOld.count(),
        `Code lama ${sourceCode} tidak boleh masih jadi baris utama setelah update ke ${newCode}`,
      ).toBe(0);
    }
  });
});
