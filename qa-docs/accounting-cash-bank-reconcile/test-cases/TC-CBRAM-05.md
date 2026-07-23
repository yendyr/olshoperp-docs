---
doc_type: e2e-test-case
tc_code: TC-CBRAM-05
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Amount tidak exact (selisih sedikit) tidak auto-match"
summary: "Auto-match MVP wajib exact amount; selisih kecil tidak boleh auto-match"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-05 — testcase-auto-match-cbr-ap-ar.md"
priority: Medium
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
preconditions:
  - Customer Payment dengan COA 11001 Approved
  - Nominal journal berbeda tipis dari bank statement
  - Header CBR Open
test_data:
  - field: Journal Trx Code
    value: JRN-AR-0006
  - field: Journal Date
    value: 06-07-2026
  - field: Reference
    value: Payment from Customer
  - field: COA 11001 (Debit)
    value: "300.000"
  - field: Import Bank Statement
    value: "TransactionDate = 06/07/2026, Received = 299500 (selisih 500)"
steps:
  - Import bank statement dengan Received 299500
  - Cek status baris bank statement vs GL JRN-AR-0006
expected_result: |
  - Tidak auto-match (amount harus exact; tidak pakai threshold 5% untuk fitur ini)
  - Baris tetap muncul sebagai suggestion biasa (threshold-based) di tab Reconcile Process untuk Match manual bila dianggap cocok
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

Bedakan auto-match (exact) vs suggestion existing (threshold).
