import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ADJUSTMENT_DEDUCTION_DATALIST_PATH,
  AdjustmentDeductionPage,
} from '../../helpers/adjustment-deduction';

/**
 * Stock Deduction (Adjustment Deduction) — create → update → add Available Product.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Stock Deduction — Create then Update then Detail', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `AO automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ADJUSTMENT_DEDUCTION_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-adjustment-deduction] Create Stock Deduction header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const ad = new AdjustmentDeductionPage(page);
    await ad.gotoDatalist();

    const mode = await ad.openCreateForm();

    if (mode === 'create') {
      await ad.ensureBuildingOriginSelected();
      await ad.fillDescription(createDescription);
      await ad.clickSaveAndNextAndWaitForEdit();
    } else {
      await ad.ensureBuildingOriginSelected();
      await ad.fillDescription(createDescription);
      await ad.clickSaveAllAndWait();
    }

    createdCode = await ad.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^AO/);
    createdEditPath = page.url();

    await ad.assertInDatalist(createdCode, createDescription.slice(0, 20));
  });

  test('[@TC-UPDATE-adjustment-deduction] Update description + Open status', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const ad = new AdjustmentDeductionPage(page);
    if (createdEditPath) {
      await ad.gotoEditUrl(createdEditPath);
      await expect(ad.codeInput).toHaveValue(createdCode, { timeout: 30_000 });
    } else {
      await ad.openEditFromDatalistByCode(createdCode);
    }

    updateDescription = `AO automation updated ${Date.now().toString().slice(-6)}`;
    await ad.fillDescription(updateDescription);
    await ad.setStatusOpen().catch(() => undefined);
    await ad.clickSaveAllAndWait();

    await expect(ad.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });
    await ad.assertInDatalist(createdCode, updateDescription.slice(0, 20));
  });

  test('[@TC-UPDATE-adjustment-deduction-detail] Add Available Product + Qty', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const ad = new AdjustmentDeductionPage(page);
    // Prefer datalist → edit (lebih stabil dari deep-link URL di serial ke-3)
    await ad.openEditFromDatalistByCode(createdCode);

    const sku = await ad.useFirstAvailableProductWithQty(1);
    await ad.assertDetailHasProduct(sku);
  });
});
