import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { LOCATION_DATALIST_PATH, LocationPage } from '../../helpers/location';

/**
 * Processing Location — create lalu update.
 * Company: lumicharmsid (153)
 * Validasi: code/name required max 50; code unique/company; description max 150.
 */
test.describe.serial('Location — Create then Update', () => {
  let createdCode = '';
  let createdName = '';
  let updatedCode = '';
  let updatedName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: LOCATION_DATALIST_PATH,
    });
  });

  test('[@TC-LOC-001] Create Processing Location', async ({ page }) => {
    test.setTimeout(180_000);

    const loc = new LocationPage(page);
    const stamp = Date.now().toString().slice(-6);
    const code = `LOC${stamp}`;
    const name = `East Side ${stamp}`;

    await loc.openCreateForm();
    await loc.fillCreateForm({
      code,
      name,
      description: 'Location automation — area picking east',
    });
    await loc.clickSaveAndNextAndWaitForEdit();
    await loc.assertInDatalist(code, name);

    createdCode = code;
    createdName = name;
  });

  test('[@TC-LOC-002] Update Code + Name dari create', async ({
    page,
  }) => {
    test.setTimeout(180_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const loc = new LocationPage(page);
    await loc.openEditFromDatalistByCode(createdCode);

    const stamp = Date.now().toString().slice(-6);
    updatedCode = `LOU${stamp}`;
    updatedName = `West Side ${stamp}`;

    await loc.updateBasicFields({
      code: updatedCode,
      name: updatedName,
      description: 'Location di-update — area picking west',
    });
    await loc.clickSaveAllAndWait();

    await expect(loc.codeInput).toHaveValue(updatedCode, { timeout: 15_000 });
    await expect(loc.nameInput).toHaveValue(updatedName, { timeout: 15_000 });
    await loc.assertInDatalist(updatedCode, updatedName);

    await loc.gotoDatalist();
    await loc.datalist.search(createdCode, 1_500);
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
