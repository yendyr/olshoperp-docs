---
doc_type: e2e-test-case
tc_code: TC-CBR-002
menu: accounting-cash-bank-reconcile
menu_name: "Cash/Bank Reconcile"
title: "IMPORT — 1 baris Received bank statement (warm-up W4)"
summary: "Buka BR Open; tab Bank Statement; upload template Received exact amount+date; assert baris muncul (tanpa assert auto-match)."
status: executed
owner: QA - Cursor
last_updated: 2026-07-23
requirement_ref: "qa-docs/accounting-cash-bank-reconcile/knowledge-base.md"
card_ref: "ETM-15298-warmup"
automated: true
automated_spec: "tests/specs/cash-bank-reconcile/cash-bank-reconcile-import-statement.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - journal
  - accounting-customer-payment
preconditions:
  - "BR-6A617F12 status Open, Cash/Bank Bank BCA 001, Period mencakup 23-07-2026 (TC-CBR-001 / W3)."
  - "File fixture tests/fixtures/cbr/bank-statement-ar-received-16000.xlsx."
test_data:
  - reconcile_code: "BR-6A617F12"
  - transaction_date: "23/07/2026"
  - received: 16000
  - spent: ""
  - description: "automation playwright Terima transfer AR"
steps:
  - "Datalist → buka edit BR-6A617F12."
  - "Expand Bank Statement."
  - "Upload file import (TransactionDate 23/07/2026, Received 16000)."
  - "Assert baris muncul di tabel Bank Statement (date + amount)."
expected_result: |
  Minimal 1 baris Bank Statement dengan tanggal 23-07-2026 dan Debit/Received 16.000.
  (Auto-match Reconciled tidak wajib di warm-up W4.)
test_result:
  status: pass
  started_at: "2026-07-23"
  finished_at: "2026-07-23"
  executed_by: "Cursor Auto"
  environment: staging
  log_summary: "BR-6A617F12 import Received 16000 tgl 23/07/2026 — baris Bank Statement OK (API upload)"
  report_url: null
---

# TC-CBR-002

## Catatan

- Warm-up W4 sebelum suite TC-CBRAM (auto-match diuji di TC-CBRAM-01+).
- Template kolom: TransactionDate, Received, Spent, Description — tepat satu dari Received/Spent.
- UI download template `.xlsx` (GAP-CBR-11 vs repo `.csv`); fixture automation memakai `.xlsx`.
- Assert wajib scope `#BankStatement` saja — Internal Transaction juga punya nominal 16.000.
- Upload: API `…/general-ledger-bank-statement/upload` (UI file input butuh klik panel Import dulu).
