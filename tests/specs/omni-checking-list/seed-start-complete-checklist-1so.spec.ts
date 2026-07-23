import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { OlshopMultiselect } from '../../helpers/shared';
import { SalesOrderGeneralPage } from '../../helpers/sales-order-general';

/**
 * One-off seed: Start Checking → Check all SKUs → Complete (Omni Checking List).
 * Lanjutan setelah Picking List Complete (PL-5TUJMVOG) untuk SO-5TU4KQUG.
 *
 * Menu: /omni/checking-list
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   $env:NODE_OPTIONS="--max-old-space-size=4096"
 *   npx playwright test tests/specs/omni-checking-list/seed-start-complete-checklist-1so.spec.ts --project=authenticated --workers=1 --retries=0 --trace=off
 */

const CHECKING_LIST_PATH = '/omni/checking-list';
const SEARCH_SO = 'SO-5TU4KQUG';

type SoVerify = {
  soCode: string;
  found: boolean;
  statusText: string;
  checkingComplete: boolean;
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

async function findChecklistRow(page: Page): Promise<{
  row: Locator;
  clCode: string;
  soCode: string;
  alreadyComplete: boolean;
  rowText: string;
} | null> {
  for (let attempt = 1; attempt <= 8; attempt++) {
    // eslint-disable-next-line no-console
    console.log(`[SEED] Search Sales Order No. attempt=${attempt} q=${SEARCH_SO}`);
    await searchClBySo(page, SEARCH_SO);
    const row = page.getByRole('row').filter({ hasText: SEARCH_SO }).first();
    const visible = await row.isVisible({ timeout: 5_000 }).catch(() => false);
    if (visible) {
      const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
      const clMatch = text.match(/CL-[A-Z0-9]+/i);
      // "Checking List - XXX" render di kolom name; fallback code di row
      const nameMatch = text.match(/Checking List\s*-\s*([A-Z0-9-]+)/i);
      const alreadyComplete =
        /\bComplete\b/i.test(text) && !/\bIncomplete\b/i.test(text);
      return {
        row,
        clCode:
          clMatch?.[0] ??
          (nameMatch ? nameMatch[1] : '(CL tidak terdeteksi di row)'),
        soCode: SEARCH_SO,
        alreadyComplete,
        rowText: text,
      };
    }
    await page.waitForTimeout(5_000);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
    await waitForClListAjax(page, 60_000).catch(() => undefined);
    await waitLoadingGone(page);
  }
  return null;
}

async function clickStartCheckingOnRow(page: Page, row: Locator) {
  const startBtn = row
    .locator(
      'button.tooltip-start-checking, button.tooltip-resume-checking, button.tooltip-continue-checking, button#updateButton',
    )
    .first();
  await expect(startBtn, 'Tombol Start/Resume/Continue Checking').toBeVisible({
    timeout: 20_000,
  });
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

  const needLocation = await locationBox
    .isVisible({ timeout: 8_000 })
    .catch(() => false);
  if (!needLocation) {
    // eslint-disable-next-line no-console
    console.log('[SEED] Location picker tidak tampil — lanjut checking form');
    return '(lokasi sudah ter-set sebelumnya)';
  }

  await multi.open(locationBox);
  await page.waitForTimeout(800);
  const option = multi.visibleOptions().first();
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
    .or(page.getByText(/\d+\s+row\(s\) selected/i))
    .first();
  let selected = 0;
  if (await selectedLabel.isVisible({ timeout: 5_000 }).catch(() => false)) {
    const selectedText = (await selectedLabel.textContent().catch(() => '')) || '';
    const selectedMatch = selectedText.match(/(\d+)\s+(?:Selected|row)/i);
    selected = selectedMatch ? Number(selectedMatch[1]) : 0;
  }

  // Checking: ikon Check = check-to-slot di action column (klik berurutan + tunggu API per klik)
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
      !/check/i.test(html)
    ) {
      // masih izinkan action-button umum di kolom checking
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

  if (clicked === 0) {
    // Fallback evaluate (DOM click)
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
  } else {
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

  // Sudah semua checked? (0 unchecked)
  const zeroUnchecked = await page
    .getByText(/0\s+out of\s+\d+\s+items\s+unchecked/i)
    .first()
    .isVisible({ timeout: 5_000 })
    .catch(() => false);
  if (zeroUnchecked) {
    checkOk = true;
    checkMsg = `${checkMsg} | UI: 0 unchecked`;
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
): Promise<{ ok: boolean; message: string }> {
  // Sudah selesai? (can_update false → Complete & Next hilang; header Checked By)
  if (
    await page
      .getByText(/Checked By\/Location/i)
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false)
  ) {
    return { ok: true, message: 'Sudah complete (Checked By/Location visible)' };
  }

  // Exact "Complete & Next" — JANGAN pakai /^Complete/i (bentrok Completion Summary jika ada)
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
    if (processed) {
      return { ok: true, message: 'Complete button hilang; status Processed' };
    }
    return { ok: false, message: 'Tombol Complete / Complete & Next tidak ditemukan' };
  }

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
        .getByText(/Checked By\/Location/i)
        .first()
        .waitFor({ state: 'visible', timeout: 90_000 })
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
      ok =
        res.ok() &&
        (errFlag === 0 ||
          errFlag === '0' ||
          errFlag === false ||
          errFlag == null ||
          Number(errFlag) === 0);
      if (errFlag !== undefined && Number(errFlag) !== 0) ok = false;
      // eslint-disable-next-line no-console
      console.log('[SEED] approve body:', JSON.stringify(body)?.slice(0, 600));
    } else {
      ok = true;
      message = 'UI: Checked By/Location (approve response miss / navigated)';
    }
  } catch (err) {
    message = err instanceof Error ? err.message : String(err);
    if (
      (await page
        .getByText(/Checked By\/Location/i)
        .first()
        .isVisible({ timeout: 5_000 })
        .catch(() => false)) ||
      (await page
        .getByText(/Processed/i)
        .first()
        .isVisible({ timeout: 3_000 })
        .catch(() => false))
    ) {
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
    if (/success|complete|checked|berhasil/i.test(toastText)) ok = true;
  }

  return { ok, message };
}

async function verifyClStatusComplete(
  page: Page,
): Promise<{ found: boolean; complete: boolean; rowText: string }> {
  // Hindari prepareSession penuh (berat) — langsung goto datalist
  await page.goto(CHECKING_LIST_PATH, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
  await waitForClListAjax(page, 90_000).catch(() => undefined);
  await waitLoadingGone(page);
  await searchClBySo(page, SEARCH_SO);

  const row = page.getByRole('row').filter({ hasText: SEARCH_SO }).first();
  const found = await row.isVisible({ timeout: 20_000 }).catch(() => false);
  if (!found) {
    return { found: false, complete: false, rowText: '' };
  }
  const rowText = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
  const complete =
    /\bComplete\b/i.test(rowText) && !/\bIncomplete\b/i.test(rowText);
  return { found: true, complete, rowText };
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

test.describe('Seed — Start & Complete Checking List (1 SO)', () => {
  test('[@SEED-CL-COMPLETE] Start Checking → Check → Complete — lumicharmsid', async ({
    page,
  }) => {
    test.setTimeout(600_000);
    test.info().annotations.push({ type: 'retries', description: '0' });

    let clCode = '';
    let soCode = SEARCH_SO;
    let locationChosen = '';
    let startOk = false;
    let checkResult = {
      selected: 0,
      checked: 0,
      checkOk: false,
      checkMsg: '',
    };
    let completeResult = { ok: false, message: '' };
    let clVerify = { found: false, complete: false, rowText: '' };
    let soVerify: SoVerify | null = null;

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: CHECKING_LIST_PATH,
    });

    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
    await waitForClListAjax(page, 120_000).catch(() => undefined);
    await waitLoadingGone(page);

    const found = await findChecklistRow(page);
    expect(
      found,
      'Checking List untuk SO-5TU4KQUG harus muncul di /omni/checking-list',
    ).not.toBeNull();

    clCode = found!.clCode;
    soCode = found!.soCode;
    // eslint-disable-next-line no-console
    console.log(
      `[SEED] Found CL=${clCode} so=${soCode} alreadyComplete=${found!.alreadyComplete}`,
    );
    // eslint-disable-next-line no-console
    console.log(`[SEED] Row: ${found!.rowText.slice(0, 220)}`);

    if (found!.alreadyComplete) {
      startOk = true;
      locationChosen = '(sudah Complete di datalist — skip Start/Check/Complete)';
      checkResult = {
        selected: -1,
        checked: -1,
        checkOk: true,
        checkMsg: 'Sudah Complete di datalist',
      };
      completeResult = {
        ok: true,
        message: 'Checking Status=Complete di datalist — skip aksi',
      };
      // eslint-disable-next-line no-console
      console.log('[SEED] CL already Complete on datalist — skip Start/Check/Complete');
    } else {
      await clickStartCheckingOnRow(page, found!.row);
      startOk = true;

      locationChosen = await chooseAnyLocationAndStart(page);
      // eslint-disable-next-line no-console
      console.log(`[SEED] Location: ${locationChosen}`);
      await dismissDocsAssistant(page);

      const alreadyDone = await page
        .getByText(/Checked By\/Location/i)
        .first()
        .isVisible({ timeout: 5_000 })
        .catch(() => false);

      if (alreadyDone) {
        checkResult = {
          selected: -1,
          checked: -1,
          checkOk: true,
          checkMsg: 'Skip Check — CL sudah complete (Checked By)',
        };
        completeResult = {
          ok: true,
          message: 'Skip Complete — CL sudah complete',
        };
        // eslint-disable-next-line no-console
        console.log('[SEED] CL already completed — skip Check/Complete');
      } else {
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
              throw new Error(
                'Masih di halaman Choose Location setelah Start Checking',
              );
            }
          });

        checkResult = await selectAllSkusAndCheck(page);
        // eslint-disable-next-line no-console
        console.log(
          `[SEED] Check: selected=${checkResult.selected} checked=${checkResult.checked} ok=${checkResult.checkOk} msg=${checkResult.checkMsg}`,
        );
        expect(
          checkResult.checkOk,
          `Check SKU gagal: ${checkResult.checkMsg}`,
        ).toBe(true);

        completeResult = await clickComplete(page);
        // eslint-disable-next-line no-console
        console.log(
          `[SEED] Complete: ok=${completeResult.ok} msg=${completeResult.message}`,
        );
        expect(
          completeResult.ok,
          `Complete gagal: ${completeResult.message}`,
        ).toBe(true);
      }
    }

    clVerify = await verifyClStatusComplete(page);
    // eslint-disable-next-line no-console
    console.log(
      `[SEED] CL verify: found=${clVerify.found} complete=${clVerify.complete} row="${clVerify.rowText.slice(0, 180)}"`,
    );

    soVerify = await verifySoViaGlobalSearch(page, SEARCH_SO);
    // eslint-disable-next-line no-console
    console.log(
      `[SEED] SO ${soVerify.soCode}: found=${soVerify.found} checkingComplete=${soVerify.checkingComplete} status="${soVerify.statusText}" ${soVerify.note ?? ''}`,
    );

    // eslint-disable-next-line no-console
    console.log('\n=== CHECKING COMPLETE RESULT ===');
    // eslint-disable-next-line no-console
    console.log(`CL: ${clCode} | Sales Order No.: ${soCode}`);
    // eslint-disable-next-line no-console
    console.log(`Location: ${locationChosen}`);
    // eslint-disable-next-line no-console
    console.log(`Start Checking: ${startOk}`);
    // eslint-disable-next-line no-console
    console.log(
      `Check: selected=${checkResult.selected} checked=${checkResult.checked} ok=${checkResult.checkOk} | ${checkResult.checkMsg}`,
    );
    // eslint-disable-next-line no-console
    console.log(`Complete: ok=${completeResult.ok} | ${completeResult.message}`);
    // eslint-disable-next-line no-console
    console.log(
      `CL Checking Status Complete: found=${clVerify.found} complete=${clVerify.complete}`,
    );
    // eslint-disable-next-line no-console
    console.log(
      `SO global search: found=${soVerify.found} | ${soVerify.statusText}`,
    );

    expect(clVerify.found, 'CL row harus ketemu setelah Complete').toBe(true);
    expect(
      clVerify.complete,
      `Checking Status harus Complete. Row: ${clVerify.rowText.slice(0, 200)}`,
    ).toBe(true);
    expect(soVerify.found, 'SO harus ketemu via global search').toBe(true);
  });
});
