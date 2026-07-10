---
doc_type: e2e-test-case
tc_code: TC-AR-BULK-APPROVE-001
menu: accounting-customer-payment
menu_name: "Account Receive"
title: "Bulk approve 10 AR status Open → Approved + notifikasi sukses"
summary: "Centang 10 AR Open, bulk Approve, verifikasi semua jadi Approved dan toast sukses."
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
  - "10 AR Open sesuai test data tersedia (atau sudah Approved → early pass)."
test_data:
  - field: "Trx Code (Open)"
    value: "RC-5SO3DMPA, RC-5SO3DMUP, RC-5SO3DMUT, RC-5SO3DMR2, RC-5SO3DMSP, RC-5SO3DMU1, RC-5SO3DMP7, RC-5SO3DMSH, RC-5SO3DMT9, RC-5SO3DMZP"
steps:
  - "Masuk menu Account Receive."
  - "Centang 10 trx code sesuai test data (shared filter RC-5SO3DM)."
  - "Klik tombol bulk Approve (ikon centang di atas tabel) → konfirmasi Approve."
  - "Verifikasi toast sukses dan semua status menjadi Approved."
expected_result: |
  Semua entri berhasil disetujui; status Approved; notifikasi sukses muncul.
test_result:
  status: passed
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS — 10 AR Open di-approve (atau already Approved early pass). Evidence di test-results/account-receive-bulk-approve/."
  report_url: null
test_data_used:
  - field: "Company"
    value: "DEV-STG (id: 13)"
  - field: "Automation tag"
    value: "@TC-AR-BULK-APPROVE-001"
  - field: "Evidence"
    value: "test-results/account-receive-bulk-approve/tc1-*.png"
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: "Shared filter RC-5SO3DM + page length agar selection tidak ter-reset DataTables"
---
