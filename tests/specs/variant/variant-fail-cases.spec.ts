import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { VARIANT_DATALIST_PATH, VariantPage } from '../../helpers/variant';

test.describe('Variant Group — Failed Test Cases (ETM-15511)', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'FAT',
      targetPath: VARIANT_DATALIST_PATH,
    });
  });

  test('[@TC-VAR-003] Form toggle Default Variant + kolom list Default', async ({ page }) => {
    test.setTimeout(120_000);
    const variant = new VariantPage(page);

    // Step 1: Open datalist and check column headers
    await variant.gotoDatalist();
    const tableHeaderRow = page.locator('table thead tr').first();
    await expect(tableHeaderRow).toBeVisible({ timeout: 30_000 });

    // Assert datalist header has 'Default' column
    const defaultColumnHeader = tableHeaderRow.getByRole('columnheader', { name: 'Default', exact: true })
      .or(tableHeaderRow.locator('th').filter({ hasText: /^Default$/i }));
    await expect(
      defaultColumnHeader,
      'Datalist header harus memiliki kolom "Default"'
    ).toBeVisible({ timeout: 5_000 });

    // Step 2: Open Create Form and check toggle label
    await variant.openCreateForm();

    // Assert toggle switch with label "Set as Default System Product"
    const defaultToggleLabel = page.getByText('Set as Default System Product', { exact: true });
    await expect(
      defaultToggleLabel,
      'Toggle di form Create/Edit harus memiliki label "Set as Default System Product"'
    ).toBeVisible({ timeout: 5_000 });
  });

  test('[@TC-VAR-008] Edit — hapus opsi random unused tidak di-re-inject', async ({ page }) => {
    test.setTimeout(120_000);
    const variant = new VariantPage(page);

    // Open Edit form for fixture NR9551 / 2965
    await page.goto('/supplychain/variant/edit/2965');
    await page.waitForURL(/\/supplychain\/variant\/edit\/2965/, { timeout: 45_000 });
    
    // Check initial state has 'random' option tag
    const randomTag = variant.optionTags.filter({ hasText: 'random' }).first();
    await expect(randomTag, 'Tag option "random" harus ada sebelum di-remove').toBeVisible({ timeout: 15_000 });

    // Remove 'random' option tag
    await variant.removeOptionTag('random');

    // Click Save All
    await variant.clickSaveAllAndWait();

    // Reload page to verify persistence after save
    await page.reload();
    await page.waitForURL(/\/supplychain\/variant\/edit\/2965/, { timeout: 45_000 });

    // Assert option 'random' is not present after reload/save
    const randomTagAfterSave = variant.optionTags.filter({ hasText: 'random' });
    await expect(
      randomTagAfterSave,
      'Opsi "random" yang dihapus tidak boleh di-re-inject oleh backend setelah Save All'
    ).toHaveCount(0, { timeout: 10_000 });
  });
});
