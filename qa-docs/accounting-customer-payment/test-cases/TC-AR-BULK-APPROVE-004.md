---
doc_type: e2e-test-case
tc_code: TC-AR-BULK-APPROVE-004
menu: accounting-customer-payment
menu_name: "Account Receive"
title: "Tombol bulk Approve inactive tanpa seleksi, active setelah pilih Open"
summary: "Verifikasi tombol Approve (ikon centang di atas tabel) tidak aktif tanpa seleksi, dan aktif setelah minimal satu AR Open dipilih."
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
  - "Sudah masuk menu Account Receive."
  - "Minimal satu AR berstatus Open tersedia untuk uji seleksi."
test_data:
  - field: "Seed Open (contoh)"
    value: "RC-5T6FVV0H (fallback ke Open lain jika TC-1 sudah Approved)"
steps:
  - "Buka datalist Account Receive tanpa seleksi baris."
  - "Verifikasi tombol bulk Approve tidak aktif (hidden/disabled)."
  - "Centang minimal satu AR berstatus Open."
  - "Verifikasi tombol bulk Approve aktif (visible + enabled)."
expected_result: |
  Tanpa seleksi: tombol Approve tidak aktif.
  Setelah pilih minimal satu Open: tombol Approve aktif.
test_result:
  status: passed
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS — inactive tanpa seleksi; active setelah pilih Open. Screenshot di test-results/account-receive-bulk-approve/."
  report_url: null
test_data_used:
  - field: "Company"
    value: "DEV-STG (id: 13)"
  - field: "Automation tag"
    value: "@TC-AR-BULK-APPROVE-004"
  - field: "Evidence"
    value: "test-results/account-receive-bulk-approve/step1-approve-*.png"
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: "UI AS-IS: tombol disembunyikan (display:none) jika selectedRowsIdsOpen kosong — bukan hanya disabled attribute"
---
