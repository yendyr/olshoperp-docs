import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { prepareSession } from '../../helpers/company-access';
import {
  BENCHMARK_COGS_PATH,
  ProductBenchmarkPricePage,
} from '../../helpers/product-benchmark-price';
import { writeSalesOrderImportXlsx } from '../../helpers/sales-order-import-xlsx';
import {
  SO_GENERAL_DATALIST_PATH,
  SalesOrderGeneralPage,
} from '../../helpers/sales-order-general';

/**
 * ETM-15493 — Snapshot Benchmark COGS = effective Manual COGS (Dev - Sales Order).
 *
 * Company: DEV-STG (id 13)
 *
 * Mapping:
 * | # | Langkah | Method | Halaman |
 * | 1 | Master expired SKU | searchSku + readSkuRow | Benchmark COGS |
 * | 2 | Create line Select Product | addProductViaSelectProduct | edit SO |
 * | 3 | Import Sales Order (Processed) | importProcessedFromFile | datalist |
 * | 4 | SO SKU rumus murni KKTOR | fillHeaderDescription + Select Product | edit SO |
 * | 5 | SO trx date 01-08-2026 lalu insert SKU expired | setTransactionDate + Select Product | edit SO |
 * | 6 | SO SKU bundle | addProductViaSelectProduct | edit SO |
 */

const SKU_EXPIRED = 'SKU-ManualCOGSWithExpirationDate-4';
const SKU_FORMULA = 'KKTOR';
const SKU_BUNDLE = 'BUNDLE-CINCIN-KALUNG-White';
const COMPANY = 'DEV-STG';
const RESULT_DIR = path.join(process.cwd(), 'implementation-card/[ETM-15493]');

const DESC_KKTOR =
  'ETM-15493 KKTOR: no Manual COGS; snapshot must use formula master';
const DESC_TRX =
  'ETM-15493 trx_date=01-08-2026 created=14-08-2026 SKU expired Manual. Lock trx vs created_at?';
const DESC_BUNDLE =
  'ETM-15493 bundle BUNDLE-CINCIN-KALUNG-White: capture Benchmark COGS per line';

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

function soEditUrl(id: string | null | undefined): string | null {
  if (!id) return null;
  return `https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/${id}`;
}

test.describe('ETM-15493 — Dev Sales Order Benchmark COGS snapshot', () => {
  test.describe.configure({ timeout: 300_000 });

  let masterExpired: Awaited<
    ReturnType<ProductBenchmarkPricePage['readSkuRow']>
  > | null = null;

  test('[@ETM-15493][@AC-EXPIRED-MASTER] Master SKU expired → COGS rumus, bukan Manual Input', async ({
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

  test('[@ETM-15493][@AC-EXPIRED-SO] Create line Select Product → snapshot = rumus efektif', async ({
    page,
  }) => {
    masterExpired = masterExpired ?? loadMasterExpired();
    expect(masterExpired, 'Master expired harus terbaca dulu').toBeTruthy();

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SO_GENERAL_DATALIST_PATH,
    });

    const so = new SalesOrderGeneralPage(page);
    await so.gotoDatalist();
    await so.openCreateOrAutoEdit();
    await capture(page, '03-so-create-or-edit');

    const soCode = await so.readGeneratedCode().catch(() => '');
    const createBody = await so.addProductViaSelectProduct(SKU_EXPIRED);
    writeJson('create-select-response.json', createBody);
    await capture(page, '04-so-after-select-product');

    const apiCogs = extractBenchmarkFromCreateBody(createBody);
    const soId = so.currentEditId();
    writeJson('etm-15493-comparison.json', {
      method: 'select-product',
      sku: SKU_EXPIRED,
      soCode,
      soId,
      url: soEditUrl(soId),
      masterCogs: masterExpired?.cogsNumber,
      masterManualCogs: masterExpired?.manualCogsText,
      masterDescription: masterExpired?.description,
      apiCogs,
    });

    expect(apiCogs, 'Snapshot Select Product harus terbaca').not.toBeNull();
    if (masterExpired?.cogsNumber != null && apiCogs != null) {
      expect(apiCogs).toBe(masterExpired.cogsNumber);
    }
    expect(apiCogs).not.toBe(parseIdNumber(masterExpired?.manualCogsText ?? ''));
  });

  test('[@ETM-15493][@AC-EXPIRED-IMPORT] Import Sales Order → snapshot = rumus efektif', async ({
    page,
  }) => {
    masterExpired = masterExpired ?? loadMasterExpired();
    expect(masterExpired, 'Master expired harus terbaca dulu').toBeTruthy();

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SO_GENERAL_DATALIST_PATH,
    });

    const so = new SalesOrderGeneralPage(page);
    const platformOrderId = `ETM15493IMP${Date.now().toString().slice(-8)}`;
    const xlsxPath = path.join(RESULT_DIR, 'import-expired-manual.xlsx');
    await writeSalesOrderImportXlsx(xlsxPath, [
      {
        transactionDate: '14-08-2026',
        customerCode: 'BUYER-OFFLINE-1',
        storeName: 'Store Staging',
        platformOrderId,
        shipperServiceCode: 'STD1001',
        sku: SKU_EXPIRED,
        qty: 1,
        unit: 'PCS',
        price: 100000,
      },
    ]);

    let importResult: {
      soCode: string;
      uploadBody: Record<string, unknown> | null;
    } | null = null;
    let importError: string | null = null;

    try {
      importResult = await so.importProcessedFromFile(xlsxPath, platformOrderId);
    } catch (err) {
      importError = err instanceof Error ? err.message : String(err);
      writeJson('import-ui-error.json', { message: importError });
      await capture(page, '07-import-ui-fail');
      throw err;
    }

    writeJson('import-upload.json', importResult);
    await so.openEditByCode(importResult.soCode);
    await capture(page, '08-import-so-edit');
    const header = await so.fetchSalesOrderApi();
    const details = so.collectDetailSnapshots(header);
    const snapshot =
      details.find((d) => /ManualCOGSWithExpirationDate-4/i.test(d.sku))
        ?.benchmarkCogs ??
      details[0]?.benchmarkCogs ??
      null;
    const soId = so.currentEditId();
    writeJson('import-so-snapshot.json', {
      platformOrderId,
      soCode: importResult.soCode,
      soId,
      url: soEditUrl(soId),
      snapshot,
      details,
      transactionDate: header?.transaction_date,
      createdAt: header?.created_at,
      masterCogs: masterExpired?.cogsNumber,
      masterManual: masterExpired?.manualCogsText,
    });

    expect(snapshot, 'Snapshot import line harus ada').not.toBeNull();
    if (masterExpired?.cogsNumber != null && snapshot != null) {
      expect(
        snapshot,
        `Import snapshot ${snapshot} harus = COGS efektif ${masterExpired.cogsNumber}`,
      ).toBe(masterExpired.cogsNumber);
    }
  });

  test('[@ETM-15493][@AC-FORMULA-KKTOR] SO baru SKU KKTOR (tanpa Manual) → snapshot rumus', async ({
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
    await capture(page, '09-master-kktor');

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SO_GENERAL_DATALIST_PATH,
    });
    const so = new SalesOrderGeneralPage(page);
    await so.gotoDatalist();
    await so.openCreateOrAutoEdit();
    await so.fillHeaderDescription(DESC_KKTOR);
    await so.clickSaveAllAndWait();
    const soCode = await so.readGeneratedCode();
    const createBody = await so.addProductViaSelectProduct(SKU_FORMULA);
    await capture(page, '10-so-kktor');
    const soId = so.currentEditId();
    const header = await so.fetchSalesOrderApi();
    const snapshot =
      extractBenchmarkFromCreateBody(createBody) ??
      so.collectDetailSnapshots(header)[0]?.benchmarkCogs ??
      null;

    writeJson('so-kktor.json', {
      soCode,
      soId,
      url: soEditUrl(soId),
      description: DESC_KKTOR,
      master: masterKktor,
      snapshot,
      details: so.collectDetailSnapshots(header),
      headerDescription: header?.description,
    });

    expect(
      /Manual Input/i.test(masterKktor.description),
      `KKTOR tidak boleh Manual Input. Actual="${masterKktor.description}"`,
    ).toBeFalsy();
    expect(snapshot, 'Snapshot KKTOR harus ada').not.toBeNull();
    if (masterKktor.cogsNumber != null && snapshot != null) {
      expect(
        snapshot,
        `Snapshot KKTOR ${snapshot} harus = rumus master ${masterKktor.cogsNumber}`,
      ).toBe(masterKktor.cogsNumber);
    }
  });

  test('[@ETM-15493][@AC-TRXDATE] Trx date 01-08-2026 lalu insert SKU expired → rumus vs Manual', async ({
    page,
  }) => {
    masterExpired = masterExpired ?? loadMasterExpired();
    expect(masterExpired, 'Master expired harus terbaca dulu').toBeTruthy();

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SO_GENERAL_DATALIST_PATH,
    });
    const so = new SalesOrderGeneralPage(page);
    await so.gotoDatalist();
    await so.openCreateOrAutoEdit();
    await so.fillHeaderDescription(DESC_TRX);
    await so.setTransactionDate('01-08-2026 00:00:00');
    await capture(page, '11-so-trxdate-before-sku');

    const dateAfterSave = await so.readTransactionDateDisplay();
    const headerBefore = await so.fetchSalesOrderApi();
    const createBody = await so.addProductViaSelectProduct(SKU_EXPIRED);
    await capture(page, '12-so-trxdate-after-sku');

    const soCode = await so.readGeneratedCode();
    const soId = so.currentEditId();
    const header = await so.fetchSalesOrderApi();
    const snapshot = extractBenchmarkFromCreateBody(createBody);
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
      soCode,
      soId,
      url: soEditUrl(soId),
      description: DESC_TRX,
      dateTyped: '01-08-2026 00:00:00',
      dateAfterSave,
      transactionDateApi: header?.transaction_date ?? headerBefore?.transaction_date,
      createdAtApi: header?.created_at,
      snapshot,
      formulaExpectedIfNow: formula,
      manualIfTrxDateBeforeExpiry: manual,
      lockSource,
    });

    expect(snapshot, 'Snapshot skenario trx date harus ada').not.toBeNull();
    expect(
      snapshot === formula || snapshot === manual,
      `Snapshot ${snapshot} harus 51900 (rumus/now) atau 55000 (Manual/trx date)`,
    ).toBeTruthy();
  });

  test('[@ETM-15493][@AC-BUNDLE] SO insert SKU bundle BUNDLE-CINCIN-KALUNG-White', async ({
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
    await capture(page, '13-master-bundle');

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SO_GENERAL_DATALIST_PATH,
    });
    const so = new SalesOrderGeneralPage(page);
    await so.gotoDatalist();
    await so.openCreateOrAutoEdit();
    await so.fillHeaderDescription(DESC_BUNDLE);
    await so.clickSaveAllAndWait();
    const soCode = await so.readGeneratedCode();
    const createBody = await so.addProductViaSelectProduct(SKU_BUNDLE);
    await capture(page, '14-so-bundle');
    const soId = so.currentEditId();
    const header = await so.fetchSalesOrderApi();
    const details = so.collectDetailSnapshots(header);
    const snapshot =
      extractBenchmarkFromCreateBody(createBody) ??
      details[0]?.benchmarkCogs ??
      null;

    writeJson('so-bundle.json', {
      soCode,
      soId,
      url: soEditUrl(soId),
      description: DESC_BUNDLE,
      masterBundle,
      snapshotHeaderLine: snapshot,
      details,
    });

    expect(
      details.length > 0 || snapshot != null,
      'Bundle harus menghasilkan line + snapshot Benchmark COGS',
    ).toBeTruthy();
  });
});

function parseIdNumber(text: string): number | null {
  const digits = text.replace(/[^\d]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function extractBenchmarkFromCreateBody(
  body: Record<string, unknown> | null,
): number | null {
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
