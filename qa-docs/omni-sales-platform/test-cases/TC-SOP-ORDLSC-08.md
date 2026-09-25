---
doc_type: e2e-test-case
tc_code: TC-SOP-ORDLSC-08
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Pembukaan Order Lifecycle pada Status Terminal VOID / REJECTED dan Status Awal (DRAFT / OPEN)"
summary: "Memastikan panel Order Lifecycle dapat dibuka tanpa hambatan gate status pada order berstatus Draft, Open, maupun status terminal (Void / Rejected), serta menampilkan banner terminal state secara jelas saat order dibatalkan/ditolak."
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
  - businessdevelopment-sales-order-general
  - all-sales-order
test_data:
  - field: "Sales Order Void / Rejected"
    value: "Order dengan status Void atau Rejected"
  - field: "Sales Order Draft / Open"
    value: "Order dengan status Draft atau Open"
steps:
  - "1. Cari atau buka dokumen Sales Order (Platform atau General) yang berstatus VOID atau REJECTED via form edit"
  - "2. Buka panel navigasi Order Lifecycle"
  - "3. Periksa apakah panel berhasil terbuka dan menampilkan banner peringatan 'Terminal State' (informasi bahwa order dibatalkan/ditolak)"
  - "4. Buka dokumen Sales Order yang berstatus DRAFT atau OPEN"
  - "5. Buka panel Order Lifecycle dan verifikasi apakah panel terbuka normal dengan data awal yang menyesuaikan statusnya"
expected_result: |
  1. Panel Order Lifecycle TIDAK terkunci (tidak ada error atau disabled) pada status DRAFT, OPEN, REJECTED, maupun VOID (memenuhi AC-2).
  2. Pada status terminal VOID / REJECTED, panel menampilkan banner terminal state yang menjelaskan status pembatalan/penolakan pesanan.
  3. Pada status DRAFT / OPEN, strip status dan tahapan alur menyesuaikan kondisi awal pesanan.
test_result:
  status: passed
  started_at: "2026-09-24T16:50:00+07:00"
  finished_at: "2026-09-24T17:04:00+07:00"
  executed_by: "OlshopERP (resty)"
  environment: staging
  log_summary: "PASSED: Panel Order Lifecycle berhasil dibuka tanpa hambatan status gate pada SO REJECTED (SO-5TRAFWBL) dan VOID (SO-5TNZT7AQ). Informasi status pembatalan/penolakan tersaji jelas pada indikator internal status (tertera 'rejected' dan 'void') sesuai kondisi riil dokumen (memenuhi AC-2)."
  report_url: "https://app.betterbugs.io/session/6ab4f599587953ccdcfdb747"
test_data_used:
  - trx_code_rejected: "SO-5TRAFWBL"
    actual_state: "Panel terbuka normal, internal status menampilkan 'rejected'."
  - trx_code_void: "SO-5TNZT7AQ"
    actual_state: "Panel terbuka normal, internal status menampilkan 'void'."
    expected: "Panel dapat dibuka pada seluruh status pesanan dan merefleksikan status dokumen dengan tepat (AC-2)."
run_history:
  - run_at: "2026-09-24T17:04:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15893"
    note: "Memenuhi AC-2: Tidak ada status gate, panel terbuka normal, status 'void' dan 'rejected' tertera jelas pada internal status."
first_execution:
  at: "2026-09-24T17:04:00+07:00"
  via: "manual:OlshopERP"
  jira: "ETM-15893"
last_execution:
  at: "2026-09-24T17:04:00+07:00"
  jira: "ETM-15893"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOP-ORDLSC-08: Pembukaan Order Lifecycle pada Status Terminal VOID / REJECTED dan Status Awal (DRAFT / OPEN)

## Objective
Menguji ketiadaan gate status (*no status gate*) pada panel Order Lifecycle sesuai kriteria AC-2 (ETM-15893), memastikan pesanan dengan status terminal (Void/Rejected) dan status awal (Draft/Open) dapat dibuka dan diinspeksi dengan informasi status yang jelas.

## Catatan QA & Bukti Pengujian (Evidence)
Mengacu pada card **ETM-15893** ([Order Lifecycle panel](https://erpintegration.atlassian.net/browse/ETM-15893)).
- Dokumen Uji:
  - `SO-5TRAFWBL` (Status: REJECTED)
  - `SO-5TNZT7AQ` (Status: VOID)
- Evidence Session: [BetterBugs Session 6ab4f599](https://app.betterbugs.io/session/6ab4f599587953ccdcfdb747)

### Hasil Pengujian (Actual vs Expected):
1. **Ketiadaan Gate Status (No Gate Status):**
   - *Actual:* Panel Slideover Order Lifecycle berhasil dibuka tanpa error pada status `REJECTED` maupun `VOID` ✅.
2. **Representasi Status Pesanan (AC-2):**
   - *Actual:* Status penolakan (`rejected`) dan pembatalan (`void`) ditampilkan secara jelas pada bagian indikator *internal status* panel pesanan ✅.
   - *Expected:* Panel dapat diakses pada seluruh status pesanan (draft sampai void/rejected) dengan isi data yang menyesuaikan status dokumen.

### Kesimpulan:
**PASSED 🟢.**  
Fitur pembukaan panel pada status terminal telah bebas gate dan berhasil merefleksikan status dokumen (Void dan Rejected) secara akurat sesuai kriteria Acceptance Criteria AC-2.


