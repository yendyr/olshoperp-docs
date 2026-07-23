---
doc_type: e2e-test-case
tc_code: TC-APAY-001
menu: accounting-supplier-payment
menu_name: "Account Payment"
title: "CREATE — Payment Unbilled Goods + Bank BCA 001 + PI-6960CB30"
summary: "Create Account Payment; supplier PT Unbilled Goods; Use Bank BCA 001; Outstanding PI PI-6960CB30 Use."
status: automated
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-supplier-payment/knowledge-base.md"
automated: true
automated_spec: "tests/specs/account-payment/account-payment-unbilled-bca-pi.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-supplier-invoice
preconditions:
  - "Supplier PT. Unbilled Goods tersedia."
  - "Cash/Bank Label Bank BCA 001 tersedia."
  - "PI-6960CB30 outstanding untuk supplier tersebut (Approved)."
  - "Available balance Bank BCA 001 > 0 (draft lama yang reserve fund perlu dihapus dulu)."
test_data:
  - supplier: "pt unbilled goods"
  - cash_bank_label: "Bank BCA 001"
  - pi_code: "PI-6960CB30"
  - description: "automation playwright"
steps:
  - "Create Account Payment → land edit."
  - "Pilih supplier PT Unbilled Goods."
  - "Select Cash/Bank → ceklis Bank BCA 001 → Use."
  - "Klik Outstanding Purchase Invoice → ceklis PI-6960CB30 → Use."
  - "Radio Open → Approve dari form detail."
expected_result: |
  Payment source Bank BCA 001 terpasang; detail PI-6960CB30 ter-use; status Approved.
test_result:
  status: pass
  started_at: "2026-07-20T08:21:00Z"
  finished_at: "2026-07-20T08:22:00Z"
  executed_by: "Cursor Agent"
  environment: staging
  log_summary: "PASS — PY-5TVBFUBZ; Unbilled Goods + Bank BCA 001 + PI-6960CB30; Open → Approve form; amount source disamakan dengan paid amount PI (4.000,00)."
  report_url: null
---

# TC-APAY-001

## Catatan automation

- Spec: `@TC-APAY-001` → `tests/specs/account-payment/account-payment-unbilled-bca-pi.spec.ts`
- Helper: `tests/helpers/account-payment.ts`
- Company: lumicharmsid (153)
- AS-IS: bulk Use Cash/Bank mengambil **full available − reserved**; draft lama bisa bikin `Insufficient balance`. Spec menghapus draft automation via API dulu, lalu set amount source ≈ 4000 setelah Use.
