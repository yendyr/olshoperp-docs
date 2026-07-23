import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { OlshopMultiselect } from '../../helpers/shared';

/**
 * One-off seed: Bulk select → Start Checking (toolbar) → Check → Complete & Next (2 SO).
 * Target: SO-5TU4LJIU, SO-5TU4UD5F (lumicharmsid).
 *
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   $env:NODE_OPTIONS="--max-old-space-size=4096"
 *   npx playwright test tests/specs/omni-checking-list/seed-bulk-start-complete-checklist-2so.spec.ts --project=authenticated --workers=1 --retries=0 --trace=off
 */

const CHECKING_LIST_PATH = '/omni/checking-list';
const TARGET_SOS = ['SO-5TU4LJIU', 'SO-5TU4UD5F'] as const;

type ClRowInfo = {
  soCode: string;
  row: Locator;
  clCode: string;
  alreadyComplete: boolean;
  rowText: string;
};

function isClListRequest(url: string): boolean {
  return (
    url.includes('/omnichannel/checking-list') &&
    !url.includes('/checking-list-detail') &&
    !url.includes('/set-location') &&
    !url.includes('/approve') &&
    !url.includes('/select2') &&
    !url.includes('/get-tocheck') &&
    !url.includes('/checking-info') &&
    !url.includes('/print-bulk')
  );
}

async function waitLoadingGone(page: Page) {
  const loading = page.getByText('Loading...', { exact: true });
  await loading.waitFor({ state: 'hidden', timeout: 90_000 }).catch(() => undefined);
  await page
    .locator('.dt-processing, .dataTables_processing, .p-datatable-loading-overlay')
    .waitFor({ state: 'hidden', timeout: 30_000 })
    .catch(() => undefined);
}

async function waitForClListAjax(page: Page, timeout = 90_000) {
  await page.waitForResponse(
    (res) =>
      isClListRequest(res.url()) &&
      res.request().method() === 'POST' &&
      res.ok(),
    { timeout },
  );
}

function clSearchInput(page: Page): Locator {
  return page
    .locator(
      [
        '.dt-search input[type="search"]',
        '.dt-search input.dt-input',
        '.dataTables_filter input[type="search"]',
        'input[type="search"]',
      ].join(', '),
    )
    .or(page.getByRole('searchbox'))
    .first();
}

async function searchCl(page: Page, query: string) {
  const input = clSearchInput(page);
  await expect(input, 'Searchbox Checking List').toBeVisible({ timeout: 60_000 });
  const ajax = waitForClListAjax(page, 45_000).catch(() => undefined);
  await input.fill('');
  await input.fill(query);
  await Promise.race([ajax, page.waitForTimeout(3_000)]);
  await page.waitForTimeout(800);
  await waitLoadingGone(page);
}

function parseClFromRowText(text: string): string {
  const clMatch = text.match(/CL-[A-Z0-9]+/i);
  if (clMatch) return clMatch[0];
  const nameMatch = text.match(/Checking List\s*-\s*([A-Z0-9-]+)/i);
  return nameMatch ? nameMatch[1] : '(CL?)';
}

function isCompleteRowText(text: string): boolean {
  return /\bComplete\b/i.test(text) && !/\bIncomplete\b/i.test(text);
}

async function findTargetRows(page: Page): Promise<ClRowInfo[]> {
  const results: ClRowInfo[] = [];
  for (const soCode of TARGET_SOS) {
    let found: ClRowInfo | null = null;
    for (let attempt = 1; attempt <= 6; attempt++) {
      // eslint-disable-next-line no-console
      console.log(`[SEED] Find ${soCode} attempt=${attempt}`);
      await searchCl(page, soCode);
      const row = page.getByRole('row').filter({ hasText: soCode }).first();
      if (await row.isVisible({ timeout: 5_000 }).catch(() => false)) {
        const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
        found = {
          soCode,
          row,
          clCode: parseClFromRowText(text),
          alreadyComplete: isCompleteRowText(text),
          rowText: text,
        };
        break;
      }
      await page.waitForTimeout(4_000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
      await waitForClListAjax(page, 60_000).catch(() => undefined);
      await waitLoadingGone(page);
    }
    if (found) results.push(found);
  }
  return results;
}

async function selectRowCheckbox(row: Locator) {
  const cell = row.locator('td').first();
  const cb = cell.locator('input[type="checkbox"]').first();
  if (await cb.isVisible({ timeout: 2_000 }).catch(() => false)) {
    if (!(await cb.isChecked().catch(() => false))) {
      await cb.click({ force: true });
    }
    return;
  }
  await cell.click({ force: true });
}

async function clickBulkStartCheckingAboveTable(page: Page) {
  // DataList: <Button role="link">Start Checking</Button> (bukan per-row icon)
  const bulkBtn = page
    .getByRole('link', { name: /^Start\s*Checking$/i })
    .or(page.getByRole('button', { name: /^Start\s*Checking$/i }))
    .or(page.locator('button, a, [role="link"]').filter({ hasText: /^Start\s*Checking$/i }))
    .locator('visible=true')
    .first();
  await expect(bulkBtn, 'Start Checking di atas tabel').toBeVisible({
    timeout: 20_000,
  });
  if (await bulkBtn.isDisabled().catch(() => false)) {
    throw new Error('Toolbar Start Checking disabled');
  }
  await bulkBtn.click();
  await page.waitForURL(/\/omni\/checking-list\/(set-location|edit)\/\d+/, {
    timeout: 60_000,
  });
}

async function clickStartCheckingOnRow(page: Page, row: Locator) {
  const startBtn = row
    .locator(
      'button.tooltip-start-checking, button.tooltip-resume-checking, button.tooltip-continue-checking, button#updateButton',
    )
    .first();
  await expect(startBtn).toBeVisible({ timeout: 20_000 });
  await startBtn.click();
  await page.waitForURL(/\/omni\/checking-list\/(set-location|edit)\/\d+/, {
    timeout: 60_000,
  });
}

async function chooseAnyLocationAndStart(page: Page): Promise<string> {
  const multi = new OlshopMultiselect(page);
  const locationBox = page
    .locator(
      [
        '[aria-placeholder="Choose Location"]',
        '[aria-placeholder*="Choose Location"]',
        '.multiselect-search[aria-placeholder*="Location"]',
      ].join(', '),
    )
    .locator('visible=true')
    .first();

  if (!(await locationBox.isVisible({ timeout: 8_000 }).catch(() => false))) {
    return '(lokasi sudah ter-set)';
  }

  await multi.open(locationBox);
  await page.waitForTimeout(700);
  const option = multi.visibleOptions().first();
  await expect(option).toBeVisible({ timeout: 30_000 });
  const label =
    ((await option.textContent()) || '').trim() || '(lokasi tanpa label)';
  await option.click();
  await page.waitForTimeout(400);

  const startBtn = page.getByRole('button', { name: /Start\s*Checking/i }).first();
  await expect(startBtn).toBeVisible({ timeout: 15_000 });
  const setLoc = page.waitForResponse(
    (res) =>
      res.url().includes('/set-location') && res.request().method() === 'POST',
    { timeout: 60_000 },
  );
  await startBtn.click();
  await setLoc.catch(() => undefined);
  await page
    .waitForURL(/\/omni\/checking-list\/edit\/\d+/, { timeout: 90_000 })
    .catch(() => undefined);
  await waitLoadingGone(page);
  return label;
}

async function dismissDocsAssistant(page: Page) {
  const closeBtn = page.getByRole('button', {
    name: /Close documentation assistant/i,
  });
  if (await closeBtn.isVisible({ timeout: 1_500 }).catch(() => false)) {
    await closeBtn.click({ force: true }).catch(() => undefined);
  }
  await page.keyboard.press('Escape').catch(() => undefined);
}

async function readCurrentSoOnForm(page: Page): Promise<string> {
  // Expand Order Details jika collapse
  const hdr = page.getByRole('button', { name: /Order Details/i }).first();
  if (await hdr.isVisible({ timeout: 3_000 }).catch(() => false)) {
    if ((await hdr.getAttribute('aria-expanded')) !== 'true') {
      await hdr.click().catch(() => undefined);
      await page.waitForTimeout(500);
    }
  }
  const orderNo = page.locator('text=/Order No:\\s*SO-[A-Z0-9]+/i').first();
  if (await orderNo.isVisible({ timeout: 8_000 }).catch(() => false)) {
    const t = ((await orderNo.textContent()) || '').trim();
    const m = t.match(/SO-[A-Z0-9]+/i);
    if (m) return m[0].toUpperCase();
  }
  const body = ((await page.locator('body').innerText().catch(() => '')) || '')
    .replace(/\s+/g, ' ')
    .slice(0, 2500);
  const m2 = body.match(/SO-5TU4[A-Z0-9]+/i);
  return m2 ? m2[0].toUpperCase() : '';
}

async function formLooksAlreadyDone(page: Page): Promise<boolean> {
  if (
    await page
      .getByText(/Checked By\/Location/i)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false)
  ) {
    return true;
  }
  const actionBtns = page.locator(
    '.p-datatable-tbody tr button.action-button, tbody tr button.action-button',
  );
  const actionCount = await actionBtns.count().catch(() => 0);
  const zero = await page
    .getByText(/0\s+out of\s+\d+\s+items\s+unchecked/i)
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  // Sudah checked semua + tidak ada tombol Check = anggap done (jangan approve lagi)
  if (zero && actionCount === 0) return true;
  return false;
}

async function selectAllSkusAndCheck(
  page: Page,
): Promise<{ checked: number; checkOk: boolean; checkMsg: string }> {
  await dismissDocsAssistant(page);
  await page
    .locator('.p-datatable, table')
    .first()
    .waitFor({ state: 'visible', timeout: 60_000 });
  await waitLoadingGone(page);
  await page.waitForTimeout(1_000);

  const headerCb = page
    .locator(
      'th .p-checkbox input, thead .p-checkbox input, .p-datatable-thead input[type="checkbox"]',
    )
    .first();
  if (await headerCb.isVisible({ timeout: 8_000 }).catch(() => false)) {
    if (!(await headerCb.isChecked().catch(() => false))) {
      await headerCb.click({ force: true });
    }
    await page.waitForTimeout(500);
  }

  const rowChecks = page.locator(
    '.p-datatable-tbody tr button.action-button, tbody tr button.action-button',
  );
  const count = await rowChecks.count();
  let clicked = 0;
  let checkOk = false;
  let checkMsg = '';

  for (let i = 0; i < count; i++) {
    const btn = rowChecks.nth(i);
    if (!(await btn.isVisible().catch(() => false))) continue;
    const html = (await btn.innerHTML().catch(() => '')) || '';
    if (/trash|cart-arrow|delete/i.test(html)) continue;
    if (
      !html.includes('check-to-slot') &&
      !html.includes('fa-check') &&
      !html.includes('svg')
    ) {
      continue;
    }

    const checkAjax = page.waitForResponse(
      (r) =>
        /checking-list-detail\/\d+\/check|bulk-check/i.test(r.url()) &&
        r.request().method() === 'POST',
      { timeout: 90_000 },
    );
    await btn.click({ force: true });
    const res = await checkAjax.catch(() => null);
    clicked += 1;
    if (res?.ok()) {
      const body = await res.json().catch(() => null);
      if (Number(body?.status?.error ?? 0) === 0) {
        checkOk = true;
        checkMsg = body?.status?.message || body?.message || `HTTP ${res.status()}`;
      }
    }
    await page.waitForTimeout(500);
  }

  checkMsg = `clicked=${clicked}/${count} | ${checkMsg}`;

  if (
    await page
      .getByText(/0\s+out of\s+\d+\s+items\s+unchecked/i)
      .first()
      .isVisible({ timeout: 5_000 })
      .catch(() => false)
  ) {
    checkOk = true;
    checkMsg = `${checkMsg} | UI: 0 unchecked`;
  }

  return { checked: clicked, checkOk, checkMsg };
}

async function clickCompleteAndNext(
  page: Page,
): Promise<{ ok: boolean; message: string; navigatedNext: boolean }> {
  if (await formLooksAlreadyDone(page)) {
    return { ok: true, message: 'Sudah complete', navigatedNext: false };
  }

  const completeBtn = page
    .getByRole('button', { name: /Complete\s*&\s*Next/i })
    .or(page.locator('button').filter({ hasText: /^Complete\s*&\s*Next$/i }))
    .first();

  if (!(await completeBtn.isVisible({ timeout: 10_000 }).catch(() => false))) {
    return {
      ok: false,
      message: 'Complete & Next tidak ditemukan',
      navigatedNext: false,
    };
  }

  const prevUrl = page.url();
  const approveAjax = page.waitForResponse(
    (res) =>
      /checking-list\/\d+\/approve/i.test(res.url()) &&
      res.request().method() === 'POST',
    { timeout: 120_000 },
  );

  await completeBtn.click({ force: true });

  let ok = false;
  let message = '';
  try {
    const res = await approveAjax;
    const body = await res.json().catch(() => null);
    message =
      body?.status?.message || body?.message || `HTTP ${res.status()}`;
    const errFlag = Number(body?.status?.error ?? 0);
    ok = res.ok() && errFlag === 0;
    if (/already approved/i.test(message)) ok = false;
    // eslint-disable-next-line no-console
    console.log('[SEED] approve:', JSON.stringify(body)?.slice(0, 400));
  } catch (err) {
    message = err instanceof Error ? err.message : String(err);
  }

  await page.waitForTimeout(2_000);
  const navigatedNext =
    /\/omni\/checking-list\/(edit|set-location)\/\d+/.test(page.url()) &&
    page.url() !== prevUrl;

  if (navigatedNext) ok = true;
  if (await formLooksAlreadyDone(page)) ok = true;

  const toast = (
    await page
      .locator('.toastify, [class*="toast"]')
      .first()
      .textContent({ timeout: 6_000 })
      .catch(() => null)
  )?.trim();
  if (toast) {
    message = `${toast} | ${message}`;
    if (/already approved|failed|error/i.test(toast)) ok = false;
    else if (/success|berhasil/i.test(toast)) ok = true;
  }

  return { ok, message, navigatedNext };
}

async function gotoClDatalist(page: Page) {
  await page.goto(CHECKING_LIST_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
  await waitForClListAjax(page, 90_000).catch(() => undefined);
  await waitLoadingGone(page);
}

async function verifySoCompleteOnCl(
  page: Page,
  soCode: string,
): Promise<{ found: boolean; complete: boolean; clCode: string; rowText: string }> {
  await searchCl(page, soCode);
  const row = page.getByRole('row').filter({ hasText: soCode }).first();
  const found = await row.isVisible({ timeout: 15_000 }).catch(() => false);
  if (!found) {
    return { found: false, complete: false, clCode: '', rowText: '' };
  }
  const rowText = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
  return {
    found: true,
    complete: isCompleteRowText(rowText),
    clCode: parseClFromRowText(rowText),
    rowText,
  };
}

async function processCheckingForm(
  page: Page,
): Promise<{
  soCode: string;
  location: string;
  checkMsg: string;
  completeMsg: string;
  ok: boolean;
  navigatedNext: boolean;
  skipReason?: string;
}> {
  await dismissDocsAssistant(page);

  let location = '(sudah ter-set)';
  if (
    /\/set-location\//.test(page.url()) ||
    (await page
      .locator('[aria-placeholder*="Choose Location"]')
      .locator('visible=true')
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false))
  ) {
    location = await chooseAnyLocationAndStart(page);
  }

  await dismissDocsAssistant(page);
  const soCode = await readCurrentSoOnForm(page);
  // eslint-disable-next-line no-console
  console.log(`[SEED] Form SO=${soCode || '?'} url=${page.url()}`);

  const isTarget = TARGET_SOS.some(
    (s) => s.toUpperCase() === (soCode || '').toUpperCase(),
  );

  if (await formLooksAlreadyDone(page)) {
    return {
      soCode,
      location,
      checkMsg: 'already done',
      completeMsg: 'already done',
      ok: true,
      navigatedNext: false,
      skipReason: 'form already complete',
    };
  }

  if (soCode && !isTarget) {
    return {
      soCode,
      location,
      checkMsg: 'skip',
      completeMsg: 'skip',
      ok: false,
      navigatedNext: false,
      skipReason: `SO ${soCode} bukan target — skip`,
    };
  }

  const check = await selectAllSkusAndCheck(page);
  // eslint-disable-next-line no-console
  console.log(`[SEED] Check: ok=${check.checkOk} ${check.checkMsg}`);
  if (!check.checkOk) {
    return {
      soCode,
      location,
      checkMsg: check.checkMsg,
      completeMsg: '',
      ok: false,
      navigatedNext: false,
      skipReason: `check gagal: ${check.checkMsg}`,
    };
  }

  const complete = await clickCompleteAndNext(page);
  // eslint-disable-next-line no-console
  console.log(
    `[SEED] Complete: ok=${complete.ok} next=${complete.navigatedNext} ${complete.message}`,
  );

  return {
    soCode,
    location,
    checkMsg: check.checkMsg,
    completeMsg: complete.message,
    ok: complete.ok,
    navigatedNext: complete.navigatedNext,
  };
}

test.describe('Seed — Bulk Start & Complete Checking List (2 SO)', () => {
  test('[@SEED-CL-BULK-2SO] Bulk Start Checking → Check → Complete — lumicharmsid', async ({
    page,
  }) => {
    test.setTimeout(720_000);

    let locationChosen = '';
    const processed: string[] = [];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: CHECKING_LIST_PATH,
    });
    await expect(page.getByRole('table').first()).toBeVisible({
      timeout: 60_000,
    });
    await waitForClListAjax(page, 120_000).catch(() => undefined);
    await waitLoadingGone(page);

    const targets = await findTargetRows(page);
    expect(targets.length, 'Harus temukan 2 CL target').toBe(2);
    for (const t of targets) {
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] ${t.soCode} CL=${t.clCode} complete=${t.alreadyComplete} | ${t.rowText.slice(0, 140)}`,
      );
    }

    let pending = targets.filter((t) => !t.alreadyComplete);
    if (pending.length === 0) {
      locationChosen = '(sudah Complete sebelumnya)';
      // eslint-disable-next-line no-console
      console.log('[SEED] Kedua SO sudah Complete — verifikasi saja');
    } else {
      // 1) Centang kedua row pending + klik Start Checking di ATAS tabel
      await searchCl(page, 'SO-5TU4');
      for (const t of pending) {
        const row = page.getByRole('row').filter({ hasText: t.soCode }).first();
        await expect(row).toBeVisible({ timeout: 20_000 });
        await selectRowCheckbox(row);
        await page.waitForTimeout(300);
      }
      const sel = page.getByText(/\d+\s+rows?\s+selected/i).first();
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] Selection: ${(await sel.textContent().catch(() => null)) || '(n/a)'}`,
      );

      let usedBulkToolbar = false;
      const bulkBtn = page
        .getByRole('link', { name: /^Start\s*Checking$/i })
        .or(page.getByRole('button', { name: /^Start\s*Checking$/i }))
        .or(
          page
            .locator('button, a, [role="link"]')
            .filter({ hasText: /^Start\s*Checking$/i }),
        )
        .locator('visible=true')
        .first();

      if (await bulkBtn.isVisible({ timeout: 10_000 }).catch(() => false)) {
        try {
          await clickBulkStartCheckingAboveTable(page);
          usedBulkToolbar = true;
          // eslint-disable-next-line no-console
          console.log('[SEED] Bulk Start Checking (toolbar) OK');
          const r = await processCheckingForm(page);
          locationChosen = r.location || locationChosen;
          if (r.ok && r.soCode) processed.push(r.soCode);
          if (r.skipReason) {
            // eslint-disable-next-line no-console
            console.log(`[SEED] Bulk toolbar: ${r.skipReason}`);
          }
          let nextHop = r.navigatedNext;
          for (let hops = 0; hops < 3 && nextHop; hops++) {
            if (
              !/\/omni\/checking-list\/(edit|set-location)/.test(page.url())
            ) {
              break;
            }
            const r2 = await processCheckingForm(page);
            locationChosen = r2.location || locationChosen;
            if (r2.ok && r2.soCode) processed.push(r2.soCode);
            nextHop = r2.navigatedNext;
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Bulk toolbar error: ${err instanceof Error ? err.message : err}`,
          );
        }
      } else {
        // eslint-disable-next-line no-console
        console.log(
          '[SEED] Toolbar Start Checking tidak terlihat — lanjut per-row',
        );
      }

      // 2) Selesaikan sisa pending via Start Checking per-row
      await gotoClDatalist(page);
      for (const so of TARGET_SOS) {
        // eslint-disable-next-line no-console
        console.log(`[SEED] Ensure complete: ${so}`);
        const v0 = await verifySoCompleteOnCl(page, so);
        if (v0.found && v0.complete) {
          // eslint-disable-next-line no-console
          console.log(`[SEED] ${so} sudah Complete — skip`);
          continue;
        }

        // eslint-disable-next-line no-console
        console.log(`[SEED] Process per-row: ${so}`);
        await searchCl(page, so);
        const row = page.getByRole('row').filter({ hasText: so }).first();
        await expect(row, `Row ${so}`).toBeVisible({ timeout: 30_000 });
        const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
        if (isCompleteRowText(text)) continue;

        await clickStartCheckingOnRow(page, row);
        // eslint-disable-next-line no-console
        console.log(`[SEED] Opened form for ${so}: ${page.url()}`);
        const r = await processCheckingForm(page);
        locationChosen = r.location || locationChosen;
        // eslint-disable-next-line no-console
        console.log(
          `[SEED] Result ${so}: ok=${r.ok} loc=${r.location} check=${r.checkMsg} complete=${r.completeMsg} skip=${r.skipReason ?? ''}`,
        );
        expect(
          r.ok,
          `Gagal complete ${so}: ${r.skipReason || r.completeMsg || r.checkMsg}`,
        ).toBe(true);
        if (r.soCode) processed.push(r.soCode);
        await gotoClDatalist(page);
      }

      // eslint-disable-next-line no-console
      console.log(
        `[SEED] usedBulkToolbar=${usedBulkToolbar} processed=[${[...new Set(processed)].join(', ')}]`,
      );
    }

    // Final verify
    await gotoClDatalist(page);
    const verifies = [];
    for (const so of TARGET_SOS) {
      const v = await verifySoCompleteOnCl(page, so);
      verifies.push({ soCode: so, ...v });
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] FINAL ${so}: CL=${v.clCode} complete=${v.complete} | ${v.rowText.slice(0, 120)}`,
      );
    }

    // eslint-disable-next-line no-console
    console.log('\n=== BULK CHECKING COMPLETE RESULT ===');
    // eslint-disable-next-line no-console
    console.log(`Location: ${locationChosen}`);
    for (const v of verifies) {
      // eslint-disable-next-line no-console
      console.log(
        `| ${v.soCode} | ${v.clCode} | found=${v.found} | Complete=${v.complete} |`,
      );
    }

    for (const v of verifies) {
      expect(v.found, `${v.soCode} harus ada di Checking List`).toBe(true);
      expect(
        v.complete,
        `Checking Status ${v.soCode} harus Complete. ${v.rowText.slice(0, 160)}`,
      ).toBe(true);
    }
  });
});
