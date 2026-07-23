---
doc_type: e2e-test-case
tc_code: TC-CBRAM-14
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Unmatch setelah auto-match tetap berfungsi normal"
summary: "Hasil auto-match bisa di-Unmatch dan di-Match manual ulang seperti transaksi biasa"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-14 — testcase-auto-match-cbr-ap-ar.md"
priority: High
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - Baris hasil auto-match dari TC-CBRAM-01 (BR-000123, bank statement 100.000 tanggal 02/07/2026 ↔ JRN-AR-0001)
  - Header masih status Open
test_data:
  - field: Header
    value: BR-000123 (Open)
  - field: Pairing
    value: "Bank statement Received 100000 tgl 02/07/2026 ↔ JRN-AR-0001 COA 11001"
steps:
  - Buka tab Reconcile Process / Bank Statement pada header BR-000123
  - Cari baris berstatus Reconciled hasil auto-match
  - Klik aksi Unmatch pada baris tersebut
  - Cek status baris bank statement dan baris GL JRN-AR-0001 setelah unmatch
  - Coba Match manual lagi baris yang sama
expected_result: |
  - Unmatch berhasil; baris bank statement dan baris GL kembali Not Reconciled
  - User bisa Match manual kembali seperti transaksi biasa
  - Tidak ada perbedaan behavior antara unmatch hasil auto-match vs unmatch hasil match manual
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
---

## Catatan

Regression unmatch — bergantung pada data hasil TC happy path AR.
