import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test.describe.configure({ retries: 0 });

test('Send to Default Waves for SO-5U7TQKCP and check whether it disappears with or without refresh', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const companyId = '153';
  const soCode = 'SO-5U7TQKCP';

  console.log('--- 1. PREPARE SESSION & GOTO UNASSIGN WAVE PAGE ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  console.log('--- 2. SEARCH FOR SALES ORDER SO-5U7TQKCP IN UNASSIGN WAVE ---');
  const searchInput = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
  if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchInput.fill(soCode);
    await searchInput.press('Enter');
    await page.waitForTimeout(2000);
  }

  // Find the row containing SO-5U7TQKCP
  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(soCode, 'i') }).first();
  await expect(row, 'Row for ' + soCode).toBeVisible({ timeout: 20000 });
  console.log('Found row for SO in Unassign Wave table:', await row.innerText());

  console.log('--- 3. CLICK SEND TO DEFAULT WAVE (1x CLICK ONLY) ---');
  // Find Send to Default Wave button in row
  const sendToWaveBtn = row.locator('button.send-to-wave, button:has-text("Send to Default Wave"), button:has-text("Send to default wave")').first();
  await expect(sendToWaveBtn, 'Send to Default Wave button in row').toBeVisible({ timeout: 10000 });
  
  await sendToWaveBtn.click({ force: true });
  console.log('Clicked Send to Default Wave button 1x.');

  console.log('--- 4. WAIT FOR NOTIFICATION POPUP ---');
  const toastNotification = page.locator('.toast, div[role="alert"], .notification, .alert-success, .text-success').first();
  // Wait for notification or network response
  await page.waitForTimeout(3000);
  const notificationText = await toastNotification.innerText().catch(() => 'Notification displayed');
  console.log('Notification result:', notificationText);

  console.log('--- 5. CHECK WHETHER ROW DISAPPEARS IMMEDIATELY WITHOUT REFRESH ---');
  await page.waitForTimeout(3000);
  const isRowVisibleWithoutRefresh = await row.isVisible().catch(() => false);
  console.log('Is row still visible WITHOUT refresh?', isRowVisibleWithoutRefresh);

  console.log('--- 6. REFRESH PAGE AND CHECK IF ROW DISAPPEARS AFTER REFRESH ---');
  await page.reload();
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  // Search again after refresh
  const searchAfterReload = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
  if (await searchAfterReload.isVisible({ timeout: 5000 }).catch(() => false)) {
    await searchAfterReload.fill(soCode);
    await searchAfterReload.press('Enter');
    await page.waitForTimeout(2000);
  }

  const rowAfterReload = page.locator('table tbody tr').filter({ hasText: new RegExp(soCode, 'i') }).first();
  const isRowVisibleAfterRefresh = await rowAfterReload.isVisible().catch(() => false);
  console.log('Is row visible AFTER refresh?', isRowVisibleAfterRefresh);

  console.log('=== SUMMARY RESULT ===');
  console.log('SO Code:', soCode);
  console.log('Row visible before send: YES');
  console.log('Row visible immediately after notification (without refresh):', isRowVisibleWithoutRefresh ? 'STILL VISIBLE' : 'DISAPPEARED AUTOMATICALLY');
  console.log('Row visible after page refresh:', isRowVisibleAfterRefresh ? 'STILL VISIBLE' : 'DISAPPEARED / GONE');
});
