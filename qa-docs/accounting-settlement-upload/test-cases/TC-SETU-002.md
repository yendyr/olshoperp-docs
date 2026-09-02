---
doc_type: e2e-test-case
tc_code: TC-SETU-002
menu: accounting-settlement-upload
menu_name: "Instant Settlement"
test_type: negative
title: "Approve ditolak jika Sales Invoice dalam 1 batch memiliki tanggal kalender berbeda"
summary: "Memastikan proses Approve pada Instant Settlement menolak pembentukan AR apabila Sales Invoice di dalam batch memuat tanggal kalender yang berbeda."
status: draft
owner: QA - Yemima
last_updated: 2026-09-01
requirement_ref: "qa-docs/accounting-settlement-upload/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu Instant Settlement"
  - "Company aktif: FAT (ID: 112)"
  - "Store target memiliki konfigurasi Cash/Bank Receiving yang aktif"
test_data:
  - field: sales_invoices
    value: "SI-1 (01-09-2026 09:00:00), SI-2 (02-09-2026 10:00:00)"
steps:
  - "1. Buka menu Finance Accounting -> Instant Settlement (/accounting/settlement-upload)"
  - "2. Pilih Store target pada filter kanan atas"
  - "3. Upload file settlement yang menghasilkan minimal 2 Sales Invoice dengan tanggal kalender berbeda (misal 01-09-2026 dan 02-09-2026)"
  - "4. Tunggu hingga tahapan upload progress selesai (status: journals approved)"
  - "5. Klik tombol Approve (ikon centang) pada baris batch settlement tersebut"
  - "6. Konfirmasi approval pada modal ApprovalDialog"
  - "7. Amati pesan validasi penolakan dan periksa menu Customer Payment (/accounting/customer-payment)"
expected_result: |
  Proses Approve ditolak oleh sistem dan memunculkan notifikasi/pesan error jelas bahwa tanggal transaksi Sales Invoice dalam batch tidak sama. Tidak ada dokumen Account Receive (AR) yang terbit di menu Customer Payment, dan status transaksi batch settlement tetap belum approved.
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
- Jira Test Case: [ETM-15703](https://erpintegration.atlassian.net/browse/ETM-15703).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtRTPDkyPi1`.
