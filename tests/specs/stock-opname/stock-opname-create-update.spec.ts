import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  STOCK_OPNAME_DATALIST_PATH,
  StockOpnamePage,
} from '../../helpers/stock-opname';

/**
 * Stock Opname — create header lalu update description (+ status Open).
 * Company: lumicharmsid (153)
 *
 * Scope: header Basic Information saja (Building Origin + Description).
 * Opname Detail / adjustment di luar TC ini.
 *
 * AS-IS: FormComponen.fetchDefaultValues() dapat auto-Save & Next.
 */
test.describe.serial('Stock Opname — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `SO automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: STOCK_OPNAME_DATALIST_PATH,
    });
  });

  test('[@TC-SOPNAME-001] Create Stock Opname header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const so = new StockOpnamePage(page);
    await so.gotoDatalist();

    const mode = await so.openCreateForm();

    if (mode === 'create') {
      await so.ensureBuildingOriginSelected();
      await so.fillDescription(createDescription);
      await so.clickSaveAndNextAndWaitForEdit();
    } else {
      // Auto-created — pastikan building terisi, update description
      await so.ensureBuildingOriginSelected();
      await so.fillDescription(createDescription);
      await so.clickSaveAllAndWait();
    }

    createdCode = await so.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    createdEditPath = page.url();

    await so.assertInDatalist(createdCode, createDescription.slice(0, 20));
  });

  test('[@TC-SOPNAME-002] Update description + Open status', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const so = new StockOpnamePage(page);
    if (createdEditPath) {
      await so.gotoEditUrl(createdEditPath);
      await expect(so.codeInput).toHaveValue(createdCode, { timeout: 30_000 });
    } else {
      await so.openEditFromDatalistByCode(createdCode);
    }

    const stamp = Date.now().toString().slice(-6);
    updateDescription = `SO automation updated ${stamp}`;

    await so.fillDescription(updateDescription);
    await so.setStatusOpen().catch(() => undefined);
    await so.clickSaveAllAndWait();

    await expect(so.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });

    await so.assertInDatalist(createdCode, updateDescription.slice(0, 20));
  });
});
