---
doc_type: e2e-test-case
tc_code: TC-CBRAM-12
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Import gagal (all-or-nothing) tidak menghasilkan partial auto-match"
summary: "Jika 1 baris file invalid, seluruh import gagal — tidak ada partial save maupun auto-match"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-12 — testcase-auto-match-cbr-ap-ar.md"
priority: High
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - File import mengandung baris valid dan baris invalid
  - Ada journal AR eligible untuk baris valid
  - Header CBR Open
test_data:
  - field: Baris 1 (valid)
    value: "TransactionDate 05/07/2026, Received 100000 — ada journal AR eligible"
  - field: Baris 2 (invalid)
    value: "TransactionDate 2026/07/05, Received kosong, Spent kosong — format tanggal salah & amount kosong"
steps:
  - Import file berisi baris 1 (valid) dan baris 2 (invalid) sekaligus
  - Cek behavior import dan status data Bank Statement
expected_result: |
  - Import gagal total (all-or-nothing)
  - Baris 1 yang valid tidak ikut tersimpan maupun ter-auto-match
  - Tidak ada partial data yang masuk ke Bank Statement
  - Sistem menampilkan error import sesuai validasi format tanggal
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

Pastikan auto-match tidak jalan di tengah import yang gagal.
