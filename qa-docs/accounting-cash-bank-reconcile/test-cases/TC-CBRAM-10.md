---
doc_type: e2e-test-case
tc_code: TC-CBRAM-10
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Header Cash & Bank Reconcile sudah Approved — auto-match tidak boleh jalan"
summary: "Header Approved tidak bisa diedit/import; auto-match tidak jalan"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-10 — testcase-auto-match-cbr-ap-ar.md"
priority: High
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - Header BR-000200 sudah berstatus Approved
  - Ada journal AR eligible (Approved) untuk nominal yang akan diuji
test_data:
  - field: Header CBR
    value: "BR-000200, status Approved"
  - field: Journal
    value: "JRN-AR-0011, Payment from Customer, COA 11001 Debit 150.000, tanggal 04-07-2026"
  - field: Import Bank Statement (percobaan)
    value: "TransactionDate 04/07/2026, Received 150000"
steps:
  - Coba akses tab Bank Statement pada header BR-000200 yang sudah Approved
  - Coba lakukan import (jika tombol/aksi tersedia)
expected_result: |
  - Import dan seluruh proses edit (termasuk auto-match) tidak bisa dilakukan pada header Approved
  - Konsisten dengan aturan existing bahwa transaksi Approved tidak bisa diedit
  - Tidak ada auto-match yang terjadi
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

Regression terhadap lock status header CBR.
