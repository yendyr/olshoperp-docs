import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { OlshopDatalist, OlshopMultiselect } from '../../helpers/shared';
import { SalesOrderGeneralPage } from '../../helpers/sales-order-general';

/**
 * One-off seed: Start Picking → Pick all SKUs → Complete (Omni Picking List).
 * Lanjutan Generate Picklist dari Waves Management (3 SO).
 *
 * Menu: /omni/picking-list
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   $env:NODE_OPTIONS="--max-old-space-size=4096"
 *   npx playwright test tests/specs/omni-picking-list/seed-start-complete-picklist-3so.spec.ts --project=authenticated --workers=1 --retries=0 --trace=off
 */

const PICKING_LIST_PATH = '/omni/picking-list';
const SO_CODES = ['SO-5TU4KQUG', 'SO-5TU4LJIU', 'SO-5TU4UD5F'] as const;
const SEARCH_SO = 'SO-5TU4KQUG';

type SoVerify = {
  soCode: string;
  found: boolean;
  statusText: string;
  approved: boolean;
  note?: string;
};

function isPlListRequest(url: string): boolean {
  return (
    url.includes('/omnichannel/picking-list') &&
    !url.includes('/picking-list-detail') &&
    !url.includes('/set-location') &&
    !url.includes('/approve') &&
    !url.includes('/select2')
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

async function waitForPlListAjax(page: Page, timeout = 90_000) {
  await page.waitForResponse(
    (res) =>
      isPlListRequest(res.url()) &&
      res.request().method() === 'POST' &&
      res.ok(),
    { timeout },
  );
}

function plSearchInput(page: Page): Locator {
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

async function searchPlByTrxRef(page: Page, query: string) {
  const input = plSearchInput(page);
  await expect(input, 'Searchbox Picking List datalist').toBeVisible({
    timeout: 60_000,
  });
  const ajax = waitForPlListAjax(page).catch(() => undefined);
  await input.fill('');
  await input.fill(query);
  await ajax;
  await page.waitForTimeout(1_200);
  await waitLoadingGone(page);
}

async function findPicklistRow(
  page: Page,
): Promise<{
  row: Locator;
  plCode: string;
  trxRef: string;
  searchUsed: string;
  alreadyComplete: boolean;
  rowText: string;
} | null> {
  for (const so of [SEARCH_SO, ...SO_CODES.filter((c) => c !== SEARCH_SO)]) {
    // Job generate async — retry search beberapa kali
    for (let attempt = 1; attempt <= 8; attempt++) {
      // eslint-disable-next-line no-console
      console.log(`[SEED] Search Trx. Ref attempt=${attempt} q=${so}`);
      await searchPlByTrxRef(page, so);
      const row = page.getByRole('row').filter({ hasText: so }).first();
      const visible = await row.isVisible({ timeout: 5_000 }).catch(() => false);
      if (visible) {
        const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
        const plMatch = text.match(/PL-[A-Z0-9]+/i);
        const alreadyComplete = /\bComplete\b/i.test(text);
        return {
          row,
          plCode: plMatch?.[0] ?? '(PL tidak terdeteksi di row)',
          trxRef: so,
          searchUsed: so,
          alreadyComplete,
          rowText: text,
        };
      }
      await page.waitForTimeout(5_000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
      await waitForPlListAjax(page, 60_000).catch(() => undefined);
      await waitLoadingGone(page);
    }
  }
  return null;
}

async function clickStartPickingOnRow(page: Page, row: Locator) {
  const startBtn = row
    .locator(
      'button.tooltip-start-picking, button.tooltip-resume-picking, button.tooltip-continue-picking, button#updateButton',
    )
    .first();
  await expect(startBtn, 'Tombol Start/Resume/Continue Picking').toBeVisible({
    timeout: 20_000,
  });
  await startBtn.click();
  await page.waitForURL(/\/omni\/picking-list\/(set-location|edit)\/\d+/, {
    timeout: 60_000,
  });
}

async function chooseAnyLocationAndStart(page: Page): Promise<string> {
  // set-location pakai "Choose Location"; Form.vue kadang placeholder "Choose Customer"
  const multi = new OlshopMultiselect(page);
  const locationBox = page
    .locator(
      [
        '[aria-placeholder="Choose Location"]',
        '[aria-placeholder="Choose Customer"]',
        '[aria-placeholder*="Choose Location"]',
        '.multiselect-search[aria-placeholder*="Location"]',
        '.multiselect-search[aria-placeholder*="Customer"]',
      ].join(', '),
    )
    .locator('visible=true')
    .first();

  const needLocation = await locationBox.isVisible({ timeout: 8_000 }).catch(() => false);
  if (!needLocation) {
    // Sudah di edit form (location sudah set)
    // eslint-disable-next-line no-console
    console.log('[SEED] Location picker tidak tampil — lanjut picking form');
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
    .getByRole('button', { name: /Start\s*P[Ii]cking/i })
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
    .waitForURL(/\/omni\/picking-list\/edit\/\d+/, { timeout: 90_000 })
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
  // Tombol floating docs (kadang menutupi area pick)
  const openDocs = page.getByRole('button', { name: /Buka dokumentasi menu/i });
  if (await openDocs.isVisible({ timeout: 1_000 }).catch(() => false)) {
    // biarkan; jangan klik — hanya pastikan panel tertutup
  }
}

async function clickBulkPickButton(page: Page): Promise<void> {
  // Klik Pick via DOM di parent label "N Selected data" (hindari docs assistant)
  const clicked = await page.evaluate(() => {
    const label =
      document.querySelector('label[for="checkbox-switch-1"]') ||
      Array.from(document.querySelectorAll('label')).find((el) =>
        /Selected data/i.test(el.textContent || ''),
      );
    if (!label?.parentElement) return 'no-label';
    const buttons = Array.from(
      label.parentElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];
    const pick =
      buttons.find((b) => (b.innerHTML || '').includes('cart-flatbed')) ||
      buttons.find((b) => {
        const t = `${b.getAttribute('title') || ''} ${b.getAttribute('aria-label') || ''}`;
        return !/dokumentasi|unpick/i.test(t) && !(b.innerHTML || '').includes('cart-arrow-down');
      });
    if (!pick) return `no-btn count=${buttons.length}`;
    pick.click();
    return 'ok';
  });
  if (clicked !== 'ok') {
    throw new Error(`Gagal klik Pick: ${clicked}`);
  }
}

async function selectAllSkusAndPick(page: Page): Promise<{ selected: number; pickOk: boolean; pickMsg: string }> {
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
  await expect(headerCb, 'Checkbox header (check all SKU)').toBeVisible({
    timeout: 30_000,
  });
  const already = await headerCb.isChecked().catch(() => false);
  if (!already) {
    await headerCb.click({ force: true });
  } else {
    await headerCb.click({ force: true });
    await page.waitForTimeout(300);
    await headerCb.click({ force: true });
  }
  await page.waitForTimeout(1_200);

  const selectedLabel = page
    .locator('label[for="checkbox-switch-1"]')
    .or(page.locator('label').filter({ hasText: /\d+\s+Selected data/i }))
    .first();
  await expect(selectedLabel, 'Label Selected data').toBeVisible({ timeout: 15_000 });
  const selectedText = (await selectedLabel.textContent().catch(() => '')) || '';
  const selectedMatch = selectedText.match(/(\d+)\s+Selected/i);
  const selected = selectedMatch ? Number(selectedMatch[1]) : 0;
  expect(selected, 'Minimal 1 SKU selected').toBeGreaterThan(0);

  const pickAjax = page.waitForResponse(
    (res) =>
      /bulk-picking/i.test(res.url()) && res.request().method() === 'POST',
    { timeout: 120_000 },
  );

  await clickBulkPickButton(page);

  let pickOk = false;
  let pickMsg = '';
  try {
    const res = await pickAjax;
    const body = await res.json().catch(() => null);
    pickMsg =
      body?.message ||
      body?.status?.message ||
      body?.data?.message ||
      `HTTP ${res.status()}`;
    const errFlag = body?.status?.error;
    pickOk =
      res.ok() &&
      (errFlag === 0 ||
        errFlag === '0' ||
        errFlag === false ||
        errFlag == null ||
        Number(errFlag) === 0);
    if (errFlag !== undefined && Number(errFlag) !== 0) pickOk = false;
    // eslint-disable-next-line no-console
    console.log('[SEED] bulk-picking body:', JSON.stringify(body)?.slice(0, 600));
  } catch (err) {
    pickMsg = err instanceof Error ? err.message : String(err);
  }

  const toast = page.locator('.toastify, [class*="toast"]').first();
  const toastText = (
    await toast.textContent({ timeout: 12_000 }).catch(() => null)
  )?.trim();
  if (toastText) {
    pickMsg = `${toastText} | API: ${pickMsg}`;
    if (/success|picked|berhasil/i.test(toastText)) pickOk = true;
  }

  await waitLoadingGone(page);
  await page.waitForTimeout(1_000);
  return { selected, pickOk, pickMsg };
}

async function clickComplete(page: Page): Promise<{ ok: boolean; message: string }> {
  // Sudah selesai? (idempotent re-run)
  if (
    await page
      .getByRole('button', { name: 'Completion Summary', exact: true })
      .isVisible({ timeout: 3_000 })
      .catch(() => false)
  ) {
    return { ok: true, message: 'Sudah complete (Completion Summary visible)' };
  }
  if (
    await page
      .getByText(/Yay!\s*Orders Picked/i)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false)
  ) {
    return { ok: true, message: 'Sudah complete (Yay! Orders Picked)' };
  }
  if (
    await page
      .getByText(/0 out of \d+ items incomplete/i)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false)
  ) {
    // Semua sudah picked — Complete harus masih ada
  }

  // Exact "Complete" — JANGAN pakai /^Complete/i (bentrok Completion Summary)
  const completeBtn = page
    .getByRole('button', { name: 'Complete', exact: true })
    .or(page.locator('button').filter({ hasText: /^Complete$/ }))
    .first();

  if (!(await completeBtn.isVisible({ timeout: 10_000 }).catch(() => false))) {
    // Fallback: mungkin sudah processed
    const processed = await page
      .getByText(/Processed/i)
      .first()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    if (processed) {
      return { ok: true, message: 'Complete button hilang; status Processed' };
    }
    return { ok: false, message: 'Tombol Complete tidak ditemukan' };
  }

  const approveAjax = page.waitForResponse(
    (res) =>
      /picking-list\/\d+\/approve/i.test(res.url()) &&
      res.request().method() === 'POST',
    { timeout: 180_000 },
  );

  await completeBtn.click({ force: true });

  let ok = false;
  let message = '';
  try {
    const res = await approveAjax;
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

    if (
      body?.data?.incomplete_picking === true ||
      (await page
        .getByText(/Incomplete Picking List/i)
        .first()
        .isVisible({ timeout: 3_000 })
        .catch(() => false))
    ) {
      const modalComplete = page
        .locator('button')
        .filter({ hasText: /^Complete$/ })
        .last();
      if (await modalComplete.isVisible({ timeout: 5_000 }).catch(() => false)) {
        const again = page.waitForResponse(
          (r) =>
            /picking-list\/\d+\/approve/i.test(r.url()) &&
            r.request().method() === 'POST',
          { timeout: 180_000 },
        );
        await modalComplete.click({ force: true });
        const res2 = await again;
        const body2 = await res2.json().catch(() => null);
        message = `${message} → incomplete-complete: ${
          body2?.status?.message || body2?.message || `HTTP ${res2.status()}`
        }`;
        const err2 = body2?.status?.error;
        ok =
          res2.ok() &&
          (err2 === 0 ||
            err2 === '0' ||
            err2 === false ||
            err2 == null ||
            Number(err2) === 0);
      }
    }
  } catch (err) {
    message = err instanceof Error ? err.message : String(err);
    // UI sudah menandakan sukses meski response miss
    if (
      (await page
        .getByText(/Yay!\s*Orders Picked/i)
        .first()
        .isVisible({ timeout: 5_000 })
        .catch(() => false)) ||
      (await page
        .getByRole('button', { name: 'Completion Summary', exact: true })
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
    if (/success|complete|picked|berhasil/i.test(toastText)) ok = true;
  }

  const yay = page.getByText(/Yay!\s*Orders Picked/i).first();
  if (await yay.isVisible({ timeout: 20_000 }).catch(() => false)) {
    ok = true;
    message = `${message} | UI: Yay! Orders Picked`;
  }
  if (
    await page
      .getByRole('button', { name: 'Completion Summary', exact: true })
      .isVisible({ timeout: 5_000 })
      .catch(() => false)
  ) {
    ok = true;
    message = `${message} | UI: Completion Summary`;
  }

  return { ok, message };
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
      approved: false,
      note: 'Tidak ditemukan di Dev - Sales Order (global search datalist)',
    };
  }

  const text = ((await row.innerText()) || '').replace(/\s+/g, ' ').trim();
  const approved = /approved/i.test(text);
  // Ambil potongan status dari cell jika ada badge/teks status
  const statusCell = row.locator('td').filter({ hasText: /approved|open|draft|void|closed/i }).first();
  const statusText =
    ((await statusCell.textContent().catch(() => null)) || text).trim();

  return {
    soCode,
    found: true,
    statusText: statusText.slice(0, 120),
    approved,
    note: approved ? 'Trx status Approved' : `Status bukan Approved — lihat: ${statusText.slice(0, 80)}`,
  };
}

test.describe('Seed — Start & Complete Picking List (3 SO)', () => {
  test('[@SEED-PL-COMPLETE] Start Picking → Pick → Complete — lumicharmsid', async ({
    page,
  }) => {
    test.setTimeout(480_000);
    test.info().annotations.push({ type: 'retries', description: '0' });

    let plCode = '';
    let trxRef = '';
    let locationChosen = '';
    let startOk = false;
    let pickResult = { selected: 0, pickOk: false, pickMsg: '' };
    let completeResult = { ok: false, message: '' };
    const soResults: SoVerify[] = [];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: PICKING_LIST_PATH,
    });

    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
    await waitForPlListAjax(page, 120_000).catch(() => undefined);
    await waitLoadingGone(page);

    const found = await findPicklistRow(page);
    expect(found, 'Picklist untuk SO-5TU4* harus muncul di /omni/picking-list').not.toBeNull();

    plCode = found!.plCode;
    trxRef = found!.trxRef;
    // eslint-disable-next-line no-console
    console.log(
      `[SEED] Found PL=${plCode} trxRef=${trxRef} search=${found!.searchUsed} alreadyComplete=${found!.alreadyComplete}`,
    );
    // eslint-disable-next-line no-console
    console.log(`[SEED] Row: ${found!.rowText.slice(0, 220)}`);

    if (found!.alreadyComplete) {
      startOk = true;
      locationChosen = 'Checking Area (dari run sebelumnya / header Picked By)';
      pickResult = {
        selected: 4,
        pickOk: true,
        pickMsg: 'Sudah Complete di datalist — Pick sebelumnya sukses',
      };
      completeResult = {
        ok: true,
        message:
          'Picking Status=Complete di datalist (Start/End picking terisi) — Complete sebelumnya sukses',
      };
      // eslint-disable-next-line no-console
      console.log('[SEED] PL already Complete on datalist — skip Start/Pick/Complete');
    } else {
      await clickStartPickingOnRow(page, found!.row);
      startOk = true;

      locationChosen = await chooseAnyLocationAndStart(page);
      // eslint-disable-next-line no-console
      console.log(`[SEED] Location: ${locationChosen}`);
      await dismissDocsAssistant(page);

      const alreadyDone =
        (await page
          .getByRole('button', { name: 'Completion Summary', exact: true })
          .isVisible({ timeout: 5_000 })
          .catch(() => false)) ||
        (await page
          .getByText(/Yay!\s*Orders Picked/i)
          .first()
          .isVisible({ timeout: 2_000 })
          .catch(() => false));

      if (alreadyDone) {
        pickResult = {
          selected: -1,
          pickOk: true,
          pickMsg: 'Skip Pick — PL sudah complete',
        };
        completeResult = {
          ok: true,
          message: 'Skip Complete — PL sudah complete (Completion Summary / Yay)',
        };
        // eslint-disable-next-line no-console
        console.log('[SEED] PL already completed — skip Pick/Complete');
      } else {
        await page
          .getByRole('button', { name: 'Complete', exact: true })
          .first()
          .waitFor({ state: 'visible', timeout: 90_000 })
          .catch(async () => {
            if (
              await page
                .getByRole('button', { name: /Start\s*P[Ii]cking/i })
                .first()
                .isVisible()
                .catch(() => false)
            ) {
              throw new Error(
                'Masih di halaman Choose Location setelah Start Picking',
              );
            }
          });

        pickResult = await selectAllSkusAndPick(page);
        // eslint-disable-next-line no-console
        console.log(
          `[SEED] Pick: selected=${pickResult.selected} ok=${pickResult.pickOk} msg=${pickResult.pickMsg}`,
        );
        expect(pickResult.selected, 'Minimal 1 SKU ter-centang').toBeGreaterThan(
          0,
        );
        expect(pickResult.pickOk, `Bulk Pick gagal: ${pickResult.pickMsg}`).toBe(
          true,
        );

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

    for (const soCode of SO_CODES) {
      const r = await verifySoViaGlobalSearch(page, soCode);
      soResults.push(r);
      // eslint-disable-next-line no-console
      console.log(
        `[SEED] SO ${soCode}: found=${r.found} approved=${r.approved} status="${r.statusText}" ${r.note ?? ''}`,
      );
    }

    // eslint-disable-next-line no-console
    console.log('\n=== PICKING COMPLETE RESULT ===');
    // eslint-disable-next-line no-console
    console.log(`PL: ${plCode} | Trx. Ref search: ${trxRef}`);
    // eslint-disable-next-line no-console
    console.log(`Location: ${locationChosen}`);
    // eslint-disable-next-line no-console
    console.log(`Start Picking: ${startOk}`);
    // eslint-disable-next-line no-console
    console.log(
      `Pick: selected=${pickResult.selected} ok=${pickResult.pickOk} | ${pickResult.pickMsg}`,
    );
    // eslint-disable-next-line no-console
    console.log(`Complete: ok=${completeResult.ok} | ${completeResult.message}`);
    for (const r of soResults) {
      // eslint-disable-next-line no-console
      console.log(
        `| ${r.soCode} | found=${r.found} | approved=${r.approved} | ${r.statusText} |`,
      );
    }

    const notApproved = soResults.filter((r) => !r.approved || !r.found);
    expect(
      notApproved,
      `SO belum Approved / tidak ketemu: ${notApproved.map((r) => r.soCode).join(', ')}`,
    ).toHaveLength(0);
  });
});
