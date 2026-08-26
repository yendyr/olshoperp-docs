---
doc_type: e2e-test-case
tc_code: TC-PI-009
menu: supplychain-new-purchase-inbound
menu_name: "BETA - New Purchase Inbound"
test_type: negative
title: "Inline edit qty 1 → 0 → Save All"
summary: "Mengubah kuantitas item inbound secara inline dari 1 menjadi 0 pada grid detail dan menyimpan."
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
  - "Purchase Inbound Draft/Open dengan minimal satu item detail berkuantitas 1."
  - "URL edit inbound tersedia."
test_data:
  - field: "SKU"
    value: "(catat SKU item)"
  - field: "Inbound Qty (new)"
    value: 0
steps:
  - "Buka edit Purchase Inbound Draft/Open yang sudah berisi detail item."
  - "Pada grid detail, ubah kuantitas (Inbound Qty) secara inline dari 1 menjadi 0."
  - "Klik tombol Save All di grid/toolbar."
  - "Amati notifikasi dan perubahan kuantitas di grid."
  - "Refresh halaman browser dan periksa kembali kuantitas item."
expected_result: |
  Kuantitas 0 tidak valid untuk item inbound. Sistem harus menolak kuantitas 0 (validation error) dan tidak mengijinkan data tersimpan.
  Kuantitas tidak boleh berubah menjadi 0 setelah refresh.
test_result:
  status: passed
  started_at: "2026-08-24T12:20:00+07:00"
  finished_at: "2026-08-24T12:24:31+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — Ditolak sistem dengan error notification: 'Input Quantity must be greater than 0. Max allowed: 980 Pieces.'"
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
    note: "PASS — Ditolak sistem dengan error notification: 'Input Quantity must be greater than 0. Max allowed: 980 Pieces.'"
origin_jira: ETM-15610
last_execution:
  at: "2026-08-20"
  jira: ETM-15610
---

# TC-PI-DRAFT-20260824113401

## Catatan QA

Kasus regresi untuk pengujian kuantitas 0 pada inline edit detail grid.
