import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { TAGGING_DATALIST_PATH, TaggingPage } from '../../helpers/tagging';

/**
 * Tagging — create lalu update (data create dipakai update).
 * Company: lumicharmsid (153)
 *
 * TC update title "Update Dimension & Weight Label" diabaikan (copy-paste).
 */
test.describe.serial('Tagging — Create then Update', () => {
  let createdCode = '';
  let createdName = '';
  let updatedCode = '';
  let updatedName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: TAGGING_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-tagging] Create new Tagging', async ({ page }) => {
    test.setTimeout(180_000);

    const tagging = new TaggingPage(page);
    const stamp = Date.now().toString().slice(-6);

    const code = `TG-AT-${stamp}`;
    const name = `Promo Seasonal ${stamp}`;

    await tagging.openCreateForm();
    await tagging.fillCreateForm({
      code,
      name,
      description: 'Tagging automation — grup label produk',
    });
    await tagging.clickSaveAndNextAndWaitForEdit();
    await tagging.assertInDatalist(code, name);

    createdCode = code;
    createdName = name;
  });

  test('[@TC-UPDATE-tagging] Update Code + Name dari create', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    expect(createdCode, 'Harus ada code dari test create sebelumnya').toBeTruthy();

    const tagging = new TaggingPage(page);
    await tagging.openEditFromDatalistByCode(createdCode);

    const stamp = Date.now().toString().slice(-6);
    updatedCode = `TG-UP-${stamp}`;
    updatedName = `Promo Updated ${stamp}`;

    await tagging.updateBasicFields({ code: updatedCode, name: updatedName });
    await tagging.clickSaveAllAndWait();
    await expect(tagging.codeInput).toHaveValue(updatedCode, { timeout: 15_000 });
    await expect(tagging.nameInput).toHaveValue(updatedName, { timeout: 15_000 });

    await tagging.assertInDatalist(updatedCode, updatedName);

    await tagging.gotoDatalist();
    await tagging.datalist.search(createdCode, 1_500);
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
