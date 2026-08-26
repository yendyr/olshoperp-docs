import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  GENERAL_COMPANY_DATALIST_PATH,
  GeneralCompanyPage,
} from '../../helpers/general-company';

/**
 * One-off seed: 1 General Company sebagai Supplier di Dev Staging (id 13).
 * Name: Supplier Colli V2
 * Code: SUP-COLLI-V2
 *
 * Run:
 *   OLSHOP_COMPANY_CODE=DEV-STG npx playwright test \
 *     tests/specs/general-company/seed-supplier-colli-v2.spec.ts \
 *     --project=authenticated --workers=1
 */

const COMPANY_CODE = 'DEV-STG';
const SUPPLIER_CODE = 'SUP-COLLI-V2';
const SUPPLIER_NAME = 'Supplier Colli V2';

test.describe('Seed supplier — Supplier Colli V2 (DEV-STG)', () => {
  test('[@SEED-GC] Create supplier Supplier Colli V2', async ({ page }) => {
    test.setTimeout(180_000);

    await prepareSession(page, {
      companyCode: COMPANY_CODE,
      targetPath: GENERAL_COMPANY_DATALIST_PATH,
    });

    const gc = new GeneralCompanyPage(page);
    const existing = await gc.findExistingByNameOrCode(
      SUPPLIER_NAME,
      SUPPLIER_CODE,
    );

    if (existing.found) {
      await gc.expandBasicInformation();
      const codeValue = await gc.codeInput.inputValue();
      const nameValue = await gc.nameInput.inputValue();
      expect(nameValue, 'Name existing harus Supplier Colli V2').toBe(
        SUPPLIER_NAME,
      );
      console.log(
        `[SEED-GC] Existing — code=${codeValue} name=${nameValue} url=${existing.editUrl}`,
      );
      return;
    }

    await gc.openCreateForm();
    await gc.fillCreateForm({
      code: SUPPLIER_CODE,
      name: SUPPLIER_NAME,
      description: 'automation playwright',
      supplier: true,
      customer: false,
      shipper: false,
      manufacturer: false,
    });

    const editUrl = await gc.clickSaveAndNextAndWaitForEdit();
    await expect(gc.codeInput).toHaveValue(SUPPLIER_CODE);
    await expect(gc.nameInput).toHaveValue(SUPPLIER_NAME);
    await expect(gc.roleSwitch('Supplier')).toBeChecked();
    await expect(gc.roleSwitch('Customer')).not.toBeChecked();

    console.log(
      `[SEED-GC] Created — code=${SUPPLIER_CODE} name=${SUPPLIER_NAME} url=${editUrl}`,
    );
  });
});
