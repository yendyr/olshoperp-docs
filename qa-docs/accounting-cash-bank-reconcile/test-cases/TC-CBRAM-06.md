---
doc_type: e2e-test-case
tc_code: TC-CBRAM-06
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Tanggal journal berbeda dengan bank statement — tidak auto-match (out of scope MVP)"
summary: "MVP hanya same-day; beda 1 hari tidak auto-match meski amount exact"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-06 — testcase-auto-match-cbr-ap-ar.md"
priority: Medium
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
preconditions:
  - Customer Payment dengan tanggal journal berbeda 1 hari dari bank statement
  - Nominal exact sama
  - Header CBR Open
test_data:
  - field: Journal Trx Code
    value: JRN-AR-0007
  - field: Journal Date
    value: 06-07-2026
  - field: Reference
    value: Payment from Customer
  - field: COA 11001 (Debit)
    value: "400.000"
  - field: Import Bank Statement
    value: "TransactionDate = 07/07/2026 (beda 1 hari), Received = 400000"
steps:
  - Import bank statement tanggal 07/07/2026 amount 400000
  - Cek status baris bank statement dan GL JRN-AR-0007 (tgl 06-07-2026)
expected_result: |
  - Tidak auto-match karena tanggal journal dan bank statement berbeda (MVP hanya same-day)
  - Muncul sebagai suggestion manual (priority kedua: amount sama, tanggal beda) mengikuti mekanisme existing
  - Date-flexible auto-match adalah follow-up terpisah, di luar scope ETM-15298 MVP
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

TC negatif untuk memastikan scope MVP tidak melebar ke date-flexible.
