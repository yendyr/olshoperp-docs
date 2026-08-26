---
doc_type: e2e-test-case
tc_code: TC-PI-010
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: negative
title: "Single Use — Max Inbound Qty = 0"
summary: "Menambahkan SKU baru dengan kuantitas 0 melalui modal Single Use."
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
  - "Masuk ke tab Available Purchase Order, cari SKU outstanding."
  - "Klik tombol aksi Single Use pada baris SKU tersebut."
  - "Di form/modal tambah item (Single Use), isi kuantitas (Qty) = 0."
  - "Klik tombol Save / Submit untuk menyimpan."
  - "Amati notifikasi dan apakah baris detail berhasil dibuat."
  - "Jika berhasil dibuat dengan Qty 0, coba lakukan Approve pada dokumen inbound."
expected_result: |
  Kuantitas 0 tidak valid untuk item inbound. Sistem harus menolak input kuantitas 0 di form Single Use, menampilkan validation error, dan mencegah penambahan item ke detail inbound.
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
    note: "FAIL — Notif success: 'The new data has been successfully created.' (qty 0 lolos create hingga approve)."
  - at: "2026-08-24"
    status: passed
    environment: staging
    note: "PASS — Ditolak sistem dengan error notification: 'Input Quantity must be greater than 0. Max allowed: 994 Pieces.'"
origin_jira: ETM-15610
last_execution:
  at: "2026-08-20"
  jira: ETM-15610
---

# TC-PI-DRAFT-20260824113402

## Catatan QA

Kasus regresi untuk pengujian input kuantitas 0 pada form/modal Single Use.
