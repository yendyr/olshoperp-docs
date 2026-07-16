import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  MUTATION_TRANSFER_INTERNAL_DATALIST_PATH,
  MutationTransferInternalPage,
} from '../../helpers/mutation-transfer-internal';

/**
 * Transfer Internal — create → update (description + Select Product).
 * Company: lumicharmsid (153)
 */
test.describe.serial('Transfer Internal — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `TFI automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MUTATION_TRANSFER_INTERNAL_DATALIST_PATH,
    });
  });

  test('[@TC-MTIN-001] Create Transfer Internal header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const tfi = new MutationTransferInternalPage(page);
    await tfi.gotoDatalist();

    const mode = await tfi.openCreateForm();

    if (mode === 'create') {
      await tfi.setTransactionDateFiscalFallback().catch(() => undefined);
      await tfi.ensureOriginSelected();
      await tfi.ensureDestinationSelected();
      await tfi.fillDescription(createDescription);
      await tfi.clickSaveAndNextAndWaitForEdit();
    } else {
      await tfi.fillDescription(createDescription);
      await tfi.clickSaveAllAndWait();
    }

    createdCode = await tfi.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^TFI/);
    createdEditPath = page.url();

    await tfi.assertInDatalist(createdCode, createDescription.slice(0, 16));
  });

  test('[@TC-MTIN-002] Update description + Select Product', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const tfi = new MutationTransferInternalPage(page);
    if (createdEditPath) {
      await tfi.gotoEditUrl(createdEditPath);
      await expect(tfi.codeInput).toHaveValue(createdCode, {
        timeout: 30_000,
      });
    } else {
      await tfi.openEditFromDatalistByCode(createdCode);
    }

    updateDescription = `TFI automation updated ${Date.now().toString().slice(-6)}`;
    await tfi.fillDescription(updateDescription);
    await tfi.clickSaveAllAndWait();

    await expect(tfi.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });
    await tfi.assertInDatalist(createdCode, updateDescription.slice(0, 16));

    if (createdEditPath) {
      await tfi.gotoEditUrl(createdEditPath);
      await expect(tfi.codeInput).toHaveValue(createdCode, {
        timeout: 45_000,
      });
    } else {
      await tfi.openEditFromDatalistByCode(createdCode);
    }

    const sku = await tfi.selectFirstAvailableProduct();
    expect(sku.length).toBeGreaterThan(0);
    await tfi.assertDetailHasProduct(sku);
  });
});
