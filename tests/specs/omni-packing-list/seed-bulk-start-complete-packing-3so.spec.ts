import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { OlshopMultiselect } from '../../helpers/shared';

/**
 * One-off seed: Bulk select → Start Packing (toolbar) → Pack SKUs → Complete & Next (3 SO).
 * Target: SO-5TU4KQUG, SO-5TU4LJIU, SO-5TU4UD5F (lumicharmsid).
 * Lanjutan setelah Checking List Complete (CL-5TUK0UFA / CL-5TUK0UTZ / CL-5TUK0V3K).
 *
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   $env:NODE_OPTIONS="--max-old-space-size=4096"
 *   npx playwright test tests/specs/omni-packing-list/seed-bulk-start-complete-packing-3so.spec.ts --project=authenticated --workers=1 --retries=0 --trace=off
 */

const PACKING_LIST_PATH = '/omni/packing-list';
const TARGET_SOS = ['SO-5TU4KQUG', 'SO-5TU4LJIU', 'SO-5TU4UD5F'] as const;
const SEARCH_PREFIX = 'SO-5TU4';

function isPkListRequest(url: string): boolean {
  return (
    url.includes('/omnichannel/packing-list') &&
    !url.includes('/packing-list-detail') &&
    !url.includes('/set-location') &&
    !url.includes('/approve') &&
    !url.includes('/select2') &&
    !url.includes('/get-topack') &&
    !url.includes('/get-unpack_total') &&
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

async function waitForPkListAjax(page: Page, timeout = 90_000) {
  await page.waitForResponse(
    (res) =>
      isPkListRequest(res.url()) &&
      res.request().method() === 'POST' &&
      res.ok(),
    { timeout },
  );
}

function pkSearchInput(page: Page): Locator {
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

async function searchPk(page: Page, query: string) {
  const input = pkSearchInput(page);
  await expect(input, 'Searchbox Packing List').toBeVisible({ timeout: 60_000 });
  const ajax = waitForPkListAjax(page, 45_000).catch(() => undefined);
  await input.fill('');
  await input.fill(query);
  await Promise.race([ajax, page.waitForTimeout(3_000)]);
  await page.waitForTimeout(800);
  await waitLoadingGone(page);
}

function parsePkFromRowText(text: string): string {
  const pkMatch = text.match(/PK-[A-Z0-9]+/i);
  if (pkMatch) return pkMatch[0].toUpperCase();
  const plMatch = text.match(/PL-[A-Z0-9]+/i);
  if (plMatch) return plMatch[0].replace(/^PL-/i, 'PK-').toUpperCase();
  const nameMatch = text.match(/Packing List\s*-\s*([A-Z0-9-]+)/i);
  return nameMatch ? nameMatch[1].toUpperCase() : '(PK?)';
}

function isCompleteRowText(text: string): boolean {
  return /\bComplete\b/i.test(text) && !/\bIncomplete\b/i.test(text);
}

async function findTargetRows(page: Page): Promise<{
  soCode: string;
  row: Locator;
  pkCode: string;
  alreadyComplete: boolean;
  rowText: string;
}[]> {
  const results: {
    soCode: string;
    row: Locator;
    pkCode: string;
    alreadyComplete: boolean;
    rowText: string;
  }[] = [];

  for (const soCode of TARGET_SOS) {
    let found: (typeof results)[number] | null = null;
    for (let attempt = 1; attempt <= 8; attempt++) {
      // eslint-disable-next-line no-console
      console.log(`[SEED] Find ${soCode} attempt=${attempt}`);
      await searchPk(page, soCode);
      const row = page.getByRole('row').filter({ hasText: soCode }).first();
      if (await row.isVisible({ timeout: 5_000 }).catch(() => false)) {
        const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
        found = {
          soCode,
          row,
          pkCode: parsePkFromRowText(text),
          alreadyComplete: isCompleteRowText(text),
          rowText: text,
        };
        break;
      }
      await page.waitForTimeout(4_000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
      await waitForPkListAjax(page, 60_000).catch(() => undefined);
      await waitLoadingGone(page);
    }
    if (found) results.push(found);
  }
  return results;
}

async function selectRowCheckbox(row: Locator): Promise<string | null> {
  const cb = row.locator('input.checkbox-select, input[type="checkbox"]').first();
  await expect(cb, 'Checkbox row PK').toBeVisible({ timeout: 15_000 });
  const id =
    (await cb.getAttribute('value').catch(() => null)) ||
    (await cb.getAttribute('data-id').catch(() => null)) ||
    (await row.getAttribute('id').catch(() => null));
  if (!(await cb.isChecked().catch(() => false))) {
    await cb.click({ force: true });
    await row.page().waitForTimeout(400);
  }
  return id && /^\d+$/.test(id) ? id : null;
}

async function extractRowId(row: Locator): Promise<string | null> {
  const fromCb = await selectRowCheckbox(row);
  if (fromCb) return fromCb;
  const btn = row
    .locator(
      'button.tooltip-start-packing, button.tooltip-resume-packing, button.tooltip-continue-packing, button#updateButton',
    )
    .first();
  const val = await btn.getAttribute('value').catch(() => null);
  if (val) {
    const m = val.match(/\/(\d+)\/?\s*$/);
    if (m) return m[1];
    if (/^\d+$/.test(val)) return val;
  }
  const href = await row
    .locator('a[href*="packing-list"]')
    .first()
    .getAttribute('href')
    .catch(() => null);
  const m2 = href?.match(/\/(\d+)\/?$/);
  return m2?.[1] ?? null;
}

async function clickToolbarStartPacking(page: Page): Promise<boolean> {
  const toolbarBtn = page
    .getByRole('link', { name: /^Start\s*Packing$/i })
    .or(page.getByRole('button', { name: /^Start\s*Packing$/i }))
    .or(page.locator('button, a, [role="link"]').filter({ hasText: /^Start\s*Packing$/i }))
    .locator('visible=true')
    .first();

  await expect(toolbarBtn, 'Toolbar Start Packing (bulk)').toBeVisible({
    timeout: 30_000,
  });
  if (await toolbarBtn.isDisabled().catch(() => false)) {
    // eslint-disable-next-line no-console
    console.log('[SEED] Toolbar Start Packing disabled — skip click');
    return false;
  }
  await toolbarBtn.click();
  await page.waitForURL(/\/omni\/packing-list\/(set-location|edit)\/\d+/, {
    timeout: 90_000,
  });
  return true;
}

function parsePackingListIdFromUrl(url: string): string | null {
  const m = url.match(/\/omni\/packing-list\/(?:set-location|edit)\/(\d+)/);
  return m?.[1] ?? null;
}

async function openPackingById(page: Page, id: string) {
  await page.goto(`/omni/packing-list/set-location/${id}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForURL(/\/omni\/packing-list\/(set-location|edit)\/\d+/, {
    timeout: 60_000,
  });
  await waitLoadingGone(page);
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

async function isFormAlreadyComplete(page: Page): Promise<boolean> {
  const completeBtn = page
    .getByRole('button', { name: /Complete\s*&\s*Next/i })
    .or(page.getByRole('button', { name: 'Complete', exact: true }))
    .first();
  const hasComplete = await completeBtn.isVisible({ timeout: 3_000 }).catch(() => false);
  if (hasComplete) return false;

  const duration = await page
    .getByText(/Packing Duration/i)
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  const packedBy = await page
    .getByText(/Packed By\/Location/i)
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  return duration || packedBy;
}

async function chooseAnyLocationAndStart(page: Page): Promise<string> {
  const multi = new OlshopMultiselect(page);

  await page
    .getByText(/Choose location first/i)
    .or(page.getByRole('button', { name: /Start\s*Packing/i }))
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

  const placeholderFallback = page
    .locator('.multiselect')
    .filter({ hasText: /Choose Location/i })
    .first();

  const needLocation =
    (await locationBox.isVisible({ timeout: 10_000 }).catch(() => false)) ||
    (await placeholderFallback.isVisible({ timeout: 3_000 }).catch(() => false));

  if (!needLocation) {
    // eslint-disable-next-line no-console
    console.log('[SEED] Location picker tidak tampil — lanjut packing form');
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

  const startBtn = page.getByRole('button', { name: /Start\s*Packing/i }).first();
  await expect(startBtn).toBeVisible({ timeout: 15_000 });

  const setLoc = page.waitForResponse(
    (res) =>
      res.url().includes('/set-location') && res.request().method() === 'POST',
    { timeout: 60_000 },
  );

  await startBtn.click();
  await setLoc.catch(() => undefined);
  await page
    .waitForURL(/\/omni\/packing-list\/edit\/\d+/, { timeout: 90_000 })
    .catch(() => undefined);
  await waitLoadingGone(page);

  if (/\/set-location\//.test(page.url())) {
    throw new Error(
      `Gagal set location — masih di ${page.url()} setelah Start Packing (label=${label})`,
    );
  }
  return label;
}

async function readCurrentPkMeta(page: Page): Promise<{
  pkCode: string;
  soHint: string;
}> {
  const bodyText = ((await page.locator('body').innerText().catch(() => '')) || '')
    .replace(/\s+/g, ' ')
    .slice(0, 3500);
  const pkMatch =
    bodyText.match(/PK-[A-Z0-9]+/i) ||
    bodyText.match(/PL-[A-Z0-9]+/i) ||
    bodyText.match(/Packing List\s*-\s*([A-Z0-9-]+)/i);
  let pkCode = '(PK header?)';
  if (pkMatch) {
    pkCode = (pkMatch[1] || pkMatch[0]).toUpperCase().replace(/^PL-/, 'PK-');
  }
  const soHint =
    TARGET_SOS.map((so) => (bodyText.includes(so) ? so : null)).find(Boolean) ??
    '(SO tidak terbaca)';
  return { pkCode, soHint };
}

async function selectAllSkusAndPack(
  page: Page,
): Promise<{ checked: number; packOk: boolean; packMsg: string }> {
  await dismissDocsAssistant(page);
  await page
    .locator('.p-datatable, table')
    .first()
    .waitFor({ state: 'visible', timeout: 60_000 });
  await waitLoadingGone(page);
  await page.waitForTimeout(1_000);

  const headerCb = page
    .locator(
      'th .p-checkbox input, thead .p-checkbox input, .p-datatable-thead input[type="checkbox"], thead input[type="checkbox"]',
    )
    .first();
  if (await headerCb.isVisible({ timeout: 8_000 }).catch(() => false)) {
    if (!(await headerCb.isChecked().catch(() => false))) {
      await headerCb.click({ force: true });
    }
    await page.waitForTimeout(500);
  }

  const rowPacks = page.locator(
    '.p-datatable-tbody tr button.action-button, tbody tr button.action-button',
  );
  const count = await rowPacks.count();
  let clicked = 0;
  let packOk = false;
  let packMsg = '';

  for (let i = 0; i < count; i++) {
    const btn = rowPacks.nth(i);
    if (!(await btn.isVisible().catch(() => false))) continue;
    const html = (await btn.innerHTML().catch(() => '')) || '';
    if (/trash|cart-arrow|delete|qrcode/i.test(html)) continue;
    if (
      !html.includes('check-to-slot') &&
      !html.includes('fa-check') &&
      !html.includes('svg')
    ) {
      continue;
    }

    const packAjax = page.waitForResponse(
      (r) =>
        /packing-list-detail\/\d+\/pack|bulk-pack|\/pack/i.test(r.url()) &&
        r.request().method() === 'POST',
      { timeout: 90_000 },
    );
    await btn.click({ force: true });
    const res = await packAjax.catch(() => null);
    clicked += 1;
    if (res?.ok()) {
      const body = await res.json().catch(() => null);
      if (Number(body?.status?.error ?? 0) === 0) {
        packOk = true;
        packMsg = body?.status?.message || body?.message || `HTTP ${res.status()}`;
      } else {
        packMsg = body?.status?.message || body?.message || `HTTP ${res.status()}`;
      }
    }
    await page.waitForTimeout(500);
  }

  if (clicked === 0) {
    const clickResult = await page.evaluate(async () => {
      const buttons = Array.from(
        document.querySelectorAll('button.action-button'),
      ) as HTMLButtonElement[];
      const packButtons = buttons.filter((b) => {
        const html = b.innerHTML || '';
        if (/trash|cart-arrow|delete|qrcode/i.test(html)) return false;
        return (
          html.includes('check-to-slot') ||
          html.includes('fa-check') ||
          html.includes('svg')
        );
      });
      let n = 0;
      for (const b of packButtons) {
        if (b.offsetParent === null) continue;
        b.click();
        n += 1;
        await new Promise((r) => setTimeout(r, 700));
      }
      return { total: packButtons.length, clicked: n };
    });
    clicked = clickResult.clicked;
    packMsg = `evaluate clicked=${clickResult.clicked}/${clickResult.total}`;
    if (clicked > 0) packOk = true;
  } else {
    packMsg = `clicked=${clicked}/${count} | ${packMsg}`;
  }

  const toast = (
    await page
      .locator('.toastify, [class*="toast"]')
      .first()
      .textContent({ timeout: 8_000 })
      .catch(() => null)
  )?.trim();
  if (toast) {
    packMsg = `${toast} | ${packMsg}`;
    if (/success|packed|berhasil|updated/i.test(toast)) packOk = true;
  }

  // Setelah pack sukses, tombol check-to-slot hilang / jadi trash (unpack)
  await page.waitForTimeout(1_000);
  const remainingPack = page.locator(
    '.p-datatable-tbody tr button.action-button:has(.fa-check-to-slot), .p-datatable-tbody tr button.action-button',
  );
  const remainingCount = await remainingPack.count().catch(() => 0);
  let stillHasPackIcon = false;
  for (let i = 0; i < remainingCount; i++) {
    const html = (await remainingPack.nth(i).innerHTML().catch(() => '')) || '';
    if (html.includes('check-to-slot') || (/fa-check/i.test(html) && !/trash/i.test(html))) {
      stillHasPackIcon = true;
      break;
    }
  }
  if (clicked > 0 && !stillHasPackIcon) {
    packOk = true;
    packMsg = `${packMsg} | UI: no remaining pack icons`;
  }

  if (clicked === 0 && !stillHasPackIcon) {
    // Sudah semua packed sebelumnya
    packOk = true;
    packMsg = `${packMsg || 'no pack buttons'} | UI: already packed`;
  }

  return { checked: clicked, packOk, packMsg };
}

async function clickCompleteAndNext(
  page: Page,
): Promise<{ ok: boolean; message: string; navigatedNext: boolean }> {
  if (await isFormAlreadyComplete(page)) {
    return {
      ok: true,
      message: 'Sudah complete (Packing Duration / Packed By)',
      navigatedNext: false,
    };
  }

  // Exact "Complete & Next" — jangan /^Complete/i (bentrok Completion Summary)
  const completeBtn = page
    .getByRole('button', { name: /Complete\s*&\s*Next/i })
    .or(page.locator('button').filter({ hasText: /^Complete\s*&\s*Next$/i }))
    .or(page.getByRole('button', { name: 'Complete', exact: true }))
    .first();

  if (!(await completeBtn.isVisible({ timeout: 10_000 }).catch(() => false))) {
    if (await isFormAlreadyComplete(page)) {
      return {
        ok: true,
        message: 'Complete button hilang; dokumen sudah selesai',
        navigatedNext: false,
      };
    }
    return {
      ok: false,
      message: 'Tombol Complete / Complete & Next tidak ditemukan',
      navigatedNext: false,
    };
  }

  const beforeUrl = page.url();
  const beforeId = parsePackingListIdFromUrl(beforeUrl);
  const approveAjax = page.waitForResponse(
    (res) =>
      /packing-list\/\d+\/approve/i.test(res.url()) &&
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
        .getByText(/Packing Duration/i)
        .first()
        .waitFor({ state: 'visible', timeout: 90_000 })
        .then(() => null),
      page
        .waitForURL(
          (url) => {
            const id = parsePackingListIdFromUrl(url.toString());
            return !!id && id !== beforeId;
          },
          { timeout: 90_000 },
        )
        .then(() => null),
      page
        .waitForURL(/\/omni\/packing-list\/?$/, { timeout: 90_000 })
        .then(() => null),
    ]);
    if (res) {
      const body = await res.json().catch(() => null);
      message =
        body?.status?.message || body?.message || `HTTP ${res.status()}`;
      const errFlag = Number(body?.status?.error ?? 0);
      const alreadyApproved = /already approved/i.test(String(message));
      ok = alreadyApproved || (res.ok() && errFlag === 0);
      if (!alreadyApproved && errFlag !== 0) ok = false;
      // eslint-disable-next-line no-console
      console.log('[SEED] approve:', JSON.stringify(body)?.slice(0, 500));
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

  const toast = (
    await page
      .locator('.toastify, [class*="toast"]')
      .first()
      .textContent({ timeout: 12_000 })
      .catch(() => null)
  )?.trim();
  if (toast) {
    message = `${toast} | ${message}`;
    if (/success|complete|berhasil|already approved/i.test(toast)) ok = true;
    else if (/failed|error/i.test(toast) && !/already approved/i.test(toast)) {
      ok = false;
    }
  }

  await page.waitForTimeout(1_500);
  const afterUrl = page.url();
  const afterId = parsePackingListIdFromUrl(afterUrl);
  const navigatedNext =
    !!afterId &&
    afterId !== beforeId &&
    /\/omni\/packing-list\/(edit|set-location)\/\d+/.test(afterUrl);

  if (navigatedNext) {
    await waitLoadingGone(page);
    message = `${message} | navigated → ${afterUrl}`;
    ok = true;
  }

  if (/\/omni\/packing-list\/?$/.test(afterUrl) && afterUrl !== beforeUrl) {
    ok = true;
    message = `${message} | back to datalist`;
  }

  return { ok, message, navigatedNext };
}

async function processOnePackingForm(
  page: Page,
  locationRef: { value: string },
): Promise<{
  meta: { pkCode: string; soHint: string };
  packMsg: string;
  completeMsg: string;
  ok: boolean;
  navigatedNext: boolean;
  skipReason?: string;
}> {
  await dismissDocsAssistant(page);

  if (/\/set-location\//.test(page.url())) {
    const loc = await chooseAnyLocationAndStart(page);
    if (!locationRef.value || locationRef.value.startsWith('(')) {
      locationRef.value = loc;
    }
  } else {
    await page.waitForTimeout(1_200);
    if (/\/set-location\//.test(page.url())) {
      const loc = await chooseAnyLocationAndStart(page);
      if (!locationRef.value || locationRef.value.startsWith('(')) {
        locationRef.value = loc;
      }
    } else if (
      await page
        .locator('[aria-placeholder*="Choose Location"]')
        .first()
        .isVisible({ timeout: 3_000 })
        .catch(() => false)
    ) {
      const loc = await chooseAnyLocationAndStart(page);
      if (!locationRef.value || locationRef.value.startsWith('(')) {
        locationRef.value = loc;
      }
    }
  }

  await dismissDocsAssistant(page);
  const meta = await readCurrentPkMeta(page);
  // eslint-disable-next-line no-console
  console.log(
    `[SEED] Form PK=${meta.pkCode} soHint=${meta.soHint} url=${page.url()}`,
  );

  if (await isFormAlreadyComplete(page)) {
    return {
      meta,
      packMsg: 'already done',
      completeMsg: 'already done',
      ok: true,
      navigatedNext: false,
      skipReason: 'form already complete',
    };
  }

  const isTarget =
    !meta.soHint.startsWith('(') &&
    TARGET_SOS.some((s) => s.toUpperCase() === meta.soHint.toUpperCase());

  // Jika SO terbaca dan bukan target — skip (get-topack quirk)
  if (meta.soHint.startsWith('SO-') && !isTarget) {
    return {
      meta,
      packMsg: 'skip',
      completeMsg: 'skip',
      ok: false,
      navigatedNext: false,
      skipReason: `SO ${meta.soHint} bukan target — skip`,
    };
  }

  await page
    .getByRole('button', { name: /Complete/i })
    .first()
    .waitFor({ state: 'visible', timeout: 90_000 })
    .catch(async () => {
      if (
        await page
          .getByRole('button', { name: /Start\s*Packing/i })
          .first()
          .isVisible()
          .catch(() => false)
      ) {
        const loc = await chooseAnyLocationAndStart(page);
        if (!locationRef.value || locationRef.value.startsWith('(')) {
          locationRef.value = loc;
        }
      }
    });

  const pack = await selectAllSkusAndPack(page);
  // eslint-disable-next-line no-console
  console.log(`[SEED] Pack: ok=${pack.packOk} ${pack.packMsg}`);
  if (!pack.packOk) {
    return {
      meta,
      packMsg: pack.packMsg,
      completeMsg: '',
      ok: false,
      navigatedNext: false,
      skipReason: `pack gagal: ${pack.packMsg}`,
    };
  }

  const complete = await clickCompleteAndNext(page);
  // eslint-disable-next-line no-console
  console.log(
    `[SEED] Complete: ok=${complete.ok} next=${complete.navigatedNext} ${complete.message}`,
  );

  return {
    meta,
    packMsg: pack.packMsg,
    completeMsg: complete.message,
    ok: complete.ok,
    navigatedNext: complete.navigatedNext,
  };
}

async function gotoPkDatalist(page: Page) {
  await page.goto(PACKING_LIST_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
  await waitForPkListAjax(page, 90_000).catch(() => undefined);
  await waitLoadingGone(page);
}

async function verifySoCompleteOnPk(
  page: Page,
  soCode: string,
): Promise<{ found: boolean; complete: boolean; pkCode: string; rowText: string }> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    await searchPk(page, soCode);
    const row = page.getByRole('row').filter({ hasText: soCode }).first();
    const found = await row.isVisible({ timeout: 15_000 }).catch(() => false);
    if (found) {
      const rowText = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
      return {
        found: true,
        complete: isCompleteRowText(rowText),
        pkCode: parsePkFromRowText(rowText),
        rowText,
      };
    }
    if (attempt < 4) {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await waitForPkListAjax(page, 60_000).catch(() => undefined);
      await waitLoadingGone(page);
    }
  }
  return { found: false, complete: false, pkCode: '', rowText: '' };
}

async function clickStartPackingOnRow(page: Page, row: Locator) {
  const startBtn = row
    .locator(
      'button.tooltip-start-packing, button.tooltip-resume-packing, button.tooltip-continue-packing, button#updateButton',
    )
    .first();
  await expect(startBtn).toBeVisible({ timeout: 20_000 });
  const val = await startBtn.getAttribute('value').catch(() => null);
  if (val && /\/omni\/packing-list\//.test(val)) {
    await page.goto(val.trim(), { waitUntil: 'domcontentloaded' });
  } else {
    await startBtn.click();
  }
  await page.waitForURL(/\/omni\/packing-list\/(set-location|edit)\/\d+/, {
    timeout: 60_000,
  });
}

test.describe('Seed — Bulk Start & Complete Packing List (3 SO)', () => {
  test('[@SEED-PK-BULK-3SO] Bulk Start Packing → Pack → Complete — lumicharmsid', async ({
    page,
  }) => {
    test.setTimeout(900_000);
    test.info().annotations.push({ type: 'retries', description: '0' });

    const locationRef = { value: '' };
    const processed: {
      pkCode: string;
      soHint: string;
      packMsg: string;
      completeMsg: string;
    }[] = [];
    let usedBulkToolbar = false;

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PACKING_LIST_PATH,
    });
    await expect(page.getByRole('table').first()).toBeVisible({
      timeout: 60_000,
    });
    await waitForPkListAjax(page, 120_000).catch(() => undefined);
    await waitLoadingGone(page);

    const targets = await findTargetRows(page);
    expect(targets.length, 'Harus temukan 3 PK target').toBe(3);
    for (const t of targets) {
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] ${t.soCode} PK=${t.pkCode} complete=${t.alreadyComplete} | ${t.rowText.slice(0, 160)}`,
      );
    }

    let pending = targets.filter((t) => !t.alreadyComplete);
    if (pending.length === 0) {
      locationRef.value = '(sudah Complete sebelumnya)';
      // eslint-disable-next-line no-console
      console.log('[SEED] Ketiga SO sudah Complete — verifikasi saja');
    } else {
      // 1) Centang semua pending + klik Start Packing di ATAS tabel
      await searchPk(page, SEARCH_PREFIX);
      const targetIds: { soCode: string; pkCode: string; id: string }[] = [];
      for (const t of pending) {
        const row = page.getByRole('row').filter({ hasText: t.soCode }).first();
        await expect(row).toBeVisible({ timeout: 20_000 });
        const id = await extractRowId(row);
        // eslint-disable-next-line no-console
        console.log(
          `[SEED] Selected SO=${t.soCode} PK=${t.pkCode} id=${id}`,
        );
        if (id) targetIds.push({ soCode: t.soCode, pkCode: t.pkCode, id });
        await page.waitForTimeout(300);
      }
      expect(
        targetIds.length,
        'Harus dapat numeric id dari row checkbox/action',
      ).toBeGreaterThan(0);

      const sel = page.getByText(/\d+\s+rows?\s+selected/i).first();
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] Selection: ${(await sel.textContent().catch(() => null)) || '(n/a)'}`,
      );

      const toolbarClicked = await clickToolbarStartPacking(page).catch(
        (err) => {
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Bulk toolbar error: ${err instanceof Error ? err.message : err}`,
          );
          return false;
        },
      );
      usedBulkToolbar = toolbarClicked;
      const landedId = parsePackingListIdFromUrl(page.url());
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] Toolbar Start Packing clicked=${toolbarClicked} landedId=${landedId} targets=[${targetIds.map((t) => t.id).join(',')}] → ${page.url()}`,
      );

      // Proses tiap target id secara eksplisit (get-topack sering bukan SO target)
      const remaining = [...targetIds];
      while (remaining.length > 0) {
        const currentId = parsePackingListIdFromUrl(page.url());
        const onRemaining = remaining.find((t) => t.id === currentId);
        const target = onRemaining ?? remaining[0];

        if (currentId !== target.id) {
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Navigate ke target SO=${target.soCode} id=${target.id} (current=${currentId})`,
          );
          await openPackingById(page, target.id);
        } else {
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Sudah di target SO=${target.soCode} id=${target.id}`,
          );
        }

        const result = await processOnePackingForm(page, locationRef);
        processed.push({
          pkCode: result.meta.pkCode || target.pkCode,
          soHint: result.meta.soHint || target.soCode,
          packMsg: result.packMsg,
          completeMsg: result.completeMsg,
        });

        if (result.skipReason) {
          // eslint-disable-next-line no-console
          console.log(`[SEED] ${result.skipReason}`);
        }

        const idx = remaining.findIndex((t) => t.id === target.id);
        if (idx >= 0) remaining.splice(idx, 1);

        if (result.navigatedNext) {
          // eslint-disable-next-line no-console
          console.log(
            `[SEED] Complete & Next → ${page.url()}; sisa=${remaining.map((r) => r.soCode).join(',')}`,
          );
        }
      }

      // 2) Pastikan sisa pending via per-row Start Packing
      await gotoPkDatalist(page);
      for (const so of TARGET_SOS) {
        // eslint-disable-next-line no-console
        console.log(`[SEED] Ensure complete: ${so}`);
        const v0 = await verifySoCompleteOnPk(page, so);
        if (v0.found && v0.complete) {
          // eslint-disable-next-line no-console
          console.log(`[SEED] ${so} sudah Complete — skip`);
          continue;
        }

        // eslint-disable-next-line no-console
        console.log(`[SEED] Process per-row: ${so}`);
        await searchPk(page, so);
        const row = page.getByRole('row').filter({ hasText: so }).first();
        await expect(row, `Row ${so}`).toBeVisible({ timeout: 30_000 });
        const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
        if (isCompleteRowText(text)) continue;

        await clickStartPackingOnRow(page, row);
        // eslint-disable-next-line no-console
        console.log(`[SEED] Opened form for ${so}: ${page.url()}`);
        const r = await processOnePackingForm(page, locationRef);
        // eslint-disable-next-line no-console
        console.log(
          `[SEED] Result ${so}: ok=${r.ok} loc=${locationRef.value} pack=${r.packMsg} complete=${r.completeMsg} skip=${r.skipReason ?? ''}`,
        );
        expect(
          r.ok,
          `Gagal complete ${so}: ${r.skipReason || r.completeMsg || r.packMsg}`,
        ).toBe(true);
        processed.push({
          pkCode: r.meta.pkCode,
          soHint: r.meta.soHint || so,
          packMsg: r.packMsg,
          completeMsg: r.completeMsg,
        });
        await gotoPkDatalist(page);
      }

      // eslint-disable-next-line no-console
      console.log(
        `[SEED] usedBulkToolbar=${usedBulkToolbar} processed=${processed.length}`,
      );
    }

    // Final verify
    await gotoPkDatalist(page);
    const verifies = [];
    for (const so of TARGET_SOS) {
      const v = await verifySoCompleteOnPk(page, so);
      verifies.push({ soCode: so, ...v });
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] FINAL ${so}: PK=${v.pkCode} complete=${v.complete} | ${v.rowText.slice(0, 140)}`,
      );
    }

    // eslint-disable-next-line no-console
    console.log('\n=== BULK PACKING COMPLETE RESULT ===');
    // eslint-disable-next-line no-console
    console.log(`Location: ${locationRef.value}`);
    // eslint-disable-next-line no-console
    console.log(`usedBulkToolbar: ${usedBulkToolbar}`);
    for (const p of processed) {
      // eslint-disable-next-line no-console
      console.log(
        `Processed: PK=${p.pkCode} soHint=${p.soHint} | pack=${p.packMsg} | complete=${p.completeMsg}`,
      );
    }
    for (const v of verifies) {
      // eslint-disable-next-line no-console
      console.log(
        `| ${v.soCode} | ${v.pkCode} | found=${v.found} | Complete=${v.complete} |`,
      );
    }

    for (const v of verifies) {
      expect(v.found, `${v.soCode} harus ada di Packing List`).toBe(true);
      expect(
        v.complete,
        `Packing Status ${v.soCode} harus Complete. ${v.rowText.slice(0, 160)}`,
      ).toBe(true);
    }
  });
});
