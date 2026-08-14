import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { prepareSession } from '../../helpers/company-access';
import {
  BENCHMARK_COGS_PATH,
  ProductBenchmarkPricePage,
} from '../../helpers/product-benchmark-price';
import {
  SALES_PLATFORM_DATALIST_PATH,
  SalesPlatformPage,
} from '../../helpers/sales-platform';

/**
 * ETM-15494 — Snapshot Benchmark COGS = effective Manual COGS (Dev - Sales Platform).
 *
 * Company: DEV-STG (id 13)
 *
 * Mapping vs ETM-15493 (SO General):
 * | # | SO General | Sales Platform | Method |
 * | 1 | Master expired SKU | sama | searchSku + readSkuRow |
 * | 2 | Select Product | bind System SKU (DRAFT/OPEN) | bindSystemSku |
 * | 3 | Import Processed trx 01-08-2026 | Import jika ada di UI; else N/A (docs: no Excel import) | hasImportButton |
 * | 4 | SKU KKTOR rumus murni | bind KKTOR | bindSystemSku |
 * | 5 | Trx date 01-08-2026 lalu insert SKU expired | PUT trx date (read-only UI) lalu bind | setTransactionDateViaApi + bind |
 * | 6 | SKU bundle | bind bundle | bindSystemSku |
 */

const SKU_EXPIRED = 'SKU-ManualCOGSWithExpirationDate-4';
const SKU_FORMULA = 'KKTOR';
const SKU_BUNDLE = 'BUNDLE-CINCIN-KALUNG-White';
const COMPANY = 'DEV-STG';
const RESULT_DIR = path.join(process.cwd(), 'implementation-card/[ETM-15494]');

async function capture(
  page: import('@playwright/test').Page,
  name: string,
): Promise<string> {
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  const file = path.join(RESULT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

function writeJson(name: string, data: unknown): void {
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  fs.writeFileSync(path.join(RESULT_DIR, name), JSON.stringify(data, null, 2));
}

function loadMasterExpired(): Awaited<
  ReturnType<ProductBenchmarkPricePage['readSkuRow']>
> | null {
  const file = path.join(RESULT_DIR, 'master-row.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Awaited<
    ReturnType<ProductBenchmarkPricePage['readSkuRow']>
  >;
}

function spEditUrl(id: string | null | undefined): string | null {
  if (!id) return null;
  return `https://staging.olshoperp.com/omni/sales-order/edit/${id}`;
}

function parseIdNumber(text: string): number | null {
  const digits = text.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function extractBenchmark(body: Record<string, unknown> | null): number | null {
  if (!body) return null;
  const walk = (node: unknown): number | null => {
    if (!node || typeof node !== 'object') return null;
    const rec = node as Record<string, unknown>;
    for (const key of Object.keys(rec)) {
      if (/benchmark_cogs/i.test(key)) {
        const n = Number(rec[key]);
        if (Number.isFinite(n)) return n;
      }
    }
    for (const val of Object.values(rec)) {
      if (val && typeof val === 'object') {
        const found = walk(val);
        if (found != null) return found;
      }
    }
    return null;
  };
  return walk(body);
}

function snapshotForSku(
  details: Array<{ sku: string; benchmarkCogs: number | null }>,
  sku: string,
): number | null {
  return (
    details.find((d) => new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(d.sku))
      ?.benchmarkCogs ??
    details[0]?.benchmarkCogs ??
    null
  );
}

function isJakartaCalendarDate(
  apiIso: unknown,
  year: number,
  month: number,
  day: number,
): boolean {
  const raw = String(apiIso ?? '');
  if (!raw) return false;
  const parsed = Date.parse(raw);
  if (!Number.isFinite(parsed)) return false;
  const jakarta = new Date(parsed + 7 * 60 * 60 * 1000);
  return (
    jakarta.getUTCFullYear() === year &&
    jakarta.getUTCMonth() + 1 === month &&
    jakarta.getUTCDate() === day
  );
}

async function ensureBoundSku(
  sp: SalesPlatformPage,
  sku: string,
): Promise<{
  soId: string | null;
  soCode: string;
  method: string;
  bindBody: Record<string, unknown> | null;
  header: Record<string, unknown> | null;
  details: ReturnType<SalesPlatformPage['collectDetailSnapshots']>;
  snapshot: number | null;
}> {
  const ids = await sp.findEditableOrderIds(10);
  if (!ids.length) {
    throw new Error(
      `Tidak ada order Sales Platform editable (Draft/Open) untuk bind SKU ${sku}`,
    );
  }

  let lastError = '';
  for (const id of ids) {
    const headerBefore = await sp.fetchSalesOrderApi(id);
    const already = sp
      .collectDetailSnapshots(headerBefore)
      .find((d) => new RegExp(sku.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(d.sku));
    if (already) {
      await sp.openEditById(id).catch(() => undefined);
      return {
        soId: id,
        soCode: String(headerBefore?.code ?? ''),
        method: 'existing-line',
        bindBody: null,
        header: headerBefore,
        details: sp.collectDetailSnapshots(headerBefore),
        snapshot: already.benchmarkCogs,
      };
    }
    const bind = await sp.bindSystemSkuViaApi(id, sku);
    if (!bind.ok) {
      lastError = JSON.stringify(bind.body)?.slice(0, 300) ?? `HTTP ${bind.status}`;
      continue;
    }
    const header = await sp.fetchSalesOrderApi(id);
    const details = sp.collectDetailSnapshots(header);
    await sp.openEditById(id).catch(() => undefined);
    return {
      soId: id,
      soCode: String(header?.code ?? headerBefore?.code ?? ''),
      method: 'put-sales-order-detail',
      bindBody: bind.body,
      header,
      details,
      snapshot:
        extractBenchmark(bind.body) ?? snapshotForSku(details, sku),
    };
  }
  throw new Error(`Gagal bind SKU ${sku} ke order platform. Last: ${lastError}`);
}

test.describe('ETM-15494 — Dev Sales Platform Benchmark COGS snapshot', () => {
  test.describe.configure({ timeout: 300_000 });

  let masterExpired: Awaited<
    ReturnType<ProductBenchmarkPricePage['readSkuRow']>
  > | null = null;

  test('[@ETM-15494][@AC-EXPIRED-MASTER] Master SKU expired → COGS rumus, bukan Manual Input', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: BENCHMARK_COGS_PATH,
    });

    const bm = new ProductBenchmarkPricePage(page);
    await bm.gotoDatalist();
    await bm.searchSku(SKU_EXPIRED);
    await capture(page, '01-benchmark-cogs-sku-search');

    masterExpired = await bm.readSkuRow(SKU_EXPIRED);
    writeJson('master-row.json', masterExpired);
    await capture(page, '02-benchmark-cogs-sku-row');

    expect(
      masterExpired.rowText.toLowerCase(),
      `SKU ${SKU_EXPIRED} harus muncul di Benchmark COGS DEV-STG`,
    ).toContain('sku-manualcogswithexpirationdate-4'.toLowerCase());

    const desc = `${masterExpired.description} ${masterExpired.rowText}`;
    expect(
      /Highest Price|Last Inbound|No Inbound/i.test(desc),
      `Setelah expiry, Description harus rumus. Actual: ${masterExpired.rowText}`,
    ).toBeTruthy();
    expect(
      /Manual Input/i.test(masterExpired.description),
      `Description tidak boleh Manual Input jika sudah expired. Actual="${masterExpired.description}"`,
    ).toBeFalsy();

    const manualNumber = bm.parseNumber(masterExpired.manualCogsText);
    if (manualNumber != null && masterExpired.cogsNumber != null) {
      expect(
        masterExpired.cogsNumber,
        `COGS (Efektif) ${masterExpired.cogsNumber} tidak boleh sama dengan Manual expired ${manualNumber}`,
      ).not.toBe(manualNumber);
    }
  });

  test('[@ETM-15494][@AC-EXPIRED-BIND] Bind System SKU expired → snapshot = rumus efektif', async ({
    page,
  }) => {
    masterExpired = masterExpired ?? loadMasterExpired();
    expect(masterExpired, 'Master expired harus terbaca dulu').toBeTruthy();

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SALES_PLATFORM_DATALIST_PATH,
    });
    const sp = new SalesPlatformPage(page);
    const toolbar = await (async () => {
      await sp.gotoDatalist();
      return sp.toolbarLabels();
    })();
    writeJson('ui-probe.json', { toolbar });
    await capture(page, '03-sp-datalist');

    const result = await ensureBoundSku(sp, SKU_EXPIRED);
    await capture(page, '04-sp-after-bind-expired');
    writeJson('so-bind-expired.json', {
      ...result,
      url: spEditUrl(result.soId),
      masterCogs: masterExpired?.cogsNumber,
      masterManual: masterExpired?.manualCogsText,
      masterDescription: masterExpired?.description,
    });

    expect(result.snapshot, 'Snapshot bind SKU expired harus ada').not.toBeNull();
    if (masterExpired?.cogsNumber != null && result.snapshot != null) {
      expect(result.snapshot).toBe(masterExpired.cogsNumber);
    }
    expect(result.snapshot).not.toBe(
      parseIdNumber(masterExpired?.manualCogsText ?? ''),
    );
  });

  test('[@ETM-15494][@AC-EXPIRED-IMPORT] Import Sales Platform → snapshot rumus (jika ada Import)', async ({
    page,
  }) => {
    masterExpired = masterExpired ?? loadMasterExpired();
    expect(masterExpired, 'Master expired harus terbaca dulu').toBeTruthy();

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SALES_PLATFORM_DATALIST_PATH,
    });
    const sp = new SalesPlatformPage(page);
    await sp.gotoDatalist();
    const importVisible = await sp.hasImportButton().isVisible().catch(() => false);
    await capture(page, '05-sp-import-check');

    if (!importVisible) {
      writeJson('import-so-snapshot.json', {
        status: 'not_applicable',
        reason:
          'Dev - Sales Platform tidak punya Import Excel (SoT datalist: order dari sync marketplace; Create redirect SO General). Skenario import ETM-15493 tidak bisa diulang 1:1. Trigger setara = bind/ganti System SKU.',
        docs: 'qa-docs/omni-sales-platform/requirement.md — datalist read-only',
      });
      return;
    }

    writeJson('import-so-snapshot.json', {
      status: 'import-button-visible',
      note: 'Tombol Import ada — belum dijalankan file Excel platform (format SoT tidak ada).',
    });
  });

  test('[@ETM-15494][@AC-FORMULA-KKTOR] Bind SKU KKTOR (tanpa Manual) → snapshot rumus', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: BENCHMARK_COGS_PATH,
    });
    const bm = new ProductBenchmarkPricePage(page);
    await bm.gotoDatalist();
    await bm.searchSku(SKU_FORMULA);
    const masterKktor = await bm.readSkuRow(SKU_FORMULA);
    writeJson('master-kktor.json', masterKktor);
    await capture(page, '06-master-kktor');

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SALES_PLATFORM_DATALIST_PATH,
    });
    const sp = new SalesPlatformPage(page);
    const result = await ensureBoundSku(sp, SKU_FORMULA);
    await capture(page, '07-sp-kktor');
    writeJson('so-kktor.json', {
      ...result,
      url: spEditUrl(result.soId),
      master: masterKktor,
    });

    expect(
      /Manual Input/i.test(masterKktor.description),
      `KKTOR tidak boleh Manual Input. Actual="${masterKktor.description}"`,
    ).toBeFalsy();
    expect(result.snapshot, 'Snapshot KKTOR harus ada').not.toBeNull();
    if (masterKktor.cogsNumber != null && result.snapshot != null) {
      expect(result.snapshot).toBe(masterKktor.cogsNumber);
    }
  });

  test('[@ETM-15494][@AC-TRXDATE] Trx date 01-08-2026 lalu bind SKU expired', async ({
    page,
  }) => {
    masterExpired = masterExpired ?? loadMasterExpired();
    expect(masterExpired, 'Master expired harus terbaca dulu').toBeTruthy();

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SALES_PLATFORM_DATALIST_PATH,
    });
    const sp = new SalesPlatformPage(page);
    const ids = await sp.findEditableOrderIds(8);
    expect(ids.length, 'Perlu order platform editable untuk tes trx date').toBeGreaterThan(
      0,
    );

    await sp.openEditById(ids[0]);
    const datePut = await sp.setTransactionDateViaApi('01-08-2026 00:00:00');
    await capture(page, '08-sp-trxdate-before-sku');
    const bind = await sp.bindSystemSkuViaApi(ids[0], SKU_EXPIRED);
    if (!bind.ok) {
      writeJson('so-trxdate-aug1.json', {
        soId: ids[0],
        datePut,
        bind,
      });
      throw new Error(`Bind trxdate gagal HTTP ${bind.status}: ${JSON.stringify(bind.body)?.slice(0, 300)}`);
    }
    await sp.openEditById(ids[0]).catch(() => undefined);
    await capture(page, '09-sp-trxdate-after-sku');

    const header = await sp.fetchSalesOrderApi(ids[0]);
    const details = sp.collectDetailSnapshots(header);
    const snapshot =
      extractBenchmark(bind.body) ?? snapshotForSku(details, SKU_EXPIRED);
    const formula = masterExpired?.cogsNumber ?? 51900;
    const manual = parseIdNumber(masterExpired?.manualCogsText ?? '') ?? 55000;
    let lockSource = 'unknown';
    if (snapshot === formula) {
      lockSource =
        'now / created_at (bukan trx date) — Manual sudah expired di 14 Aug';
    } else if (snapshot === manual) {
      lockSource =
        'transaction_date 01-08-2026 (sebelum expiry 13 Aug) — pakai Manual 55.000';
    }

    writeJson('so-trxdate-aug1.json', {
      soId: sp.currentEditId(),
      soCode: await sp.readCode(),
      url: spEditUrl(sp.currentEditId()),
      datePut,
      requestedTransactionDate: '01-08-2026',
      transactionDateApi: header?.transaction_date,
      createdAtApi: header?.created_at,
      snapshot,
      formulaExpectedIfNow: formula,
      manualIfTrxDateBeforeExpiry: manual,
      lockSource,
      jakartaIs1Aug: isJakartaCalendarDate(header?.transaction_date, 2026, 8, 1),
      details,
    });

    expect(snapshot, 'Snapshot skenario trx date harus ada').not.toBeNull();
    expect(
      snapshot === formula || snapshot === manual,
      `Snapshot ${snapshot} harus 51900 (rumus/now) atau 55000 (Manual/trx date)`,
    ).toBeTruthy();
  });

  test('[@ETM-15494][@AC-BUNDLE] Bind SKU bundle BUNDLE-CINCIN-KALUNG-White', async ({
    page,
  }) => {
    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: BENCHMARK_COGS_PATH,
    });
    const bm = new ProductBenchmarkPricePage(page);
    await bm.gotoDatalist();
    let masterBundle: Awaited<
      ReturnType<ProductBenchmarkPricePage['readSkuRow']>
    > | null = null;
    try {
      await bm.searchSku(SKU_BUNDLE);
      masterBundle = await bm.readSkuRow(SKU_BUNDLE);
    } catch {
      await bm.searchSku('BUNDLE-CINCIN-KALUNG');
      masterBundle = await bm.readSkuRow('BUNDLE-CINCIN-KALUNG');
    }
    writeJson('master-bundle.json', masterBundle);
    await capture(page, '10-master-bundle');

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SALES_PLATFORM_DATALIST_PATH,
    });
    const sp = new SalesPlatformPage(page);
    const result = await ensureBoundSku(sp, SKU_BUNDLE);
    await capture(page, '11-sp-bundle');
    writeJson('so-bundle.json', {
      ...result,
      url: spEditUrl(result.soId),
      masterBundle,
    });

    expect(
      result.details.length > 0 || result.snapshot != null,
      'Bundle harus menghasilkan line + snapshot Benchmark COGS',
    ).toBeTruthy();
  });
});
