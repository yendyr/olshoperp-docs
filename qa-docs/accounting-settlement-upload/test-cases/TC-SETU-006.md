---
doc_type: e2e-test-case
tc_code: TC-SETU-006
menu: accounting-settlement-upload
menu_name: "Instant Settlement"
test_type: cross-menu
title: "Bulk Approve kombinasi batch settlement valid dan invalid tanggal SI"
summary: "Memastikan aksi Bulk Approve memproses batch yang valid (tanggal SI sama) dan memblokir/melaporkan error pada batch yang invalid (tanggal SI campur)."
status: draft
owner: QA - Yemima
last_updated: 2026-09-01
requirement_ref: "qa-docs/accounting-settlement-upload/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-customer-payment
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu Instant Settlement"
  - "Company aktif: FAT (ID: 112)"
  - "Terdapat 2 batch settlement siap approve (Batch-1: SI tanggal sama, Batch-2: SI beda tanggal)"
test_data: []
steps:
  - "1. Buka menu Finance Accounting -> Instant Settlement (/accounting/settlement-upload)"
  - "2. Centang checkbox pada Batch-1 (valid) dan Batch-2 (invalid)"
  - "3. Klik tombol Bulk Approve pada toolbar tabel"
  - "4. Amati hasil eksekusi kedua batch dan periksa notifikasi error log per batch"
expected_result: |
  Batch-1 berhasil di-approve dan menghasilkan dokumen AR yang valid di Customer Payment. Batch-2 gagal di-approve dengan pesan error spesifik pada log error slideover yang menjelaskan bahwa batch memiliki tanggal SI berbeda.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15701
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
first_execution:
  at: null
  via: null
  jira: null
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15701** ([Instant Settlement - Tambahkan validasi approval instant settlement transaksi tanggal SI harus sama semua](https://erpintegration.atlassian.net/browse/ETM-15701)).
- Jira Test Case: [ETM-15707](https://erpintegration.atlassian.net/browse/ETM-15707).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtRTPDkyPi1`.
