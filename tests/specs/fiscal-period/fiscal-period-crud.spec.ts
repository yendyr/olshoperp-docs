import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  DEC_2024,
  FISCAL_PERIOD_DATALIST_PATH,
  FiscalPeriodPage,
} from '../../helpers/fiscal-period';

/**
 * Fiscal Period — VIEW → ensure December 2024 → UPDATE → SEARCH.
 * Company: lumicharmsid (153)
 * Description: automation playwright
 */
test.describe.serial('Fiscal Period — December 2024', () => {
  test.describe.configure({ timeout: 300_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: FISCAL_PERIOD_DATALIST_PATH,
    });
  });

  test('[@TC-FP-001] VIEW datalist shell + Create', async ({ page }) => {
    const fp = new FiscalPeriodPage(page);
    await fp.gotoDatalist();
    await fp.assertDatalistShell();
  });

  test('[@TC-FP-002] CREATE / ensure December 2024', async ({ page }) => {
    const fp = new FiscalPeriodPage(page);
    const mode = await fp.ensureDecember2024();

    await expect(page).toHaveURL(/\/accounting\/fiscal-period\/edit\/\d+/);

    const nameVal = await fp.nameInput.inputValue().catch(() => '');
    expect(nameVal.length, `Period terbuka (mode=${mode})`).toBeGreaterThan(0);

    if (mode === 'created') {
      await expect(fp.nameInput).toHaveValue(DEC_2024.name);
    }
  });

  test('[@TC-FP-003] UPDATE Description (jika Open)', async ({ page }) => {
    const fp = new FiscalPeriodPage(page);
    await fp.openEditDecember2024();
    const result = await fp.updateDescriptionIfEditable(
      'automation playwright',
    );
    expect(['updated', 'skipped']).toContain(result);
    if (result === 'updated') {
      await expect(fp.descriptionInput).toHaveValue('automation playwright');
    }
  });

  test('[@TC-FP-004] SEARCH December 2024', async ({ page }) => {
    const fp = new FiscalPeriodPage(page);
    await fp.assertDecember2024InDatalist();
  });
});
