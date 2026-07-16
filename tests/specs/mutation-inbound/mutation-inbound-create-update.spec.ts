import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  DEFAULT_INBOUND_SUPPLIER,
  MUTATION_INBOUND_DATALIST_PATH,
  MutationInboundPage,
} from '../../helpers/mutation-inbound';

/**
 * Purchase Inbound (mutation-inbound) — create → update (description + Select Product).
 * Company: lumicharmsid (153)
 * TC: CREATE + UPDATE saja (detail digabung di UPDATE).
 */
test.describe.serial('Purchase Inbound — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `IN automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MUTATION_INBOUND_DATALIST_PATH,
    });
  });

  test('[@TC-MUTIN-001] Create Purchase Inbound header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const inbound = new MutationInboundPage(page);
    await inbound.gotoDatalist();

    const mode = await inbound.openCreateForm();

    if (mode === 'create') {
      await inbound.setTransactionDateFiscalFallback().catch(() => undefined);
      await inbound.selectSupplier(DEFAULT_INBOUND_SUPPLIER);
      await inbound.ensureLocationDestinationSelected();
      await inbound.fillDescription(createDescription);
      await inbound.clickSaveAndNextAndWaitForEdit();
    } else {
      await inbound.fillDescription(createDescription);
      await inbound.clickSaveAllAndWait();
    }

    createdCode = await inbound.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^IN/);
    createdEditPath = page.url();

    await inbound.assertInDatalist(
      createdCode,
      createDescription.slice(0, 16),
    );
  });

  test('[@TC-MUTIN-002] Update description + Select Product', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const inbound = new MutationInboundPage(page);
    if (createdEditPath) {
      await inbound.gotoEditUrl(createdEditPath);
      await expect(inbound.codeInput).toHaveValue(createdCode, {
        timeout: 30_000,
      });
    } else {
      await inbound.openEditFromDatalistByCode(createdCode);
    }

    updateDescription = `IN automation updated ${Date.now().toString().slice(-6)}`;
    await inbound.fillDescription(updateDescription);
    await inbound.clickSaveAllAndWait();

    await expect(inbound.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });
    await inbound.assertInDatalist(
      createdCode,
      updateDescription.slice(0, 16),
    );

    if (createdEditPath) {
      await inbound.gotoEditUrl(createdEditPath);
      await expect(inbound.codeInput).toHaveValue(createdCode, {
        timeout: 45_000,
      });
    } else {
      await inbound.openEditFromDatalistByCode(createdCode);
    }

    const sku = await inbound.selectFirstOutstandingProduct();
    expect(sku.length).toBeGreaterThan(0);
    await inbound.assertDetailHasProduct(sku);
  });
});
