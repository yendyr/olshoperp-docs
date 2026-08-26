import * as fs from 'fs';
import * as path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  ETM_15584_RESULTS_DIR,
  INSUFFICIENT_STOCK_PATTERN,
  STOCK_REMAPPING_PATH,
  StockRemappingPage,
  planSplitQty,
  type AvailableStockRow,
  type ApproveOutcome,
} from '../../helpers/stock-remapping';

/**
 * ETM-15584 — Stock Remapping: Approve gagal karena validasi Stock ID
 * membaca availability 0 dari alokasi dokumen yang sama.
 *
 * Mapping langkah kartu → POM:
 * 1. Datalist Stock Remapping → Create              → gotoDatalist + openCreateOrAutoEdit
 * 2. Warehouse Lobby Tanrise + description          → selectWarehouse + fillDescription
 * 3. Available Products, cari SKU Origin            → openAvailableProducts
 * 4. Use qty yang split ≥2 Stock ID; Remapped To    → useOriginSku
 * 5. Approve                                        → approve
 * 6. Expected: Approved, tanpa false Insufficient stock
 *
 * Company: DEV-STG (13)
 * Origin (instruksi run): SKU-RM-01-tosca
 * Remapped To (sibling same parent, balik arah kartu): SKU-RM-01-hijau
 *
 * Expected (requirement §8.3 / GAP-RM-03):
 * Approve harus menghitung reserved/allocated qty dokumen ini sebagai stok sah.
 */

const COMPANY = 'DEV-STG';
const ORIGIN_SKU = 'SKU-RM-01-tosca';
const REMAPPED_TO_SKU = 'SKU-RM-01-hijau';
const WAREHOUSE = 'Lobby Tanrise';

type AcResult = {
  id: string;
  title: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  detail: string;
};

type RunDump = {
  card: string;
  menu: string;
  route: string;
  company: string;
  originSku: string;
  remappedToSku: string;
  warehouse: string;
  rmCode: string | null;
  rmUrl: string | null;
  available: AvailableStockRow[];
  splitPlan: ReturnType<typeof planSplitQty> | null;
  detailText: string | null;
  detailStockIds: string[];
  approve: ApproveOutcome | null;
  ac: AcResult[];
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

function writeDump(dump: RunDump): void {
  fs.mkdirSync(ETM_15584_RESULTS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(ETM_15584_RESULTS_DIR, 'measurements.json'),
    JSON.stringify(dump, null, 2),
  );
}

test.describe.configure({ retries: 0 });

test.describe.serial('ETM-15584 Stock Remapping approve split Stock ID', () => {
  test('[@ETM-15584] Approve remapping split Stock ID tidak false Insufficient stock', async ({
    page,
  }) => {
    test.setTimeout(420_000);
    fs.mkdirSync(path.join(ETM_15584_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });

    const notes: string[] = [];
    const ac: AcResult[] = [];
    let rmCode: string | null = null;
    let rmUrl: string | null = null;
    let available: AvailableStockRow[] = [];
    let splitPlan: ReturnType<typeof planSplitQty> | null = null;
    let detailText: string | null = null;
    let detailStockIds: string[] = [];
    let approve: ApproveOutcome | null = null;
    let verdict: 'PASS' | 'FAIL' = 'FAIL';

    const dump = (): RunDump => ({
      card: 'ETM-15584',
      menu: 'Stock Remapping',
      route: STOCK_REMAPPING_PATH,
      company: COMPANY,
      originSku: ORIGIN_SKU,
      remappedToSku: REMAPPED_TO_SKU,
      warehouse: WAREHOUSE,
      rmCode,
      rmUrl,
      available,
      splitPlan,
      detailText,
      detailStockIds,
      approve,
      ac,
      verdict,
      notes,
    });

    try {
      const rm = new StockRemappingPage(page);
      await prepareSession(page, {
        companyCode: COMPANY,
        targetPath: STOCK_REMAPPING_PATH,
      });
      await rm.gotoDatalist();
      await rm.screenshot('01-datalist.png');

      const mode = await rm.openCreateOrAutoEdit();
      notes.push(`Setelah Create: mode=${mode}`);
      await rm.fillDescription('automation playwright ETM-15584');
      await rm.selectWarehouse(WAREHOUSE);
      await rm.clickSaveAndNextIfCreate();
      rmCode = await rm.readGeneratedCode();
      rmUrl = await rm.readEditUrl();
      notes.push(`Transaksi baru: ${rmCode} ${rmUrl}`);
      await rm.screenshot('02-header-open.png');

      const apiRows = await rm.openAvailableProductsWithData(ORIGIN_SKU);
      const fromApi = rm.parseAvailableFromApi(ORIGIN_SKU, apiRows);
      const fromTable = await rm.parseAvailableFromTable(ORIGIN_SKU);
      available = fromApi.length > 0 ? fromApi : fromTable;
      notes.push(
        `Available ${ORIGIN_SKU}: API=${fromApi.length} baris, tabel=${fromTable.length} baris`,
      );
      await rm.screenshot('03-available-products.png');

      expect(
        available.length,
        `${ORIGIN_SKU} harus ada di Available Products company DEV-STG / ${WAREHOUSE}`,
      ).toBeGreaterThan(0);

      splitPlan = planSplitQty(available);
      notes.push(`Split plan: ${splitPlan.reason} qty=${splitPlan.qty}`);
      expect(
        splitPlan.qty,
        `Available qty Origin ${ORIGIN_SKU} harus > 0`,
      ).toBeGreaterThan(0);

      const used = await rm.bulkUseStockIds({
        sku: ORIGIN_SKU,
        remappedTo: REMAPPED_TO_SKU,
        stockIds: splitPlan.batches.map((b) => b.stockId).filter(Boolean),
      });
      notes.push(
        `Bulk Use Origin ${ORIGIN_SKU} stockIds=${splitPlan.batches
          .map((b) => `${b.stockId}:${b.available}`)
          .join(', ')} ok=${used.ok} message=${used.apiMessage ?? '(none)'}`,
      );
      expect(used.ok, `Use Product Origin gagal: ${used.apiMessage}`).toBeTruthy();

      await rm.setRemappedToOnDetail(ORIGIN_SKU, REMAPPED_TO_SKU);
      detailText = await rm.readDetailTexts();
      detailStockIds = await rm.readDetailStockIds();
      notes.push(`Detail stock IDs: ${detailStockIds.join(', ') || '(tidak terbaca)'}`);
      notes.push(`Detail text: ${detailText.slice(0, 400)}`);
      await rm.screenshot('04-detail-after-use.png');

      const splitConfirmed =
        detailStockIds.length >= 2 ||
        (splitPlan.canSplit && /SKU-RM-01-tosca/i.test(detailText));

      if (!splitConfirmed && detailStockIds.length < 2) {
        notes.push(
          'Split ≥2 Stock ID belum terlihat di tabel detail — approve tetap dijalankan; AC split bisa SKIP jika hanya 1 batch.',
        );
      }

      approve = await rm.approve();
      await rm.screenshot('05-after-approve.png');
      notes.push(
        `Approve: ok=${approve.ok} http=${approve.httpStatus} insufficient=${approve.insufficientStock} redirected=${approve.redirected} api="${approve.apiMessage ?? ''}" toast="${approve.toastText ?? ''}"`,
      );

      const splitAc: AcResult = {
        id: 'AC-split-allocation',
        title:
          'Qty remapping di-split ke ≥2 Stock ID (batch pertama available jadi 0)',
        status:
          detailStockIds.length >= 2 || splitPlan.canSplit ? 'PASS' : 'SKIP',
        detail:
          detailStockIds.length >= 2
            ? `Stock ID di detail: ${detailStockIds.join(', ')} qty=${splitPlan.qty}`
            : splitPlan.canSplit
              ? `FIFO split direncanakan (qty=${splitPlan.qty}) tapi Stock ID detail tidak terbaca di UI. Plan: ${splitPlan.reason}`
              : `Tidak cukup batch untuk merepro split. ${splitPlan.reason}`,
      };
      ac.push(splitAc);

      const falseError =
        approve.insufficientStock ||
        INSUFFICIENT_STOCK_PATTERN.test(
          `${approve.apiMessage ?? ''} ${approve.toastText ?? ''}`,
        );

      if (splitAc.status === 'SKIP') {
        ac.push({
          id: 'AC-approve-no-false-insufficient',
          title:
            'Approve berhasil; tidak ada false Insufficient stock 0 base units',
          status: 'SKIP',
          detail:
            'Skenario split Stock ID tidak terbentuk — hasil Approve tidak dipakai sebagai bukti fix ETM-15584.',
        });
        notes.push(
          'BLOCKER data: Origin tosca tidak punya ≥2 Stock ID yang bisa di-split di Lobby Tanrise.',
        );
        verdict = 'FAIL';
        writeDump(dump());
        expect(
          false,
          `BLOCKER: tidak bisa merepro split ≥2 Stock ID untuk ${ORIGIN_SKU}. ${splitPlan.reason}`,
        ).toBeTruthy();
        return;
      }

      ac.push({
        id: 'AC-approve-no-false-insufficient',
        title:
          'Approve berhasil; tidak ada false Insufficient stock 0 base units',
        status: falseError || !approve.ok ? 'FAIL' : 'PASS',
        detail: falseError
          ? `False error masih muncul: ${approve.apiMessage ?? approve.toastText ?? 'Insufficient stock 0 base units'}`
          : `Approve ok=${approve.ok} redirected=${approve.redirected} http=${approve.httpStatus} message=${approve.apiMessage ?? '(none)'}`,
      });

      const failed = ac.filter((item) => item.status === 'FAIL');
      verdict = failed.length === 0 ? 'PASS' : 'FAIL';
      writeDump(dump());

      expect(
        falseError,
        `ETM-15584 FAIL: false Insufficient stock. API="${approve.apiMessage ?? ''}" toast="${approve.toastText ?? ''}"`,
      ).toBeFalsy();
      expect(
        approve.ok,
        `Approve gagal: HTTP ${approve.httpStatus} ${approve.apiMessage ?? ''}`,
      ).toBeTruthy();
    } catch (err) {
      notes.push(err instanceof Error ? err.message : String(err));
      verdict = 'FAIL';
      writeDump(dump());
      throw err;
    }
  });
});
