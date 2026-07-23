---
doc_type: e2e-test-case
tc_code: TC-APAY-002
menu: accounting-supplier-payment
menu_name: "Account Payment"
title: "APPROVE — Form detail Open → Approve"
summary: "Dari form edit payment (sudah ada source + PI), ubah status radio ke Open lalu Approve via modal."
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
  - "Payment Draft dengan supplier, Cash/Bank source, dan PI detail sudah terisi."
test_data:
  - description: "automation playwright"
steps:
  - "Di form edit, pilih radio Open (auto-save status)."
  - "Klik tombol Approve (check-double) di sidebar."
  - "Isi description modal → klik Approve."
expected_result: |
  Payment status Approved; redirect ke datalist; baris menampilkan Approved.
test_result:
  status: pass
  started_at: "2026-07-20T08:21:00Z"
  finished_at: "2026-07-20T08:22:00Z"
  executed_by: "Cursor Agent"
  environment: staging
  log_summary: "PASS — bagian approve dalam TC-APAY-001; PY-5TVBFUBZ Approved via form."
  report_url: null
---

# TC-APAY-002

Bagian approve digabung dalam spec `@TC-APAY-001` (flow end-to-end create → approve).
