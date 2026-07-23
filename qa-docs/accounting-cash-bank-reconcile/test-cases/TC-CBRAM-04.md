---
doc_type: e2e-test-case
tc_code: TC-CBRAM-04
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Journal manual (bukan AP/AR) dengan nominal sama tidak ikut auto-match"
summary: "Hanya journal dengan transaction_reference_text Payment to Supplier / Payment from Customer yang eligible auto-match"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-04 — testcase-auto-match-cbr-ap-ar.md"
priority: High
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - journal
preconditions:
  - Ada journal manual (bukan hasil Payment AP/AR) dengan COA 11001 dan nominal sama dengan bank statement
  - Header CBR Open
test_data:
  - field: Journal Trx Code
    value: JRN-MANUAL-0005
  - field: Journal Date
    value: 05-07-2026
  - field: transaction_reference_text
    value: "kosong / bukan Payment to Supplier atau Payment from Customer"
  - field: Detail journal
    value: "COA 11001 — Debit 750.000"
  - field: Import Bank Statement
    value: "TransactionDate = 05/07/2026, Received = 750000"
steps:
  - Import bank statement dengan data di atas
  - Cek status baris bank statement dan baris GL JRN-MANUAL-0005
expected_result: |
  - Baris bank statement tidak auto-match, tetap Not Reconciled
  - JRN-MANUAL-0005 tetap bisa masuk suggestion existing (threshold/exact), tapi harus Match manual
  - Tidak ada auto-match karena journal bukan bersumber dari Payment AP/AR
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

Filter reference text adalah gate utama fitur auto-match MVP.
