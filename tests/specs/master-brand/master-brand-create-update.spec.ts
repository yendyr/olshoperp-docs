import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  MASTER_BRAND_DATALIST_PATH,
  MasterBrandPage,
} from '../../helpers/master-brand';

/**
 * Master Brand — create lalu update name.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Master Brand — Create then Update', () => {
  let createdName = '';
  let updatedName = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MASTER_BRAND_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-master-brand] Create Brand baru', async ({ page }) => {
    test.setTimeout(180_000);

    const brand = new MasterBrandPage(page);
    const stamp = Date.now().toString().slice(-6);
    createdName = `BR-AT-${stamp}`;

    await brand.openCreateForm();
    await brand.fillCreateForm({
      name: createdName,
      description: 'Brand automation — master merek produk',
    });
    await brand.clickSaveAndNextAndWaitForEdit();
    await expect(brand.nameInput).toHaveValue(createdName, { timeout: 15_000 });
    await brand.assertInDatalist(createdName);
  });

  test('[@TC-UPDATE-master-brand] Update Name + Description', async ({
    page,
  }) => {
    test.setTimeout(180_000);
    expect(createdName, 'Harus ada name dari create').toBeTruthy();

    const brand = new MasterBrandPage(page);
    await brand.openEditFromDatalistByName(createdName);

    const stamp = Date.now().toString().slice(-6);
    updatedName = `BR-UP-${stamp}`;

    await brand.updateBasicFields({
      name: updatedName,
      description: 'Brand di-update automation',
    });
    await brand.clickSaveAllAndWait();

    await expect(brand.nameInput).toHaveValue(updatedName, { timeout: 15_000 });
    await brand.assertInDatalist(updatedName);

    await brand.gotoDatalist();
    await brand.datalist.search(createdName, 1_500);
    const exactOld = page
      .getByRole('row')
      .filter({ hasText: createdName })
      .filter({ hasNotText: updatedName });
    expect(
      await exactOld.count(),
      `Name lama ${createdName} sudah diganti ke ${updatedName}`,
    ).toBe(0);
  });
});
