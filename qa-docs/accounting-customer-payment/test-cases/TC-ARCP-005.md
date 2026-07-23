---
doc_type: e2e-test-case
tc_code: TC-ARCP-005
menu: accounting-customer-payment
menu_name: "Account Receive"
title: "CREATE — PT. Customer Lumi 001 + Available SI Use + Bank BCA 001 + Approve"
summary: "Warm-up W1 CBR: Create AR; customer PT. Customer Lumi 001; Available SI bulk Use; Receiving Destination Bank BCA 001; Open; Approve; search datalist."
status: executed
owner: QA - Cursor
last_updated: 2026-07-23
requirement_ref: "qa-docs/accounting-customer-payment/knowledge-base.md"
card_ref: "ETM-15298-warmup"
automated: true
automated_spec: "tests/specs/account-receive/account-receive-china-si-bca.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-customer-invoice
  - accounting-company-detail-bank
  - journal
preconditions:
  - "Customer PT. Customer Lumi 001 tersedia di select2 Account Receive."
  - "Minimal 1 Sales Invoice outstanding untuk customer tersebut."
  - "Cash/Bank Bank BCA 001 aktif dengan saldo cukup."
  - "Fiscal period tanggal transaksi Open."
test_data:
  - customer: "PT. Customer Lumi 001"
  - cash_bank: "Bank BCA 001"
  - description: "automation playwright"
steps:
  - "Create Account Receive → land edit (auto-create)."
  - "Pilih customer PT. Customer Lumi 001 → isi description → Save All."
  - "Klik Available Sales Invoice → ceklis SI outstanding → Use."
  - "Receiving Destination → Select Cash/Bank Bank BCA 001 → Use."
  - "Samakan amount destination dengan paid amount detail SI."
  - "Set Open → Approve → search kode di datalist."
expected_result: |
  AR Approved; detail berisi SI; Receiving Destination Bank BCA 001; muncul di datalist status Approved.
test_result:
  status: pass
  started_at: "2026-07-23"
  finished_at: "2026-07-23"
  executed_by: "Cursor Auto"
  environment: staging
  log_summary: "RC-5TWBHOUX Approved; customer PT. Customer Lumi 001; SI-5TO0EERH; Bank BCA 001 synced via /primevue fund API"
  report_url: null
---

# TC-ARCP-005

## Catatan

- Warm-up sebelum suite TC-CBRAM (auto-match CBR AP/AR).
- Di lumicharmsid, **Supplier China tidak muncul** di `select2-customer` Account Receive (filter customer berbeda dari Sales Invoice). Pakai **PT. Customer Lumi 001**.
- Bulk Use SI = full outstanding (`customer-payment-detail-bulk`).
- Sebelum Approve: total Receiving Destination harus = total Detail (sama seperti Account Payment).
- SI Use sering auto-insert fund default (Bank BCA Lumi Charms). Sync harus hapus fund non–BCA 001 lalu set `fund_amount` = paid SI. List fund lewat `…/customer-payment-detail-fund/primevue`.
