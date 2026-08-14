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
 * ETM-15493 follow-up — flag Below Benchmark COGS setelah Manual COGS expired.
 *
 * Company: DEV-STG (id 13)
 * SKU: SKU-ManualCOGSWithExpirationDate-4
 * - Manual COGS expired 13-08-2026 EOD → per 14-08-2026 00:00 WIB pakai rumus.
 * - Rumus Last Inbound ≈ 51.900.
 * - Unit price 49.000 > Manual expired, tapi 49.000 < 51.900 → flag harus muncul.
 * - Jika sistem masih bandingkan ke Manual expired, flag tidak muncul (FAIL).
 *
 * Label UI/docs: Below Benchmark COGS (AS-IS tooltip masih boleh
 * "Product price is below COGS Benchmark…" — GAP-BM-13 Open).
 */

const SKU = 'SKU-ManualCOGSWithExpirationDate-4';
const UNIT_PRICE = 49_000;
const FORMULA_COGS = 51_900;
const COMPANY = 'DEV-STG';
const RESULT_DIR = path.join(
  process.cwd(),
  'implementation-card',
  '[ETM-15493]',
  'below-cogs-flag',
);

function writeJson(name: string, data: unknown): void {
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  fs.writeFileSync(path.join(RESULT_DIR, name), `${JSON.stringify(data, null, 2)}\n`);
}

async function capture(
  page: import('@playwright/test').Page,
  name: string,
): Promise<string> {
  fs.mkdirSync(RESULT_DIR, { recursive: true });
  const file = path.join(RESULT_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

function soEditUrl(id: string | null | undefined): string | null {
  if (!id) return null;
  return `https://staging.olshoperp.com/businessdevelopment/sales-order-general/edit/${id}`;
}

function parseManualNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = Number.parseFloat(cleaned.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

test.describe('ETM-15493 Below Benchmark COGS flag — expired Manual', () => {
  test.describe.configure({ timeout: 300_000 });

  test('[@ETM-15493] Create SO price 49000 < formula 51900 → flag Below Benchmark COGS', async ({
    page,
  }) => {
    test.setTimeout(300_000);

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: BENCHMARK_COGS_PATH,
    });

    const bm = new ProductBenchmarkPricePage(page);
    await bm.gotoDatalist();
    await bm.searchSku(SKU);
    const master = await bm.readSkuRow(SKU);
    writeJson('01-master.json', master);
    await capture(page, '01-master');

    expect(master.rowText.toLowerCase(), `SKU ${SKU} di Benchmark COGS DEV-STG`).toContain(
      skuLower(SKU),
    );
    expect(
      /Manual Input/i.test(master.description),
      `Description tidak boleh Manual Input setelah expiry. Actual="${master.description}"`,
    ).toBeFalsy();
    expect(
      /Highest Price|Last Inbound|No Inbound/i.test(
        `${master.description} ${master.rowText}`,
      ),
      `Setelah expiry, Description harus rumus. Actual: ${master.rowText}`,
    ).toBeTruthy();
    expect(
      /13[\/\-]08[\/\-]2026/.test(`${master.expiryText} ${master.rowText}`),
      `Expired At harus 13-08-2026. Actual expiry="${master.expiryText}"`,
    ).toBeTruthy();
    expect(master.cogsNumber, 'COGS efektif ≈ 51.900').toBeCloseTo(FORMULA_COGS, -2);

    const manualNumber = parseManualNumber(master.manualCogsText);

    await prepareSession(page, {
      companyCode: COMPANY,
      targetPath: SO_GENERAL_DATALIST_PATH,
    });

    const so = new SalesOrderGeneralPage(page);
    await so.gotoDatalist();
    await so.openCreateOrAutoEdit();
    await so.fillHeaderDescription(
      'ETM-15493 flag: price 49000 vs formula 51900 after Manual expiry 13-08-2026',
    );
    await so.clickSaveAllAndWait();
    const soCode = await so.readGeneratedCode();
    const soId = so.currentEditId();
    const soUrl = soEditUrl(soId);

    const createBody = await so.addProductViaSelectProduct(SKU);
    writeJson('02-create-select.json', { soCode, soId, soUrl, createBody });
    await capture(page, '02-after-select-product');

    await so.setQtyAndPriceForSku(SKU, 1, UNIT_PRICE).catch(async (err) => {
      writeJson('03-ui-price-error.json', {
        message: err instanceof Error ? err.message : String(err),
      });
    });
    await so.clickSaveAllAndWait().catch(() => undefined);

    let soApi = await so.fetchSalesOrderApi();
    let snapshots = so.collectDetailSnapshots(soApi);
    let line = snapshots.find((row) => /ManualCOGSWithExpirationDate-4/i.test(row.sku)) ??
      snapshots[0];
    const pbv = line?.priceBeforeVat ?? line?.eachPrice ?? 0;
    if (Math.abs(pbv - UNIT_PRICE) > 1) {
      const apiPrice = await so.setDetailUnitPriceViaApi(UNIT_PRICE);
      writeJson('03-put-price.json', apiPrice);
      expect(apiPrice.ok, `PUT unit price 49000 gagal: ${apiPrice.body}`).toBe(true);
      soApi = await so.fetchSalesOrderApi();
      snapshots = so.collectDetailSnapshots(soApi);
      line =
        snapshots.find((row) => /ManualCOGSWithExpirationDate-4/i.test(row.sku)) ??
        snapshots[0];
    }

    await so.showDetailColumn('Error Flag').catch(() => undefined);
    await so.showDetailColumn('Benchmark COGS').catch(() => undefined);
    const uiFlag = await so.readErrorFlagUi(SKU);
    const uiCogs = await so.readBenchmarkCogsFromSkuRow(SKU);
    await capture(page, '04-so-detail-flag');

    soApi = await so.fetchSalesOrderApi();
    const errorState = so.collectCogsErrorState(soApi);
    snapshots = so.collectDetailSnapshots(soApi);
    line =
      snapshots.find((row) => /ManualCOGSWithExpirationDate-4/i.test(row.sku)) ??
      snapshots[0];

    const comparePrice = line?.priceBeforeVat ?? line?.eachPrice ?? UNIT_PRICE;
    const snapshot = line?.benchmarkCogs ?? uiCogs.number;
    const usesFormula = snapshot != null && Math.abs(snapshot - FORMULA_COGS) < 2;
    const usesManual =
      snapshot != null &&
      ((manualNumber != null && Math.abs(snapshot - manualNumber) < 2) ||
        Math.abs(snapshot - 47_000) < 2 ||
        Math.abs(snapshot - 55_000) < 2);
    const priceBelowSnapshot =
      comparePrice != null && snapshot != null && comparePrice < snapshot;
    const flagBlob = `${uiFlag.tooltip} ${uiFlag.headerText} ${uiFlag.rowText} ${uiFlag.cellHtml} ${errorState.flagLabels.join(' ')}`;
    const flagPresent =
      uiFlag.hasIcon ||
      uiFlag.hasCogsErrorClass ||
      /Below Benchmark COGS|below COGS Benchmark|cogs-error/i.test(flagBlob) ||
      errorState.hasCogsErrorKey ||
      errorState.hasBelowBenchmarkLabel ||
      errorState.preventAutoApprove === true;

    const result = {
      soCode,
      soId,
      soUrl,
      master: {
        cogsNumber: master.cogsNumber,
        cogsText: master.cogsText,
        description: master.description,
        manualCogsText: master.manualCogsText,
        manualNumber,
        expiryText: master.expiryText,
      },
      unitPriceRequested: UNIT_PRICE,
      comparePrice,
      snapshot,
      uiCogs,
      uiFlag,
      errorState: {
        preventAutoApprove: errorState.preventAutoApprove,
        hasCogsErrorKey: errorState.hasCogsErrorKey,
        hasBelowBenchmarkLabel: errorState.hasBelowBenchmarkLabel,
        flagLabels: errorState.flagLabels,
      },
      usesFormula,
      usesManual,
      priceBelowSnapshot,
      flagPresent,
      line,
    };
    writeJson('04-result.json', result);

    expect(usesFormula, `Snapshot harus rumus ${FORMULA_COGS}, bukan Manual expired`).toBe(
      true,
    );
    expect(usesManual, 'Snapshot tidak boleh nilai Manual yang sudah expired').toBe(false);
    expect(
      priceBelowSnapshot,
      `Price Before VAT ${comparePrice} harus < snapshot ${snapshot}`,
    ).toBe(true);
    expect(
      flagPresent,
      'Error flag Below Benchmark COGS / cogs-error harus muncul (49.000 < 51.900 rumus)',
    ).toBe(true);
  });
});

function skuLower(sku: string): string {
  return sku.toLowerCase();
}
