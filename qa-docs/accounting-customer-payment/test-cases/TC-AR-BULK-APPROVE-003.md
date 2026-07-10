---
doc_type: e2e-test-case
tc_code: TC-AR-BULK-APPROVE-003
menu: accounting-customer-payment
menu_name: "Account Receive"
title: "Bulk approve Draft — status tidak berubah + tombol tidak aktif"
summary: "Centang AR Draft; tombol bulk Approve tidak aktif; status tetap Draft."
status: draft
owner: QA - Cursor
last_updated: 2026-07-10
requirement_ref: "qa-docs/accounting-customer-payment/requirement.md"
automated: true
automated_spec: "tests/specs/account-receive/ar-bulk-approve.spec.ts"
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Dev Staging (id: 13)."
  - "AR Draft sesuai test data tersedia."
test_data:
  - field: "Draft"
    value: "RC-5TNMT9CH, RC-5TNYSCE1"
steps:
  - "Masuk menu Account Receive."
  - "Centang AR Draft sesuai test data."
  - "Verifikasi tombol bulk Approve tidak aktif (UI menyembunyikan jika tidak ada Open terpilih)."
  - "Verifikasi status tetap Draft."
expected_result: |
  Entri tidak berubah status.
  Sistem tidak mengizinkan approve (tombol tidak aktif / pesan status tidak valid).
test_result:
  status: passed
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — AS-IS UI: tanpa Open terpilih, tombol bulk Approve display:none.
    Status Draft tidak berubah. Evidence: test-results/account-receive-bulk-approve/tc3-*.png
  report_url: null
test_data_used:
  - field: "Company"
    value: "DEV-STG (id: 13)"
  - field: "Automation tag"
    value: "@TC-AR-BULK-APPROVE-003"
  - field: "Evidence"
    value: "test-results/account-receive-bulk-approve/tc3-*.png"
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: "Expected TC menyebut error notifikasi; AS-IS mencegah aksi dengan hide tombol — dicatat sebagai perilaku UI"
---
