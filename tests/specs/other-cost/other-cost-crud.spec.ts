import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  OTHER_COST_DATALIST_PATH,
  OtherCostPage,
} from '../../helpers/other-cost';

/**
 * Other Cost — VIEW → CREATE → UPDATE → SEARCH.
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Other Cost — CRUD', () => {
  test.describe.configure({ timeout: 300_000 });

  const stamp = Date.now().toString().slice(-6);
  const code = `AT-OC-${stamp}`;
  let name = `Automation Other Cost ${stamp}`;
  const updatedName = `Automation OC UPD ${stamp}`;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: OTHER_COST_DATALIST_PATH,
    });
  });

  test('[@TC-OC-001] VIEW datalist shell + Create', async ({ page }) => {
    const oc = new OtherCostPage(page);
    await oc.gotoDatalist();
    await oc.assertDatalistShell();
  });

  test('[@TC-OC-002] CREATE Code/Name + Expense COA', async ({ page }) => {
    const oc = new OtherCostPage(page);
    await oc.gotoDatalist();
    await oc.openCreateForm();
    await oc.fillCreateForm({
      code,
      name,
      description: 'automation playwright',
    });
    await oc.clickSaveAndNextAndWaitForEdit(code);
    await expect(page).toHaveURL(/\/omni\/other-cost\/edit\/\d+/);
    await expect(oc.codeInput).toHaveValue(code);
  });

  test('[@TC-OC-003] UPDATE Name + Description', async ({ page }) => {
    const oc = new OtherCostPage(page);
    await oc.openEditFromDatalistByCode(code);
    name = updatedName;
    await oc.updateNameAndDescription(updatedName, 'automation playwright');
    await oc.clickSaveAllAndWait();
    await expect(oc.nameInput).toHaveValue(updatedName);
  });

  test('[@TC-OC-004] SEARCH Code di datalist', async ({ page }) => {
    const oc = new OtherCostPage(page);
    await oc.assertInDatalist(code, updatedName);
  });
});
