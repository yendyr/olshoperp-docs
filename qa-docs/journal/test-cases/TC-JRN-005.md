---
doc_type: e2e-test-case
tc_code: TC-JRN-005
menu: journal
menu_name: "Journal"
test_type: cross-menu
title: "VERIFY — Auto journal dari Account Payment (Payment to Supplier)"
summary: "Dari Account Payment Approved, buka journal linked; assert Approved, TYPE Payment to Supplier, Transaction Reference = kode payment, ledger Dr AP / Cr cash-bank COA."
status: draft
owner: QA - Yemima
last_updated: 2026-08-24
requirement_ref: "qa-docs/journal/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-supplier-payment
preconditions:
  - "Account Payment Approved tersedia (mis. hasil TC-APAY-002) dengan alokasi PI."
  - "Auto-journal terbentuk saat approve payment (AP requirement: journal on approve — Dr AP, Cr Cash/Bank)."
test_data:
  - payment_code: "{kode Account Payment Approved — parameterizable, jangan hardcode}"
  - type: "Payment to Supplier"
steps:
  - "Account Payment datalist → search payment_code → baca kode journal linked."
  - "Journal datalist → search kode journal → assert status Approved + TYPE Payment to Supplier (assert pakai prefix — kolom TYPE sering truncate)."
  - "Buka edit/show journal → Transaction Reference = payment_code."
  - "Ledger Detail → ada baris debit COA AP dan baris credit cash/bank COA sesuai bank yang dipakai payment."
expected_result: |
  Journal auto tercipta dari Account Payment Approved: status Approved, TYPE
  Payment to Supplier (journal requirement §6.2 mapping Account Payment →
  Payment to Supplier), reference = kode payment, ledger Dr AP / Cr Cash-Bank
  (AP requirement § journal on approve).
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
---

# TC-JRN-005

## Catatan

- Mirror sisi AP dari TC-JRN-004 (yang meng-cover sisi AR / Payment from Customer).
- Dibutuhkan flow `TC-FLOW-SCM-AP-001` (Pilot 2) sebagai side-effect assertion
  phase terakhir.
- Kode journal di lumicharmsid berpola `GL-…` (bukan `JRN-…`).
- Test data diparameterisasi: di flow, `payment_code` datang dari phase payment
  (consumes), bukan dokumen statis.
