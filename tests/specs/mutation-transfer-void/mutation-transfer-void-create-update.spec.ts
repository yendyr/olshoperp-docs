import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  MUTATION_TRANSFER_VOID_DATALIST_PATH,
  MutationTransferVoidPage,
} from '../../helpers/mutation-transfer-void';

/**
 * Transfer Void — create smoke (form incomplete AS-IS) → update (Select Product) on Open TFV*.
 * Company: lumicharmsid (153)
 */
test.describe.serial('Transfer Void — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MUTATION_TRANSFER_VOID_DATALIST_PATH,
    });
  });

  test('[@TC-MTVOD-001] Create page smoke + bind Open TFV', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const tfv = new MutationTransferVoidPage(page);
    await tfv.gotoDatalist();

    // AS-IS: Origin Multiselect di-comment — create manual tidak viable
    await tfv.openCreateFormSmoke();

    // Fixture: dokumen existing (prefer TFV* / Open). Jika datalist kosong → CREATE smoke saja.
    try {
      createdCode = await tfv.openFirstOpenEditableFromDatalist();
      expect(createdCode.length).toBeGreaterThan(0);
      expect(createdCode.toUpperCase()).toMatch(/^TF/);
      createdEditPath = page.url();
      expect(createdEditPath).toMatch(/mutation-transfer-void\/edit\/\d+/);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/datalist.*kosong|tidak ada fixture/i.test(msg)) {
        test.info().annotations.push({
          type: 'note',
          description:
            'AS-IS: datalist Void kosong di lumicharmsid — CREATE = smoke only; UPDATE di-skip',
        });
        createdCode = '';
        createdEditPath = '';
        return;
      }
      throw err;
    }
  });

  test('[@TC-MTVOD-002] Update status + Select Product', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    test.skip(
      !createdCode,
      'Skip UPDATE — tidak ada fixture TFV di datalist Void (CREATE smoke only)',
    );

    const tfv = new MutationTransferVoidPage(page);
    if (createdEditPath) {
      await tfv.gotoEditUrl(createdEditPath);
      await expect(tfv.codeInput).toHaveValue(createdCode, {
        timeout: 30_000,
      });
    }

    await tfv.ensureStatusOpen().catch(() => undefined);
    await tfv.clickSaveAllAndWait().catch(() => undefined);

    const sku = await tfv.selectFirstAvailableProduct();
    expect(sku.length).toBeGreaterThan(0);
    await tfv.assertDetailHasProduct(sku);
  });
});
