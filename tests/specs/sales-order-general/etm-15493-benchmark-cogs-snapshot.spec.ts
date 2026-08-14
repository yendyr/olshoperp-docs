import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { prepareSession } from '../../helpers/company-access';
import {
  BENCHMARK_COGS_PATH,
  ProductBenchmarkPricePage,
} from '../../helpers/product-benchmark-price';
import {
  SO_GENERAL_DATALIST_PATH,
  SalesOrderGeneralPage,
} from '../../helpers/sales-order-general';

/**
 * ETM-15493 — [Dev - Sales Order] Snapshot Benchmark COGS = effective Manual COGS.
 *
 * Company: DEV-STG (id 13)
 * SKU expired Manual COGS (user): SKU-ManualCOGSWithExpirationDate-4
 *   expiry = 13-08-2026 23:59:59 → 14 Aug 2026 sudah expired
 *   expected snapshot = rumus Highest Price / Last Inbound / No Inbound
 *   (bukan nilai Manual yang sudah expired)
 *
 * Mapping:
 * | # | Langkah | Method | Halaman |
 * | 1 | Buka Benchmark COGS, cari SKU | searchSku + readSkuRow | /accounting/product-benchmark-price |
 * | 2 | Catat COGS efektif + Description | readSkuRow | datalist master |
 * | 3 | Create Dev - Sales Order + Select Product SKU | openCreateOrAutoEdit + addProductViaSelectProduct | edit SO |
 * | 4 | Unhide kolom Benchmark COGS | showDetailColumn | edit SO |
 * | 5 | Bandingkan snapshot line vs COGS efektif master | readBenchmarkCogsFromSkuRow | edit SO |
 */

const SKU = 'SKU-ManualCOGSWithExpirationDate-4';
const COMPANY = 'DEV-STG';
const RESULT_DIR = path.join(process.cwd(), 'implementation-card/[ETM-15493]');

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

test.describe.serial('ETM-15493 — Dev Sales Order Benchmark COGS snapshot (expired Manual)', () => {
  test.describe.configure({ timeout: 300_000 });

  let master: Awaited<
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
    await bm.searchSku(SKU);
    await capture(page, '01-benchmark-cogs-sku-search');

    master = await bm.readSkuRow(SKU);
    writeJson('master-row.json', master);
    await capture(page, '02-benchmark-cogs-sku-row');

    expect(
      master.rowText.toLowerCase(),
      `SKU ${SKU} harus muncul di Benchmark COGS DEV-STG`,
    ).toContain('sku-manualcogswithexpirationdate-4'.toLowerCase());

    const desc = `${master.description} ${master.rowText}`;
    expect(
      /Highest Price|Last Inbound|No Inbound/i.test(desc),
      `Setelah expiry, Description harus rumus (Highest Price / Last Inbound / No Inbound). Actual: ${master.rowText}`,
    ).toBeTruthy();
    expect(
      /Manual Input/i.test(master.description),
      `Description tidak boleh Manual Input jika Manual COGS sudah expired. Actual description="${master.description}"`,
    ).toBeFalsy();

    const manualNumber = bm.parseNumber(master.manualCogsText);
    if (manualNumber != null && master.cogsNumber != null) {
      expect(
        master.cogsNumber,
        `COGS (Efektif) ${master.cogsNumber} tidak boleh sama dengan Manual COGS expired ${manualNumber}`,
      ).not.toBe(manualNumber);
    }
  });

  test('[@ETM-15493][@AC-EXPIRED-SO] Create line Dev Sales Order → snapshot = rumus efektif, bukan Manual expired', async ({
    page,
  }) => {
    expect(master, 'Master Benchmark COGS harus terbaca di tes sebelumnya').toBeTruthy();

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SO_GENERAL_DATALIST_PATH,
    });

    const so = new SalesOrderGeneralPage(page);
    await so.gotoDatalist();
    await so.openCreateOrAutoEdit();
    await capture(page, '03-so-create-or-edit');

    const soCode = await so.readGeneratedCode().catch(() => '');
    const createBody = await so.addProductViaSelectProduct(SKU);
    writeJson('create-select-response.json', createBody);
    await capture(page, '04-so-after-select-product');

    await so.showDetailColumn('Benchmark COGS').catch(async (err) => {
      writeJson('show-column-error.json', {
        message: err instanceof Error ? err.message : String(err),
      });
    });
    await capture(page, '05-so-benchmark-column');

    let line: { cellText: string; number: number | null; rowText: string } = {
      cellText: '(UI tidak terbaca)',
      number: null,
      rowText: '',
    };
    try {
      line = await so.readBenchmarkCogsFromSkuRow(SKU);
    } catch (err) {
      writeJson('so-line-read-error.json', {
        message: err instanceof Error ? err.message : String(err),
      });
      await capture(page, '06-so-line-read-fail');
    }
    writeJson('so-line-benchmark.json', { soCode, line, master });

    const apiCogs = extractBenchmarkFromCreateBody(createBody);
    const snapshot = apiCogs ?? line.number ?? null;
    const manualNumber = parseIdNumber(master?.manualCogsText ?? '');

    writeJson('etm-15493-comparison.json', {
      sku: SKU,
      soCode,
      masterCogs: master?.cogsNumber,
      masterCogsText: master?.cogsText,
      masterManualCogs: master?.manualCogsText,
      masterManualNumber: manualNumber,
      masterDescription: master?.description,
      masterExpiry: master?.expiryText,
      lineCell: line.cellText,
      lineNumber: line.number,
      apiCogs,
      snapshotUsed: snapshot,
      rowText: line.rowText,
    });

    expect(
      snapshot,
      `Snapshot Benchmark COGS line ${SKU} harus terbaca (UI atau API). UI="${line.cellText}" API=${apiCogs}`,
    ).not.toBeNull();

    if (master?.cogsNumber != null && snapshot != null) {
      expect(
        snapshot,
        `Snapshot SO (${snapshot}) harus sama dengan COGS efektif master (${master.cogsNumber}) setelah Manual expired`,
      ).toBe(master.cogsNumber);
    }

    if (manualNumber != null && snapshot != null) {
      expect(
        snapshot,
        `Snapshot SO (${snapshot}) tidak boleh pakai Manual COGS expired (${manualNumber})`,
      ).not.toBe(manualNumber);
    }

    expect(
      /Manual Input/i.test(master?.description ?? ''),
      'Master Description bukan Manual Input — snapshot tidak boleh dari Manual expired',
    ).toBeFalsy();
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
