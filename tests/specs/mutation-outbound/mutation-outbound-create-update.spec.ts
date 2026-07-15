import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  MUTATION_OUTBOUND_DATALIST_PATH,
  MutationOutboundPage,
} from '../../helpers/mutation-outbound';

/**
 * Outbound External (mutation-outbound) — create → update (description + Select Product).
 * Company: lumicharmsid (153)
 * TC: CREATE + UPDATE saja (detail digabung di UPDATE).
 */
test.describe.serial('Outbound External — Create then Update', () => {
  let createdCode = '';
  let createdEditPath = '';
  const createDescription = `OT automation create ${Date.now().toString().slice(-6)}`;
  let updateDescription = '';

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: MUTATION_OUTBOUND_DATALIST_PATH,
    });
  });

  test('[@TC-CREATE-mutation-outbound] Create Outbound External header', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const outbound = new MutationOutboundPage(page);
    await outbound.gotoDatalist();

    const mode = await outbound.openCreateForm();

    if (mode === 'create') {
      await outbound.setTransactionDateFiscalFallback().catch(() => undefined);
      await outbound.ensureTypeOther();
      await outbound.ensureBuildingOriginSelected();
      await outbound.fillDescription(createDescription);
      await outbound.clickSaveAndNextAndWaitForEdit();
    } else {
      // Auto-create sering type Sales Order dari default-values — paksa Other
      await outbound.ensureTypeOther();
      await outbound.ensureBuildingOriginSelected();
      await outbound.fillDescription(createDescription);
      await outbound.clickSaveAllAndWait();
    }

    createdCode = await outbound.readGeneratedCode();
    expect(createdCode.length).toBeGreaterThan(0);
    expect(createdCode.toUpperCase()).toMatch(/^OT/);
    createdEditPath = page.url();

    await outbound.assertInDatalist(
      createdCode,
      createDescription.slice(0, 16),
    );
  });

  test('[@TC-UPDATE-mutation-outbound] Update description + Select Product', async ({
    page,
  }) => {
    test.setTimeout(300_000);
    expect(createdCode, 'Harus ada code dari create').toBeTruthy();

    const outbound = new MutationOutboundPage(page);
    if (createdEditPath) {
      await outbound.gotoEditUrl(createdEditPath);
      await expect(outbound.codeInput).toHaveValue(createdCode, {
        timeout: 30_000,
      });
    } else {
      await outbound.openEditFromDatalistByCode(createdCode);
    }

    updateDescription = `OT automation updated ${Date.now().toString().slice(-6)}`;
    await outbound.fillDescription(updateDescription);
    await outbound.clickSaveAllAndWait();

    await expect(outbound.descriptionInput).toHaveValue(updateDescription, {
      timeout: 15_000,
    });
    await outbound.assertInDatalist(
      createdCode,
      updateDescription.slice(0, 16),
    );

    if (createdEditPath) {
      await outbound.gotoEditUrl(createdEditPath);
      await expect(outbound.codeInput).toHaveValue(createdCode, {
        timeout: 45_000,
      });
    } else {
      await outbound.openEditFromDatalistByCode(createdCode);
    }

    const sku = await outbound.selectFirstAvailableProduct();
    expect(sku.length).toBeGreaterThan(0);
    await outbound.assertDetailHasProduct(sku);
  });
});
