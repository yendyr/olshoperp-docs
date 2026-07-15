import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { WARRANTY_DATALIST_PATH, WarrantyPage } from '../../helpers/warranty';

/**
 * Warranty — create lalu update (data create dipakai update).
 * Company: lumicharmsid (153)
 *
 * Validasi BE: code/name required max 50 unique per company; description max 150.
 */
test.describe.serial('Warranty — Create then Update', () => {
  let createdCode = '';
  let createdName = '';
  let updatedCode = '';
  let updatedName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: WARRANTY_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-warranty] Create new Warranty', async ({ page }) => {
    test.setTimeout(180_000);

    const warranty = new WarrantyPage(page);
    const stamp = Date.now().toString().slice(-6);

    const code = `WRT${stamp}`;
    const name = `3 Month ${stamp}`;

    await warranty.openCreateForm();
    await warranty.fillCreateForm({
      code,
      name,
      description: 'Warranty automation — garansi produk 3 bulan',
    });
    await warranty.clickSaveAndNextAndWaitForEdit();
    await warranty.assertInDatalist(code, name);

    createdCode = code;
    createdName = name;
  });

  test('[@TC-UPDATE-warranty] Update Code + Name dari create', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    expect(createdCode, 'Harus ada code dari test create sebelumnya').toBeTruthy();

    const warranty = new WarrantyPage(page);
    await warranty.openEditFromDatalistByCode(createdCode);

    const stamp = Date.now().toString().slice(-6);
    updatedCode = `WRU${stamp}`;
    updatedName = `6 Month ${stamp}`;

    await warranty.updateBasicFields({
      code: updatedCode,
      name: updatedName,
      description: 'Warranty di-update — garansi diperpanjang 6 bulan',
    });
    await warranty.clickSaveAllAndWait();
    await expect(warranty.codeInput).toHaveValue(updatedCode, { timeout: 15_000 });
    await expect(warranty.nameInput).toHaveValue(updatedName, { timeout: 15_000 });

    await warranty.assertInDatalist(updatedCode, updatedName);

    await warranty.gotoDatalist();
    await warranty.datalist.search(createdCode, 1_500);
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
