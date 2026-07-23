---
doc_type: e2e-test-case
tc_code: TC-CBRAM-03
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Skip-on-tie — dua kandidat GL AP/AR nominal & tanggal sama"
summary: "Jika >1 kandidat GL eligible dengan amount+date sama, bank statement tidak auto-match"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-03 — testcase-auto-match-cbr-ap-ar.md"
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
  - Ada 2 transaksi Customer Payment berbeda, tanggal dan nominal identik
  - Kedua journal Approved, reference Payment from Customer
  - Header CBR Open untuk COA 11001
test_data:
  - field: Journal 1
    value: "JRN-AR-0002 | 04-07-2026 | Payment from Customer | COA 11001 Debit 500.000"
  - field: Journal 2
    value: "JRN-AR-0003 | 04-07-2026 | Payment from Customer | COA 11001 Debit 500.000"
  - field: Import Bank Statement
    value: "TransactionDate = 04/07/2026, Received = 500000"
steps:
  - Import bank statement dengan data di atas
  - Cek status baris bank statement 500.000 tanggal 04/07/2026
  - Cek kedua baris GL JRN-AR-0002 dan JRN-AR-0003
expected_result: |
  - Baris bank statement tidak auto-match (tetap Not Reconciled)
  - Kedua baris GL tetap Not Reconciled, muncul sebagai suggestion manual (bukan auto-match)
  - Muncul indikator See {number} other matching transactions
  - User harus pilih manual salah satu via modal Matching with Bank Statement
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

Skip-on-tie adalah aturan MVP inti — jangan auto-pick jika ambigu.
