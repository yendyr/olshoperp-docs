---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-12
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Breakdown Rincian Nilai Sales Invoice (Line Items + Other Cost - Other Discount = Total Invoice)"
summary: "Memastikan rincian perhitungan nilai pada kartu Sales Invoice (SI) menjabarkan komponen subtotal line items ditambah biaya lain-lain (Other Cost) dan dikurangi diskon lain-lain (Other Discount) menghasilkan Total Invoice yang sinkron."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-24
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15893
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-customer-invoice
  - all-sales-order
test_data:
  - field: "Sales Order with SI Breakdown"
    value: "SO-5TBW8NFJ atau order ber-Sales Invoice dengan Other Cost / Other Discount"
steps:
  - "1. Buka dokumen Sales Order yang telah terbit Sales Invoice (SI)"
  - "2. Buka panel Order Lifecycle"
  - "3. Gulir ke kartu Sales Invoice pada Related Transactions atau Money Trail"
  - "4. Periksa breakdown angka rincian invoice (subtotal line items, other cost, other discount)"
  - "5. Hitung formula: Line items + Other Cost (OC) - Other Discount (OD) = Total Invoice"
expected_result: |
  1. Kartu Sales Invoice menyajikan rincian pembentuk nilai invoice secara transparan sesuai AC-16.
  2. Formula matematis terpenuhi: (Subtotal Lines + Other Cost - Other Discount = Total Sales Invoice).
  3. Nilai total sinkron dengan nilai invoiceable/sales invoice pada strip ringkasan atas.
test_result:
  status: failed
  started_at: "2026-09-24T21:20:00+07:00"
  finished_at: "2026-09-24T21:33:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "FAILED: Nilai Sales Invoice di section Money Trail cocok sebesar 100.000 (sinkron dengan SO Detail lines dan strip Money). Namun ditemukan DEFECT KRITIS pada navigasi card Sales Invoice: hyperlink SI-5TBWFWT2 salah rute mengarah ke '/finance/sales-invoice/edit/3469' yang memicu error 404 'We couldn't find the page you were looking for'. Rute yang benar di OlshopERP seharusnya '/accounting/customer-invoice/{id}' (melanggar AC-4)."
  report_url: "https://app.betterbugs.io/session/6ab533f79a0216b8a623a429"
test_data_used:
  - trx_code: "SO-5TBW8NFJ"
    si_code: "SI-5TBWFWT2"
    actual_amount: "Sales invoice di money trail = 100.000, sinkron dengan total price detail line dan strip money."
    actual_url: "https://staging.olshoperp.com/finance/sales-invoice/edit/3469 (Error 404)"
    expected_url: "https://staging.olshoperp.com/accounting/customer-invoice/{id}"
run_history:
  - run_at: "2026-09-24T21:33:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-4 & AC-16: Hyperlink SI Code salah routing ke /finance/sales-invoice/edit/{id} (404 Page Not Found)."
first_execution:
  at: "2026-09-24T21:33:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T21:33:00+07:00"
  jira: "ETM-15893"
  status: failed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-12: Breakdown Rincian Nilai Sales Invoice (Line Items + Other Cost - Other Discount = Total Invoice)

## Objective
Memverifikasi ketepatan formula kalkulasi dan penjabaran detail tagihan penjualan (*Sales Invoice breakdown*) pada panel Order Lifecycle sesuai kriteria AC-16, serta validitas navigasi hyperlink dokumen Sales Invoice.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji: `SO-5TBW8NFJ`
- Dokumen Sales Invoice: `SI-5TBWFWT2`
- Evidence Session:
  - Wrong Route 404: [BetterBugs Session 6ab533f7](https://app.betterbugs.io/session/6ab533f79a0216b8a623a429)
  - SI Code Navigation Mismatch: [BetterBugs Session 6ab53465](https://app.betterbugs.io/session/6ab534659a0216b8a623a433)

### Hasil Pengujian (Actual vs Expected):
1. **Keselarasan Nilai SI (AC-16):**
   - *Actual:* Nilai Sales Invoice pada section Money Trail sebesar Rp100.000, sinkron dengan total price detail lines pada Sales Order (Rp100.000) dan nilai pada strip Money ✅.
2. **Navigasi Hyperlink SI Code (AC-4):**
   - *Actual:* Hyperlink kode dokumen `SI-5TBWFWT2` salah mengarah ke URL `https://staging.olshoperp.com/finance/sales-invoice/edit/3469` yang menghasilkan error 404 (*"We couldn't find the page you were looking for"*) ❌.
   - *Expected:* Rute URL yang benar untuk Sales Invoice pada OlshopERP adalah `https://staging.olshoperp.com/accounting/customer-invoice/{id}`.

### Kesimpulan:
**FAILED ❌ (Defect AC-4 & AC-16 — Invalid Routing for Sales Invoice Hyperlink).**  
Meskipun nilai kalkulasi Sales Invoice telah sinkron, hyperlink kode Sales Invoice mengalami *broken route* (404 Page Not Found) karena mengarah ke path `/finance/sales-invoice/edit/` bukannya `/accounting/customer-invoice/edit/`.

