import { chromium } from '@playwright/test';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const apiResponses = [];

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/api/')) {
      try {
        const json = await res.json();
        apiResponses.push({ url, json });
      } catch (e) {}
    }
  });

  await page.goto('https://staging.olshoperp.com/login', { waitUntil: 'domcontentloaded' });
  await page.locator('input[placeholder*="Email" i], input[type="email"], #email').first().fill('tim_dev@mail.com');
  await page.locator('input[placeholder*="Password" i], input[type="password"], #password').first().fill('12345678');
  await page.locator('button:has-text("Login"), button[type="submit"]').first().click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 45000 });
  await page.waitForTimeout(1000);

  // Switch to Dev Staging (id: 13) if needed
  const comp = await page.evaluate(() => JSON.parse(localStorage.getItem('company') || '{}'));
  if (comp?.data?.id !== 13) {
    await page.evaluate(() => {
      const c = JSON.parse(localStorage.getItem('company') || '{}');
      c.data = { id: 13, code: 'DEV-STG', name: 'Dev Staging' };
      localStorage.setItem('company', JSON.stringify(c));
    });
  }

  console.log('Navigating to Edit 132654...');
  await page.goto('https://staging.olshoperp.com/accounting/purchase-return/edit/132654', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  // Extract all table data
  const rows = await page.evaluate(() => {
    const trs = Array.from(document.querySelectorAll('table tbody tr'));
    return trs.map(tr => {
      const tds = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
      return tds;
    });
  });

  console.log('Extracted Rows count:', rows.length);
  rows.forEach((r, i) => console.log(`Row ${i + 1}:`, JSON.stringify(r)));

  // Look for Select To input
  const selectTo = await page.locator('input[placeholder*="Select" i], .vs__search, [id*="select_to"], [name*="select_to"]').all();
  console.log('Found select inputs count:', selectTo.length);

  // Look for any Available Product button or tab or link
  const allClickables = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button, a, .tab, .btn, span'));
    return els
      .map(e => e.innerText.trim())
      .filter(t => /available|product|item|add|stock/i.test(t));
  });
  console.log('Clickable elements related to product/available:', [...new Set(allClickables)]);

  fs.writeFileSync(
    '/Users/admin/.gemini/antigravity-ide/brain/f2c96fc5-ff9f-414d-acd7-05aec511b2d1/scratch/pr_edit_api_responses.json',
    JSON.stringify(apiResponses, null, 2)
  );

  await browser.close();
}

run().catch(console.error);
