import { test, type Page, type TestInfo } from '@playwright/test';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import { PURCHASE_ORDER_DATALIST_PATH } from '../../helpers/purchase-order';
import {
  createPrOpen,
  approvePrFromDatalist,
  PR_SCENARIO_TCS,
} from '../../scenarios/purchase-requisition.scenario';
import {
  createPoWithPrOpen,
  approvePoFromDatalist,
  PO_SCENARIO_TCS,
} from '../../scenarios/purchase-order.scenario';
import {
  createPiFromPoOpen,
  approvePiFromShow,
  PI_SCENARIO_TCS,
} from '../../scenarios/purchase-inbound.scenario';
import defaultFixture from '../../fixtures/flows/scm-inbound.fixture.json';
import * as fs from 'fs';
import * as path from 'path';

/**
 * FLOW-SCM-INBOUND-001 — chain 3 menu, murni UI crawling, komposisi scenario:
 *   Phase 1: recall TC-PR-CREATE-001 + TC-PR-UPDATE-002   (PR Open → Approved)
 *   Phase 2: recall TC-PO-CREATE-001/UPDATE-001 + UPDATE-002 (PO With PR → Approved)
 *   Phase 3: recall TC-PI-CREATE-001 [+ TC-PI-APPROVE-001 jika fixture.approve_inbound]
 *
 * Langkah per menu TIDAK ditulis di sini — hidup di tests/scenarios/ (1 scenario =
 * 1 TC origin). File ini hanya berisi glue E2E: handoff data antar phase + attachment
 * untuk reporter. TC doc flow: qa-docs/flows/scm-inbound/testcase.md
 *
 * Test data per run — SELALU fresh chain, tidak pernah bergantung dokumen run lama:
 *   1. Default : tests/fixtures/flows/scm-inbound.fixture.json
 *   2. Override: OLSHOP_FLOW_FIXTURE=/path/ke/fixture.json (tester-specified data)
 * Summary + history (last-run/prev-run): flow-summary-reporter.
 */

type FlowFixture = typeof defaultFixture;

function loadFixture(): FlowFixture {
  const overridePath = process.env.OLSHOP_FLOW_FIXTURE;
  if (!overridePath) return defaultFixture;
  const resolved = path.resolve(process.cwd(), overridePath);
  return JSON.parse(fs.readFileSync(resolved, 'utf-8')) as FlowFixture;
}

const fixture = loadFixture();
const runId = `PWFLOW-${Date.now().toString(36).toUpperCase()}`;

async function attachPhaseResult(
  testInfo: TestInfo,
  page: Page,
  data: {
    phase: number;
    menu: string;
    recalls: string[];
    produces: Record<string, unknown>;
  },
): Promise<void> {
  await testInfo.attach('flow-phase', {
    body: JSON.stringify({
      flow_id: fixture.flow_id,
      run_id: runId,
      company: fixture.company_code,
      test_data: {
        supplier: fixture.supplier_name,
        product_lines: fixture.product_lines,
      },
      ...data,
    }),
    contentType: 'application/json',
  });
  await testInfo.attach(`phase-${data.phase}-screenshot`, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
}

// PENTING: judul describe/test WAJIB statis — Playwright re-evaluasi file ini di
// worker process; nilai dinamis (timestamp) di judul membuat "Test not found in worker".
// run_id cukup tercatat di attachment flow-phase → summary/history.
test.describe.serial('SCM Inbound Flow — PR → PO → PI', () => {
  // Gate disiplin: flow hanya boleh jalan kalau chain lengkap (TC origin ada,
  // bukan PENDING, scenario ada, requirement review/approved). Kalau preflight
  // gagal, seluruh chain berhenti — lengkapi/jawab gap dulu sebelum eksekusi.
  test.beforeAll(() => {
    const { execFileSync } = require('child_process') as typeof import('child_process');
    execFileSync(
      'node',
      [path.resolve(__dirname, '../../tools/flow-preflight.mjs'), fixture.flow_id],
      { stdio: 'inherit' },
    );
  });

  let prTrxCode = '';
  let poTrxCode = '';
  let piTrxCode = '';

  test('[@FLOW-SCM-INBOUND-001][phase-1] PR create + approve', async ({ page }, testInfo) => {
    test.setTimeout(300_000);

    await prepareSession(page, {
      companyCode: fixture.company_code,
      targetPath: PURCHASE_REQUISITION_DATALIST_PATH,
    });

    ({ prCode: prTrxCode } = await createPrOpen(page, fixture.product_lines));
    await approvePrFromDatalist(page, prTrxCode);

    await attachPhaseResult(testInfo, page, {
      phase: 1,
      menu: 'supplychain-purchase-requisition',
      recalls: [PR_SCENARIO_TCS.createPrOpen, PR_SCENARIO_TCS.approvePrFromDatalist],
      produces: { pr_code: prTrxCode, status: 'Approved' },
    });
  });

  test('[@FLOW-SCM-INBOUND-001][phase-2] PO With PR create + approve', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!prTrxCode, 'Phase 1 tidak menghasilkan pr_code — chain berhenti');

    await prepareSession(page, {
      companyCode: fixture.company_code,
      targetPath: PURCHASE_ORDER_DATALIST_PATH,
    });

    ({ poCode: poTrxCode } = await createPoWithPrOpen(
      page,
      fixture.supplier_name,
      fixture.product_lines,
    ));
    await approvePoFromDatalist(page, poTrxCode);

    await attachPhaseResult(testInfo, page, {
      phase: 2,
      menu: 'supplychain-purchase-order',
      recalls: [PO_SCENARIO_TCS.createPoWithPrOpen, PO_SCENARIO_TCS.approvePoFromDatalist],
      produces: { po_code: poTrxCode, status: 'Approved', consumed_pr: prTrxCode },
    });
  });

  test('[@FLOW-SCM-INBOUND-001][phase-3] PI dari approved PO', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!poTrxCode, 'Phase 2 tidak menghasilkan po_code — chain berhenti');

    await prepareSession(page, {
      companyCode: fixture.company_code,
      targetPath: PURCHASE_ORDER_DATALIST_PATH,
    });

    ({ piCode: piTrxCode } = await createPiFromPoOpen(
      page,
      fixture.supplier_name,
      fixture.product_lines,
      poTrxCode,
    ));

    const recalls: string[] = [PI_SCENARIO_TCS.createPiFromPoOpen];
    let piStatus = 'Open';
    if (fixture.approve_inbound) {
      await approvePiFromShow(page, piTrxCode);
      recalls.push(PI_SCENARIO_TCS.approvePiFromShow);
      piStatus = 'Approved';
    }

    await attachPhaseResult(testInfo, page, {
      phase: 3,
      menu: 'supplychain-new-purchase-inbound',
      recalls,
      produces: { pi_code: piTrxCode, status: piStatus, consumed_po: poTrxCode },
    });
  });
});
