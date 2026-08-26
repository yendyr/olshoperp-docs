---
doc_type: e2e-test-case
tc_code: TC-PI-011
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: negative
title: "Select Product — qty 0 → Save All"
summary: "Menambahkan SKU baru dengan kuantitas 0 via modal Select Product lalu menyimpan."
status: draft
owner: QA - Cursor
last_updated: 2026-08-24
requirement_ref: "qa-docs/supplychain-new-purchase-inbound/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: DEV-STG (id: 13)."
  - "Purchase Inbound Draft/Open terikat PO outstanding."
  - "URL edit inbound tersedia."
test_data:
  - field: "SKU"
    value: "(dari PO outstanding)"
  - field: "Qty"
    value: 0
steps:
  - "Buka edit Purchase Inbound Draft/Open."
  - "Klik tombol Select Product (atau Select Multiple Products) pada section detail."
  - "Pilih SKU outstanding, lalu isi kuantitas persiapan = 0."
  - "Klik tombol Save All di toolbar/grid."
  - "Amati notifikasi dan apakah baris detail tersimpan."
  - "Refresh halaman browser dan periksa kembali kuantitas item."
expected_result: |
  Kuantitas 0 tidak valid untuk item inbound. Sistem harus menolak penambahan item dengan kuantitas 0, memunculkan validation error, dan mencegah penyimpanan.
  Kuantitas tidak boleh tersimpan/ter-update menjadi 0 setelah refresh.
test_result:
  status: passed
  started_at: "2026-08-24T12:20:00+07:00"
  finished_at: "2026-08-24T12:24:31+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — Ditolak sistem dengan error notification: 'Input Quantity must be greater than 0. Max allowed: 994 Pieces.'"
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-20"
    status: failed
    environment: staging
    note: "FAIL — Notif success: 'The data has been success updated'. Setelah refresh qty kembali 1."
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS — Ditolak sistem dengan error notification: 'Input Quantity must be greater than 0. Max allowed: 994 Pieces.'"
origin_jira: ETM-15610
last_execution:
  at: "2026-08-20"
  jira: "ETM-15610"
  status: passed
  via: "legacy:test_result"
---

# TC-PI-DRAFT-20260824113403

## Catatan QA

Kasus regresi untuk pengujian input kuantitas 0 pada saat menambahkan SKU via modal Select Product.
