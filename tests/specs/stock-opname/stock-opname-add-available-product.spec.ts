import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  STOCK_OPNAME_DATALIST_PATH,
  StockOpnamePage,
} from '../../helpers/stock-opname';

/**
 * Edit Stock Opname SP-6A56E465 — add Available Product + isi Adjustment Qty.
 * Company: lumicharmsid (153)
 *
 * Idempotent: jika detail sudah punya baris, set Expected stock saja.
 */
const TARGET_CODE = 'SP-6A56E465';
const ADJUSTMENT_QTY = 1;
const EXPECTED_STOCK = 2;

test.describe('Stock Opname — Add Available Product + Qty', () => {
  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: STOCK_OPNAME_DATALIST_PATH,
    });
  });

  test(`[@TC-UPDATE-stock-opname-detail] ${TARGET_CODE} add available product + qty`, async ({
    page,
  }) => {
    test.setTimeout(300_000);

    const so = new StockOpnamePage(page);
    await so.openEditFromDatalistByCode(TARGET_CODE);
    await expect(so.codeInput).toHaveValue(TARGET_CODE, { timeout: 30_000 });

    await so.expandOpnameDetail();

    // Sudah ada baris detail (mis. dari run sebelumnya) → cukup update Expected stock
    const existingRow = page
      .locator('.p-datatable-tbody tr, #OpnameDetail tbody tr')
      .filter({ hasText: /LUMI|CHARM|TTK|[A-Z]{2,}\d/i })
      .first();
    const alreadyHasDetail = await existingRow
      .isVisible({ timeout: 8_000 })
      .catch(() => false);

    let productLabel: string;

    if (alreadyHasDetail) {
      const rowText = ((await existingRow.textContent()) ?? '')
        .replace(/\s+/g, ' ')
        .trim();
      // Ambil SKU-like token pertama
      const skuMatch = rowText.match(
        /([A-Z]{2,}[A-Z0-9._-]{3,}|LUMI\w+|CHARM[\w-]+|TTK[\w-]+)/i,
      );
      productLabel = skuMatch?.[1] ?? rowText.slice(0, 40);
      expect(productLabel.length).toBeGreaterThan(0);
      await so.setExpectedStockOnDetailRow(productLabel, EXPECTED_STOCK);
    } else {
      productLabel = await so.useFirstAvailableProductWithQty(ADJUSTMENT_QTY);

      const panel = so.availableProductsPanel();
      if (await panel.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await page.mouse.click(8, 8);
        await page.waitForTimeout(500);
      }

      await so.assertDetailHasProduct(productLabel);
      await so.setExpectedStockOnDetailRow(productLabel, EXPECTED_STOCK).catch(
        () => undefined,
      );
    }

    const detailRow = await so.assertDetailHasProduct(productLabel);
    await expect(detailRow).toBeVisible();
  });
});
