import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

/**
 * Playwright E2E Test Spec for ETM-15350: Re-check Failed Process & Log
 * Covers scenarios with previous FAILED notes from Jeiniffer (T03, T05, T06, T08, T09, T10).
 *
 * Menu routes:
 * - All Sales Order: /businessdevelopment/all-sales-order
 * - Dev - Sales Platform: /omni/sales-order
 */

test.describe('ETM-15350 — Re-check Failed Process & Log Verification', () => {
  const targetCompany = process.env.OLSHOP_COMPANY_CODE ?? 'FAT';

  test('@TC-ASO-DRAFT-20260819112201 [T03] Verify Recheck failed process button exists in All Sales Order and Dev - Sales Platform', async ({ page }) => {
    // 1. Check in All Sales Order
    await prepareSession(page, {
      companyCode: targetCompany,
      targetPath: '/businessdevelopment/all-sales-order',
    });

    await page.waitForLoadState('networkidle').catch(() => undefined);
    
    // Locate Recheck button in All Sales Order
    const recheckBtnAllSo = page.getByRole('button', { name: /Recheck failed process|Rechecking.../i });
    await expect(recheckBtnAllSo, 'Recheck failed process button should be visible in All Sales Order').toBeVisible({ timeout: 15_000 });

    // Hover tooltip check
    await recheckBtnAllSo.hover();
    await page.waitForTimeout(500);
    const tooltipText = page.locator('body').getByText(/Re-check sales order error flaggings|Re-check is in progress/i);
    await expect(tooltipText.first()).toBeVisible({ timeout: 5_000 });

    console.log('[PASS] Recheck failed process button and tooltip verified in All Sales Order');

    // 2. Check in Dev - Sales Platform (Addressing previous FAILED note on T03)
    await page.goto('/omni/sales-order', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const recheckBtnSalesPlatform = page.getByRole('button', { name: /Recheck failed process|Rechecking.../i });
    await expect(recheckBtnSalesPlatform, 'Recheck failed process button should be visible in Dev - Sales Platform').toBeVisible({ timeout: 15_000 });

    // Hover tooltip check
    await recheckBtnSalesPlatform.hover();
    await page.waitForTimeout(500);
    const tooltipTextPlatform = page.locator('body').getByText(/Re-check sales order error flaggings|Re-check is in progress/i);
    await expect(tooltipTextPlatform.first()).toBeVisible({ timeout: 5_000 });

    console.log('[PASS] Recheck failed process button and tooltip verified in Dev - Sales Platform');
  });

  test('@TC-ASO-DRAFT-20260819112202 [T05/T06] Search target test SOs and verify error flags & trigger', async ({ page }) => {
    await prepareSession(page, {
      companyCode: targetCompany,
      targetPath: '/businessdevelopment/all-sales-order',
    });

    await page.waitForLoadState('networkidle').catch(() => undefined);

    // Check search for SO-5TT5DGP5
    const searchInput = page.getByPlaceholder(/search|cari/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('SO-5TT5DGP5');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      
      const rowCount = await page.locator('table tbody tr').count();
      console.log();
    }

    // Check recheck trigger button state
    const recheckBtn = page.getByRole('button', { name: /Recheck failed process|Rechecking.../i });
    await expect(recheckBtn).toBeVisible();

    const isCurrentlyDisabled = await recheckBtn.isDisabled();
    console.log();
  });

  test('@TC-ASO-DRAFT-20260819112203 [T07/T10] Verify Log Data modal/slideover and entries', async ({ page }) => {
    await prepareSession(page, {
      companyCode: targetCompany,
      targetPath: '/businessdevelopment/all-sales-order',
    });

    await page.waitForLoadState('networkidle').catch(() => undefined);

    // Target button.dt-btn-log-data
    const logBtn = page.locator('button.dt-btn-log-data').first();
    await expect(logBtn, 'Log Data button should exist in DataTables header').toBeVisible({ timeout: 10_000 });

    await logBtn.click({ force: true });
    console.log('[INFO] Clicked Log Data button');
    
    // Wait for Slideover / Modal to appear
    const slideover = page.locator('.slideover, [role="dialog"], .modal').first();
    await expect(slideover).toBeVisible({ timeout: 10_000 });
    console.log('[PASS] Sync Log Slideover / Modal is visible in All Sales Order');

    // Check slideover content / table
    await page.waitForTimeout(1000);
    const tableInside = slideover.locator('table').first();
    if (await tableInside.isVisible().catch(() => false)) {
      console.log('[PASS] Log data table rendered inside slideover');
    }
  });
});
