import { test, expect, type Page, type TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { prepareSession } from '../../helpers/company-access';
import { PURCHASE_REQUISITION_DATALIST_PATH } from '../../helpers/purchase-requisition';
import { PURCHASE_ORDER_DATALIST_PATH } from '../../helpers/purchase-order';
import { PURCHASE_INVOICE_DATALIST_PATH } from '../../helpers/purchase-invoice';
import { ACCOUNT_PAYMENT_DATALIST_PATH } from '../../helpers/account-payment';
import { JOURNAL_DATALIST_PATH } from '../../helpers/journal';
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
import {
  createSupplierInvoiceDraft,
  approveSupplierInvoice,
  SINV_SCENARIO_TCS,
} from '../../scenarios/supplier-invoice.scenario';
import {
  createPaymentWithInvoice,
  approvePayment,
  getLinkedJournalCode,
  APAY_SCENARIO_TCS,
} from '../../scenarios/account-payment.scenario';
import {
  verifyAutoJournalFromPayment,
  JRN_SCENARIO_TCS,
} from '../../scenarios/journal.scenario';
import defaultFixture from '../../fixtures/flows/scm-ap-full.fixture.json';

/**
 * FLOW-SCM-AP-001 — chain 6 phase procure-to-pay, murni UI crawling:
 *   1 PR → 2 PO With PR → 3 Purchase Inbound (approve) →
 *   4 Supplier Invoice → 5 Account Payment → 6 verifikasi auto-journal
 *
 * Phase 1–3 memanggil scenario yang SAMA dengan flow scm-inbound — tidak ada
 * langkah yang disalin. TC doc: qa-docs/flows/scm-ap-full/testcase.md
 *
 * Test data selalu fresh; override via OLSHOP_FLOW_FIXTURE.
 * Company default: lumicharmsid (153).
 */

type FlowFixture = typeof defaultFixture;

function loadFixture(): FlowFixture {
  const overridePath = process.env.OLSHOP_FLOW_FIXTURE;
  if (!overridePath) return defaultFixture;
  return JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), overridePath), 'utf-8'),
  ) as FlowFixture;
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

// Judul describe/test WAJIB statis (nilai dinamis → "Test not found in worker").
test.describe.serial('SCM AP Flow — PR → PO → PI → SI → Payment → Journal', () => {
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
  let invoiceCode = '';
  let paymentCode = '';
  let journalCode = '';

  test('[@FLOW-SCM-AP-001][phase-1] PR create + approve', async ({ page }, testInfo) => {
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

  test('[@FLOW-SCM-AP-001][phase-2] PO With PR create + approve', async ({ page }, testInfo) => {
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

  test('[@FLOW-SCM-AP-001][phase-3] Purchase Inbound create + approve', async ({ page }, testInfo) => {
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
      fixture.warehouse_destination,
    ));
    // Wajib approve: Supplier Invoice hanya bisa menarik inbound yang approved.
    await approvePiFromShow(page, piTrxCode);

    // SIDE-EFFECT stok: BELUM diassert — lihat catatan di
    // qa-docs/flows/scm-ap-full/testcase.md § TODO. Dua sumber yang dicoba
    // 2026-08-26 sama-sama buntu: Real Time Stock (requirement masih `draft`,
    // ditolak preflight) dan Stock History V2 (laporan batch — "Latest
    // Calculation" harian, mutasi baru muncul setelah job terjadwal berjalan).

    await attachPhaseResult(testInfo, page, {
      phase: 3,
      menu: 'supplychain-new-purchase-inbound',
      recalls: [
        PI_SCENARIO_TCS.createPiFromPoOpen,
        PI_SCENARIO_TCS.approvePiFromShow,
      ],
      produces: {
        pi_code: piTrxCode,
        status: 'Approved',
        consumed_po: poTrxCode,
      },
    });
  });

  test('[@FLOW-SCM-AP-001][phase-4] Supplier Invoice create + approve', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!piTrxCode, 'Phase 3 tidak menghasilkan pi_code — chain berhenti');

    await prepareSession(page, {
      companyCode: fixture.company_code,
      targetPath: PURCHASE_INVOICE_DATALIST_PATH,
    });

    ({ invoiceCode } = await createSupplierInvoiceDraft(
      page,
      fixture.supplier_name,
      poTrxCode,
    ));
    await approveSupplierInvoice(page, invoiceCode);

    await attachPhaseResult(testInfo, page, {
      phase: 4,
      menu: 'accounting-supplier-invoice',
      recalls: [
        SINV_SCENARIO_TCS.createSupplierInvoiceDraft,
        SINV_SCENARIO_TCS.approveSupplierInvoice,
      ],
      produces: {
        invoice_code: invoiceCode,
        status: 'Approved',
        consumed_inbound: piTrxCode,
      },
    });
  });

  test('[@FLOW-SCM-AP-001][phase-5] Account Payment create + approve', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!invoiceCode, 'Phase 4 tidak menghasilkan invoice_code — chain berhenti');

    await prepareSession(page, {
      companyCode: fixture.company_code,
      targetPath: ACCOUNT_PAYMENT_DATALIST_PATH,
    });

    ({ paymentCode } = await createPaymentWithInvoice(
      page,
      fixture.supplier_name,
      fixture.cash_bank_label,
      invoiceCode,
    ));
    await approvePayment(page, paymentCode);

    await attachPhaseResult(testInfo, page, {
      phase: 5,
      menu: 'accounting-supplier-payment',
      recalls: [
        APAY_SCENARIO_TCS.createPaymentWithInvoice,
        APAY_SCENARIO_TCS.approvePayment,
      ],
      produces: {
        payment_code: paymentCode,
        status: 'Approved',
        consumed_invoice: invoiceCode,
      },
    });
  });

  test('[@FLOW-SCM-AP-001][phase-6] Verifikasi auto-journal Payment to Supplier', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!paymentCode, 'Phase 5 tidak menghasilkan payment_code — chain berhenti');

    await prepareSession(page, {
      companyCode: fixture.company_code,
      targetPath: JOURNAL_DATALIST_PATH,
    });

    journalCode = await getLinkedJournalCode(page, paymentCode);
    await verifyAutoJournalFromPayment(
      page,
      journalCode,
      paymentCode,
      fixture.bank_account_hint,
    );

    await attachPhaseResult(testInfo, page, {
      phase: 6,
      menu: 'journal',
      recalls: [JRN_SCENARIO_TCS.verifyAutoJournalFromPayment],
      produces: {
        journal_code: journalCode,
        type: 'Payment to Supplier',
        consumed_payment: paymentCode,
      },
    });
  });
});
