---
doc_type: e2e-test-case
tc_code: TC-CBRAM-02
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Happy path — auto-match Account Payable (Supplier Payment)"
summary: "Import bank statement Spent exact amount+date → auto Reconciled ke baris GL COA cash/bank Credit dari Payment to Supplier"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-02 — testcase-auto-match-cbr-ap-ar.md"
priority: High
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-supplier-payment
  - journal
preconditions:
  - Master Cash/Bank COA 11001 aktif
  - Fiscal period Juli 2026 Open
  - Supplier Payment (AP) sudah dibuat & journal Approved
  - Header CBR status Open
test_data:
  - field: Journal Trx Code
    value: JRN-AP-0001
  - field: Journal Date
    value: 03-07-2026
  - field: transaction_reference_text
    value: Payment to Supplier
  - field: Detail journal 1
    value: "COA 11001 (Cash/Bank) — Credit 250.000"
  - field: Detail journal 2
    value: "COA 20011 (Hutang PI-010) — Debit 250.000"
  - field: File Import Bank Statement
    value: "TransactionDate = 03/07/2026, Received = kosong, Spent = 250000, Description = Bayar supplier"
steps:
  - Buka header Cash & Bank Reconcile status Open untuk COA 11001
  - Buka tab Bank Statement, Import file dengan data Spent di atas
  - Cek status baris bank statement 250.000 tanggal 03/07/2026
  - Cek pairing baris GL JRN-AP-0001 COA 11001 (Credit)
expected_result: |
  - Baris bank statement 250.000 (Spent) tanggal 03/07/2026 otomatis Reconciled
  - Baris GL COA 11001 (Credit) dari JRN-AP-0001 yang ter-pairing
  - Side matching benar: Received ↔ Debit, Spent ↔ Credit
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

Happy path AP — mirror TC AR dengan sisi Spent/Credit.
