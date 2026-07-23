---
doc_type: e2e-test-case
tc_code: TC-CBRAM-08
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "GL yang sudah pernah ter-link tidak boleh double-match"
summary: "Baris GL yang sudah matched tidak boleh auto-match ke bank statement baru dengan nominal sama"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-08 — testcase-auto-match-cbr-ap-ar.md"
priority: High
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
preconditions:
  - Baris GL COA 11001 dari JRN-AR-0009 sudah di-match manual ke bank statement row #A
  - Record accounting_cash_bank_reconciliation_details sudah ada
  - Header CBR Open
test_data:
  - field: Journal Trx Code
    value: JRN-AR-0009
  - field: Journal Date
    value: 09-07-2026
  - field: Reference
    value: Payment from Customer
  - field: COA 11001 (Debit)
    value: "600.000 — sudah matched ke bank statement row #A"
  - field: Import Bank Statement baru (row #B)
    value: "TransactionDate = 09/07/2026, Received = 600000"
steps:
  - Import bank statement baru (row #B) dengan nominal sama persis dengan JRN-AR-0009 yang sudah ter-link
  - Cek status row #B
expected_result: |
  - Row #B tidak auto-match ke JRN-AR-0009 karena journal sudah ter-link ke transaksi lain
  - Row #B tetap Not Reconciled
  - Tidak ada 1 baris GL yang pairing dobel ke 2 baris bank statement berbeda
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

Data integrity — cegah double-link reconciliation detail.
