---
doc_type: e2e-test-case
tc_code: TC-CBRAM-11
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Re-import — baris yang sudah matched tidak diproses ulang, hanya baris baru"
summary: "Re-import tidak menduplikasi/mengubah baris Reconciled; baris baru tetap bisa auto-match"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-11 — testcase-auto-match-cbr-ap-ar.md"
priority: Medium
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
preconditions:
  - Header BR-000123 (Open) sudah punya baris bank statement Reconciled dari import sebelumnya (lihat TC-CBRAM-01)
  - Ada journal baru eligible untuk baris baru
test_data:
  - field: Baris existing
    value: "TransactionDate 02/07/2026, Received 100000 — sudah Reconciled"
  - field: File import baru
    value: "Baris lama duplikat (02/07/2026 Received 100000) + baris baru 04/07/2026 Received 320000"
  - field: Journal baru eligible
    value: "JRN-AR-0012, Payment from Customer, COA 11001 Debit 320.000, tanggal 04-07-2026, Approved"
steps:
  - Import file baru yang berisi baris lama (duplikat) + baris baru ke header BR-000123
  - Cek jumlah baris bank statement dan statusnya setelah import
expected_result: |
  - Baris lama (02/07/2026, 100.000) tidak diproses ulang / tidak dobel — tetap Reconciled
  - Baris baru (04/07/2026, 320.000) diproses sebagai baris baru dan auto-match ke JRN-AR-0012
  - Tidak ada duplikasi baris bank statement untuk data yang sama persis
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

Bergantung pada hasil TC-CBRAM-01 (happy path AR).
