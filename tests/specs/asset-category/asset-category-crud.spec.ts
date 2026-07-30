import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ASC_DATALIST_PATH,
  AssetCategoryPage,
} from '../../helpers/asset-category';

/**
 * Asset Category — VIEW → CREATE → UPDATE → SEARCH → DELETE → AUDIT.
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Asset Category — CRUD', () => {
  test.describe.configure({ timeout: 300_000 });

  const stamp = Date.now().toString().slice(-6);
  const code = `AT-ASC-${stamp}`;
  const auditCode = `AT-ASC-AUD-${stamp}`;
  let name = `Automation Asset Cat ${stamp}`;
  const updatedName = `Automation Asset Cat UPD ${stamp}`;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ASC_DATALIST_PATH,
    });
  });

  test('[@TC-ASC-001] VIEW datalist shell + Create', async ({ page }) => {
    const asc = new AssetCategoryPage(page);
    await asc.gotoDatalist();
    await asc.assertDatalistShell();
  });

  test('[@TC-ASC-002] CREATE Code/Name + depreciation Straight Line', async ({
    page,
  }) => {
    const asc = new AssetCategoryPage(page);
    await asc.gotoDatalist();
    await asc.openCreateForm();
    await asc.fillCreateForm({
      code,
      name,
      description: 'automation playwright',
      depreciationMethodLabel: 'Straight Line',
      frequency: 1,
      totalDepreciation: 12,
      salvagePercent: 10,
      postingDate: 1,
    });
    await asc.clickSaveAllAndWaitForEdit();
    await expect(page).toHaveURL(/\/accounting\/asset-category\/edit\/\d+/);
    await expect(asc.codeInput).toHaveValue(code);
    await expect(asc.frequencyInput).toHaveValue('1');
    await expect(asc.totalDepreciationInput).toHaveValue('12');
  });

  test('[@TC-ASC-003] UPDATE Name + Written Down Value + Salvage', async ({
    page,
  }) => {
    const asc = new AssetCategoryPage(page);
    await asc.openEditFromDatalistByCode(code);
    name = updatedName;
    await asc.updateNameMethodSalvage({
      name: updatedName,
      depreciationMethodLabel: 'Written Down Value',
      salvagePercent: 15,
    });
    await asc.clickSaveAllAndWait();
    await expect(asc.nameInput).toHaveValue(updatedName);
    await expect(asc.salvageInput).toHaveValue('15');
  });

  test('[@TC-ASC-004] SEARCH Code di datalist', async ({ page }) => {
    const asc = new AssetCategoryPage(page);
    await asc.assertInDatalist(code, updatedName);
  });

  test('[@TC-ASC-005] Soft DELETE + Show deleted', async ({ page }) => {
    const asc = new AssetCategoryPage(page);
    await asc.softDeleteByCode(code);
    await asc.assertNotInActiveDatalist(code);
    await asc.assertInDeletedDatalist(code);
  });

  test('[@TC-ASC-006] Audit Log slideover', async ({ page }) => {
    const asc = new AssetCategoryPage(page);
    await asc.gotoDatalist();
    await asc.openCreateForm();
    await asc.fillCreateForm({
      code: auditCode,
      name: `Automation Asset Cat AUD ${stamp}`,
      description: 'automation playwright',
      depreciationMethodLabel: 'Straight Line',
      frequency: 1,
      totalDepreciation: 6,
      salvagePercent: 0,
      postingDate: 1,
    });
    await asc.clickSaveAllAndWaitForEdit();
    await asc.openAuditLog();
  });
});
