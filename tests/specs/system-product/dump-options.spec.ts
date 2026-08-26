import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { SYSTEM_PRODUCT_DATALIST_PATH } from '../../helpers/system-product';

test('Dump CLR-SP options', async ({ page }) => {
  await prepareSession(page, {
    companyCode: 'DEV-STG',
    targetPath: SYSTEM_PRODUCT_DATALIST_PATH,
  });

  // 1. Click Create
  await page.getByRole('link', { name: 'Create', exact: true }).click();
  await page.waitForLoadState('networkidle');

  // 2. Click Add Variant
  const addVariantBtn = page
    .getByText('Add New Variant', { exact: true })
    .or(page.getByText('Add Variant', { exact: true }))
    .first();
  await addVariantBtn.click();
  await page.waitForTimeout(1000);

  // 3. Select type CLR-SP
  const emptyType = page.locator('.multiselect').filter({ hasText: /Choose Type|Flavour|Tipe/i }).last();
  await emptyType.click();
  await page.waitForTimeout(500);

  const typeOpt = page.locator('.multiselect-option, [role="option"]').filter({ hasText: /^CLR-SP$/i }).first();
  await typeOpt.click();
  await page.waitForTimeout(1000);

  // 4. Click options dropdown
  const optionsMultiselect = page.locator('.multiselect').last();
  await optionsMultiselect.click();
  await page.waitForTimeout(1000);

  // 5. Get all option text
  const options = page.locator('.multiselect-option, [role="option"]');
  const count = await options.count();
  console.log(`FOUND ${count} OPTIONS:`);
  for (let i = 0; i < count; i++) {
    const txt = await options.nth(i).textContent();
    console.log(`Option ${i}: "${txt?.trim()}"`);
  }
});
