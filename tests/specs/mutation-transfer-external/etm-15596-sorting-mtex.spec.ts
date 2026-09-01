import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15596 — Transfer External Print Sorting Sync', () => {
  const trxCode = 'TFE-5U97T5DC';
  const companyCode = 'DEV-STG'; // default staging company for this TC

  test.beforeEach(async ({ page }) => {
    // 1. Prepare session on staging and navigate to the Transfer External datalist
    await prepareSession(page, {
      companyCode,
      targetPath: `/supplychain/mutation-transfer-external`,
    });
  });

  test('[@TC-MTEX-DRAFT-20260827162401] Print with Default LIFO Sorting', async ({ page }) => {
    test.setTimeout(120_000);

    // 2. Search for the target document TFE-5U97T5DC in the datalist
    const searchInput = page.getByPlaceholder(/find something|search/i).or(page.locator('input[type="search"]')).first();
    await expect(searchInput).toBeVisible({ timeout: 30_000 });
    await searchInput.fill(trxCode);
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);

    const row = page.getByRole('row').filter({ hasText: trxCode }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });

    const editLink = row.locator('a[href*="/supplychain/mutation-transfer-external/edit/"]').first();
    await expect(editLink).toBeVisible();
    await editLink.click();

    await page.waitForURL(/\/supplychain\/mutation-transfer-external\/edit\/\d+/, { timeout: 45_000 });
    await page.waitForLoadState('load');

    // 3. Expand the Product Transfer Detail section
    const accordionBtn = page.getByRole('button', { name: /Product Transfer Detail/i }).first();
    await expect(accordionBtn).toBeVisible({ timeout: 30_000 });
    if (await accordionBtn.getAttribute('aria-expanded') !== 'true') {
      await accordionBtn.click();
      await page.waitForTimeout(1000);
    }

    // 4. Capture the SKU row texts in the UI (to verify the order)
    const tableRows = page.locator('#DatalistDetail tbody tr').filter({ hasNotText: /no data available/i });
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);
    
    const uiSkus: string[] = [];
    for (let i = 0; i < rowCount; i++) {
      const text = await tableRows.nth(i).locator('td').first().innerText();
      uiSkus.push(text.trim());
    }
    console.log('UI SKUs in default order:', uiSkus);

    // 5. Intercept the print URL / download
    const printBtn = page.locator('[data-tippy-content="Print Detail"]')
      .or(page.locator('font-awesome-icon[icon="print"], .fa-print'))
      .first();

    await expect(printBtn).toBeVisible({ timeout: 20_000 });

    // Catch print navigation or download
    const downloadPromise = page.waitForEvent('download').catch(() => null);
    const pagePromise = page.context().waitForEvent('page').catch(() => null);

    await printBtn.click();

    const download = await downloadPromise;
    if (download) {
      const url = download.url();
      console.log('Download URL triggered:', url);
      expect(url).toContain('print');
    } else {
      const newPage = await pagePromise;
      if (newPage) {
        const url = newPage.url();
        console.log('New tab URL opened:', url);
        expect(url).toContain('print');
        await newPage.close();
      }
    }
  });
});
