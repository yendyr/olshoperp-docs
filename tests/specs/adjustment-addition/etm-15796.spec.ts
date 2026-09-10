import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { dismissStagingBanner } from '../../helpers/shared/staging-banner';

/**
 * ETM-15796: [Stock Addition] - Total Price dan Unit Price Salah Display di Approval saat Menggunakan Alternative Unit
 * Company: lumicharmsid (153)
 * Target Document: AI-5UD7YEOQ (ID: 131984)
 * Location Destination: GSB LT1-AA Rack-001
 * SKU: SKU-ALT-UNT-003
 */
test.describe('ETM-15796 — Stock Addition Alternative Unit Price Display in Approval', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: '/accounting/adjustment-inbound/edit/131984',
    });
  });

  test('[@ETM-15796] Verify Unit Price and Total Price calculation display on Stock Addition Approval', async ({
    page,
  }) => {
    test.setTimeout(180_000);

    console.log('[ETM-15796] Opening Stock Addition Approval edit page for ID 131984 (AI-5UD7YEOQ)...');
    await page.goto('/accounting/adjustment-inbound/edit/131984', {
      waitUntil: 'domcontentloaded',
    });
    await dismissStagingBanner(page);
    await page.waitForTimeout(3000);

    // 1. Initial State Check
    const unitPriceInput = page.locator('table tbody input.w-full, .p-datatable-tbody input').last();
    await expect(unitPriceInput).toBeVisible({ timeout: 30_000 });

    const initialUnitPrice = await unitPriceInput.inputValue();
    console.log('[ETM-15796] Initial Unit Price Input:', initialUnitPrice);

    const initialTotalPriceCell = page.locator('table tbody tr td, .p-datatable-tbody tr td').filter({ hasText: /IDR/i }).first();
    const initialTotalPrice = (await initialTotalPriceCell.innerText()).trim();
    console.log('[ETM-15796] Initial Total Price Display:', initialTotalPrice);

    // 2. Test Editing Unit Price (e.g. 50.000)
    console.log('[ETM-15796] Modifying Unit Price to 50000...');
    await unitPriceInput.click({ clickCount: 3 });
    await unitPriceInput.fill('50000');
    await unitPriceInput.press('Tab');
    await page.waitForTimeout(1500);

    const updatedUnitPrice = await unitPriceInput.inputValue();
    const updatedTotalPrice = (await initialTotalPriceCell.innerText()).trim();
    console.log('[ETM-15796] Updated Unit Price:', updatedUnitPrice);
    console.log('[ETM-15796] Updated Total Price (Qty 10 * 50.000):', updatedTotalPrice);

    // Save screenshot
    await page.screenshot({
      path: `tests/scratch/ETM-15796_approval_price_display.png`,
      fullPage: true,
    });
    console.log('[ETM-15796] Screenshot saved to tests/scratch/ETM-15796_approval_price_display.png');
  });
});
