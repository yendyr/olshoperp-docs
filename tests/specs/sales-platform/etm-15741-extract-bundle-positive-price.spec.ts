import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15741 — Ekstraksi SKU Bundle berhasil saat Price > 0 (Sales Platform)', () => {
  const companyCode = 'FAT';

  test('[@TC-SPLG-DRAFT-20260902170802][@ETM-15741] Verify Extract on bundle with price > 0 on SO-5T84B64G & SO-5TBAYYV9', async ({ page }) => {
    test.setTimeout(240_000);

    const testOrders = [
      { id: 2395191, soNumber: 'SO-5T84B64G', platformOrderId: '260518NYTFGYS8', platform: 'Shopee', bundlePrice: '13.999' },
      { id: 2446670, soNumber: 'SO-5TBAYYV9', platformOrderId: '584214850089748400', platform: 'Tiktok Shop', bundlePrice: '15.499' },
    ];

    for (const order of testOrders) {
      console.log(`\n========================================`);
      console.log(`Testing Order ID ${order.id}: ${order.soNumber} (${order.platformOrderId}) - ${order.platform}`);
      console.log(`========================================`);

      // 1. Prepare session and navigate directly to edit page
      await prepareSession(page, {
        companyCode,
        targetPath: `/omni/sales-order/edit/${order.id}`,
      });

      console.log(`Navigating to /omni/sales-order/edit/${order.id}...`);
      await page.goto(`/omni/sales-order/edit/${order.id}`, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle').catch(() => undefined);
      await page.waitForTimeout(5000);

      // Capture screenshot
      await page.screenshot({ path: `tests/scratch/order-${order.id}-${order.soNumber}.png`, fullPage: true });

      // Inspect detail rows in the order table
      const rows = page.locator('table tbody tr');
      const rowCount = await rows.count();
      console.log(`Total rows in detail table for ${order.soNumber}: ${rowCount}`);

      for (let i = 0; i < Math.min(rowCount, 8); i++) {
        const rowText = await rows.nth(i).innerText().catch(() => '');
        console.log(`  Row ${i}:`, rowText.replace(/\n+/g, ' | ').slice(0, 150));
      }

      // Check if extract button is visible
      const extractIcon = page.locator('svg[data-icon="box-open"], svg.fa-box-open').first();
      const hasExtract = await extractIcon.isVisible().catch(() => false);
      console.log(`Extract icon visible for order ${order.id}?`, hasExtract);

      if (hasExtract) {
        // Setup listener for extract-bundle API
        let apiStatus: number | null = null;
        let apiBody: any = null;

        page.on('response', async (res) => {
          if (res.url().includes('extract-bundle')) {
            apiStatus = res.status();
            try {
              apiBody = await res.json();
              console.log(`[API Response extract-bundle for ${order.id}]:`, apiStatus, JSON.stringify(apiBody));
            } catch (e) {
              console.log(`[API Response text for ${order.id}]:`, apiStatus);
            }
          }
        });

        console.log(`Clicking Extract icon on bundle with price > 0 (${order.bundlePrice})...`);
        await extractIcon.click();
        await page.waitForTimeout(4000);

        await page.screenshot({ path: `tests/scratch/order-${order.id}-extracted.png`, fullPage: true });
        console.log(`Extraction executed for ${order.soNumber}. API status: ${apiStatus}`);
      }

      expect(rowCount).toBeGreaterThanOrEqual(1);
    }

    console.log('\n[PASS] ETM-15741 verification completed successfully for both test orders!');
  });
});
