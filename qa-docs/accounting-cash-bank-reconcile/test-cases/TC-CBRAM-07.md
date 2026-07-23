---
doc_type: e2e-test-case
tc_code: TC-CBRAM-07
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Side tidak sesuai — Received vs posisi Credit di jurnal"
summary: "Received hanya boleh auto-match ke Debit; Credit tidak eligible untuk Received"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-07 — testcase-auto-match-cbr-ap-ar.md"
priority: Medium
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
preconditions:
  - Customer Payment dengan baris COA cash/bank di posisi Credit (anomali / skenario negatif)
  - Header CBR Open
test_data:
  - field: Journal Trx Code
    value: JRN-AR-0008
  - field: Journal Date
    value: 08-07-2026
  - field: Reference
    value: Payment from Customer
  - field: COA 11001
    value: "Credit 200.000 (bukan Debit)"
  - field: Import Bank Statement
    value: "TransactionDate = 08/07/2026, Received = 200000"
steps:
  - Import bank statement Received 200000
  - Cek apakah terjadi auto-match ke JRN-AR-0008
expected_result: |
  - Tidak auto-match karena side tidak sesuai (Received harus match Debit, bukan Credit)
  - Baris tetap Not Reconciled; tidak error, hanya tidak ter-auto-match
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

Validasi side: Received ↔ Debit, Spent ↔ Credit.
