import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { prepareSession } from '../../helpers/company-access';
import {
  STOCK_REMAPPING_DATALIST_PATH,
  StockRemappingPage,
  isSelfRemapRejected,
} from '../../helpers/stock-remapping';
import { writeStockRemappingImportXlsx } from '../../helpers/stock-remapping-import-xlsx';

/**
 * ETM-15526 retest — TC-13 / TC-14 / TC-15 (FAILED di komentar 40137).
 *
 * Company: lumicharmsid (153)
 * Building: Dropoff Gayungsari
 * Data uji: sku-spidol-biru / sku-spidol-hijau / sku-spidol-hitam
 *
 * | TC | Expected |
 * | TC-13 | Origin != Remapped To di insert / update Origin / update Qty / approve |
 * | TC-14 | Edit Remapped To / Qty / Description tidak memindahkan baris |
 * | TC-15 | Qty non-numerik ditolak; semua error required tampil; failed row = jumlah baris gagal |
 */
const COMPANY = 'lumicharmsid';
const BUILDING = 'dropoff gayungsari';
const SKU_MIX = 'sku-spidol-biru';
const SKU_WHITE = 'sku-spidol-hijau';
const SKU_PINK = 'sku-spidol-hitam';
const RESULT_DIR = path.join(
  process.cwd(),
  'automate testing jira',
  'ETM-15526',
  'results',
  'retest-failed-tc',
);

function writeJson(name: string, data: unknown): void {
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  fs.writeFileSync(path.join(RESULT_DIR, name), `${JSON.stringify(data, null, 2)}\n`);
}

async function capture(page: Page, name: string): Promise<void> {
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  await page.screenshot({ path: path.join(RESULT_DIR, `${name}.png`), fullPage: true });
}

/**
 * ATS Mix/Pink/White sering 0 (booked oleh RM Open).
 * Kalau Available Products kosong, pakai RM editable yang sudah punya baris Origin.
 */
async function prepareRmWithOrigins(
  page: Page,
  rm: StockRemappingPage,
  requiredSkus: string[],
  description: string,
): Promise<{
  mode: 'create' | 'reuse';
  building: string | null;
  existing: Awaited<ReturnType<StockRemappingPage['findEditableWithOriginSkus']>>;
}> {
  await rm.gotoDatalist();
  await rm.openCreateOrAutoEdit();
  await rm.fillDescription(description);
  await rm.clickSaveAllAndWait();
  const building = await rm.setBuilding(BUILDING).catch(() => null);
  if (await rm.isSkuInAvailableProducts(requiredSkus[0])) {
    return { mode: 'create', building, existing: null };
  }
  const existing = await rm.findEditableWithOriginSkus(requiredSkus);
  if (!existing) {
    throw new Error(
      `BLOCKED: ${requiredSkus[0]} tidak ada di Available Products (ATS=0) dan tidak ada RM editable yang sudah punya baris ${requiredSkus.join(', ')}.`,
    );
  }
  await rm.openEditById(existing.id);
  return { mode: 'reuse', building, existing };
}

test.describe('ETM-15526 retest FAILED TC-13 / TC-14 / TC-15', () => {
  test.describe.configure({ timeout: 420_000 });

  test('[@ETM-15526][@TC-13] Origin = Remapped To ditolak di semua titik', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: STOCK_REMAPPING_DATALIST_PATH,
    });
    const rm = new StockRemappingPage(page);
    const setup = await prepareRmWithOrigins(
      page,
      rm,
      [SKU_MIX],
      'ETM-15526 TC-13 self-remap retest',
    );
    const code = await rm.readGeneratedCode();
    const url = rm.currentEditUrl();

    let insert: Awaited<ReturnType<StockRemappingPage['addOriginSku']>> | null =
      null;
    if (setup.mode === 'create') {
      insert = await rm.addOriginSku(SKU_MIX);
    }
    await capture(page, 'tc13-after-insert-origin');

    const setSameOnInsert = await rm.setRemappedToOnRow(SKU_MIX, SKU_MIX);
    const toastSame = await rm.readToastText();
    await capture(page, 'tc13-set-remapped-same-as-origin');

    const setValid = await rm.setRemappedToOnRow(SKU_MIX, SKU_PINK);
    const setOriginSame = await rm.setOriginOnRow(SKU_MIX, SKU_WHITE);
    const setQty = await rm.setQtyOnRow(SKU_WHITE, 2).catch(async () =>
      rm.setQtyOnRow(SKU_MIX, 2),
    );

    const apiAfter = await rm.fetchApi();
    const details = rm.collectDetails(apiAfter);
    const selfRemapExists = details.some(
      (d) =>
        d.originSku &&
        d.remappedSku &&
        d.originSku.toLowerCase() === d.remappedSku.toLowerCase(),
    );

    let approve: Awaited<ReturnType<StockRemappingPage['tryApprove']>> | null =
      null;
    if (selfRemapExists) {
      approve = await rm.tryApprove();
    }

    const insertRejected = isSelfRemapRejected(setSameOnInsert, toastSame);
    const originUpdateRejected = isSelfRemapRejected(setOriginSame);
    const qtyRejected = isSelfRemapRejected(setQty);
    const approveRejected = approve ? !approve.ok || isSelfRemapRejected(approve) : null;

    const result = {
      code,
      url,
      building: setup.building,
      setup,
      insert,
      setSameOnInsert,
      toastSame,
      setValid,
      setOriginSame,
      setQty,
      details,
      selfRemapExists,
      approve,
      insertRejected,
      originUpdateRejected,
      qtyRejected,
      approveRejected,
    };
    writeJson('tc13-result.json', result);
    await capture(page, 'tc13-final');

    expect(
      insertRejected,
      `TC-13 insert/update Remapped To=Origin harus ditolak. Actual: ok=${setSameOnInsert.ok} msg="${setSameOnInsert.message || toastSame}"`,
    ).toBe(true);
    expect(
      selfRemapExists,
      'Baris Origin = Remapped To tidak boleh tersimpan',
    ).toBe(false);
    if (approve) {
      expect(
        approveRejected,
        `Approve self-remap harus gagal. Actual: ${approve.message}`,
      ).toBe(true);
    }
  });

  test('[@ETM-15526][@TC-14] Inline edit Remapped To tidak memindahkan baris', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: STOCK_REMAPPING_DATALIST_PATH,
    });
    const rm = new StockRemappingPage(page);
    const setup = await prepareRmWithOrigins(
      page,
      rm,
      [SKU_MIX, SKU_PINK],
      'ETM-15526 TC-14 row order retest',
    );
    const code = await rm.readGeneratedCode();
    const url = rm.currentEditUrl();

    if (setup.mode === 'create') {
      await rm.addOriginSku(SKU_MIX);
      await rm.setRemappedToOnRow(SKU_MIX, SKU_WHITE);
      await rm.addOriginSku(SKU_PINK);
      await rm.setRemappedToOnRow(SKU_PINK, SKU_WHITE);
      await rm.clickSaveAllAndWait();
    }

    const identifiers = [SKU_MIX, SKU_PINK];
    const before = await rm.readOriginOrder(identifiers);
    await capture(page, 'tc14-before-edit');

    const editRemapped = await rm.setRemappedToOnRow(SKU_PINK, SKU_MIX);
    const afterRemapped = await rm.readOriginOrder(identifiers);
    await capture(page, 'tc14-after-remapped-to');

    const editQty = await rm.setQtyOnRow(SKU_PINK, 1);
    const afterQty = await rm.readOriginOrder(identifiers);

    await rm.setDescriptionOnRow(SKU_PINK, 'tc14 desc');
    const afterDesc = await rm.readOriginOrder(identifiers);
    await capture(page, 'tc14-after-qty-desc');

    writeJson('tc14-result.json', {
      code,
      url,
      setup,
      before,
      afterRemapped,
      afterQty,
      afterDesc,
      editRemapped,
      editQty,
    });

    expect(before.length, 'Harus ada 2 baris Origin Mix & Pink').toBe(2);
    expect(
      afterRemapped,
      `Ubah Remapped To tidak boleh pindah baris. before=${before.join(' ΓåÆ ')} after=${afterRemapped.join(' ΓåÆ ')}`,
    ).toEqual(before);
    expect(afterQty, 'Ubah Qty tidak boleh pindah baris').toEqual(before);
    expect(afterDesc, 'Ubah Description tidak boleh pindah baris').toEqual(before);
  });

  test('[@ETM-15526][@TC-15] Import validasi & error message', async ({ page }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: STOCK_REMAPPING_DATALIST_PATH,
    });
    const rm = new StockRemappingPage(page);
    await rm.gotoDatalist();
    await rm.openCreateOrAutoEdit();
    await rm.fillDescription('ETM-15526 TC-15 import validation retest');
    await rm.clickSaveAllAndWait();
    const code = await rm.readGeneratedCode();
    const url = rm.currentEditUrl();

    const emptyPath = path.join(RESULT_DIR, 'import-empty.xlsx');
    const i5Path = path.join(RESULT_DIR, 'import-qty-i5.xlsx');
    const requiredPath = path.join(RESULT_DIR, 'import-required-empty.xlsx');

    await writeStockRemappingImportXlsx(emptyPath, [], { headersOnly: true });
    await writeStockRemappingImportXlsx(i5Path, [
      {
        origin: SKU_MIX,
        remapped: SKU_PINK,
        qty: 'I5',
        description: 'non-numeric qty',
      },
    ]);
    await writeStockRemappingImportXlsx(requiredPath, [
      { origin: '', remapped: '', qty: '', description: 'all required empty' },
    ]);

    const emptyUpload = await rm.importDetailFile(emptyPath);
    const emptyHistory = await rm.readImportHistorySummary();
    await capture(page, 'tc15-empty-template');

    const i5Upload = await rm.importDetailFile(i5Path);
    const i5History = await rm.readImportHistorySummary();
    const apiAfterI5 = rm.collectDetails(await rm.fetchApi());
    const i5SneakedIn = apiAfterI5.some((d) => d.qty === 5);
    await capture(page, 'tc15-qty-i5');

    const requiredUpload = await rm.importDetailFile(requiredPath);
    const requiredHistory = await rm.readImportHistorySummary();
    await capture(page, 'tc15-required-empty');

    const requiredMessages = requiredHistory.errorLogs;
    const requiredErrorCount = (requiredMessages.match(/required|must be|cannot be empty|invalid/gi) ?? [])
      .length;

    const result = {
      code,
      url,
      empty: { upload: emptyUpload, history: emptyHistory },
      i5: { upload: i5Upload, history: i5History, i5SneakedIn, details: apiAfterI5 },
      required: {
        upload: requiredUpload,
        history: requiredHistory,
        requiredErrorCount,
      },
    };
    writeJson('tc15-result.json', result);

    const emptyBlob = `${emptyUpload.message} ${emptyHistory.text} ${emptyHistory.errorLogs}`;
    expect(
      /No data rows found to import/i.test(emptyBlob),
      `Template kosong harus pesan "No data rows found to import.". Actual="${emptyBlob.slice(0, 240)}"`,
    ).toBe(true);
    expect(
      emptyHistory.failedRow === 1,
      `Failed row template kosong tidak boleh 1 (harusnya 0 / bukan 1 baris data). Actual failedRow=${emptyHistory.failedRow}`,
    ).toBe(false);

    expect(
      i5SneakedIn,
      'Qty "I5" tidak boleh lolos sebagai angka 5',
    ).toBe(false);
    expect(
      /invalid|numeric|number|qty/i.test(
        `${i5Upload.message} ${i5History.errorLogs} ${i5History.text}`,
      ) || !i5Upload.ok,
      `Qty "I5" harus ditolak. Actual upload.ok=${i5Upload.ok} logs="${i5History.errorLogs.slice(0, 200)}"`,
    ).toBe(true);

    expect(
      requiredErrorCount >= 2 ||
        /origin/i.test(requiredMessages) && /remapped|qty/i.test(requiredMessages),
      `>1 kolom required kosong harus tampil semua error. Actual count=${requiredErrorCount} logs="${requiredMessages.slice(0, 300)}"`,
    ).toBe(true);
  });
});
