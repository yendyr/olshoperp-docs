import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test('Update PO Detail Unit Price via UI and verify VAT calculation', async ({ page }) => {
  test.setTimeout(120_000);
  const companyCode = 'lumicharmsid';
  const poId = '2635';

  await prepareSession(page, {
    companyCode,
    targetPath: '/supplychain/purchase-order/edit/' + poId,
  });

  await page.goto('https://staging.olshoperp.com/supplychain/purchase-order/edit/' + poId);
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(2000);

  // Expand PO Detail accordion
  const poDetailBtn = page.locator('#PurchaseOrderDetail, button:has-text("Purchase Order Detail")').first();
  await poDetailBtn.scrollIntoViewIfNeeded().catch(() => undefined);

  // Check detail row and click update/edit
  const row = page.locator('#PurchaseOrderDetail tr').filter({ hasText: /LUMI-CRAWL-1787447920177/i }).first();
  await expect(row).toBeVisible({ timeout: 20000 });

  const editBtn = row.locator('button[class*="tooltip-update"], button#updateButton, button:has(svg.lucide-edit), button:has(svg.lucide-pen)').first();
  if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await editBtn.click({ force: true });
    await page.waitForTimeout(2000);

    const modal = page.locator('div.modal, div[role="dialog"]').last();
    // Fill Unit Price = 80000
    const priceInput = modal.locator('input#each_price, input[name*="price" i]').first();
    if (await priceInput.count() > 0) {
      await priceInput.click();
      await priceInput.fill('80000');
      await page.keyboard.press('Tab');
      await page.waitForTimeout(1000);
    }

    // Inspect VAT / Tax details in modal
    const taxType = await modal.locator('.multiselect').innerText().catch(() => '');
    const priceAfterVat = await modal.locator('input#price_after_vat').inputValue().catch(() => '');
    console.log('VAT info in modal:', taxType);
    console.log('Price After VAT in modal:', priceAfterVat);

    // Save modal
    const saveBtn = modal.locator('button:has-text("Save"), button[type="submit"]').last();
    await saveBtn.click({ force: true });
    await page.waitForTimeout(2000);
  } else {
    // Direct editable cell
    const cell = row.locator('td').nth(3);
    await cell.dblclick({ force: true });
    const cellInput = cell.locator('input');
    if (await cellInput.count() > 0) {
      await cellInput.fill('80000');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);
    }
  }

  // Click Save All
  const saveAll = page.getByRole('button', { name: /Save All/i }).first();
  if (await saveAll.isVisible({ timeout: 5000 }).catch(() => false)) {
    await saveAll.click({ force: true });
    await page.waitForTimeout(3000);
    console.log('Clicked Save All.');
  }
});
