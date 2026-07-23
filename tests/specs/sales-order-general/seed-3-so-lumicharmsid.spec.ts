import { test, expect } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import {
  SO_GENERAL_DATALIST_PATH,
  SalesOrderGeneralPage,
  type SoDetailLine,
} from '../../helpers/sales-order-general';

/**
 * One-off seed: 3 Sales Order (Dev - Sales Order) di lumicharmsid.
 * Description / approval note: "automation playwright"
 *
 * Menu: /businessdevelopment/sales-order-general
 * Run:
 *   $env:OLSHOP_COMPANY_CODE="lumicharmsid"
 *   npx playwright test tests/specs/sales-order-general/seed-3-so-lumicharmsid.spec.ts --project=authenticated --workers=1
 */

type SeedResult = {
  label: string;
  customer: string;
  skus: string;
  code: string;
  status: string;
  error?: string;
};

const STORE = 'Store Barang Mahal';
const SHIPPER = 'automation test shipper';
const DESC = 'automation playwright';

const SEEDS: Array<{
  label: string;
  customer: string;
  customerAliases?: string[];
  lines: SoDetailLine[];
}> = [
  {
    label: 'SO 1',
    customer: 'PT. Import Order',
    lines: [
      { sku: 'AUTO-SKU001', qty: 3, price: 1000 },
      { sku: 'AUTO-SKU003', qty: 1, price: 1000 },
    ],
  },
  {
    label: 'SO 2',
    customer: 'CV Karya Logam Jaya Abadi',
    lines: [
      { sku: 'AUTO-SKU002', qty: 1, price: 1000 },
      { sku: 'AUTO-SKU003', qty: 2, price: 1000 },
    ],
  },
  {
    label: 'SO 3',
    customer: 'PT. Import Order',
    lines: [
      { sku: 'AUTO-SKU002', qty: 4, price: 1000 },
      { sku: 'AUTO-SKU004', qty: 5, price: 1000 },
    ],
  },
];

test.describe.serial('Seed 3 Sales Order — lumicharmsid', () => {
  const results: SeedResult[] = [];

  test.beforeEach(async ({ page }) => {
    await prepareSession(page, {
      companyCode: 'lumicharmsid',
      targetPath: SO_GENERAL_DATALIST_PATH,
    });
  });

  for (const seed of SEEDS) {
    test(`[@SEED-SO] ${seed.label} — ${seed.customer}`, async ({ page }) => {
      test.setTimeout(420_000);

      const so = new SalesOrderGeneralPage(page);
      const skus = seed.lines
        .map((l) => `${l.sku}×${l.qty}@${l.price}`)
        .join(', ');

      try {
        const code = await so.createApprovedSo({
          customer: seed.customer,
          customerAliases: seed.customerAliases,
          store: STORE,
          shipperService: SHIPPER,
          lines: seed.lines,
          description: DESC,
        });

        expect(code.length).toBeGreaterThan(0);

        // Verifikasi status Approved di datalist (best-effort)
        let status = 'Approved';
        try {
          await so.assertStatusInDatalist(code, /approved/i);
        } catch {
          status = 'Created (cek status manual)';
        }

        results.push({
          label: seed.label,
          customer: seed.customer,
          skus,
          code,
          status,
        });

        // eslint-disable-next-line no-console
        console.log(
          `[SEED OK] ${seed.label} code=${code} customer=${seed.customer} skus=${skus}`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({
          label: seed.label,
          customer: seed.customer,
          skus,
          code: '-',
          status: 'FAIL',
          error: message.slice(0, 240),
        });
        // eslint-disable-next-line no-console
        console.error(`[SEED FAIL] ${seed.label}: ${message}`);
        throw err;
      }
    });
  }

  test.afterAll(() => {
    // eslint-disable-next-line no-console
    console.log('\n=== SEED RESULT TABLE ===');
    // eslint-disable-next-line no-console
    console.log(
      '| # | SO Code | Customer | SKUs | Status |',
    );
    // eslint-disable-next-line no-console
    console.log('|---|---|---|---|---|');
    for (const r of results) {
      // eslint-disable-next-line no-console
      console.log(
        `| ${r.label} | ${r.code} | ${r.customer} | ${r.skus} | ${r.status}${r.error ? ` — ${r.error}` : ''} |`,
      );
    }
  });
});
