import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  MUTATION_TRANSFER_EXTERNAL_DATALIST_PATH,
  MutationTransferExternalPage,
} from '../../helpers/mutation-transfer-external';

/**
 * External Transfer — create → update (description + Select Product).
 * Company: lumicharmsid (153)
 */
test.describe.serial('External Transfer — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `TFE automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MUTATION_TRANSFER_EXTERNAL_DATALIST_PATH,
    });
  });

  test('[@TC-MTEX-001] Create External Transfer header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const tfe = new MutationTransferExternalPage(page);
    await tfe.gotoDatalist();

    const mode = await tfe.openCreateForm();

    if (mode === 'create') {
      await tfe.setTransactionDateFiscalFallback().catch(() => undefined);
      await tfe.ensureOriginSelected();
      await tfe.ensureDestinationSelected();
      await tfe.fillDescription(createDescription);
      await tfe.clickSaveAndNextAndWaitForEdit();
    } else {
      await tfe.fillDescription(createDescription);
      await tfe.clickSaveAllAndWait();
    }

    createdCode = await tfe.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^TFE/);
    createdEditPath = page.url();

    await tfe.assertInDatalist(createdCode, createDescription.slice(0, 16));
  });

  test('[@TC-MTEX-002] Update description + Select Product', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const tfe = new MutationTransferExternalPage(page);
    if (createdEditPath) {
      await tfe.gotoEditUrl(createdEditPath);
      await expect(tfe.codeInput).toHaveValue(createdCode, {
        timeout: 30_000,
      });
    } else {
      await tfe.openEditFromDatalistByCode(createdCode);
    }

    updateDescription = `TFE automation updated ${Date.now().toString().slice(-6)}`;
    await tfe.fillDescription(updateDescription);
    await tfe.clickSaveAllAndWait();

    await expect(tfe.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });
    await tfe.assertInDatalist(createdCode, updateDescription.slice(0, 16));

    if (createdEditPath) {
      await tfe.gotoEditUrl(createdEditPath);
      await expect(tfe.codeInput).toHaveValue(createdCode, {
        timeout: 45_000,
      });
    } else {
      await tfe.openEditFromDatalistByCode(createdCode);
    }

    const sku = await tfe.selectFirstAvailableProduct();
    expect(sku.length).toBeGreaterThan(0);
    await tfe.assertDetailHasProduct(sku);
  });
});
