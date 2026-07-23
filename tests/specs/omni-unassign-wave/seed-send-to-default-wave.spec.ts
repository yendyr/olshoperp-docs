import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { OlshopDatalist } from '../../helpers/shared/datalist';

/**
 * One-off seed: Send to Default Wave untuk SO di Unassign Wave (lumicharmsid).
 *
 * Menu: /omni/unassign-wave
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   npx playwright test tests/specs/omni-unassign-wave/seed-send-to-default-wave.spec.ts --project=authenticated --workers=1 --retries=0
 */

const UNASSIGN_WAVE_PATH = '/omni/unassign-wave';
const SO_CODES = ['SO-5TU4KQUG', 'SO-5TU4LJIU', 'SO-5TU4UD5F'] as const;

type SeedResult = {
  soCode: string;
  status: 'SUCCESS' | 'FAIL' | 'SKIP';
  toastOrApi?: string;
  note?: string;
};

function isUnassignWaveListRequest(url: string): boolean {
  return (
    url.includes('/omnichannel/unassign-wave') &&
    !url.includes('/count-') &&
    !url.includes('/export') &&
    !url.includes('/refresh-stock') &&
    !url.includes('/send-to-wave') &&
    !url.includes('/bulk-send') &&
    !url.includes('/processing') &&
    !url.includes('/check-progress') &&
    !url.includes('/data-logs')
  );
}

async function waitForListAjax(page: import('@playwright/test').Page, timeout = 90_000) {
  await page.waitForResponse(
    (res) => isUnassignWaveListRequest(res.url()) && res.request().method() === 'POST' && res.ok(),
    { timeout },
  );
}

async function ensureDefaultListFilter(page: import('@playwright/test').Page) {
  const failedBtn = page.locator('button').filter({ hasText: 'Failed Process' }).first();
  await expect(failedBtn).toBeVisible({ timeout: 30_000 });

  // Active Failed Process pakai bg-red-50
  const failedActive = await failedBtn.evaluate((el) =>
    el.className.includes('bg-red-50'),
  );
  if (failedActive) {
    const ajax = waitForListAjax(page);
    await failedBtn.click();
    await ajax.catch(() => undefined);
  }

  const onProcessBtn = page
    .locator('button')
    .filter({ hasText: 'On Process to Default Wave' })
    .first();
  const onProcessActive = await onProcessBtn.evaluate((el) =>
    el.className.includes('bg-primary/10'),
  );
  if (onProcessActive) {
    const ajax = waitForListAjax(page);
    await onProcessBtn.click();
    await ajax.catch(() => undefined);
  }
}

async function waitLoadingGone(page: import('@playwright/test').Page) {
  const loading = page.getByText('Loading...', { exact: true });
  await loading.waitFor({ state: 'hidden', timeout: 90_000 }).catch(() => undefined);
  await page.locator('.dt-processing, .dataTables_processing').waitFor({
    state: 'hidden',
    timeout: 30_000,
  }).catch(() => undefined);
}

async function searchSo(page: import('@playwright/test').Page, soCode: string) {
  const datalist = new OlshopDatalist(page);
  const ajax = waitForListAjax(page);
  await datalist.searchInput.fill('');
  await datalist.searchInput.fill(soCode);
  // DataTables debounce — tunggu AJAX search
  await ajax.catch(() => undefined);
  await page.waitForTimeout(800);
  await waitLoadingGone(page);
}

test.describe('Seed — Send to Default Wave (Unassign Wave)', () => {
  test('[@SEED-UW] Send to Default Wave — 3 SO lumicharmsid', async ({ page }) => {
    test.setTimeout(420_000);
    test.info().annotations.push({ type: 'retries', description: '0' });

    const results: SeedResult[] = [];

    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: UNASSIGN_WAVE_PATH,
    });

    const datalist = new OlshopDatalist(page);
    await expect(datalist.table).toBeVisible({ timeout: 45_000 });

    // Tunggu load awal datalist
    await waitForListAjax(page, 120_000).catch(() => undefined);
    await waitLoadingGone(page);
    await ensureDefaultListFilter(page);
    await waitLoadingGone(page);

    for (const soCode of SO_CODES) {
      try {
        await searchSo(page, soCode);

        const row = page.getByRole('row').filter({ hasText: soCode }).first();
        const rowVisible = await row.isVisible({ timeout: 25_000 }).catch(() => false);

        if (!rowVisible) {
          // Coba sekali lagi: reload page + search (kadang filter/state stale)
          await page.goto(UNASSIGN_WAVE_PATH, { waitUntil: 'domcontentloaded' });
          await waitForListAjax(page, 120_000).catch(() => undefined);
          await waitLoadingGone(page);
          await ensureDefaultListFilter(page);
          await searchSo(page, soCode);

          const retryVisible = await row.isVisible({ timeout: 25_000 }).catch(() => false);
          if (!retryVisible) {
            results.push({
              soCode,
              status: 'FAIL',
              note: 'SO tidak ditemukan di Unassign Wave (sudah wave / tidak di list)',
            });
            // eslint-disable-next-line no-console
            console.error(`[SEED FAIL] ${soCode}: tidak ditemukan`);
            continue;
          }
        }

        const sendBtn = row.locator('button.send-to-wave').first();
        const btnVisible = await sendBtn.isVisible({ timeout: 10_000 }).catch(() => false);
        if (!btnVisible) {
          results.push({
            soCode,
            status: 'FAIL',
            note: 'Tombol Send to Default Wave tidak ada di baris',
          });
          continue;
        }

        if (await sendBtn.isDisabled()) {
          results.push({
            soCode,
            status: 'SKIP',
            note: 'Tombol disabled (in queue / process_to_wave=false)',
          });
          // eslint-disable-next-line no-console
          console.log(`[SEED SKIP] ${soCode}: button disabled`);
          continue;
        }

        const responsePromise = page.waitForResponse(
          (res) =>
            res.url().includes('/omnichannel/unassign-wave/') &&
            res.url().includes('/send-to-wave') &&
            res.request().method() === 'POST',
          { timeout: 60_000 },
        );

        await sendBtn.click();

        let apiMessage = '';
        let apiOk = false;
        try {
          const res = await responsePromise;
          const body = await res.json().catch(() => null);
          apiMessage =
            (body &&
              (body.message ||
                body?.data?.message ||
                body?.status?.message ||
                JSON.stringify(body))) ||
            `HTTP ${res.status()}`;
          const errFlag = body?.status?.error;
          apiOk =
            res.ok() &&
            (errFlag === 0 ||
              errFlag === '0' ||
              errFlag === false ||
              errFlag == null ||
              Number(errFlag) === 0);
          if (errFlag !== undefined && Number(errFlag) !== 0) {
            apiOk = false;
          }
        } catch (err) {
          apiMessage = err instanceof Error ? err.message : String(err);
        }

        const toast = page.locator('.toastify, [class*="toast"]').first();
        const toastText = (
          await toast.textContent({ timeout: 8_000 }).catch(() => null)
        )?.trim();
        const message = toastText || apiMessage || '(tidak ada toast/API message)';

        if (apiOk || /success|on process|currently on process/i.test(message)) {
          results.push({
            soCode,
            status: 'SUCCESS',
            toastOrApi: message,
            note: 'Queued ke default wave (async)',
          });
          // eslint-disable-next-line no-console
          console.log(`[SEED OK] ${soCode}: ${message}`);
        } else {
          results.push({
            soCode,
            status: 'FAIL',
            toastOrApi: message,
          });
          // eslint-disable-next-line no-console
          console.error(`[SEED FAIL] ${soCode}: ${message}`);
        }

        await page.waitForTimeout(2_000);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({
          soCode,
          status: 'FAIL',
          note: msg.slice(0, 240),
        });
        // eslint-disable-next-line no-console
        console.error(`[SEED FAIL] ${soCode}: ${msg}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log('\n=== SEND TO DEFAULT WAVE RESULT ===');
    for (const r of results) {
      // eslint-disable-next-line no-console
      console.log(
        `| ${r.soCode} | ${r.status} | ${r.toastOrApi ?? '-'} | ${r.note ?? ''} |`,
      );
    }

    // Soft assert: laporkan semua; fail test hanya jika ada FAIL keras
    const fails = results.filter((r) => r.status === 'FAIL');
    expect(
      fails,
      `Gagal: ${fails.map((f) => `${f.soCode}: ${f.toastOrApi ?? f.note}`).join(' | ')}`,
    ).toHaveLength(0);
  });
});
