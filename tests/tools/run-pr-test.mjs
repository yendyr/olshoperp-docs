import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = '/Users/admin/.gemini/antigravity-ide/brain/f2c96fc5-ff9f-414d-acd7-05aec511b2d1/scratch/screenshots';
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function run() {
  console.log('--- Launching Playwright Chromium ---');
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  const apiLogs = [];
  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/') && (url.includes('purchase-return') || url.includes('stock') || url.includes('product'))) {
      try {
        const status = res.status();
        const text = await res.text();
        apiLogs.push({ url, status, body: text.substring(0, 1000) });
      } catch (e) {}
    }
  });

  console.log('1. Navigating to Login page...');
  await page.goto('https://staging.olshoperp.com/login', { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_login_page.png') });

  console.log('2. Entering credentials for tim_dev@mail.com...');
  await page.locator('input[placeholder*="Email" i], input[type="email"], #email').first().fill('tim_dev@mail.com');
  await page.locator('input[placeholder*="Password" i], input[type="password"], #password').first().fill('12345678');
  await page.locator('button:has-text("Login"), button[type="submit"]').first().click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 45000 });
  console.log('Logged in successfully! Current URL:', page.url());
  await page.waitForTimeout(2000);

  // Check and switch company to Dev Staging (ID: 13)
  console.log('3. Checking active company in localStorage...');
  const currentCompanyRaw = await page.evaluate(() => localStorage.getItem('company'));
  let currentCompany = {};
  try {
    currentCompany = JSON.parse(currentCompanyRaw || '{}');
  } catch (e) {}
  console.log('Active Company:', currentCompany?.data?.id, currentCompany?.data?.name);

  if (currentCompany?.data?.id !== 13) {
    console.log('Switching company to Dev Staging (ID: 13)...');
    const profileTrigger = page.locator('.topbar .rounded-full.image-fit, .topbar img[alt*="Profile"]').first();
    await profileTrigger.click();
    await page.waitForTimeout(500);

    const switchBtn = page.getByText('Switch Company', { exact: true });
    if (await switchBtn.isVisible()) {
      await switchBtn.click();
      await page.waitForTimeout(500);

      const searchInput = page.getByPlaceholder(/search company|find company|filter company/i);
      if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await searchInput.fill('Dev Staging');
        await page.waitForTimeout(500);
      }

      const devStagingItem = page.getByRole('menuitem', { name: 'Dev Staging' }).or(page.locator('text="Dev Staging"')).first();
      await devStagingItem.click();
      await page.waitForTimeout(500);

      const proceedBtn = page.getByRole('button', { name: /^Proceed$/i }).or(page.locator('button:has-text("Proceed")')).first();
      if (await proceedBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await proceedBtn.click();
      }
      await page.waitForTimeout(3000);
    }
  }

  const verifiedCompanyRaw = await page.evaluate(() => localStorage.getItem('company'));
  console.log('Verified Company:', verifiedCompanyRaw);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_dashboard_dev_staging.png') });

  // Navigate to Purchase Return List
  console.log('4. Navigating to /accounting/purchase-return...');
  await page.goto('https://staging.olshoperp.com/accounting/purchase-return', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_purchase_return_list.png') });

  // Get list table headers
  const listHeaders = await page.locator('table thead th').allInnerTexts().catch(() => []);
  console.log('Purchase Return List Headers:', listHeaders);

  // Navigate to target document edit page (132654)
  console.log('5. Navigating to Purchase Return Edit (ID: 132654)...');
  await page.goto('https://staging.olshoperp.com/accounting/purchase-return/edit/132654', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_purchase_return_edit_132654.png'), fullPage: true });

  // Inspect detail section headers
  console.log('6. Inspecting Purchase Return Detail Section...');
  const detailHeaders = await page.locator('table thead th, .table thead th').allInnerTexts().catch(() => []);
  console.log('All visible table headers on edit page:', detailHeaders);

  // Check specific column presence and position
  const hasUnitPrice = detailHeaders.some(h => /unit price/i.test(h));
  const hasTotalPrice = detailHeaders.some(h => /total price/i.test(h));
  const hasLocation = detailHeaders.some(h => /location/i.test(h));

  console.log(`Column check:
- Has Unit Price (Before VAT): ${hasUnitPrice}
- Has Total Price Return: ${hasTotalPrice}
- Has Location: ${hasLocation}`);

  // Check rows in detail table
  const detailRows = await page.locator('table tbody tr').allInnerTexts().catch(() => []);
  console.log('Detail Rows count:', detailRows.length);
  if (detailRows.length > 0) {
    console.log('Sample detail row text:', detailRows[0]);
  }

  // Inspect Available Product modal
  console.log('7. Opening Available Product Modal...');
  const addProductBtn = page.locator('button:has-text("Add Product"), button:has-text("Available Product"), button:has-text("Select"), .btn:has-text("Product")').first();
  let modalHeaders = [];
  let modalSampleRows = [];
  if (await addProductBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    console.log('Clicking Add Product button...');
    await addProductBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_available_product_modal.png') });

    modalHeaders = await page.locator('.modal table thead th, [role="dialog"] table thead th').allInnerTexts().catch(() => []);
    console.log('Available Product Modal Headers:', modalHeaders);

    modalSampleRows = await page.locator('.modal table tbody tr, [role="dialog"] table tbody tr').slice(0, 5).allInnerTexts().catch(() => []);
    console.log('Available Product Sample Rows count:', modalSampleRows.length);
    if (modalSampleRows.length > 0) {
      console.log('Sample Modal Row 1:', modalSampleRows[0]);
    }

    // Close modal
    const closeBtn = page.locator('.modal button:has-text("Close"), .modal button:has-text("Cancel"), [role="dialog"] button.close, .modal .close').first();
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(1000);
    }
  } else {
    console.log('Add product button not found with standard selectors. Inspecting buttons on page:');
    const allButtons = await page.locator('button, .btn').allInnerTexts().catch(() => []);
    console.log('Available buttons:', allButtons);
  }

  // Navigate to Show Page
  console.log('8. Navigating to Purchase Return Show Page (ID: 132654)...');
  await page.goto('https://staging.olshoperp.com/accounting/purchase-return/show/132654', { waitUntil: 'domcontentloaded' }).catch(() => {
    return page.goto('https://staging.olshoperp.com/accounting/purchase-return/132654', { waitUntil: 'domcontentloaded' });
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_purchase_return_show_132654.png'), fullPage: true });

  const showHeaders = await page.locator('table thead th').allInnerTexts().catch(() => []);
  console.log('Show Page Table Headers:', showHeaders);

  const results = {
    testedAt: new Date().toISOString(),
    environment: 'Staging',
    companyId: 13,
    companyName: 'Dev Staging',
    documentTested: 132654,
    editPageHeaders: detailHeaders,
    showPageHeaders: showHeaders,
    modalHeaders: modalHeaders,
    hasUnitPriceInDetail: hasUnitPrice,
    hasTotalPriceInDetail: hasTotalPrice,
    hasLocationInDetail: hasLocation,
    sampleDetailRows: detailRows.slice(0, 3),
    sampleModalRows: modalSampleRows.slice(0, 3),
    apiLogsCount: apiLogs.length,
  };

  fs.writeFileSync(
    '/Users/admin/.gemini/antigravity-ide/brain/f2c96fc5-ff9f-414d-acd7-05aec511b2d1/scratch/etm15858_execution_results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('Saved test results to scratch/etm15858_execution_results.json');

  await browser.close();
  console.log('--- Test Completed ---');
}

run().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
