import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  CBA_DATALIST_PATH,
  CompanyDetailBankPage,
} from '../../helpers/company-detail-bank';

/**
 * Cash/Bank Account — VIEW → CREATE → UPDATE → SEARCH.
 * Route AS-IS: /accounting/company-detail-bank
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Cash/Bank Account — CRUD', () => {
  test.describe.configure({ timeout: 300_000 });

  const stamp = Date.now().toString().slice(-6);
  // Label max 30: AT-CBA-###### = 13 chars; UPD version shorter
  let label = `AT-CBA-${stamp}`;
  const updatedLabel = `AT-CBA-U${stamp}`.slice(0, 30);

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: CBA_DATALIST_PATH,
    });
  });

  test('[@TC-CBA-001] VIEW datalist shell + Create', async ({ page }) => {
    const cba = new CompanyDetailBankPage(page);
    await cba.gotoDatalist();
    await cba.assertDatalistShell();
  });

  test('[@TC-CBA-002] CREATE Label + Currency + COA', async ({ page }) => {
    const cba = new CompanyDetailBankPage(page);
    await cba.gotoDatalist();
    await cba.openCreateForm();
    await cba.fillCreateForm({
      label,
      description: 'automation playwright',
    });
    await cba.clickSaveAndNextAndWaitForEdit();
    await expect(page).toHaveURL(
      /\/accounting\/company-detail-bank\/edit\/\d+/,
    );
    await expect(cba.labelInput).toHaveValue(label);
  });

  test('[@TC-CBA-003] UPDATE Label + Description', async ({ page }) => {
    const cba = new CompanyDetailBankPage(page);
    await cba.openEditFromDatalistByLabel(label);
    await cba.updateLabelAndDescription(
      updatedLabel,
      'automation playwright',
    );
    await cba.clickSaveAllAndWait();
    await expect(cba.labelInput).toHaveValue(updatedLabel);
    label = updatedLabel;
  });

  test('[@TC-CBA-004] SEARCH Label di datalist', async ({ page }) => {
    const cba = new CompanyDetailBankPage(page);
    await cba.assertInDatalist(updatedLabel);
  });
});
