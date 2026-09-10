import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('Test Export on Merdian Server for Product Profit Loss', async ({ page }) => {
  test.setTimeout(90000);

  const logs: string[] = [];
  page.on('console', msg => {
    const text = `[BROWSER ${msg.type()}]: ${msg.text()}`;
    logs.push(text);
    console.log(text);
  });

  page.on('pageerror', err => {
    const text = `[PAGE ERROR]: ${err.message}`;
    logs.push(text);
    console.log(text);
  });

  page.on('request', req => {
    if (req.url().includes('/api/')) {
      console.log(`[API REQ] ${req.method()} ${req.url()}`);
    }
  });

  page.on('response', async resp => {
    if (resp.url().includes('/api/')) {
      const status = resp.status();
      console.log(`[API RESP ${status}] ${resp.url()}`);
      if (status >= 400) {
        try {
          const body = await resp.text();
          console.log(`[API ERROR BODY]:`, body);
        } catch (e) {}
      }
      if (resp.url().includes('export')) {
        try {
          const body = await resp.text();
          console.log(`[EXPORT API RESP BODY]:`, body);
        } catch (e) {}
      }
    }
  });

  console.log('=== STEP 1: LOGIN TO MERDIAN ===');
  await page.goto('https://merdian.olshoperp.com/login');
  await page.waitForLoadState('networkidle');

  await page.locator('input[type="email"], input[name="email"], #email').first().fill('yemimamerdian@gmail.com');
  await page.locator('input[type="password"], input[name="password"], #password').first().fill('12345678');
  await page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Sign In"), button:has-text("Login")').first().click();

  await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 30000 });
  console.log('Logged in successfully, current URL:', page.url());

  console.log('=== STEP 2: NAVIGATE TO PRODUCT PROFIT LOSS ===');
  await page.goto('https://merdian.olshoperp.com/accounting/product-profit-loss');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);
  console.log('Current URL after navigation:', page.url());

  // Screenshot initial page
  await page.screenshot({ path: 'test-results/merdian_step1_ppl_page.png', fullPage: true });

  console.log('=== STEP 3: CLICK EXPORT BUTTON ON TOP RIGHT OF DATATABLE ===');
  // Find the export button in the datatable header
  const datatableExportBtn = page.locator('button.dt-btn-export, button:has-text("Export"), a:has-text("Export")').first();
  console.log('Datatable Export button visible:', await datatableExportBtn.isVisible().catch(() => false));
  
  if (await datatableExportBtn.isVisible()) {
    await datatableExportBtn.click();
    console.log('Clicked datatable export button');
    await page.waitForTimeout(3000);
  } else {
    // try clicking any export button visible
    await page.locator('button:has-text("Export")').first().click({ force: true });
    await page.waitForTimeout(3000);
  }

  // Screenshot after opening export slider
  await page.screenshot({ path: 'test-results/merdian_step2_slider_open.png', fullPage: true });

  console.log('=== STEP 4: IN SLIDER MODAL, CLICK EXPORT BUTTON & SELECT ALL ===');
  // The export button inside the slider table header
  const sliderExportDropdownBtn = page.locator('.p-sidebar button:has-text("Export"), .dt-button:has-text("Export"), [data-pc-name="sidebar"] button:has-text("Export")').last();
  console.log('Slider Export dropdown button visible:', await sliderExportDropdownBtn.isVisible().catch(() => false));

  if (await sliderExportDropdownBtn.isVisible()) {
    await sliderExportDropdownBtn.click();
    console.log('Clicked slider export dropdown button');
    await page.waitForTimeout(1500);

    await page.screenshot({ path: 'test-results/merdian_step3_dropdown_open.png', fullPage: true });

    // Look for dropdown menu items
    const allOption = page.locator('button:has-text("All"), li:has-text("All"), a:has-text("All")').filter({ hasText: /^All$/i }).first();
    const isAllVis = await allOption.isVisible().catch(() => false);
    console.log('Exact "All" option visible:', isAllVis);

    if (isAllVis) {
      await allOption.click();
      console.log('Clicked "All" option');
    } else {
      console.log('Trying general "All" locator...');
      await page.getByRole('button', { name: 'All', exact: true }).or(page.getByText('All', { exact: true })).first().click({ force: true });
      console.log('Clicked All via fallback');
    }
  }

  console.log('=== STEP 5: WAIT & OBSERVE EXPORT PROCESSING / RESULTS ===');
  await page.waitForTimeout(15000);

  // Check for any alerts / toast messages / progress bar
  const toast = page.locator('.p-toast, [role="alert"]');
  if (await toast.first().isVisible().catch(() => false)) {
    console.log('Toast notification visible:', await toast.first().innerText());
  }

  // Screenshot final state
  await page.screenshot({ path: 'test-results/merdian_step4_final_state.png', fullPage: true });
  console.log('=== TEST EXECUTION COMPLETED ===');
});
