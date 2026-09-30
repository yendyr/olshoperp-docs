---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-12
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Breakdown Rincian Nilai Sales Invoice (Line Items + Other Cost - Other Discount = Total Invoice)"
summary: "Memastikan rincian perhitungan nilai pada kartu Sales Invoice (SI) menjabarkan komponen subtotal line items ditambah biaya lain-lain (Other Cost) dan dikurangi diskon lain-lain (Other Discount) menghasilkan Total Invoice yang sinkron."
status: ready
owner: "QA - Yemima"
last_updated: 2026-09-30
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
  status: passed
  started_at: "2026-09-30T10:00:00+07:00"
  finished_at: "2026-09-30T10:15:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Tautan dokumen SI-5TBWFWT2 sudah mengarah ke rute valid /accounting/customer-invoice/{id} (tidak lagi mengarah ke /finance/sales-invoice/edit/{id} yang memicu 404). Nilai invoice sinkron sebesar Rp100.000 (memenuhi AC-04 dan AC-16)."
  report_url: "https://jam.dev/c/c07fc061-1430-4c2c-9758-3c195fc7df3d"
test_data_used:
  - trx_code: "SO-5TBW8NFJ"
    si_code: "SI-5TBWFWT2"
    actual_amount: "Sales invoice di money trail = 100.000, sinkron dengan total price detail line dan strip money."
    actual_url: "https://staging.olshoperp.com/accounting/customer-invoice/{id}"
run_history:
  - run_at: "2026-09-24T21:33:00+07:00"
    status: failed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Defect AC-4 & AC-16: Hyperlink SI Code salah routing ke /finance/sales-invoice/edit/{id} (404 Page Not Found)."
  - run_at: "2026-09-30T10:15:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-16098"
    note: "Retest PASSED (AC-04, AC-16): Tautan SI-5TBWFWT2 mengarah ke rute valid /accounting/customer-invoice/{id} tanpa 404."
first_execution:
  at: "2026-09-24T21:33:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-30T10:15:00+07:00"
  jira: "ETM-16098"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-12: Breakdown Rincian Nilai Sales Invoice (Line Items + Other Cost - Other Discount = Total Invoice)

## Objective
Memverifikasi ketepatan formula kalkulasi dan penjabaran detail tagihan penjualan (*Sales Invoice breakdown*) pada panel Order Lifecycle sesuai kriteria AC-16, serta validitas navigasi hyperlink dokumen Sales Invoice.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** dan retest pada **ETM-16098** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-16098)).
- Dokumen Uji: `SO-5TBW8NFJ`
- Dokumen Sales Invoice: `SI-5TBWFWT2`
- Evidence Retest: https://jam.dev/c/c07fc061-1430-4c2c-9758-3c195fc7df3d

### Hasil Pengujian Retest (ETM-16098):
1. **Keselarasan Nilai SI (AC-16):** Nilai Sales Invoice pada section Money Trail sebesar Rp100.000, sinkron dengan total price detail lines pada Sales Order (Rp100.000) dan nilai pada strip Money ✅.
2. **Navigasi Hyperlink SI Code (AC-4):** Tautan kode dokumen `SI-5TBWFWT2` berhasil mengarah ke rute aktif yang benar: `/accounting/customer-invoice/{id}` tanpa error 404 ✅.

### Kesimpulan:
**PASSED 🟢 (AC-04 & AC-16 Terpenuhi).**  
Nilai breakdown tagihan telah akurat dan navigasi hyperlink dokumen Sales Invoice telah mengarah ke rute modul accounting yang valid.

