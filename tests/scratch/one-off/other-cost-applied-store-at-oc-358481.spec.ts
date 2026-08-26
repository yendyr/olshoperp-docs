import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  OTHER_COST_DATALIST_PATH,
  OtherCostPage,
} from '../../helpers/other-cost';

/**
 * One-shot: AT-OC-358481 All Stores → Applied Store
 * Stores: store barang mahal, offline store lumi
 */
test.describe('Other Cost — set Applied Store AT-OC-358481', () => {
  test.describe.configure({ timeout: 300_000 });

  const code = 'AT-OC-358481';
  const stores = ['store barang mahal', 'offline store lumi'];

  test('update All Stores → Applied Store + 2 stores + Save All', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: OTHER_COST_DATALIST_PATH,
    });

    const oc = new OtherCostPage(page);
    await oc.openEditFromDatalistByCode(code);
    await oc.setAppliedStores(stores);
    await oc.clickSaveAllAndWait();

    // Verifikasi radio + tags tetap setelah save
    await expect(oc.appliedStoreRadio).toBeChecked();
    await expect(
      page
        .locator('#OtherCost')
        .getByText(/store barang mahal/i)
        .first(),
    ).toBeVisible();
    await expect(
      page
        .locator('#OtherCost')
        .getByText(/offline store lumi/i)
        .first(),
    ).toBeVisible();
  });
});
