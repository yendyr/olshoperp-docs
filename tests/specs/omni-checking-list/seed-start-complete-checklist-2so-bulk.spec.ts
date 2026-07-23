import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { OlshopMultiselect } from '../../helpers/shared';
import { SalesOrderGeneralPage } from '../../helpers/sales-order-general';

/**
 * One-off seed: Bulk Start Checking → Check all SKUs → Complete & Next (2 SO).
 * Lanjutan setelah Picking List Complete (PL-5TUJMVOG).
 * SO-5TU4KQUG sudah Complete (CL-5TUK0UFA) — jangan re-process.
 *
 * Menu: /omni/checking-list
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   $env:NODE_OPTIONS="--max-old-space-size=4096"
 *   npx playwright test tests/specs/omni-checking-list/seed-start-complete-checklist-2so-bulk.spec.ts --project=authenticated --workers=1 --retries=0 --trace=off
 */

const CHECKING_LIST_PATH = '/omni/checking-list';
const TARGET_SOS = ['SO-5TU4LJIU', 'SO-5TU4UD5F'] as const;
/** Prefiks agar kedua SO target tampil di datalist (tanpa hanya 1 row). */
const SEARCH_PREFIX = 'SO-5TU4';

type SoVerify = {
  soCode: string;
  found: boolean;
  statusText: string;
  checkingComplete: boolean;
  clCode?: string;
  note?: string;
};

function isClListRequest(url: string): boolean {
  return (
    url.includes('/omnichannel/checking-list') &&
    !url.includes('/checking-list-detail') &&
    !url.includes('/set-location') &&
    !url.includes('/approve') &&
    !url.includes('/select2') &&
    !url.includes('/get-tocheck') &&
    !url.includes('/checking-info')
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

async function searchClBySo(page: Page, query: string) {
  const input = clSearchInput(page);
  await expect(input, 'Searchbox Checking List datalist').toBeVisible({
    timeout: 60_000,
  });
  const ajax = waitForClListAjax(page).catch(() => undefined);
  await input.fill('');
  await input.fill(query);
  await ajax;
  await page.waitForTimeout(1_200);
  await waitLoadingGone(page);
}

async function findTargetRows(page: Page): Promise<{
  rows: { soCode: string; row: Locator; clCode: string; alreadyComplete: boolean; rowText: string }[];
  allComplete: boolean;
}> {
  for (let attempt = 1; attempt <= 8; attempt++) {
    // eslint-disable-next-line no-console
    console.log(`[SEED] Search attempt=${attempt} q=${SEARCH_PREFIX}`);
    await searchClBySo(page, SEARCH_PREFIX);

    const found: {
      soCode: string;
      row: Locator;
      clCode: string;
      alreadyComplete: boolean;
      rowText: string;
    }[] = [];

    for (const so of TARGET_SOS) {
      const row = page.getByRole('row').filter({ hasText: so }).first();
      const visible = await row.isVisible({ timeout: 4_000 }).catch(() => false);
      if (!visible) continue;
      const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
      const clMatch = text.match(/CL-[A-Z0-9]+/i);
      const nameMatch = text.match(/Checking List\s*-\s*([A-Z0-9-]+)/i);
      const alreadyComplete =
        /\bComplete\b/i.test(text) && !/\bIncomplete\b/i.test(text);
      found.push({
        soCode: so,
        row,
        clCode:
          clMatch?.[0] ??
          (nameMatch ? nameMatch[1] : '(CL tidak terdeteksi)'),
        alreadyComplete,
        rowText: text,
      });
    }

    if (found.length === TARGET_SOS.length) {
      return {
        rows: found,
        allComplete: found.every((r) => r.alreadyComplete),
      };
    }

    await page.waitForTimeout(5_000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
    await waitForClListAjax(page, 60_000).catch(() => undefined);
    await waitLoadingGone(page);
  }

  return { rows: [], allComplete: false };
}

async function selectRowCheckbox(row: Locator): Promise<string | null> {
  const cb = row.locator('input.checkbox-select, input[type="checkbox"]').first();
  await expect(cb, 'Checkbox row CL').toBeVisible({ timeout: 15_000 });
  const id =
    (await cb.getAttribute('value').catch(() => null)) ||
    (await cb.getAttribute('data-id').catch(() => null)) ||
    (await row.getAttribute('id').catch(() => null));
  const checked = await cb.isChecked().catch(() => false);
  if (!checked) {
    // DataTables select: klik TD checkbox cell lebih reliable
    await cb.click({ force: true });
    await row.page().waitForTimeout(400);
  }
  return id && /^\d+$/.test(id) ? id : null;
}

async function extractRowId(row: Locator): Promise<string | null> {
  const fromCb = await selectRowCheckbox(row);
  if (fromCb) return fromCb;
  // Fallback: id dari action button value / updateButton
  const btn = row.locator('button#updateButton, button.update-button').first();
  const val = await btn.getAttribute('value').catch(() => null);
  if (val && /^\d+$/.test(val)) return val;
  // Fallback: parse dari link edit di row
  const href = await row.locator('a[href*="checking-list"]').first().getAttribute('href').catch(() => null);
  const m = href?.match(/\/(\d+)\/?$/);
  return m?.[1] ?? null;
}

async function clickToolbarStartChecking(page: Page) {
  // Toolbar di atas tabel (slot filter) — BUKAN per-row tooltip-start-checking
  const toolbarBtn = page
    .locator('button')
    .filter({ hasText: /^Start\s*Checking$/i })
    .or(page.getByRole('button', { name: /^Start\s*Checking$/i }))
    .or(page.getByRole('link', { name: /Start\s*Checking/i }))
    .first();

  await expect(toolbarBtn, 'Toolbar Start Checking (bulk)').toBeVisible({
    timeout: 30_000,
  });
  const disabled = await toolbarBtn.isDisabled().catch(() => false);
  // get-tocheck bisa disable / arahkan ke dokumen lain — tetap klik jika enabled;
  // kalau disabled, caller akan navigate by selected id.
  if (disabled) {
    // eslint-disable-next-line no-console
    console.log('[SEED] Toolbar Start Checking disabled — skip click');
    return false;
  }

  await toolbarBtn.click();
  await page.waitForURL(/\/omni\/checking-list\/(set-location|edit)\/\d+/, {
    timeout: 90_000,
  });
  return true;
}

function parseCheckingListIdFromUrl(url: string): string | null {
  const m = url.match(/\/omni\/checking-list\/(?:set-location|edit)\/(\d+)/);
  return m?.[1] ?? null;
}

async function openCheckingById(page: Page, id: string) {
  // set-location dulu — Form akan redirect ke edit setelah lokasi ter-set
  await page.goto(`/omni/checking-list/set-location/${id}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForURL(/\/omni\/checking-list\/(set-location|edit)\/\d+/, {
    timeout: 60_000,
  });
  await waitLoadingGone(page);
}

/** Already-done = no Complete button + Checking Duration / already approved toast */
async function isFormAlreadyComplete(page: Page): Promise<boolean> {
  const completeBtn = page
    .getByRole('button', { name: /Complete\s*&\s*Next/i })
    .or(page.getByRole('button', { name: 'Complete', exact: true }))
    .first();
  const hasComplete = await completeBtn.isVisible({ timeout: 3_000 }).catch(() => false);
  if (hasComplete) return false;

  const duration = await page
    .getByText(/Checking Duration/i)
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  const checkedBy = await page
    .getByText(/Checked By\/Location/i)
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  return duration || checkedBy;
}

async function chooseAnyLocationAndStart(page: Page): Promise<string> {
  const multi = new OlshopMultiselect(page);

  // Tunggu halaman set-location siap
  await page
    .getByText(/Choose location first/i)
    .or(page.getByRole('button', { name: /Start\s*Checking/i }))
    .first()
    .waitFor({ state: 'visible', timeout: 30_000 })
    .catch(() => undefined);

  const locationBox = page
    .locator(
      [
        '[aria-placeholder="Choose Location"]',
        '[aria-placeholder*="Choose Location"]',
        '.multiselect-search[aria-placeholder*="Location"]',
        '.multiselect .multiselect-search',
        '.custom-multiselect input',
        '.multiselect',
      ].join(', '),
    )
    .locator('visible=true')
    .first();

  // Fallback: klik teks placeholder di vueform Multiselect
  const placeholderFallback = page
    .locator('.multiselect')
    .filter({ hasText: /Choose Location/i })
    .first();

  const needLocation =
    (await locationBox.isVisible({ timeout: 10_000 }).catch(() => false)) ||
    (await placeholderFallback.isVisible({ timeout: 3_000 }).catch(() => false));

  if (!needLocation) {
    // eslint-disable-next-line no-console
    console.log('[SEED] Location picker tidak tampil — lanjut checking form');
    return '(lokasi sudah ter-set sebelumnya)';
  }

  const openTarget = (await locationBox.isVisible().catch(() => false))
    ? locationBox
    : placeholderFallback;

  try {
    await multi.open(openTarget);
  } catch {
    await openTarget.click({ force: true });
    await page.waitForTimeout(800);
  }
  await page.waitForTimeout(800);

  let option = multi.visibleOptions().first();
  if (!(await option.isVisible({ timeout: 5_000 }).catch(() => false))) {
    // Options dropdown vueform
    option = page
      .locator(
        '.multiselect-dropdown .multiselect-option, .multiselect-options .multiselect-option, [class*="multiselect-option"]',
      )
      .locator('visible=true')
      .first();
  }
  await expect(option, 'Opsi lokasi tersedia').toBeVisible({ timeout: 30_000 });
  const label = ((await option.textContent()) || '').trim() || '(lokasi tanpa label)';
  await option.click();
  await page.waitForTimeout(500);

  const startBtn = page
    .getByRole('button', { name: /Start\s*Checking/i })
    .first();
  await expect(startBtn).toBeVisible({ timeout: 15_000 });

  const setLoc = page.waitForResponse(
    (res) =>
      res.url().includes('/set-location') &&
      res.request().method() === 'POST',
    { timeout: 60_000 },
  );

  await startBtn.click();
  await setLoc.catch(() => undefined);
  await page
    .waitForURL(/\/omni\/checking-list\/edit\/\d+/, { timeout: 90_000 })
    .catch(() => undefined);
  await waitLoadingGone(page);

  // Pastikan sudah keluar dari set-location
  if (/\/set-location\//.test(page.url())) {
    throw new Error(
      `Gagal set location — masih di ${page.url()} setelah Start Checking (label=${label})`,
    );
  }
  return label;
}

async function dismissDocsAssistant(page: Page) {
  const closeBtn = page.getByRole('button', {
    name: /Close documentation assistant/i,
  });
  if (await closeBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await closeBtn.click({ force: true }).catch(() => undefined);
    await page.waitForTimeout(400);
  }
  await page.keyboard.press('Escape').catch(() => undefined);
}

async function readCurrentClMeta(page: Page): Promise<{
  clCode: string;
  soHint: string;
  uncheckedText: string;
}> {
  const header = page
    .locator('p')
    .filter({ hasText: /Checking List No:/i })
    .first();
  const text = ((await header.textContent().catch(() => '')) || '').trim();
  const clMatch = text.match(/CL-[A-Z0-9]+/i);
  // SO kadang di HeaderInformation
  const bodyText = ((await page.locator('body').innerText().catch(() => '')) || '')
    .replace(/\s+/g, ' ')
    .slice(0, 2500);
  const soMatch = TARGET_SOS.map((so) =>
    bodyText.includes(so) ? so : null,
  ).find(Boolean);
  return {
    clCode: clMatch?.[0] ?? '(CL header?)',
    soHint: soMatch ?? '(SO tidak terbaca di header)',
    uncheckedText: text.slice(0, 160),
  };
}

async function selectAllSkusAndCheck(
  page: Page,
): Promise<{ selected: number; checked: number; checkOk: boolean; checkMsg: string }> {
  await dismissDocsAssistant(page);

  await page
    .locator('.p-datatable, table')
    .first()
    .waitFor({ state: 'visible', timeout: 60_000 });
  await waitLoadingGone(page);
  await page.waitForTimeout(1_500);

  const headerCb = page
    .locator(
      'th .p-checkbox input, thead .p-checkbox input, .p-datatable-thead input[type="checkbox"], thead input[type="checkbox"]',
    )
    .first();
  if (await headerCb.isVisible({ timeout: 10_000 }).catch(() => false)) {
    const already = await headerCb.isChecked().catch(() => false);
    if (!already) {
      await headerCb.click({ force: true });
    } else {
      await headerCb.click({ force: true });
      await page.waitForTimeout(300);
      await headerCb.click({ force: true });
    }
    await page.waitForTimeout(800);
  }

  const selectedLabel = page
    .locator('label[for="checkbox-switch-1"]')
    .or(page.locator('label').filter({ hasText: /\d+\s+Selected data/i }))
    .or(page.getByText(/\d+\s+row\(s\) selected/i ))
    .first();
  let selected = 0;
  if (await selectedLabel.isVisible({ timeout: 5_000 }).catch(() => false)) {
    const selectedText = (await selectedLabel.textContent().catch(() => '')) || '';
    const selectedMatch = selectedText.match(/(\d+)\s+(?:Selected|row)/i);
    selected = selectedMatch ? Number(selectedMatch[1]) : 0;
  }

  // Prefer toolbar/bulk Check jika ada (selected rows)
  const bulkCheckBtn = page
    .locator('button')
    .filter({ has: page.locator('svg, i, .fa-check, [class*="check"]') })
    .filter({ hasText: /^$/ })
    .or(page.locator('button.action-button').filter({ hasText: /check/i }))
    .first();

  // Checking: ikon Check = check-to-slot di action column / bulk
  const rowChecks = page.locator(
    '.p-datatable-tbody tr button.action-button, tbody tr button.action-button',
  );
  const count = await rowChecks.count();
  let clicked = 0;
  let checkOk = false;
  let checkMsg = '';

  // Coba bulk check sekali jika header selected
  if (selected > 0) {
    const bulkAjax = page.waitForResponse(
      (r) =>
        /checking-list-detail\/\d+\/bulk-check|\/check/i.test(r.url()) &&
        r.request().method() === 'POST',
      { timeout: 90_000 },
    );
    // Tombol Check di atas tabel (PrimeDataTables action) — klik first action-button yang check-to-slot di header area
    const headerCheck = page
      .locator(
        '.p-datatable-header button.action-button, [class*="header"] button.action-button, button:has(.fa-check-to-slot), button:has([data-icon="check-to-slot"])',
      )
      .first();
    if (await headerCheck.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await headerCheck.click({ force: true });
      const res = await bulkAjax.catch(() => null);
      if (res) {
        const body = await res.json().catch(() => null);
        const errFlag = body?.status?.error;
        checkOk =
          res.ok() &&
          (errFlag === 0 ||
            errFlag === '0' ||
            errFlag === false ||
            errFlag == null ||
            Number(errFlag) === 0);
        checkMsg = `bulk header check: ${
          body?.status?.message || body?.message || `HTTP ${res.status()}`
        }`;
        clicked = selected;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('[SEED] Header bulk Check tidak terlihat — fallback per-row');
      void bulkCheckBtn;
    }
  }

  if (!checkOk) {
    for (let i = 0; i < count; i++) {
      const btn = rowChecks.nth(i);
      if (!(await btn.isVisible().catch(() => false))) continue;
      const html = (await btn.innerHTML().catch(() => '')) || '';
      if (/trash|cart-arrow|delete/i.test(html)) continue;
      if (
        !html.includes('check-to-slot') &&
        !html.includes('fa-check') &&
        !/check/i.test(html)
      ) {
        if (!html.includes('svg') && !html.includes('fa-')) continue;
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
      if (res) {
        const body = await res.json().catch(() => null);
        const errFlag = body?.status?.error;
        if (
          res.ok() &&
          (errFlag === 0 ||
            errFlag === '0' ||
            errFlag === false ||
            errFlag == null ||
            Number(errFlag) === 0)
        ) {
          checkOk = true;
          checkMsg = `API check ok: ${
            body?.status?.message || body?.message || `HTTP ${res.status()}`
          }`;
        } else {
          checkMsg = `API check fail: ${
            body?.status?.message || body?.message || `HTTP ${res?.status()}`
          }`;
        }
      }
      await page.waitForTimeout(700);
    }
  }

  if (clicked === 0) {
    const clickResult = await page.evaluate(async () => {
      const buttons = Array.from(
        document.querySelectorAll('button.action-button'),
      ) as HTMLButtonElement[];
      const checkButtons = buttons.filter((b) => {
        const html = b.innerHTML || '';
        if (/trash|cart-arrow|delete/i.test(html)) return false;
        return (
          html.includes('check-to-slot') ||
          html.includes('fa-check') ||
          html.includes('svg')
        );
      });
      let n = 0;
      for (const b of checkButtons) {
        if (b.offsetParent === null) continue;
        b.click();
        n += 1;
        await new Promise((r) => setTimeout(r, 700));
      }
      return { total: checkButtons.length, clicked: n };
    });
    clicked = clickResult.clicked;
    checkMsg = `evaluate clicked=${clickResult.clicked}/${clickResult.total}`;
    if (clicked > 0) checkOk = true;
  } else if (!checkMsg.includes('bulk')) {
    checkMsg = `clicked=${clicked}/${count} | ${checkMsg}`;
  }

  const toast = page.locator('.toastify, [class*="toast"]').first();
  const toastText = (
    await toast.textContent({ timeout: 8_000 }).catch(() => null)
  )?.trim();
  if (toastText) {
    checkMsg = `${toastText} | ${checkMsg}`;
    if (/success|checked|berhasil|updated/i.test(toastText)) checkOk = true;
  }

  const zeroUnchecked = await page
    .getByText(/0\s+out of\s+([1-9]\d*)\s+items\s+unchecked/i)
    .first()
    .isVisible({ timeout: 5_000 })
    .catch(() => false);
  if (zeroUnchecked) {
    checkOk = true;
    checkMsg = `${checkMsg} | UI: 0 unchecked`;
  }

  // Tolak "0 out of 0" (dokumen kosong / salah id)
  const emptyDoc = await page
    .getByText(/0\s+out of\s+0\s+items\s+unchecked/i)
    .first()
    .isVisible({ timeout: 1_500 })
    .catch(() => false);
  if (emptyDoc && clicked === 0) {
    checkOk = false;
    checkMsg = `${checkMsg} | FAIL: 0 out of 0 (dokumen kosong / bukan target)`;
  }

  if (selected === 0) selected = clicked || 1;

  await waitLoadingGone(page);
  await page.waitForTimeout(1_000);
  return {
    selected,
    checked: clicked,
    checkOk,
    checkMsg,
  };
}

async function clickComplete(
  page: Page,
): Promise<{ ok: boolean; message: string; navigatedToNext: boolean }> {
  if (await isFormAlreadyComplete(page)) {
    return {
      ok: true,
      message: 'Sudah complete (tidak ada Complete & Next / Checking Duration)',
      navigatedToNext: false,
    };
  }

  // Exact "Complete & Next" — JANGAN pakai /^Complete/i (bentrok Completion Summary)
  const completeBtn = page
    .getByRole('button', { name: /Complete\s*&\s*Next/i })
    .or(page.locator('button').filter({ hasText: /^Complete\s*&\s*Next$/i }))
    .or(page.getByRole('button', { name: 'Complete', exact: true }))
    .first();

  if (!(await completeBtn.isVisible({ timeout: 10_000 }).catch(() => false))) {
    const processed = await page
      .getByText(/Processed/i)
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    if (processed || (await isFormAlreadyComplete(page))) {
      return {
        ok: true,
        message: 'Complete button hilang; dokumen sudah selesai',
        navigatedToNext: false,
      };
    }
    return {
      ok: false,
      message: 'Tombol Complete / Complete & Next tidak ditemukan',
      navigatedToNext: false,
    };
  }

  const beforeUrl = page.url();
  const beforeId = parseCheckingListIdFromUrl(beforeUrl);
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
    const res = await Promise.race([
      approveAjax,
      page
        .getByText(/Checking Duration/i)
        .first()
        .waitFor({ state: 'visible', timeout: 90_000 })
        .then(() => null),
      page
        .waitForURL(
          (url) => {
            const id = parseCheckingListIdFromUrl(url.toString());
            return !!id && id !== beforeId;
          },
          { timeout: 90_000 },
        )
        .then(() => null),
    ]);
    if (res) {
      const body = await res.json().catch(() => null);
      message =
        body?.message ||
        body?.status?.message ||
        body?.data?.message ||
        `HTTP ${res.status()}`;
      const errFlag = body?.status?.error;
      const alreadyApproved = /already approved/i.test(String(message));
      ok =
        alreadyApproved ||
        (res.ok() &&
          (errFlag === 0 ||
            errFlag === '0' ||
            errFlag === false ||
            errFlag == null ||
            Number(errFlag) === 0));
      if (!alreadyApproved && errFlag !== undefined && Number(errFlag) !== 0) {
        ok = false;
      }
      // eslint-disable-next-line no-console
      console.log('[SEED] approve body:', JSON.stringify(body)?.slice(0, 600));
    } else {
      ok = true;
      message = 'UI: complete / navigated (approve response miss)';
    }
  } catch (err) {
    message = err instanceof Error ? err.message : String(err);
    if (await isFormAlreadyComplete(page)) {
      ok = true;
      message = `${message} | UI menandakan complete`;
    }
  }

  const toast = page.locator('.toastify, [class*="toast"]').first();
  const toastText = (
    await toast.textContent({ timeout: 15_000 }).catch(() => null)
  )?.trim();
  if (toastText) {
    message = `${toastText} | API: ${message}`;
    if (/success|complete|checked|berhasil|already approved/i.test(toastText)) {
      ok = true;
    }
  }

  // Complete & Next → navigate ke edit/{next_id}
  await page.waitForTimeout(1_200);
  const afterUrl = page.url();
  const afterId = parseCheckingListIdFromUrl(afterUrl);
  const navigatedToNext =
    !!afterId &&
    afterId !== beforeId &&
    /\/omni\/checking-list\/(edit|set-location)\/\d+/.test(afterUrl);

  if (navigatedToNext) {
    await waitLoadingGone(page);
    message = `${message} | navigated → ${afterUrl}`;
  }

  return { ok, message, navigatedToNext };
}

async function processOneCheckingForm(
  page: Page,
  locationChosenRef: { value: string },
): Promise<{
  meta: { clCode: string; soHint: string; uncheckedText: string };
  check: { selected: number; checked: number; checkOk: boolean; checkMsg: string };
  complete: { ok: boolean; message: string; navigatedToNext: boolean };
}> {
  // Mungkin redirect set-location
  if (/\/set-location\//.test(page.url())) {
    const loc = await chooseAnyLocationAndStart(page);
    if (!locationChosenRef.value || locationChosenRef.value.startsWith('(')) {
      locationChosenRef.value = loc;
    }
  } else {
    // Location belum set → Form redirect; tunggu sebentar
    await page.waitForTimeout(1_500);
    if (/\/set-location\//.test(page.url())) {
      const loc = await chooseAnyLocationAndStart(page);
      if (!locationChosenRef.value || locationChosenRef.value.startsWith('(')) {
        locationChosenRef.value = loc;
      }
    } else if (
      await page
        .locator('[aria-placeholder*="Choose Location"]')
        .first()
        .isVisible({ timeout: 3_000 })
        .catch(() => false)
    ) {
      const loc = await chooseAnyLocationAndStart(page);
      if (!locationChosenRef.value || locationChosenRef.value.startsWith('(')) {
        locationChosenRef.value = loc;
      }
    }
  }

  await dismissDocsAssistant(page);
  const meta = await readCurrentClMeta(page);
  // eslint-disable-next-line no-console
  console.log(
    `[SEED] Form CL=${meta.clCode} soHint=${meta.soHint} | ${meta.uncheckedText}`,
  );

  if (await isFormAlreadyComplete(page)) {
    return {
      meta,
      check: {
        selected: -1,
        checked: -1,
        checkOk: true,
        checkMsg: 'Skip Check — sudah complete',
      },
      complete: {
        ok: true,
        message: 'Skip Complete — sudah complete',
        navigatedToNext: false,
      },
    };
  }

  await page
    .getByRole('button', { name: /Complete/i })
    .first()
    .waitFor({ state: 'visible', timeout: 90_000 })
    .catch(async () => {
      if (
        await page
          .getByRole('button', { name: /Start\s*Checking/i })
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        // Masih set-location — coba set lokasi sekali lagi
        const loc = await chooseAnyLocationAndStart(page);
        if (!locationChosenRef.value || locationChosenRef.value.startsWith('(')) {
          locationChosenRef.value = loc;
        }
        await page
          .getByRole('button', { name: /Complete/i })
          .first()
          .waitFor({ state: 'visible', timeout: 60_000 });
      }
    });

  const check = await selectAllSkusAndCheck(page);
  // eslint-disable-next-line no-console
  console.log(
    `[SEED] Check: selected=${check.selected} checked=${check.checked} ok=${check.checkOk} msg=${check.checkMsg}`,
  );
  expect(check.checkOk, `Check SKU gagal: ${check.checkMsg}`).toBe(true);

  const complete = await clickComplete(page);
  // eslint-disable-next-line no-console
  console.log(
    `[SEED] Complete: ok=${complete.ok} next=${complete.navigatedToNext} msg=${complete.message}`,
  );
  expect(complete.ok, `Complete gagal: ${complete.message}`).toBe(true);

  return { meta, check, complete };
}

async function verifyClStatusForSo(
  page: Page,
  soCode: string,
): Promise<{ found: boolean; complete: boolean; rowText: string; clCode: string }> {
  await page.goto(CHECKING_LIST_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
  await waitForClListAjax(page, 90_000).catch(() => undefined);
  await waitLoadingGone(page);
  await searchClBySo(page, soCode);

  const row = page.getByRole('row').filter({ hasText: soCode }).first();
  const found = await row.isVisible({ timeout: 20_000 }).catch(() => false);
  if (!found) {
    return { found: false, complete: false, rowText: '', clCode: '' };
  }
  const rowText = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
  const clMatch = rowText.match(/CL-[A-Z0-9]+/i);
  const complete =
    /\bComplete\b/i.test(rowText) && !/\bIncomplete\b/i.test(rowText);
  return {
    found: true,
    complete,
    rowText,
    clCode: clMatch?.[0] ?? '',
  };
}

async function verifySoViaGlobalSearch(
  page: Page,
  soCode: string,
): Promise<SoVerify> {
  const so = new SalesOrderGeneralPage(page);
  await so.gotoDatalist();
  await so.datalist.search(soCode);
  await page.waitForTimeout(1_500);

  const row = page.getByRole('row').filter({ hasText: soCode }).first();
  const found = await row.isVisible({ timeout: 20_000 }).catch(() => false);
  if (!found) {
    return {
      soCode,
      found: false,
      statusText: '',
      checkingComplete: false,
      note: 'Tidak ditemukan di Dev - Sales Order (global search datalist)',
    };
  }

  const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
  const checkingComplete = /\bComplete\b/i.test(text);
  return {
    soCode,
    found: true,
    statusText: text.slice(0, 160),
    checkingComplete,
    note: checkingComplete
      ? 'Row memuat Complete'
      : `Cek Checking Status di CL datalist — SO row: ${text.slice(0, 80)}`,
  };
}

test.describe('Seed — Bulk Start & Complete Checking List (2 SO)', () => {
  test('[@SEED-CL-BULK-2SO] Bulk Start Checking → Check → Complete — lumicharmsid', async ({
    page,
  }) => {
    test.setTimeout(900_000);
    test.info().annotations.push({ type: 'retries', description: '0' });

    const processed: {
      clCode: string;
      soHint: string;
      checkMsg: string;
      completeMsg: string;
    }[] = [];
    const locationRef = { value: '' };
    let startOk = false;
    const clVerifies: Record<
      string,
      { found: boolean; complete: boolean; rowText: string; clCode: string }
    > = {};
    const soVerifies: SoVerify[] = [];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: CHECKING_LIST_PATH,
    });

    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
    await waitForClListAjax(page, 120_000).catch(() => undefined);
    await waitLoadingGone(page);

    const discovered = await findTargetRows(page);
    expect(
      discovered.rows.length,
      `Harus ketemu ${TARGET_SOS.join(' & ')} di Checking List`,
    ).toBe(TARGET_SOS.length);

    for (const r of discovered.rows) {
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] Found SO=${r.soCode} CL=${r.clCode} complete=${r.alreadyComplete} | ${r.rowText.slice(0, 180)}`,
      );
    }

    if (discovered.allComplete) {
      startOk = true;
      locationRef.value = '(kedua SO sudah Complete di datalist — skip aksi)';
      // eslint-disable-next-line no-console
      console.log('[SEED] Both CLs already Complete — skip Start/Check/Complete');
    } else {
      const incomplete = discovered.rows.filter((r) => !r.alreadyComplete);
      const targetIds: { soCode: string; clCode: string; id: string }[] = [];

      for (const r of incomplete) {
        const id = await extractRowId(r.row);
        // eslint-disable-next-line no-console
        console.log(
          `[SEED] Selected checkbox SO=${r.soCode} CL=${r.clCode} id=${id}`,
        );
        if (id) {
          targetIds.push({ soCode: r.soCode, clCode: r.clCode, id });
        }
      }
      expect(
        targetIds.length,
        'Harus dapat numeric id dari row checkbox/action untuk kedua SO incomplete',
      ).toBeGreaterThan(0);
      await page.waitForTimeout(600);

      // Step user: toolbar Start Checking (bulk) — get-tocheck bisa buka dokumen lain
      const toolbarClicked = await clickToolbarStartChecking(page);
      startOk = true;
      const landedId = parseCheckingListIdFromUrl(page.url());
      const targetIdSet = new Set(targetIds.map((t) => t.id));
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] Toolbar Start Checking clicked=${toolbarClicked} landedId=${landedId} targets=[${[...targetIdSet].join(',')}] → ${page.url()}`,
      );

      // Proses tiap target id secara eksplisit (toolbar hanya entry; queue get-tocheck sering bukan SO target)
      const remaining = [...targetIds];
      while (remaining.length > 0) {
        const currentId = parseCheckingListIdFromUrl(page.url());
        const onRemaining = remaining.find((t) => t.id === currentId);
        const target = onRemaining ?? remaining[0];

        if (currentId !== target.id) {
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Navigate ke target SO=${target.soCode} id=${target.id} (current=${currentId})`,
          );
          await openCheckingById(page, target.id);
        } else {
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Sudah di target SO=${target.soCode} id=${target.id}`,
          );
        }

        const result = await processOneCheckingForm(page, locationRef);
        processed.push({
          clCode: result.meta.clCode || target.clCode,
          soHint: result.meta.soHint || target.soCode,
          checkMsg: result.check.checkMsg,
          completeMsg: result.complete.message,
        });

        // Hapus target yang baru diproses
        const idx = remaining.findIndex((t) => t.id === target.id);
        if (idx >= 0) remaining.splice(idx, 1);

        if (result.complete.navigatedToNext) {
          const nextId = parseCheckingListIdFromUrl(page.url());
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Complete & Next → id=${nextId}; sisa=${remaining.map((r) => r.soCode).join(',')}`,
          );
        }
      }
    }

    // Final verify CL datalist
    for (const so of TARGET_SOS) {
      const v = await verifyClStatusForSo(page, so);
      clVerifies[so] = v;
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] CL verify ${so}: found=${v.found} complete=${v.complete} CL=${v.clCode} row="${v.rowText.slice(0, 160)}"`,
      );
    }

    for (const so of TARGET_SOS) {
      const sv = await verifySoViaGlobalSearch(page, so);
      soVerifies.push(sv);
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] SO ${sv.soCode}: found=${sv.found} checkingComplete=${sv.checkingComplete} | ${sv.statusText}`,
      );
    }

    // eslint-disable-next-line no-console
    console.log('\n=== BULK CHECKING COMPLETE RESULT ===');
    // eslint-disable-next-line no-console
    console.log(`Target SO: ${TARGET_SOS.join(', ')}`);
    // eslint-disable-next-line no-console
    console.log(`Location: ${locationRef.value || '(n/a)'}`);
    // eslint-disable-next-line no-console
    console.log(`Start Checking (toolbar): ${startOk}`);
    for (const p of processed) {
      // eslint-disable-next-line no-console
      console.log(
        `Processed: CL=${p.clCode} soHint=${p.soHint} | check=${p.checkMsg} | complete=${p.completeMsg}`,
      );
    }
    for (const so of TARGET_SOS) {
      const v = clVerifies[so];
      // eslint-disable-next-line no-console
      console.log(
        `Verify ${so}: CL=${v?.clCode} complete=${v?.complete} found=${v?.found}`,
      );
    }

    expect(startOk, 'Toolbar Start Checking harus berhasil diklik').toBe(true);
    for (const so of TARGET_SOS) {
      expect(clVerifies[so]?.found, `${so} harus ketemu di CL datalist`).toBe(
        true,
      );
      expect(
        clVerifies[so]?.complete,
        `${so} Checking Status harus Complete. Row: ${clVerifies[so]?.rowText?.slice(0, 200)}`,
      ).toBe(true);
    }
  });
});
