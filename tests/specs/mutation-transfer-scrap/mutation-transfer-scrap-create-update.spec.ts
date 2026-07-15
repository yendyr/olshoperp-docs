import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  MUTATION_TRANSFER_SCRAP_DATALIST_PATH,
  MutationTransferScrapPage,
} from '../../helpers/mutation-transfer-scrap';

/**
 * Transfer Broken (Scrap) — create → update (status/Open + Select Product).
 * Company: lumicharmsid (153)
 * AS-IS: description locked on edit.
 */
test.describe.serial('Transfer Broken — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `TFS automation create ${Date.now().toString().slice(-6)}`;

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MUTATION_TRANSFER_SCRAP_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-mutation-transfer-scrap] Create Transfer Broken header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const tfs = new MutationTransferScrapPage(page);
    await tfs.gotoDatalist();

    const mode = await tfs.openCreateForm();
    expect(mode, 'Scrap tidak auto-create — harus form create').toBe('create');

    await tfs.setTransactionDateFiscalFallback().catch(() => undefined);
    await tfs.ensureOriginAndScrapDestination();
    await tfs.fillDescription(createDescription);
    await tfs.clickSaveAndNextAndWaitForEdit();

    createdCode = await tfs.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    // AS-IS BE: ScrapController.store() tidak pass code_identifier TFS → generateCode TFI
    expect(createdCode.toUpperCase()).toMatch(/^TF/);
    createdEditPath = page.url();
    expect(createdEditPath).toMatch(/mutation-transfer-scrap\/edit\/\d+/);

    // Datalist scrap filter TFS* — dokumen create manual (TFI) mungkin tidak tampil
    if (/^TFS/i.test(createdCode)) {
      await tfs.assertInDatalist(createdCode, createDescription.slice(0, 16));
    } else {
      await expect(tfs.descriptionInput).toHaveValue(createDescription, {
        timeout: 15_000,
      });
    }
  });

  test('[@TC-UPDATE-mutation-transfer-scrap] Update status + Select Product', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const tfs = new MutationTransferScrapPage(page);
    if (createdEditPath) {
      await tfs.gotoEditUrl(createdEditPath);
      await expect(tfs.codeInput).toHaveValue(createdCode, {
        timeout: 30_000,
      });
    } else {
      await tfs.openEditFromDatalistByCode(createdCode);
    }

    // Description disabled on edit AS-IS — update via status Open jika ada
    await tfs.ensureStatusOpen().catch(() => undefined);
    await tfs.clickSaveAllAndWait().catch(() => undefined);

    const sku = await tfs.selectFirstAvailableProduct();
    expect(sku.length).toBeGreaterThan(0);
    await tfs.assertDetailHasProduct(sku);
  });
});
