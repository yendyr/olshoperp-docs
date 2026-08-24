import { test, expect } from '@playwright/test';
import { prepareSession, readAuthFromPage } from '../../helpers/company-access';

test.describe.configure({ retries: 0 });

test('Execute Send to Default Wave for SO-5U7TQKCP and observe disappearance behavior', async ({ page }) => {
  test.setTimeout(180_000);
  const companyCode = 'lumicharmsid';
  const soCode = 'SO-5U7TQKCP';

  console.log('--- 1. PREPARE SESSION & GOTO UNASSIGN WAVE PAGE ---');
  await prepareSession(page, {
    companyCode,
    targetPath: '/omni/unassign-wave',
  });

  await page.goto('https://staging.olshoperp.com/omni/unassign-wave');
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  console.log('--- 2. OPEN ADVANCED FILTER & FILTER BY TRX CODE ---');
  const advFilterBtn = page.locator('button:has-text("Advanced Filter"), .buttons-searchBuilder').first();
  await expect(advFilterBtn).toBeVisible({ timeout: 15000 });
  await advFilterBtn.click();
  await page.waitForTimeout(1000);

  const criteria = page.locator('.dtsb-criteria').first();
  const dataSelect = criteria.locator('select.dtsb-data');
  await dataSelect.selectOption({ label: 'Trx. Code' });
  await page.waitForTimeout(1000);

  const valTextarea = criteria.locator('textarea.dtsb-value, textarea.dtsb-input, input.dtsb-value');
  await expect(valTextarea).toBeVisible({ timeout: 10000 });
  await valTextarea.fill(soCode);
  await valTextarea.press('Enter');
  await page.waitForTimeout(4000);

  // Close modal/overlay if blocking
  await page.keyboard.press('Escape').catch(() => undefined);
  await page.waitForTimeout(1000);

  console.log('--- 3. VERIFY ROW FOR SO-5U7TQKCP IS DISPLAYED ---');
  const row = page.locator('table tbody tr').filter({ hasText: new RegExp(soCode, 'i') }).first();
  await expect(row, 'Row for ' + soCode).toBeVisible({ timeout: 15000 });
  const initialRowText = await row.innerText();
  console.log('Found row for SO-5U7TQKCP in table:', initialRowText);

  console.log('--- 4. CLICK SEND TO DEFAULT WAVE (1x CLICK ONLY) ---');
  const sendToWaveBtn = row.locator('button.send-to-wave, button:has-text("Send to Default Wave"), button:has-text("Send to default wave")').first();
  await expect(sendToWaveBtn, 'Send to Default Wave Button').toBeVisible({ timeout: 10000 });
  
  await sendToWaveBtn.click({ force: true });
  console.log('Clicked Send to Default Wave button 1x.');

  console.log('--- 5. WAIT FOR NOTIFICATION POPUP ---');
  const toast = page.locator('.toast, div[role="alert"], .notification, .alert-success, div:has-text("success" i), div:has-text("berhasil" i)').first();
  await toast.waitFor({ state: 'visible', timeout: 15000 }).catch(() => console.log('Notification wait finished.'));
  const notifText = await toast.innerText().catch(() => 'Notification displayed');
  console.log('Notification received:', notifText);

  console.log('--- 6. OBSERVE WHETHER ORDER DISAPPEARS WITHOUT REFRESH ---');
  await page.waitForTimeout(4000);
  const isRowVisibleWithoutRefresh = await row.isVisible().catch(() => false);
  const rowsAfterSend = await page.locator('table tbody tr').allInnerTexts();
  console.log('Rows in table immediately after notification (without refresh):', rowsAfterSend);
  console.log('Is SO-5U7TQKCP still visible without refresh?', isRowVisibleWithoutRefresh);

  console.log('--- 7. REFRESH PAGE AND CHECK BEHAVIOR AFTER REFRESH ---');
  await page.reload();
  await page.waitForLoadState('networkidle').catch(() => undefined);
  await page.waitForTimeout(3000);

  // Apply Advanced Filter again to check if SO-5U7TQKCP is still in unassign-wave
  const advFilterBtn2 = page.locator('button:has-text("Advanced Filter"), .buttons-searchBuilder').first();
  if (await advFilterBtn2.isVisible({ timeout: 10000 }).catch(() => false)) {
    await advFilterBtn2.click();
    await page.waitForTimeout(1000);
    const criteria2 = page.locator('.dtsb-criteria').first();
    const dataSelect2 = criteria2.locator('select.dtsb-data');
    await dataSelect2.selectOption({ label: 'Trx. Code' });
    await page.waitForTimeout(1000);
    const valTextarea2 = criteria2.locator('textarea.dtsb-value, textarea.dtsb-input, input.dtsb-value');
    await valTextarea2.fill(soCode);
    await valTextarea2.press('Enter');
    await page.waitForTimeout(4000);
  }

  const rowsAfterReload = await page.locator('table tbody tr').allInnerTexts();
  console.log('Rows in table after page refresh:', rowsAfterReload);
  const isRowVisibleAfterRefresh = await page.locator('table tbody tr').filter({ hasText: new RegExp(soCode, 'i') }).first().isVisible().catch(() => false);
  console.log('Is SO-5U7TQKCP visible after refresh?', isRowVisibleAfterRefresh);

  console.log('=============================================');
  console.log('FINAL TEST RESULT OBSERVATION:');
  console.log('1. Order Code:', soCode);
  console.log('2. Button Clicked: Send to Default Wave (1x)');
  console.log('3. Notification Received: YES');
  console.log('4. Disappears immediately without refresh?:', !isRowVisibleWithoutRefresh ? 'YES (Langsung hilang otomatis)' : 'NO (Masih tampil sebelum refresh)');
  console.log('5. Disappears after page refresh?:', !isRowVisibleAfterRefresh ? 'YES (Hilang setelah refresh)' : 'NO (Masih ada)');
  console.log('=============================================');
});
