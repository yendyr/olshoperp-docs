import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  PCG_DATALIST_PATH,
  ProductCoaGroupPage,
} from '../../helpers/product-coa-group';

/**
 * Product COA Group — VIEW → CREATE (Purchased Item) → UPDATE → SEARCH.
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Product COA Group — CRUD', () => {
  test.describe.configure({ timeout: 360_000 });

  const stamp = Date.now().toString().slice(-6);
  const code = `AT-PCG-${stamp}`;
  let name = `Automation PCG ${stamp}`;
  const updatedName = `Automation PCG UPD ${stamp}`;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PCG_DATALIST_PATH,
    });
  });

  test('[@TC-PCG-001] VIEW datalist shell + Create', async ({ page }) => {
    const pcg = new ProductCoaGroupPage(page);
    await pcg.gotoDatalist();
    await pcg.assertDatalistShell();
  });

  test('[@TC-PCG-002] CREATE Purchased Item + COA bindings', async ({
    page,
  }) => {
    const pcg = new ProductCoaGroupPage(page);
    await pcg.gotoDatalist();
    await pcg.openCreateForm();
    await pcg.fillCreatePurchasedItem({
      code,
      name,
      description: 'automation playwright',
    });
    await pcg.clickSaveAndNextAndWaitForEdit();
    await expect(page).toHaveURL(
      /\/accounting\/product-coa-group\/edit\/\d+/,
    );
    await expect(pcg.codeInput).toHaveValue(code);
  });

  test('[@TC-PCG-003] UPDATE Name + Description', async ({ page }) => {
    const pcg = new ProductCoaGroupPage(page);
    await pcg.openEditFromDatalistByCode(code);
    name = updatedName;
    await pcg.updateNameAndDescription(updatedName, 'automation playwright');
    await pcg.clickSaveAllAndWait();
    await expect(pcg.nameInput).toHaveValue(updatedName);
  });

  test('[@TC-PCG-004] SEARCH Code di datalist', async ({ page }) => {
    const pcg = new ProductCoaGroupPage(page);
    await pcg.assertInDatalist(code, updatedName);
  });
});
