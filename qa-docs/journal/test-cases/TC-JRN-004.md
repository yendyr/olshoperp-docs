---
doc_type: e2e-test-case
tc_code: TC-JRN-004
menu: journal
menu_name: "Journal"
title: "VERIFY — Auto journal dari Account Receive (Payment from Customer)"
summary: "Warm-up W2 CBR: dari AR Approved, buka journal linked; assert Approved, TYPE Payment from Customer, Transaction Reference = RC, ledger COA Bank BCA."
status: executed
owner: QA - Cursor
last_updated: 2026-07-23
requirement_ref: "qa-docs/journal/knowledge-base.md"
card_ref: "ETM-15298-warmup"
automated: true
automated_spec: "tests/specs/journal/journal-verify-ar-auto.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-customer-payment
  - accounting-cash-bank-reconcile
preconditions:
  - "AR RC-5TWBHOUX Approved di lumicharmsid (TC-ARCP-005 / W1)."
  - "Auto-journal terbentuk saat approve AR (kolom Journal di datalist AR terisi)."
test_data:
  - receive_code: "RC-5TWBHOUX"
  - type: "Payment from Customer"
  - ledger_hint: "Bank BCA"
steps:
  - "Account Receive datalist → search RC-5TWBHOUX → baca kode journal linked."
  - "Journal datalist → search kode → assert Approved + TYPE Payment from Customer."
  - "Buka edit journal → Transaction Reference = RC-5TWBHOUX."
  - "Ledger Detail → ada baris Bank BCA (cash/bank COA)."
expected_result: |
  Journal auto dari AR Approved; eligible seed CBR (ref Payment from Customer + COA cash/bank).
test_result:
  status: pass
  started_at: "2026-07-23"
  finished_at: "2026-07-23"
  executed_by: "Cursor Auto"
  environment: staging
  log_summary: "RC-5TWBHOUX → GL-5TWBI5XV Approved; TYPE Payment from Customer; ref RC; ledger Bank BCA"
  report_url: null
---

# TC-JRN-004

## Catatan

- Warm-up W2 sebelum CBR create/import (W3/W4) dan TC-CBRAM.
- CBR auto-match hanya journal dengan `transaction_reference_text` = Payment from Customer / Payment to Supplier + status Approved.
- Kolom TYPE di datalist sering truncate (`Payment from Custome...`) — assert pakai prefix.
- Kode journal di lumicharmsid berpola `GL-…` (bukan `JRN-…`).
