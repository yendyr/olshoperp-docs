import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  COA_DATALIST_PATH,
  ChartOfAccountPage,
} from '../../helpers/chart-of-account';

/**
 * COA (Chart of Account) — VIEW → CREATE → UPDATE → SEARCH.
 * Company: lumicharmsid (153)
 * Description fields: automation playwright
 */
test.describe.serial('COA — CRUD', () => {
  test.describe.configure({ timeout: 300_000 });

  const stamp = Date.now().toString().slice(-6);
  let code = `AT-COA-${stamp}`;
  let name = `Automation COA ${stamp}`;
  let updatedName = `Automation COA UPD ${stamp}`;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: COA_DATALIST_PATH,
    });
  });

  test('[@TC-COA-001] VIEW datalist shell + Create', async ({ page }) => {
    const coa = new ChartOfAccountPage(page);
    await coa.gotoDatalist();
    await coa.assertDatalistShell();
  });

  test('[@TC-COA-002] CREATE Code/Name/Class', async ({ page }) => {
    const coa = new ChartOfAccountPage(page);
    await coa.gotoDatalist();
    await coa.openCreateForm();

    const classLabel = await coa.fillCreateForm({
      code,
      name,
      classLabel: 'Asset',
      description: 'automation playwright',
    });
    expect(classLabel.length).toBeGreaterThan(0);

    await coa.clickSaveAndNextAndWaitForEdit();
    await expect(page).toHaveURL(/\/accounting\/chart-of-account\/edit\/\d+/);
    await expect(coa.codeInput).toHaveValue(code);
  });

  test('[@TC-COA-003] UPDATE Name + Description', async ({ page }) => {
    const coa = new ChartOfAccountPage(page);
    await coa.openEditFromDatalistByCode(code);
    await coa.updateNameAndDescription(updatedName, 'automation playwright');
    await coa.clickSaveAllAndWait();
    await expect(coa.nameInput).toHaveValue(updatedName);
  });

  test('[@TC-COA-004] SEARCH Code di datalist', async ({ page }) => {
    const coa = new ChartOfAccountPage(page);
    await coa.assertInDatalist(code, updatedName);
  });
});
