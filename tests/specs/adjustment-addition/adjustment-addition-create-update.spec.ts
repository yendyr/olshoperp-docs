import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ADJUSTMENT_ADDITION_DATALIST_PATH,
  AdjustmentAdditionPage,
} from '../../helpers/adjustment-addition';

/**
 * Stock Addition (Adjustment Addition) — create header lalu update description.
 * Company: lumicharmsid (153)
 *
 * Scope: Basic Information (Location Destination + Description).
 * AS-IS: FormComponen.fetchDefaultValues() dapat auto-Save & Next.
 */
test.describe.serial('Stock Addition — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `AI automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ADJUSTMENT_ADDITION_DATALIST_PATH,
    });
  });

  test('[@TC-ADJADD-001] Create Stock Addition header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const aa = new AdjustmentAdditionPage(page);
    await aa.gotoDatalist();

    const mode = await aa.openCreateForm();

    if (mode === 'create') {
      await aa.ensureLocationDestinationSelected();
      await aa.fillDescription(createDescription);
      await aa.clickSaveAndNextAndWaitForEdit();
    } else {
      await aa.ensureLocationDestinationSelected();
      await aa.fillDescription(createDescription);
      await aa.clickSaveAllAndWait();
    }

    createdCode = await aa.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^AI/);
    createdEditPath = page.url();

    await aa.assertInDatalist(createdCode, createDescription.slice(0, 20));
  });

  test('[@TC-ADJADD-002] Update description + Open status', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const aa = new AdjustmentAdditionPage(page);
    if (createdEditPath) {
      await aa.gotoEditUrl(createdEditPath);
      await expect(aa.codeInput).toHaveValue(createdCode, { timeout: 30_000 });
    } else {
      await aa.openEditFromDatalistByCode(createdCode);
    }

    const stamp = Date.now().toString().slice(-6);
    updateDescription = `AI automation updated ${stamp}`;

    await aa.fillDescription(updateDescription);
    await aa.setStatusOpen().catch(() => undefined);
    await aa.clickSaveAllAndWait();

    await expect(aa.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });

    await aa.assertInDatalist(createdCode, updateDescription.slice(0, 20));
  });

  test('[@TC-ADJADD-003] Add product + In Qty', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const aa = new AdjustmentAdditionPage(page);
    if (createdEditPath) {
      await aa.gotoEditUrl(createdEditPath);
      await expect(aa.codeInput).toHaveValue(createdCode, { timeout: 30_000 });
    } else {
      await aa.openEditFromDatalistByCode(createdCode);
    }

    // Cari LUMI — skip SKU yang sedang dipakai AI open lain (AS-IS lock)
    const sku = await aa.addProductViaSelectProduct('LUMI');
    await aa.assertDetailHasProduct(sku);
    await aa.setInQtyOnDetailRow(sku, 1);
  });
});
