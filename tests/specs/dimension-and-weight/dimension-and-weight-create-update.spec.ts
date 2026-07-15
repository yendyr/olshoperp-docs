import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  DIMENSION_WEIGHT_DATALIST_PATH,
  DimensionAndWeightPage,
} from '../../helpers/dimension-and-weight';

/**
 * Dimension & Weight Label — create lalu update (data create dipakai update).
 * Company: lumicharmsid (153)
 *
 * TC draft update menyebut "Warehouse Level" — diabaikan (copy-paste);
 * subject = Dimension & Weight Label.
 */
test.describe.serial('Dimension & Weight Label — Create then Update', () => {
  let createdCode = '';
  let createdName = '';
  let updatedCode = '';
  let updatedName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: DIMENSION_WEIGHT_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-dimension-weight-label] Create DW label', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const dw = new DimensionAndWeightPage(page);

    const stamp = Date.now().toString().slice(-6);
    const code = `DW-AT-${stamp}`;
    const name = `Parcel Standard ${stamp}`;

    await dw.openCreateForm();
    await dw.fillCreateForm({
      code,
      name,
      description: 'Label dimensi & berat paket standar (automation)',
    });
    await dw.clickSaveAndNextAndWaitForEdit();
    await dw.assertInDatalist(code, name);

    createdCode = code;
    createdName = name;
  });

  test('[@TC-UPDATE-dimension-weight-label] Update Code + Name dari create', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    expect(createdCode, 'Harus ada code dari test create sebelumnya').toBeTruthy();

    const dw = new DimensionAndWeightPage(page);
    await dw.openEditFromDatalistByCode(createdCode);

    const stamp = Date.now().toString().slice(-6);
    updatedCode = `DW-UP-${stamp}`;
    updatedName = `Parcel Updated ${stamp}`;

    await dw.updateBasicFields({ code: updatedCode, name: updatedName });
    await dw.clickSaveAllAndWait();
    await expect(dw.codeInput).toHaveValue(updatedCode, { timeout: 15_000 });
    await expect(dw.nameInput).toHaveValue(updatedName, { timeout: 15_000 });

    await dw.assertInDatalist(updatedCode, updatedName);

    await dw.gotoDatalist();
    await dw.datalist.search(createdCode, 1_500);
    const exactOld = page
      .getByRole('row')
      .filter({ hasText: createdCode })
      .filter({ hasNotText: updatedCode });
    expect(
      await exactOld.count(),
      `Code lama ${createdCode} sudah diganti ke ${updatedCode}`,
    ).toBe(0);
  });
});
