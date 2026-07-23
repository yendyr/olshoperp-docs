import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  OTHER_DISCOUNT_DATALIST_PATH,
  OtherDiscountPage,
} from '../../helpers/other-discount';

/**
 * Other Discount — VIEW → CREATE → UPDATE → SEARCH.
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Other Discount — CRUD', () => {
  test.describe.configure({ timeout: 300_000 });

  const stamp = Date.now().toString().slice(-6);
  const code = `AT-OD-${stamp}`;
  let name = `Automation Other Discount ${stamp}`;
  const updatedName = `Automation OD UPD ${stamp}`;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: OTHER_DISCOUNT_DATALIST_PATH,
    });
  });

  test('[@TC-OD-001] VIEW datalist shell + Create', async ({ page }) => {
    const od = new OtherDiscountPage(page);
    await od.gotoDatalist();
    await od.assertDatalistShell();
  });

  test('[@TC-OD-002] CREATE Code/Name + COA (All Stores)', async ({
    page,
  }) => {
    const od = new OtherDiscountPage(page);
    await od.gotoDatalist();
    await od.openCreateForm();
    await od.fillCreateForm({
      code,
      name,
      description: 'automation playwright',
    });
    await od.clickSaveAndNextAndWaitForEdit(code);
    await expect(page).toHaveURL(/\/omni\/other-discount\/edit\/\d+/);
    await expect(od.codeInput).toHaveValue(code);
  });

  test('[@TC-OD-003] UPDATE Name + Description', async ({ page }) => {
    const od = new OtherDiscountPage(page);
    await od.openEditFromDatalistByCode(code);
    name = updatedName;
    await od.updateNameAndDescription(updatedName, 'automation playwright');
    await od.clickSaveAllAndWait();
    await expect(od.nameInput).toHaveValue(updatedName);
  });

  test('[@TC-OD-004] SEARCH Code di datalist', async ({ page }) => {
    const od = new OtherDiscountPage(page);
    await od.assertInDatalist(code, updatedName);
  });
});
