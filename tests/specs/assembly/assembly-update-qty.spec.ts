import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { ASSEMBLY_DATALIST_PATH, AssemblyPage } from '../../helpers/assembly';

/** Update QTY Assembly Detail pada dokumen existing. */
const TARGET_CODE = 'AS-6A56F627';
const TARGET_QTY = 10;

test.describe('Assembly — Update Detail QTY', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: ASSEMBLY_DATALIST_PATH,
    });
  });

  test(`[@TC-ASMBLY-003] ${TARGET_CODE} set QTY=${TARGET_QTY}`, async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const as = new AssemblyPage(page);
    await as.openEditFromDatalistByCode(TARGET_CODE);
    await expect(as.codeInput).toHaveValue(TARGET_CODE, { timeout: 30_000 });

    const sku = await as.setQtyOnDetailRow(TARGET_QTY);
    expect(sku.length).toBeGreaterThan(0);
    await as.assertDetailHasProduct(sku);
  });
});
