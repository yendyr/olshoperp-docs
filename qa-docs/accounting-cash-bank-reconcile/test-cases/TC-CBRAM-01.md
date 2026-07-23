---
doc_type: e2e-test-case
tc_code: TC-CBRAM-01
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "Happy path — auto-match Account Receivable (Customer Payment) multi-invoice"
summary: "Import bank statement Received exact amount+date → auto Reconciled ke baris GL COA cash/bank dari Payment from Customer"
status: draft
owner: QA - Resty
last_updated: 2026-07-21
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/requirement.md"
card_ref: "ETM-15298"
source_scenario: "TC-01 — testcase-auto-match-cbr-ap-ar.md"
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
  - Master Cash/Bank COA 11001 (Bank BCA) aktif
  - Fiscal period Juli 2026 masih Open
  - Customer Payment (AR) sudah dibuat & journal berstatus Approved
  - Header Cash & Bank Reconcile status Open (Draft/Open)
test_data:
  - field: Journal Trx Code
    value: JRN-AR-0001
  - field: Journal Date
    value: 02-07-2026
  - field: transaction_reference_text
    value: Payment from Customer
  - field: Detail journal 1
    value: "COA 11001 (Cash/Bank) — Debit 100.000"
  - field: Detail journal 2
    value: "COA 10011 (Piutang SI-001) — Credit 15.000"
  - field: Detail journal 3
    value: "COA 10012 (Piutang SI-002) — Credit 35.000"
  - field: Detail journal 4
    value: "COA 10013 (Piutang SI-003) — Credit 50.000"
  - field: Cash & Bank Reconcile
    value: "Header BR-000123, Cash/Bank Account = COA 11001, Period 01-07-2026 s/d 05-07-2026, Status Open"
  - field: File Import Bank Statement
    value: "1 baris: TransactionDate = 02/07/2026, Received = 100000, Spent = kosong, Description = Terima transfer"
steps:
  - Buka transaksi Cash & Bank Reconcile BR-000123 (status Open)
  - Buka tab Bank Statement, klik Import, upload file dengan data di atas
  - Cek hasil import dan status baris bank statement
  - Cek tab GL Transaction / Reconcile Process untuk baris JRN-AR-0001 (COA 11001)
expected_result: |
  - Import berhasil; baris bank statement 100.000 tanggal 02/07/2026 langsung berstatus Reconciled tanpa Match manual
  - Baris GL COA 11001 dari JRN-AR-0001 yang ter-pairing (bukan baris piutang 10011/10012/10013)
  - Baris piutang SI-001/SI-002/SI-003 tidak di-match ke bank statement
  - Statement Balance dan Internal Balance di header BR-000123 ter-update sesuai hasil auto-match
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

Happy path AR multi-invoice — pairing hanya ke baris COA cash/bank, bukan ke baris piutang detail.
