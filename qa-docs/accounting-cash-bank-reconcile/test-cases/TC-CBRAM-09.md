---
doc_type: e2e-test-case
tc_code: TC-CBRAM-09
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Journal AP/AR belum Approved tidak eligible untuk auto-match"
summary: "Hanya journal Approved yang ikut auto-match; approve belakangan tidak auto-update baris import lama"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-09 — testcase-auto-match-cbr-ap-ar.md"
priority: High
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
  - journal
preconditions:
  - Customer Payment dibuat tapi journal masih Draft / belum Approved
  - Header CBR Open
test_data:
  - field: Journal Trx Code
    value: JRN-AR-0010
  - field: Journal Date
    value: 10-07-2026
  - field: Status Journal
    value: Draft (belum Approved)
  - field: Reference
    value: Payment from Customer
  - field: COA 11001 (Debit)
    value: "350.000"
  - field: Import Bank Statement
    value: "TransactionDate = 10/07/2026, Received = 350000"
steps:
  - Import bank statement saat journal masih Draft
  - Cek status baris bank statement
  - Approve journal JRN-AR-0010 tanpa re-import
  - Cek ulang status baris bank statement
expected_result: |
  - Tidak auto-match saat journal belum Approved
  - Setelah journal di-approve tanpa re-import, baris bank statement TIDAK otomatis jadi match
  - Tetap Not Reconciled sampai Match manual atau import baru / re-run
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

Auto-match hanya jalan tepat setelah proses import (MVP).
