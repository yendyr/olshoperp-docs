import { test, expect, type Page, type Locator } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';

/**
 * One-off seed: Generate Picking List untuk 3 SO di Waves Management (lumicharmsid).
 * Lanjutan setelah Send to Default Wave (Unassign Wave).
 *
 * Menu: /omni/waves-management
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   npx playwright test tests/specs/omni-waves-management/seed-generate-picklist-3so.spec.ts --project=authenticated --workers=1 --retries=0
 */

const WAVES_PATH = '/omni/waves-management';
const SO_CODES = ['SO-5TU4KQUG', 'SO-5TU4LJIU', 'SO-5TU4UD5F'] as const;

type SoPickResult = {
  soCode: string;
  found: boolean;
  checked: boolean;
  note?: string;
};

function isWaveListRequest(url: string): boolean {
  return (
    url.includes('/omnichannel/wave') &&
    !url.includes('/so-detail') &&
    !url.includes('/pl-detail') &&
    !url.includes('/transfer-detail') &&
    !url.includes('/revert') &&
    !url.includes('/bulk-') &&
    !url.includes('/generate')
  );
}

function isSoDetailRequest(url: string): boolean {
  return url.includes('/omnichannel/wave/') && url.includes('/so-detail');
}

async function waitForWaveListAjax(page: Page, timeout = 90_000) {
  await page.waitForResponse(
    (res) =>
      isWaveListRequest(res.url()) &&
      res.request().method() === 'POST' &&
      res.ok(),
    { timeout },
  );
}

async function waitForSoDetailAjax(page: Page, timeout = 90_000) {
  await page.waitForResponse(
    (res) =>
      isSoDetailRequest(res.url()) &&
      res.request().method() === 'POST' &&
      res.ok(),
    { timeout },
  );
}

async function waitLoadingGone(page: Page) {
  const loading = page.getByText('Loading...', { exact: true });
  await loading.waitFor({ state: 'hidden', timeout: 90_000 }).catch(() => undefined);
  await page
    .locator('.dt-processing, .dataTables_processing')
    .waitFor({ state: 'hidden', timeout: 30_000 })
    .catch(() => undefined);
}

async function ensureSalesOrderWaveTab(page: Page) {
  // PillButton: klik tab yang sudah active akan TOGGLE ke tipe lain — jangan klik jika sudah SO.
  const soTab = page.getByRole('button', { name: /Waves Sales Orders/i }).first();
  await expect(soTab).toBeVisible({ timeout: 30_000 });

  const hasSoTotal = await page
    .locator('th, .dt-head')
    .filter({ hasText: /SO Total/i })
    .first()
    .isVisible({ timeout: 3_000 })
    .catch(() => false);
  const hasTransferTotal = await page
    .locator('th, .dt-head')
    .filter({ hasText: /Transfer Total/i })
    .first()
    .isVisible({ timeout: 2_000 })
    .catch(() => false);

  if (hasSoTotal && !hasTransferTotal) return;
  const soActive = await soTab.evaluate((el) => el.className.includes('bg-blue-50'));
  if (soActive && !hasTransferTotal) return;

  const ajax = waitForWaveListAjax(page);
  await soTab.click();
  await ajax.catch(() => undefined);
  await waitLoadingGone(page);
  await expect(
    page.locator('th, .dt-head').filter({ hasText: /SO Total/i }).first(),
  ).toBeVisible({ timeout: 30_000 });
}

async function openSoDetailForWave(
  page: Page,
  waveBtn: Locator,
): Promise<{ waveId: string; waveName: string }> {
  const waveId = (await waveBtn.getAttribute('data-id')) ?? '?';
  const row = waveBtn.locator('xpath=ancestor::tr[1]');
  const waveName =
    (await row.locator('td').nth(1).innerText().catch(() => ''))?.trim() ||
    (await row.locator('td').first().innerText().catch(() => ''))?.trim() ||
    `wave#${waveId}`;

  const ajax = waitForSoDetailAjax(page);
  await waveBtn.click();
  await ajax.catch(() => undefined);
  await waitLoadingGone(page);
  await page
    .getByText(/Order Detail/i)
    .first()
    .waitFor({ state: 'visible', timeout: 20_000 })
    .catch(() => undefined);

  return { waveId, waveName };
}

async function checkSoRow(page: Page, soCode: string): Promise<SoPickResult> {
  const row = page.getByRole('row').filter({ hasText: soCode }).first();
  const visible = await row.isVisible({ timeout: 10_000 }).catch(() => false);
  if (!visible) {
    return { soCode, found: false, checked: false, note: 'Tidak ada di SO detail wave' };
  }

  const checkbox = row.locator('input[type="checkbox"]').first();
  if (await checkbox.isVisible({ timeout: 2_000 }).catch(() => false)) {
    const already = await checkbox.isChecked().catch(() => false);
    if (!already) {
      await checkbox.check({ force: true }).catch(async () => {
        await row.locator('td').first().click();
      });
    }
  } else {
    await row.locator('td').first().click();
  }

  const checked =
    (await checkbox.isChecked().catch(() => false)) ||
    (await row.evaluate((el) => el.classList.contains('selected')).catch(() => false));

  return {
    soCode,
    found: true,
    checked: Boolean(checked),
    note: checked ? 'Selected' : 'Klik row — selected tidak terdeteksi (lanjut bulk)',
  };
}

function extractPlCodes(message: string, body: unknown): string[] {
  const text = `${message} ${typeof body === 'object' && body ? JSON.stringify(body) : ''}`;
  const matches = text.match(/PL-[A-Z0-9]+/gi) ?? [];
  return [...new Set(matches)];
}

test.describe('Seed — Generate Picking List (Waves Management)', () => {
  test('[@SEED-WM-PL] Generate Pick List — 3 SO lumicharmsid', async ({ page }) => {
    test.setTimeout(360_000);
    test.info().annotations.push({ type: 'retries', description: '0' });

    const soResults: SoPickResult[] = [];
    let openedWaveId = '';
    let openedWaveName = '';
    let generateMessage = '';
    let generateOk = false;
    let plCodes: string[] = [];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: WAVES_PATH,
    });

    await expect(page.getByRole('table').first()).toBeVisible({ timeout: 60_000 });
    await waitForWaveListAjax(page, 120_000).catch(() => undefined);
    await waitLoadingGone(page);
    await ensureSalesOrderWaveTab(page);
    await waitLoadingGone(page);

    const soBtns = page.locator('button.wave-so-detail');
    await expect(soBtns.first()).toBeVisible({ timeout: 45_000 });

    const btnCount = await soBtns.count();
    const candidates: Array<{ idx: number; id: string; total: number }> = [];
    for (let i = 0; i < btnCount; i++) {
      const btn = soBtns.nth(i);
      const id = (await btn.getAttribute('data-id')) ?? '';
      const text = ((await btn.innerText()) || '0').replace(/[^\d]/g, '') || '0';
      const total = Number(text);
      // eslint-disable-next-line no-console
      console.log(`[SEED] wave-so-detail idx=${i} id=${id} text="${await btn.innerText()}" total=${total}`);
      if (total > 0) candidates.push({ idx: i, id, total });
    }
    candidates.sort((a, b) => {
      if (a.id === '1') return -1;
      if (b.id === '1') return 1;
      return b.total - a.total;
    });
    expect(candidates.length, 'Tidak ada wave dengan SO Total > 0').toBeGreaterThan(0);

    // Prefer Default Waves / MIX (id=1)
    const cand = candidates[0];
    const target = page.locator(`button.wave-so-detail[data-id="${cand.id}"]`).first();
    const opened = await openSoDetailForWave(page, target);
    openedWaveId = opened.waveId;
    openedWaveName = opened.waveName;
    // eslint-disable-next-line no-console
    console.log(`[SEED] Opened wave id=${openedWaveId} name=${openedWaveName}`);

    // Tampilkan sebanyak mungkin baris (wave kecil: 4 SO — tanpa search agar multi-select tidak hilang)
    const lengthSelect = page.locator('.dataTables_length select, select[name*="length"]').last();
    if (await lengthSelect.isVisible({ timeout: 3_000 }).catch(() => false)) {
      const ajaxLen = waitForSoDetailAjax(page);
      const optCount = await lengthSelect.locator('option').count();
      await lengthSelect.selectOption({ index: optCount - 1 }).catch(() => undefined);
      await ajaxLen.catch(() => undefined);
      await waitLoadingGone(page);
    }

    for (const soCode of SO_CODES) {
      const r = await checkSoRow(page, soCode);
      soResults.push(r);
      // eslint-disable-next-line no-console
      console.log(`[SEED] ${soCode}: found=${r.found} checked=${r.checked} ${r.note ?? ''}`);
    }

    const missing = soResults.filter((r) => !r.found);
    expect(
      missing,
      `SO tidak ditemukan di ${openedWaveName} (#${openedWaveId}): ${missing.map((m) => m.soCode).join(', ')}`,
    ).toHaveLength(0);

    const responsePromise = page.waitForResponse(
      (res) =>
        res.url().includes('/bulk-generate-picklist') &&
        res.request().method() === 'POST',
      { timeout: 120_000 },
    );

    const genBtn = page
      .locator('button.bulk-generate-picking')
      .filter({ hasText: /Generate Pick/i })
      .last();
    await expect(genBtn).toBeVisible({ timeout: 15_000 });
    await genBtn.click();

    try {
      const res = await responsePromise;
      const body = await res.json().catch(() => null);
      generateMessage =
        body?.message ||
        body?.data?.message ||
        body?.status?.message ||
        `HTTP ${res.status()}`;
      const errFlag = body?.status?.error;
      generateOk =
        res.ok() &&
        (errFlag === 0 ||
          errFlag === '0' ||
          errFlag === false ||
          errFlag == null ||
          Number(errFlag) === 0);
      if (errFlag !== undefined && Number(errFlag) !== 0) generateOk = false;
      plCodes = extractPlCodes(String(generateMessage), body);
      // eslint-disable-next-line no-console
      console.log('[SEED] API body:', JSON.stringify(body)?.slice(0, 800));
    } catch (err) {
      generateMessage = err instanceof Error ? err.message : String(err);
    }

    const toast = page.locator('.toastify, [class*="toast"]').first();
    const toastText = (
      await toast.textContent({ timeout: 12_000 }).catch(() => null)
    )?.trim();
    if (toastText) {
      generateMessage = `${toastText} | API: ${generateMessage}`;
      if (/success|generated|pick.?list|on process/i.test(toastText)) generateOk = true;
      plCodes = [...new Set([...plCodes, ...extractPlCodes(toastText, null)])];
    }

    // eslint-disable-next-line no-console
    console.log('\n=== GENERATE PICKLIST RESULT ===');
    // eslint-disable-next-line no-console
    console.log(`Wave: ${openedWaveName} (#${openedWaveId})`);
    for (const r of soResults) {
      // eslint-disable-next-line no-console
      console.log(`| ${r.soCode} | found=${r.found} | checked=${r.checked} | ${r.note ?? ''} |`);
    }
    // eslint-disable-next-line no-console
    console.log(`Generate: ok=${generateOk} | ${generateMessage}`);
    // eslint-disable-next-line no-console
    console.log(`PL codes: ${plCodes.join(', ') || '(tidak terdeteksi di response)'}`);

    expect(generateOk, `Generate gagal: ${generateMessage}`).toBe(true);
  });
});
