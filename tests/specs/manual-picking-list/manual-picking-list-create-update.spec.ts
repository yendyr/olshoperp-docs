import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  MANUAL_PICKING_LIST_DATALIST_PATH,
  ManualPickingListPage,
} from '../../helpers/manual-picking-list';

/**
 * Manual Picking List — create → update → add Available Product.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Manual Picking List — Create then Update then Detail', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `MPL automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MANUAL_PICKING_LIST_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-manual-picking-list] Create Manual PL header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const mpl = new ManualPickingListPage(page);
    await mpl.gotoDatalist();

    const mode = await mpl.openCreateForm();

    if (mode === 'create') {
      await mpl.ensureBuildingOriginSelected();
      await mpl.fillDescription(createDescription);
      await mpl.clickSaveAndNextAndWaitForEdit();
    } else {
      await mpl.ensureBuildingOriginSelected();
      await mpl.fillDescription(createDescription);
      await mpl.clickSaveAllAndWait();
    }

    createdCode = await mpl.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^PL/);
    createdEditPath = page.url();

    await mpl.assertInDatalist(createdCode, createDescription.slice(0, 20));
  });

  test('[@TC-UPDATE-manual-picking-list] Update description + Open', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const mpl = new ManualPickingListPage(page);
    if (createdEditPath) {
      await mpl.gotoEditUrl(createdEditPath);
      await expect(mpl.codeInput).toHaveValue(createdCode, { timeout: 30_000 });
    } else {
      await mpl.openEditFromDatalistByCode(createdCode);
    }

    updateDescription = `MPL automation updated ${Date.now().toString().slice(-6)}`;
    await mpl.fillDescription(updateDescription);
    await mpl.clickSaveAllAndWait();
    await page.waitForTimeout(3_500);
    await mpl.setStatusOpen().catch(() => undefined);

    await expect(mpl.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });
    await mpl.assertInDatalist(createdCode, updateDescription.slice(0, 20));
  });

  test('[@TC-UPDATE-manual-picking-list-detail] Add Available Product + Qty', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const mpl = new ManualPickingListPage(page);
    if (createdEditPath) {
      await mpl.gotoEditUrl(createdEditPath);
      await expect(mpl.codeInput).toHaveValue(createdCode, { timeout: 45_000 });
    } else {
      await mpl.openEditFromDatalistByCode(createdCode);
    }

    let sku = '';
    try {
      sku = await mpl.useFirstAvailableProductWithQty(1);
    } catch {
      sku = await mpl.selectFirstProductViaSelectProduct();
    }

    await mpl.assertDetailHasProduct(sku);
  });
});
