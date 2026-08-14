import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { prepareSession } from '../../helpers/company-access';
import {
  ETM_15532_CONFIRM_TEXT,
  SKIP_WAVE_PROCESS_PATH,
  SkipWaveProcessPage,
} from '../../helpers/skip-wave-process';

/**
 * ETM-15532 — [Skip Wave Process] confirmation saat import jika Processing Order Date kosong.
 *
 * Company: lumicharmsid (153) | staging.olshoperp.com
 * File dummy: tidak boleh di-Confirm (Cancel) agar batch skip wave tidak terproses.
 *
 * Mapping langkah card → POM:
 * | # | Langkah | Method | Halaman setelah step |
 * | 1 | Buka Skip Wave Process | gotoDatalist | /omni/skip-wave-process |
 * | 2 | Kosongkan / biarkan Processing Order Date empty | clearProcessingOrderDate | halaman list |
 * | 3 | Import file dummy | triggerImport | halaman list (+ dialog bila empty) |
 * | 4 | Verifikasi wording dialog | waitForEmptyDateConfirmation | dialog di atas list |
 * | 5 | Cancel dialog | dismissConfirmation | halaman list |
 * | 6 | Isi tanggal lalu import lagi | ensureProcessingOrderDateFilled + triggerImport | halaman list tanpa dialog empty-date |
 */

const FIXTURE = path.join(
  process.cwd(),
  'tests/fixtures/skip-wave-process/etm-15532-dummy-orders.xlsx',
);

const RESULT_DIR = path.join(
  process.cwd(),
  'implementation-card/[ETM-15532]',
);

async function capture(
  page: import('@playwright/test').Page,
  name: string,
): Promise<string> {
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  const file = path.join(RESULT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

test.describe('ETM-15532 — Skip Wave Process empty Processing Order Date confirmation', () => {
  test.describe.configure({ timeout: 180_000 });

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SKIP_WAVE_PROCESS_PATH,
    });
  });

  test('[@ETM-15532][@TC-SW-EMPTY-DATE] Import dengan Processing Order Date kosong → confirmation dialog', async ({
    page,
  }, testInfo) => {
    const sw = new SkipWaveProcessPage(page);
    await sw.gotoDatalist();
    await capture(page, '01-datalist-before-clear');

    const snapshot = await sw.dumpToolbarSnapshot();
    await testInfo.attach('toolbar-snapshot.json', {
      body: snapshot,
      contentType: 'application/json',
    });
    fs.mkdirSync(RESULT_DIR, { recursive: true });
    fs.writeFileSync(path.join(RESULT_DIR, 'toolbar-snapshot.json'), snapshot);

    await sw.clearProcessingOrderDate();
    await capture(page, '02-after-clear-date');

    const empty = await sw.isProcessingOrderDateEmpty();
    const dateValue = await sw.readProcessingOrderDateValue();
    testInfo.annotations.push({
      type: 'date-after-clear',
      description: empty ? 'empty' : dateValue,
    });

    expect(
      empty,
      `Processing Order Date harus bisa dikosongkan (ETM-15532). Nilai sekarang: "${dateValue}". Snapshot toolbar ada di implementation-card/[ETM-15532]/toolbar-snapshot.json`,
    ).toBe(true);

    const appeared = await sw.clickImportThenMaybeAttach(FIXTURE);
    await capture(page, '03-after-import-empty-date');

    const visibleText = appeared
      ? (
          sw.lastNativeDialogMessage ||
          ((await sw.confirmDialogBody.first().textContent()) ?? '')
        ).trim()
      : '';
    const toast = (
      (await page.locator('.toastify, [class*="toast"]').first().textContent().catch(() => '')) ?? ''
    ).trim();
    testInfo.annotations.push({
      type: 'actual-after-import',
      description: `dialog=${appeared}; native="${sw.lastNativeDialogMessage}"; toast="${toast}"`,
    });

    expect(
      appeared,
      `Dialog konfirmasi harus muncul saat import dengan Processing Order Date kosong.\nExpected wording: "${ETM_15532_CONFIRM_TEXT}"`,
    ).toBe(true);

    expect(visibleText.replace(/\s+/g, ' ')).toContain(
      'Processing Order Date is empty',
    );

    await sw.dismissConfirmation();
    await capture(page, '04-after-dismiss-confirm');
  });

  test('[@ETM-15532][@TC-SW-FILLED-DATE] Import dengan Processing Order Date terisi → tanpa confirmation dialog', async ({
    page,
  }) => {
    const sw = new SkipWaveProcessPage(page);
    await sw.gotoDatalist();

    const filled = await sw.ensureProcessingOrderDateFilled();
    await capture(page, '05-date-filled');

    expect(
      filled && filled.length > 0,
      'Processing Order Date harus terisi sebelum skenario tanpa dialog',
    ).toBeTruthy();

    const appeared = await sw.clickImportThenMaybeAttach(FIXTURE);
    await capture(page, '06-after-import-filled-date');
    expect(
      appeared,
      `Dialog "${ETM_15532_CONFIRM_TEXT}" tidak boleh muncul jika Processing Order Date sudah terisi. Nilai tanggal: "${filled}"`,
    ).toBe(false);

    // Jangan biarkan upload dummy lanjut tanpa kontrol — tutup modal lain bila ada.
    await sw.dismissConfirmation();
    await page.keyboard.press('Escape').catch(() => undefined);
  });
});
