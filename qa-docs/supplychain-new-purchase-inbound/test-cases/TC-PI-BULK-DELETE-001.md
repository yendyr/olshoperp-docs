---
doc_type: e2e-test-case
tc_code: TC-PI-BULK-DELETE-001
menu: supplychain-new-purchase-inbound
menu_name: "Purchase Inbound"
title: "Bulk delete dokumen inbound IN-6A506737 / IN-6A506584 / IN-6A506544"
summary: "Checklist tiga Purchase Inbound di datalist DEV-STG, klik Bulk Delete di samping Bulk Approve, verifikasi hilang dari datalist aktif dan masih bisa tampil saat Show deleted data ON."
status: draft
owner: QA - Cursor
last_updated: 2026-07-10
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: true
automated_spec: "tests/specs/purchase-inbound/pi-bulk-delete.spec.ts"
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: Dev Staging (id: 13)."
  - "Trx IN-6A506737, IN-6A506584, IN-6A506544 ada di datalist (atau sudah soft-deleted untuk re-run idempotent)."
test_data:
  - field: "Transaction Code"
    value: "IN-6A506737"
  - field: "Transaction Code"
    value: "IN-6A506584"
  - field: "Transaction Code"
    value: "IN-6A506544"
steps:
  - "Buka menu Purchase Inbound (company Dev Staging)."
  - "Pastikan Show deleted data OFF."
  - "Filter/search prefix bersama agar ketiga trx terlihat, lalu checklist baris sesuai test data."
  - "Klik tombol Bulk Delete (di atas table, samping Bulk Approve)."
  - "Pada modal konfirmasi, klik Delete."
  - "Verifikasi ketiga trx tidak tampil di datalist aktif."
  - "Aktifkan Show deleted data; verifikasi minimal satu trx masih bisa tampil."
expected_result: |
  Purchase Inbound berhasil dihapus (soft-delete).
  Trx tidak tampil di datalist tanpa Show deleted data.
  Dengan Show deleted data aktif, trx masih mungkin tampil di datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS — bulk delete 3 PI di DEV-STG; hilang dari datalist aktif;
    Show deleted data ON menampilkan soft-deleted rows.
  report_url: null
test_data_used:
  - field: "Runner email"
    value: "playwright@gmail.com"
  - field: "Company"
    value: "DEV-STG (id: 13)"
  - field: "Automation tag"
    value: "@TC-PI-BULK-DELETE-001"
  - field: "Run command"
    value: "npx playwright test tests/specs/purchase-inbound/pi-bulk-delete.spec.ts -g @TC-PI-BULK-DELETE-001 --retries=0"
run_history:
  - at: "2026-07-10"
    status: passed
    environment: staging
    note: "Bulk delete + assert not in datalist + Show deleted data OK (~4m)"
---
