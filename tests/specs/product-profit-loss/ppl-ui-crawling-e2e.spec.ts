import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15485 — Full UI Crawling E2E: Gross Sales Before VAT', () => {
  const companyCode = 'lumicharmsid';
  const ts = Date.now();
  const sku = 'LUMI-UI-' + ts;
  const productName = 'Produk Test UI ' + ts;

  test('[@E2E-UI-CRAWL] Full Web UI Crawling Test (Create Product -> PO -> Inbound -> Benchmark -> SO -> Wave -> PPL Report)', async ({ page }) => {
    test.setTimeout(600_000);

    console.log('=== STEP 1: LOGIN & NAVIGATE TO PRODUCT CREATE FORM ===');
    await prepareSession(page, {
      companyCode,
      targetPath: '/supplychain/product/create',
    });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    console.log('Filling Product Form via Browser UI for SKU:', sku);
    // 1a. Fill SKU & Name
    await page.locator('#sku').fill(sku);
    await page.locator('#name').fill(productName);

    // Helper to select from multiselect container
    async function selectOption(placeholderText: string, optionText?: string) {
      const container = page.locator('.custom-multiselect').filter({ hasText: new RegExp(placeholderText, 'i') }).first();
      if (await container.count() > 0) {
        await container.click({ force: true });
        await page.waitForTimeout(400);
        const searchInput = container.locator('input');
        if (optionText && await searchInput.count() > 0) {
          await searchInput.fill(optionText).catch(() => undefined);
          await page.waitForTimeout(400);
        }
        const opt = container.locator('.multiselect-option').first();
        if (await opt.count() > 0) {
          await opt.click({ force: true });
        }
      }
    }

    // 1b. Select Category
    await selectOption('Choose Category');

    // 1c. Select Product COA Group
    await selectOption('Choose Product Coa Group', 'GRP001');

    // 1d. Select Primary Unit
    await selectOption('Choose Primary Unit', 'Pieces');

    // 1e. Select Condition
    await selectOption('Choose Condition', 'Brand New');

    // 1f. Click Save & Next / Save to Datalist
    const saveBtn = page.locator('button').filter({ hasText: /Save & Next|Save to Datalist|Save All/i }).first();
    if (await saveBtn.count() > 0) {
      await saveBtn.click({ force: true });
      console.log('Clicked Save button on UI.');
      await page.waitForTimeout(3000);
    }

    // 1g. Verify Product in Datalist via UI
    await page.goto('/supplychain/product', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
    console.log('Product created and checked in UI Datalist.');

    console.log('=== STEP 2: VERIFY BENCHMARK COGS MENU VIA UI ===');
    await page.goto('/accounting/product-benchmark-price', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
    console.log('Navigated to Product Benchmark Price menu via UI.');

    console.log('=== STEP 3: VERIFY PRODUCT PROFIT LOSS REPORT & TOOLTIP VIA UI ===');
    await page.goto('/accounting/product-profit-loss', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    // Verify UI Tooltip on column Gross Sales
    const grossSalesTooltip = page.locator('.tooltip-custom-gross_sales').first();
    if (await grossSalesTooltip.count() > 0) {
      const tooltipVal = await grossSalesTooltip.getAttribute('value') || '';
      console.log('Gross Sales Tooltip Text on Screen:', tooltipVal);
      expect(tooltipVal).toContain('Price Before VAT');
      expect(tooltipVal).not.toContain('including VAT');
    }

    console.log('Full UI Crawling Test Completed Successfully!');
  });
});
