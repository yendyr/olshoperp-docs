import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

test.describe('ETM-15746 — Instant Settlement Approval Error Wording Verification', () => {
  const companyCode = 'FAT';

  test('[@ETM-15746] Verify settlement approval error wording on ST-5UBPORWI / ST-5UBORUN5', async ({ page }) => {
    test.setTimeout(180_000);

    // 1. Prepare session in company FAT
    console.log('Step 1: Preparing session for company FAT...');
    await prepareSession(page, {
      companyCode,
      targetPath: '/accounting/settlement-upload',
    });

    console.log('Step 2: Navigating to /accounting/settlement-upload...');
    await page.goto('/accounting/settlement-upload', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle').catch(() => undefined);
    await page.waitForTimeout(4000);

    // Setup listener for approve API responses
    let approveApiResponseStatus: number | null = null;
    let approveApiResponseBody: any = null;

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('approve') || url.includes('settlement')) {
        const status = response.status();
        try {
          const body = await response.json();
          console.log(`[API Response] ${response.request().method()} ${url} (${status}):`, JSON.stringify(body));
          if (url.includes('approve') && response.request().method() === 'POST') {
            approveApiResponseStatus = status;
            approveApiResponseBody = body;
          }
        } catch (e) {
          // ignore
        }
      }
    });

    // 2. Find row ST-5UBPORWI or ST-5UBORUN5
    const targetRow = page.locator('table tbody tr').filter({ hasText: 'ST-5UBPORWI' }).first();
    await expect(targetRow).toBeVisible({ timeout: 15_000 });
    console.log('Step 3: Located target row ST-5UBPORWI');

    // 3. Click the Approve button (svg.fa-circle-check inside target row)
    const approveBtn = targetRow.locator('button:has(svg[data-icon="circle-check"]), button svg[data-icon="circle-check"]').first();
    await expect(approveBtn).toBeVisible({ timeout: 10_000 });
    console.log('Step 4: Clicking Approve button (fa-circle-check)...');
    await approveBtn.click();
    await page.waitForTimeout(2000);

    // 4. Check for Confirmation Modal / Approval Dialog
    const confirmModal = page.locator('[role="dialog"], .modal, div.fixed.inset-0').last();
    const isModalVisible = await confirmModal.isVisible().catch(() => false);
    console.log('Confirmation dialog visible?', isModalVisible);

    if (isModalVisible) {
      const confirmButton = confirmModal.locator('button').filter({ hasText: /Approve|Yes|Confirm|Setuju/i }).last();
      if (await confirmButton.isVisible()) {
        console.log('Step 5: Clicking confirm button in modal...');
        await confirmButton.click();
      }
    }

    // 5. Wait for toast / notification & API response
    await page.waitForTimeout(4000);

    // 6. Inspect Toastify / Toast notification
    const toast = page.locator('.toastify, [class*="toast"]').first();
    const isToastVisible = await toast.isVisible().catch(() => false);
    const toastText = isToastVisible ? await toast.innerText() : '';
    console.log('Toast notification text:', toastText);

    await page.screenshot({ path: 'tests/scratch/settlement-approval-toast.png', fullPage: true });

    console.log('Approve API Status:', approveApiResponseStatus);
    console.log('Approve API Response Body:', JSON.stringify(approveApiResponseBody));

    // Expected wording: "Unable to approve settlement, the transaction date of all invoices must be within a single day."
    const expectedMessage = 'Unable to approve settlement, the transaction date of all invoices must be within a single day.';

    expect(approveApiResponseStatus).toBe(422);
    expect(approveApiResponseBody?.status?.message).toBe(expectedMessage);
    if (isToastVisible) {
      expect(toastText).toContain('Unable to approve settlement, the transaction date of all invoices must be within a single day');
    }

    console.log('[PASS] ETM-15746 wording verification successful and matches specification exactly!');
  });
});
