import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { TAX_DATALIST_PATH, TaxPage } from '../../helpers/tax';

/**
 * Tax — VIEW → CREATE → UPDATE → SEARCH.
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Tax — CRUD', () => {
  test.describe.configure({ timeout: 300_000 });

  const stamp = Date.now().toString().slice(-6);
  const code = `AT-TAX-${stamp}`;
  let name = `Automation Tax ${stamp}`;
  const updatedName = `Automation Tax UPD ${stamp}`;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: TAX_DATALIST_PATH,
    });
  });

  test('[@TC-TAX-001] VIEW datalist shell + Create', async ({ page }) => {
    const tax = new TaxPage(page);
    await tax.gotoDatalist();
    await tax.assertDatalistShell();
  });

  test('[@TC-TAX-002] CREATE Code/Name/Tariff + COA', async ({ page }) => {
    const tax = new TaxPage(page);
    await tax.gotoDatalist();
    await tax.openCreateForm();
    await tax.fillCreateForm({
      code,
      name,
      tariff: '11',
      description: 'automation playwright',
    });
    await tax.clickSaveAndNextAndWaitForEdit();
    await expect(page).toHaveURL(/\/accounting\/tax\/edit\/\d+/);
    await expect(tax.codeInput).toHaveValue(code);
  });

  test('[@TC-TAX-003] UPDATE Name + Description', async ({ page }) => {
    const tax = new TaxPage(page);
    await tax.openEditFromDatalistByCode(code);
    name = updatedName;
    await tax.updateNameAndDescription(updatedName, 'automation playwright');
    await tax.clickSaveAllAndWait();
    await expect(tax.nameInput).toHaveValue(updatedName);
  });

  test('[@TC-TAX-004] SEARCH Code di datalist', async ({ page }) => {
    const tax = new TaxPage(page);
    await tax.assertInDatalist(code, updatedName);
  });
});
