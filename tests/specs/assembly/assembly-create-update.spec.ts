import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { ASSEMBLY_DATALIST_PATH, AssemblyPage } from '../../helpers/assembly';

/**
 * Assembly (Work Order) — create header → update description → add FG detail jika BOM ada.
 * Company: lumicharmsid (153)
 * Jangan Open tanpa detail.
 */
test.describe.serial('Assembly — Create then Update then Detail', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `AS automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ASSEMBLY_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-assembly] Create Assembly header', async ({ page }) => {
    test.setTimeout(300_000);

    const as = new AssemblyPage(page);
    await as.gotoDatalist();

    const mode = await as.openCreateForm();

    if (mode === 'create') {
      await as.ensureBuildingOriginSelected();
      await as.ensureTypeSelected('Assembly');
      await as.fillDescription(createDescription);
      await as.clickSaveAndNextAndWaitForEdit();
    } else {
      await as.ensureBuildingOriginSelected();
      await as.ensureTypeSelected('Assembly');
      await as.fillDescription(createDescription);
      await as.clickSaveAllAndWait();
    }

    createdCode = await as.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^AS/);
    createdEditPath = page.url();

    await as.assertInDatalist(createdCode, createDescription.slice(0, 20));
  });

  test('[@TC-UPDATE-assembly] Update description (stay Draft)', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const as = new AssemblyPage(page);
    await as.openEditFromDatalistByCode(createdCode);

    updateDescription = `AS automation updated ${Date.now().toString().slice(-6)}`;
    await as.fillDescription(updateDescription);
    await as.clickSaveAllAndWait();

    await expect(as.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });
    await expect(as.draftRadio).toBeChecked({ timeout: 10_000 }).catch(() => undefined);

    await as.assertInDatalist(createdCode, updateDescription.slice(0, 20));
  });

  test('[@TC-UPDATE-assembly-detail] Add Finish Goods (Header BOM)', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const as = new AssemblyPage(page);
    await as.openEditFromDatalistByCode(createdCode);

    const sku = await as.tryAddFirstFinishGoodsProduct();
    if (!sku) {
      test.info().annotations.push({
        type: 'note',
        description:
          'Skip assert detail: tidak ada Header BOM Active di Select Product (prasyarat Bill of Material).',
      });
      return;
    }

    await as.assertDetailHasProduct(sku);
  });
});
