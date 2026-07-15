import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ITEM_CATEGORY_DATALIST_PATH,
  ItemCategoryPage,
} from '../../helpers/item-category';

/**
 * Item Category — create lalu update (data create dipakai update).
 * Company: lumicharmsid (153)
 *
 * Catatan AS-IS UI:
 * - Tidak ada dropdown "Unit Class" (copy-paste dari Unit TC) → diabaikan.
 * - Create button = Save & Next (TC: Save All).
 */
test.describe.serial('Item Category — Create then Update', () => {
  /** Shared state create → update */
  let createdCode = '';
  let createdName = '';
  let updatedCode = '';
  let updatedName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ITEM_CATEGORY_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-item-category] Create Item Category CAT029 / Baterai AAA', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const ic = new ItemCategoryPage(page);

    let code = 'CAT029';
    let name = 'Baterai AAA';

    if (await ic.isCodeVisibleInDatalist(code)) {
      const stamp = Date.now().toString().slice(-6);
      code = `CAT029-AT-${stamp}`;
      name = `Baterai AAA ${stamp}`;
    }

    await ic.openCreateForm();
    await ic.fillCreateForm({ code, name });
    await ic.clickSaveAndNextAndWaitForEdit();
    await ic.assertInDatalist(code, name);

    createdCode = code;
    createdName = name;
  });

  test('[@TC-UPDATE-item-category] Update Item Category dari hasil create', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    expect(createdCode, 'Harus ada code dari test create sebelumnya').toBeTruthy();

    const ic = new ItemCategoryPage(page);
    await ic.openEditFromDatalistByCode(createdCode);

    const stamp = Date.now().toString().slice(-6);
    updatedCode = `CAT029-UP-${stamp}`;
    updatedName = `BATERAI AAA UPD ${stamp}`;

    await ic.updateBasicFields({ code: updatedCode, name: updatedName });
    await ic.clickSaveAllAndWait();
    await expect(ic.codeInput).toHaveValue(updatedCode, { timeout: 15_000 });

    await ic.assertInDatalist(updatedCode, updatedName);

    // Code lama tidak boleh masih jadi baris exact
    await ic.gotoDatalist();
    await ic.datalist.search(createdCode, 1_500);
    const exactOld = page
      .getByRole('row')
      .filter({ hasText: createdCode })
      .filter({ hasNotText: updatedCode });
    expect(await exactOld.count(), `Code lama ${createdCode} sudah diganti`).toBe(0);
  });
});
