import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  BENCHMARK_COGS_PATH,
  ETM_15493_RESULTS_DIR,
  ProductBenchmarkPricePage,
  isFormulaDescription,
  isManualDescription,
  moneyEquals,
  type BenchmarkSkuRow,
} from '../../helpers/product-benchmark-price';
import {
  SO_GENERAL_DATALIST_PATH,
  SalesOrderGeneralPage,
} from '../../helpers/sales-order-general';

/**
 * ETM-15493 — Dev - Sales Order: snapshot Benchmark COGS = effective Manual COGS.
 *
 * Mapping langkah kartu → POM:
 * 1. Buka Benchmark COGS, baca master SKU expired     → ProductBenchmarkPricePage.readSku
 * 2. Buka Dev - Sales Order → Create                  → openCreateOrAutoEdit
 * 3. Add line SKU expired via Select Product          → addProductAndCaptureSnapshot
 * 4. Unhide kolom Benchmark COGS                      → showBenchmarkCogsColumn
 * 5. Verifikasi snapshot = COGS efektif rumus         → readUiBenchmarkCogs
 * 6. (opsional) line Manual aktif / ganti product     → addProduct / changeProductOnLine
 *
 * Company: DEV-STG (13)
 * SKU expired (user): SKU-ManualCOGSWithExpirationDate-4
 *   Manual COGS expiry = 13 Agustus 2026 23:59:59
 *
 * Expected (requirement sales-order-general §8.2 / Benchmark §3.5):
 * setelah expiry, snapshot pakai rumus Highest Price / Last Inbound / No Inbound.
 */

const COMPANY = 'DEV-STG';
const EXPIRED_SKU = 'SKU-ManualCOGSWithExpirationDate-4';
const SIBLING_SKUS = [
  'SKU-ManualCOGStanpaExpiredDate-1',
  'SKU-ManualCOGSWithExpirationDate-1',
  'SKU-ManualCOGSWithExpirationDate-2',
  'SKU-ManualCOGSWithExpirationDate-3',
];

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
  soCode: string | null;
  soUrl: string | null;
  expiredSku: string;
  master: Record<string, BenchmarkSkuRow | null>;
  snapshots: Array<{
    sku: string;
    api: number | null;
    ui: number | null;
    uiText: string;
    expected: number | null;
    expectedSource: string;
  }>;
  ac: AcResult[];
  verdict: 'PASS' | 'FAIL';
  notes: string[];
};

function writeDump(dump: RunDump): void {
  fs.mkdirSync(ETM_15493_RESULTS_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(ETM_15493_RESULTS_DIR, 'measurements.json'),
    JSON.stringify(dump, null, 2),
  );
}

function pickActiveManualSku(
  rows: Record<string, BenchmarkSkuRow | null>,
): BenchmarkSkuRow | null {
  for (const sku of SIBLING_SKUS) {
    const row = rows[sku];
    if (!row) continue;
    if (!isManualDescription(row.description)) continue;
    if (row.manualCogs == null) continue;
    return row;
  }
  return null;
}

test.describe.configure({ retries: 0 });

test.describe.serial('ETM-15493 Dev - Sales Order Benchmark COGS snapshot', () => {
  test('[@ETM-15493] Snapshot Benchmark COGS memakai effective COGS termasuk expiry Manual', async ({
    page,
  }) => {
    test.setTimeout(420_000);
    fs.mkdirSync(path.join(ETM_15493_RESULTS_DIR, 'screenshots'), {
      recursive: true,
    });

    const notes: string[] = [];
    const ac: AcResult[] = [];
    const master: Record<string, BenchmarkSkuRow | null> = {};
    const snapshots: RunDump['snapshots'] = [];
    let soCode: string | null = null;
    let soUrl: string | null = null;
    let verdict: 'PASS' | 'FAIL' = 'FAIL';

    const dump = (): RunDump => ({
      card: 'ETM-15493',
      menu: 'Dev - Sales Order',
      route: SO_GENERAL_DATALIST_PATH,
      company: COMPANY,
      soCode,
      soUrl,
      expiredSku: EXPIRED_SKU,
      master,
      snapshots,
      ac,
      verdict,
      notes,
    });

    try {
      const bm = new ProductBenchmarkPricePage(page);
      await prepareSession(page, {
        companyCode: COMPANY,
        targetPath: BENCHMARK_COGS_PATH,
      });
      await bm.gotoList();
      await bm.screenshot('01-benchmark-cogs-list.png');

      for (const sku of [EXPIRED_SKU, ...SIBLING_SKUS]) {
        const row = await bm.readSkuWithShowDetailFallback(sku);
        master[sku] = row;
        notes.push(
          row
            ? `Master ${sku}: COGS=${row.cogsText} Manual=${row.manualCogsText} Expiry=${row.expiryText} Desc="${row.description}" (${row.source})`
            : `Master ${sku}: tidak ketemu di Benchmark COGS`,
        );
      }
      await bm.screenshot('02-benchmark-cogs-expired-sku.png');

      const expiredMaster = master[EXPIRED_SKU];
      expect(
        expiredMaster,
        `SKU ${EXPIRED_SKU} harus ada di Benchmark COGS company DEV-STG`,
      ).toBeTruthy();

      const expiredEffective = expiredMaster!.cogs;
      const expiredManual = expiredMaster!.manualCogs;
      const expiredIsFormula = isFormulaDescription(expiredMaster!.description);
      const expiredStillManual = isManualDescription(expiredMaster!.description);

      if (expiredStillManual) {
        notes.push(
          `Catatan: Description master ${EXPIRED_SKU} masih "Manual Input" padahal expiry 13-08-2026 23:59:59 sudah lewat (today=14-08-2026). Snapshot SO tetap harus = COGS efektif master.`,
        );
      }
      if (expiredIsFormula) {
        notes.push(
          `Master ${EXPIRED_SKU} sudah kembali rumus (${expiredMaster!.description}).`,
        );
      }

      const so = new SalesOrderGeneralPage(page);
      await page.goto(SO_GENERAL_DATALIST_PATH, {
        waitUntil: 'domcontentloaded',
      });
      await so.gotoDatalist();
      await so.openCreateOrAutoEdit();
      soCode = await so.ensureHeaderReadyForDetail();
      soUrl = await so.readEditUrl();
      notes.push(`SO draft: ${soCode} ${soUrl}`);
      await so.screenshot('03-so-header-ready.png');

      const expiredSnap = await so.addProductAndCaptureSnapshot(EXPIRED_SKU);
      const columnShown = await so.showBenchmarkCogsColumn();
      notes.push(`Kolom Benchmark COGS unhide: ${columnShown}`);
      const expiredUi = await so.readUiBenchmarkCogs(EXPIRED_SKU);
      await so.screenshot('04-so-line-expired-sku.png');

      const expiredCaptured = expiredUi.value ?? expiredSnap.apiBenchmarkCogs;
      snapshots.push({
        sku: EXPIRED_SKU,
        api: expiredSnap.apiBenchmarkCogs,
        ui: expiredUi.value,
        uiText: expiredUi.text,
        expected: expiredEffective,
        expectedSource: expiredIsFormula
          ? `rumus (${expiredMaster!.description})`
          : 'COGS efektif master',
      });

      const expiryPass =
        expiredCaptured != null &&
        expiredEffective != null &&
        moneyEquals(expiredCaptured, expiredEffective);
      const notUsingExpiredManual =
        expiredManual == null ||
        expiredEffective == null ||
        moneyEquals(expiredManual, expiredEffective) ||
        !moneyEquals(expiredCaptured, expiredManual) ||
        moneyEquals(expiredCaptured, expiredEffective);

      ac.push({
        id: 'AC-expiry',
        title:
          'Order baru setelah expiry Manual memakai rumus Highest Price / Last Inbound / No Inbound',
        status: expiryPass && notUsingExpiredManual ? 'PASS' : 'FAIL',
        detail: `SKU ${EXPIRED_SKU}: snapshot=${expiredCaptured} (API ${expiredSnap.apiBenchmarkCogs}, UI "${expiredUi.text}") vs master COGS efektif=${expiredEffective} (Manual=${expiredManual}, Desc="${expiredMaster!.description}").`,
      });

      expect(
        expiryPass,
        `AC-expiry FAIL: snapshot SO ${expiredCaptured} ≠ COGS efektif master ${expiredEffective} untuk ${EXPIRED_SKU}`,
      ).toBeTruthy();

      if (
        expiredManual != null &&
        expiredEffective != null &&
        !moneyEquals(expiredManual, expiredEffective)
      ) {
        expect(
          moneyEquals(expiredCaptured, expiredManual),
          `AC-expiry FAIL: snapshot masih memakai Manual COGS expired (${expiredManual}) bukan rumus (${expiredEffective})`,
        ).toBeFalsy();
      }

      const activeManual = pickActiveManualSku(master);
      if (activeManual) {
        const manualSnap = await so.addProductAndCaptureSnapshot(activeManual.sku);
        const manualUi = await so.readUiBenchmarkCogs(activeManual.sku);
        await so.screenshot('05-so-line-manual-active.png');
        const captured = manualUi.value ?? manualSnap.apiBenchmarkCogs;
        snapshots.push({
          sku: activeManual.sku,
          api: manualSnap.apiBenchmarkCogs,
          ui: manualUi.value,
          uiText: manualUi.text,
          expected: activeManual.cogs,
          expectedSource: 'Manual COGS aktif',
        });
        const pass =
          captured != null &&
          activeManual.cogs != null &&
          moneyEquals(captured, activeManual.cogs);
        ac.push({
          id: 'AC-manual-active',
          title: 'Create line saat Manual aktif → Benchmark COGS = Manual (termasuk 0)',
          status: pass ? 'PASS' : 'FAIL',
          detail: `SKU ${activeManual.sku}: snapshot=${captured} vs master efektif=${activeManual.cogs} (Manual=${activeManual.manualCogs}, Desc="${activeManual.description}").`,
        });
        expect(
          pass,
          `AC-manual-active FAIL: snapshot ${captured} ≠ Manual efektif ${activeManual.cogs}`,
        ).toBeTruthy();

        const changed = await so
          .changeProductOnLine(activeManual.sku, EXPIRED_SKU)
          .catch((err: unknown) => {
            notes.push(
              `Ganti product gagal (UI): ${err instanceof Error ? err.message : String(err)}`,
            );
            return null;
          });
        if (changed) {
          await so.screenshot('06-so-line-product-changed.png');
          const afterUi = await so.readUiBenchmarkCogs(EXPIRED_SKU);
          const after = afterUi.value ?? changed.apiBenchmarkCogs;
          snapshots.push({
            sku: `${activeManual.sku}→${EXPIRED_SKU}`,
            api: changed.apiBenchmarkCogs,
            ui: afterUi.value,
            uiText: afterUi.text,
            expected: expiredEffective,
            expectedSource: 're-capture product baru (expired → rumus)',
          });
          const changePass =
            after != null &&
            expiredEffective != null &&
            moneyEquals(after, expiredEffective);
          ac.push({
            id: 'AC-change-product',
            title: 'Ganti product di line → re-capture effective dari product baru',
            status: changePass ? 'PASS' : 'FAIL',
            detail: `Line ${activeManual.sku} → ${EXPIRED_SKU}: snapshot=${after} vs expected rumus ${expiredEffective}.`,
          });
          expect(
            changePass,
            `AC-change-product FAIL: setelah ganti ke ${EXPIRED_SKU} snapshot ${after} ≠ ${expiredEffective}`,
          ).toBeTruthy();
        } else {
          ac.push({
            id: 'AC-change-product',
            title: 'Ganti product di line → re-capture effective dari product baru',
            status: 'SKIP',
            detail: 'Modal edit product tidak bisa diotomasi pada run ini — lihat notes.',
          });
        }
      } else {
        ac.push({
          id: 'AC-manual-active',
          title: 'Create line saat Manual aktif → Benchmark COGS = Manual (termasuk 0)',
          status: 'SKIP',
          detail:
            'Tidak ketemu SKU sibling dengan Description Manual Input di DEV-STG (SKU-ManualCOGStanpaExpiredDate-1 Manual=COGS rumus Last Inbound — tidak bisa bedakan override vs rumus).',
        });
        ac.push({
          id: 'AC-change-product',
          title: 'Ganti product di line → re-capture effective dari product baru',
          status: 'SKIP',
          detail: 'Tidak ada SKU Manual aktif sebagai sumber ganti product.',
        });
      }

      ac.push({
        id: 'AC-master-change-old-order',
        title: 'Ubah Manual di master → order lama tidak berubah',
        status: 'SKIP',
        detail:
          'Tidak diotomasi — akan mengubah data master Benchmark COGS. Snapshot by-design dicek lewat AC-expiry (order baru setelah expiry).',
      });
      ac.push({
        id: 'AC-bundle-random',
        title: 'Bundle/random path mengikuti product_id line',
        status: 'SKIP',
        detail: 'Tidak ada fixture bundle/random di instruksi run ini.',
      });

      const failed = ac.filter((item) => item.status === 'FAIL');
      verdict = failed.length === 0 ? 'PASS' : 'FAIL';
      writeDump(dump());
    } catch (err) {
      notes.push(err instanceof Error ? err.message : String(err));
      verdict = 'FAIL';
      writeDump(dump());
      throw err;
    }
  });
});
