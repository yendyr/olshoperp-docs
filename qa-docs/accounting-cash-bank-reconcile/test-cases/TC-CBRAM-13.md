---
doc_type: e2e-test-case
tc_code: TC-CBRAM-13
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Multi cash/bank COA dalam 1 payment vs 1 baris bank statement total — tidak auto-match"
summary: "Split fund multi-COA: baris GL partial tidak exact match ke total bank statement"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-13 — testcase-auto-match-cbr-ap-ar.md"
priority: Medium
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
preconditions:
  - Satu Customer Payment memakai 2 COA cash/bank berbeda (split fund) dalam 1 journal
  - Header CBR untuk akun 11001 Open
test_data:
  - field: Journal Trx Code
    value: JRN-AR-0013
  - field: Detail baris 1
    value: "COA 11001 (Bank A) Debit 60.000"
  - field: Detail baris 2
    value: "COA 11002 (Bank B) Debit 40.000"
  - field: Import Bank Statement (CBR akun 11001)
    value: "TransactionDate 06/07/2026, Received 100000 (total gabungan)"
steps:
  - Import bank statement Received 100000 pada CBR akun 11001
  - Cek apakah auto-match ke baris GL COA 11001 (60.000)
expected_result: |
  - Tidak auto-match, karena baris GL COA 11001 hanya 60.000 — tidak exact sama dengan 100.000
  - Baris bank statement tetap Not Reconciled
  - Perlu penanganan manual (bulk match lintas baris jika relevan) — di luar scope auto-match MVP
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

Edge case split payment multi cash/bank.
