import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  EMPTY_DATE_CONFIRM_PATTERN,
  ETM_15532_RESULTS_DIR,
  SKIP_WAVE_PROCESS_PATH,
  SkipWaveProcessPage,
} from '../../helpers/skip-wave-process';

/**
 * ETM-15532 — Skip Wave Process: popup confirmation saat Import
 * jika Processing Order Date empty.
 *
 * Mapping langkah kartu → POM (halaman /omni/skip-wave-process):
 * 1. Buka Skip Wave Process                 → gotoList
 * 2. Catat tanggal existing                 → readProcessingDate
 * 3. Kosongkan Processing Order Date        → clearProcessingDate
 * 4. Klik Import (+ file dummy jika perlu)  → clickImport
 * 5. Popup confirmation muncul              → isEmptyDateConfirmVisible
 * 6. Cancel (jangan proceed import)         → cancelConfirm
 * 7. Isi tanggal                            → setProcessingDate
 * 8. Klik Import lagi                       → clickImport
 * 9. Tidak ada confirmation                 → assert not visible
 * 10. Restore tanggal semula                → setProcessingDate(original)
 */

const EXPECTED_WORDING =
  'Processing Order Date is empty. All transaction dates for the imported sales orders will automatically use the current date and time. Are you sure you want to proceed?';

type RunDump = {
  card: string;
  menu: string;
  route: string;
  company: string;
  originalDate: string;
  dateAfterClear: string;
  confirmWhenEmpty: boolean;
  confirmTextWhenEmpty: string | null;
  confirmWhenFilled: boolean;
  dummyFileAttached: boolean;
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

function dummyXlsxPath(): string {
  const filePath = path.join(
    ETM_15532_RESULTS_DIR,
    'fixtures',
    'etm-15532-dummy-order-no.xlsx',
  );
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fixture xlsx tidak ada: ${filePath}`);
  }
  return filePath;
}

test.describe.configure({ retries: 0 });

test.describe.serial('ETM-15532 Skip Wave Process empty date import confirm', () => {
  test('[@ETM-15532] Import dengan Processing Order Date empty menampilkan confirmation', async ({
    page,
  }) => {
    test.setTimeout(240_000);
    fs.mkdirSync(path.join(ETM_15532_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });

    const notes: string[] = [];
    const sw = new SkipWaveProcessPage(page);
    const dummyFile = dummyXlsxPath();
    let originalDate = '';
    let dummyFileAttached = false;

    await prepareSession(page, {
      companyCode: 'FAT',
      targetPath: SKIP_WAVE_PROCESS_PATH,
    });
    await sw.gotoList();
    await sw.screenshot('00-page-loaded.png');

    originalDate = await sw.readProcessingDate();
    notes.push(`Tanggal awal: "${originalDate || '(kosong)'}"`);
    notes.push(`File import: ${path.basename(dummyFile)}`);

    try {
      await sw.clearProcessingDate();
      const dateAfterClear = await sw.readProcessingDate();
      const dateEmpty = await sw.isDateEmpty();
      await sw.screenshot('01-date-cleared.png');
      notes.push(`Setelah clear: value="${dateAfterClear}", empty-placeholder=${dateEmpty}`);

      await sw.clickImport();
      dummyFileAttached = await sw.attachDummyFileIfChooser(dummyFile);
      await page.waitForTimeout(2_000);
      await sw.screenshot('02-import-empty-date.png');

      const confirmWhenEmpty = await sw.isEmptyDateConfirmVisible(8_000);
      let confirmTextWhenEmpty: string | null = null;
      if (confirmWhenEmpty) {
        confirmTextWhenEmpty = (
          await sw.confirmText.innerText().catch(() => '')
        ).trim();
      }
      notes.push(`confirmWhenEmpty=${confirmWhenEmpty}`);
      fs.writeFileSync(
        path.join(ETM_15532_RESULTS_DIR, 'measurements-ac-empty.json'),
        JSON.stringify(
          { confirmWhenEmpty, confirmTextWhenEmpty, dummyFileAttached, dateEmpty },
          null,
          2,
        ),
      );

      if (confirmWhenEmpty) {
        await sw.cancelConfirm();
      } else {
        await sw.closeImportChrome();
      }

      const fallbackDate =
        originalDate ||
        `${String(new Date().getDate()).padStart(2, '0')}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${new Date().getFullYear()}`;
      await sw.setProcessingDate(fallbackDate);
      const dateFilled = await sw.readProcessingDate();
      notes.push(`Tanggal setelah diisi: "${dateFilled}"`);
      await sw.screenshot('03-date-filled.png');

      await sw.clickImport();
      await page.waitForTimeout(1_200);
      await sw.screenshot('04-import-filled-date.png');
      const confirmWhenFilled = await sw.isEmptyDateConfirmVisible(2_500);
      await sw.closeImportChrome();
      await sw.cancelConfirm().catch(() => undefined);

      const wordingOk = confirmTextWhenEmpty
        ? EMPTY_DATE_CONFIRM_PATTERN.test(confirmTextWhenEmpty)
        : false;

      const verdict: 'PASS' | 'FAIL' =
        confirmWhenEmpty && !confirmWhenFilled ? 'PASS' : 'FAIL';

      const dump: RunDump = {
        card: 'ETM-15532',
        menu: 'Skip Wave Process',
        route: SKIP_WAVE_PROCESS_PATH,
        company: 'FAT (112)',
        originalDate,
        dateAfterClear,
        confirmWhenEmpty,
        confirmTextWhenEmpty,
        confirmWhenFilled,
        dummyFileAttached,
        verdict,
        notes,
      };
      fs.writeFileSync(
        path.join(ETM_15532_RESULTS_DIR, 'measurements.json'),
        JSON.stringify(dump, null, 2),
      );

      expect(
        dateEmpty || dateAfterClear.length === 0,
        `Precondition ETM-15532: Processing Order Date harus kosong (placeholder "Default to current time"). value="${dateAfterClear}"`,
      ).toBeTruthy();

      expect(
        confirmWhenEmpty,
        `AC empty-date FAIL: confirmation tidak muncul saat Import dengan tanggal kosong. Expected wording: "${EXPECTED_WORDING}"`,
      ).toBeTruthy();
      expect(wordingOk, `Wording confirmation tidak sesuai kartu: "${confirmTextWhenEmpty}"`).toBeTruthy();
      expect(
        confirmWhenFilled,
        'AC filled-date FAIL: confirmation tetap muncul padahal Processing Order Date sudah diisi',
      ).toBeFalsy();
    } finally {
      const restoreDate = originalDate || '06-08-2026 14:12:30';
      await sw.setProcessingDate(restoreDate).catch(() => undefined);
    }
  });
});
