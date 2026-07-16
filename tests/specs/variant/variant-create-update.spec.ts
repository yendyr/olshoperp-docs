import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { VARIANT_DATALIST_PATH, VariantPage } from '../../helpers/variant';

/**
 * Variant Group — create lalu update (data create dipakai update).
 * Company: lumicharmsid (153)
 *
 * TC update title "Update Dimension & Weight Label" diabaikan (copy-paste).
 */
test.describe.serial('Variant Group — Create then Update', () => {
  let createdCode = '';
  let createdName = '';
  let removedOption = '';
  let keptOptions: string[] = [];
  let updatedCode = '';
  let updatedName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: VARIANT_DATALIST_PATH,
    });
  });

  test('[@TC-VAR-001] Create Variant Group Color + options', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const variant = new VariantPage(page);
    const stamp = Date.now().toString().slice(-6);

    // Name max 14 chars (AS-IS validation)
    const code = `COL${stamp}`;
    const name = `Color-${stamp}`; // 12 chars
    const options = ['Red', 'Blue', 'Green'];

    await variant.openCreateForm();
    await variant.fillCreateForm({
      code,
      name,
      options,
      description: 'Variant group warna (automation)',
    });
    await variant.clickSaveAndNextAndWaitForEdit();
    await variant.assertInDatalist(code, {
      name,
      optionPresent: 'Red',
    });

    createdCode = code;
    createdName = name;
    removedOption = 'Green';
    keptOptions = ['Red', 'Blue'];
  });

  test('[@TC-VAR-002] Update Code/Name + hapus satu option', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    expect(createdCode, 'Harus ada code dari test create sebelumnya').toBeTruthy();

    const variant = new VariantPage(page);
    await variant.openEditFromDatalistByCode(createdCode);

    const stamp = Date.now().toString().slice(-6);
    updatedCode = `CU${stamp}`;
    updatedName = `ClrUp-${stamp}`; // 12 chars ≤ 14

    await variant.updateBasicFields({ code: updatedCode, name: updatedName });
    await variant.removeOptionTag(removedOption);
    await variant.clickSaveAllAndWait();

    await expect(variant.codeInput).toHaveValue(updatedCode, { timeout: 15_000 });
    await expect(variant.nameInput).toHaveValue(updatedName, { timeout: 15_000 });
    await expect(variant.optionTags.filter({ hasText: removedOption })).toHaveCount(0);
    for (const opt of keptOptions) {
      await expect(variant.optionTags.filter({ hasText: opt }).first()).toBeVisible();
    }

    await variant.assertInDatalist(updatedCode, {
      name: updatedName,
      optionPresent: keptOptions[0],
      optionAbsent: removedOption,
    });

    await variant.gotoDatalist();
    await variant.datalist.search(createdCode, 1_500);
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
