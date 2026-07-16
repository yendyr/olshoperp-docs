import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ITEM_INTERCHANGE_DATALIST_PATH,
  ItemInterchangePage,
} from '../../helpers/item-interchange';

/**
 * Product Interchange — create lalu update.
 * Company: lumicharmsid (153)
 *
 * Test data (SKU exists di lumicharmsid):
 * create: CHARM-BEAR-BEADS-Pink ↔ TTK-CHROME-POWDER-black
 * update second → TTK-CHROME-POWDER-gold
 */
test.describe.serial('Product Interchange — Create then Update', () => {
  const firstSku = 'CHARM-BEAR-BEADS-Pink';
  const secondSkuCreate = 'TTK-CHROME-POWDER-black';
  const secondSkuUpdate = 'TTK-CHROME-POWDER-gold';
  const updateDescription =
    'penukaran dialihkan ke TTK-CHROME-POWDER-gold karena model chrome black diganti';

  let created = false;
  let createdEditPath = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ITEM_INTERCHANGE_DATALIST_PATH,
    });
  });

  test('[@TC-ITEMINT-001] Create interchange CHARM↔TTK black', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const pi = new ItemInterchangePage(page);
    await pi.gotoDatalist();

    // Idempotent: clear search (bukan full-SKU filter — match from start only)
    await pi.datalist.searchInput.fill('');
    await page.waitForTimeout(2_000);
    const existing = page
      .getByRole('row')
      .filter({ hasText: firstSku })
      .filter({ hasText: secondSkuCreate });
    if (await existing.first().isVisible({ timeout: 8_000 }).catch(() => false)) {
      await pi.datalist.editButton(existing.first()).first().click();
      await page.waitForURL(/\/supplychain\/item-interchange\/edit\/\d+/, {
        timeout: 45_000,
      });
      createdEditPath = page.url();
      created = true;
      return;
    }

    await pi.openCreateForm();
    await pi.fillCreateForm({
      firstSku,
      secondSku: secondSkuCreate,
      showForAllCompany: true,
    });

    try {
      await pi.clickSaveAndNextAndWaitForEdit();
      await pi.assertEditShowsFirstSku(firstSku);
      createdEditPath = page.url();
    } catch (error) {
      const msg = String(error);
      if (!/already|exist|unique|duplicate|taken/i.test(msg)) {
        throw error;
      }
    }

    await pi.assertInDatalist(firstSku, secondSkuCreate);
    if (!createdEditPath) {
      await pi.openEditFromDatalistByFirstSku(firstSku);
      createdEditPath = page.url();
    }
    created = true;
  });

  test('[@TC-ITEMINT-002] Update second product + description', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    expect(created, 'Harus ada data dari create / existing').toBeTruthy();

    const pi = new ItemInterchangePage(page);

    if (createdEditPath) {
      await pi.gotoEditUrl(createdEditPath, firstSku);
    } else {
      await pi.openEditFromDatalistByFirstSku(firstSku);
    }

    await pi.updateSecondProductAndDescription(
      secondSkuUpdate,
      updateDescription,
    );
    await pi.clickSaveAllAndWait();

    await expect(pi.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });

    await pi.assertInDatalist(firstSku, secondSkuUpdate);
  });
});
