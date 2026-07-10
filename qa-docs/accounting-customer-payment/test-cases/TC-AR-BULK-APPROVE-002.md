---
doc_type: e2e-test-case
tc_code: TC-AR-BULK-APPROVE-002
menu: accounting-customer-payment
menu_name: "Account Receive"
title: "Bulk approve mix Open + Approved → partial success + error detail"
summary: "Bulk approve kombinasi 5 Open + 3 Approved; hanya Open yang berubah; sistem tampilkan feedback partial (error_count / dialog)."
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
  - "5 AR Open dan 3 AR Approved sesuai test data tersedia."
test_data:
  - field: "Open"
    value: "RC-5T6FVV0H, RC-5T76JS8G, RC-5T767TVN, RC-5T8KSC15, RC-5TBVFJ4K"
  - field: "Approved"
    value: "RC-5T4LUJDD, RC-5T6CRQVZ, RC-5T45TBYJ"
steps:
  - "Masuk menu Account Receive."
  - "Siapkan seleksi 5 Open + 3 Approved (via ID rewrite karena prefix kode berbeda)."
  - "Klik bulk Approve → konfirmasi."
  - "Verifikasi feedback partial (error_count > 0 / dialog / toast) dan status Open yang sukses jadi Approved; Approved tetap Approved."
expected_result: |
  Hanya entri Open yang berubah status (yang lolos validasi).
  Sistem memberi notifikasi/dialog yang menjelaskan sukses vs gagal (mis. sudah Approved).
test_result:
  status: passed
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — partial success: error_count > 0 untuk baris sudah Approved;
    Open yang valid jadi Approved. Beberapa Open amount 0 bisa ikut gagal (error_details).
    Evidence: test-results/account-receive-bulk-approve/tc2-*.png
  report_url: null
test_data_used:
  - field: "Company"
    value: "DEV-STG (id: 13)"
  - field: "Automation tag"
    value: "@TC-AR-BULK-APPROVE-002"
  - field: "Evidence"
    value: "test-results/account-receive-bulk-approve/tc2-*.png"
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: "Kode beda prefix → UI selection lintas-filter tidak stabil; automation rewrite data_ids sambil tetap klik tombol Approve UI"
---
