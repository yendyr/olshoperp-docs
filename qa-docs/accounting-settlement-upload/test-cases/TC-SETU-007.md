---
doc_type: e2e-test-case
tc_code: TC-SETU-007
menu: accounting-settlement-upload
menu_name: "Instant Settlement"
test_type: cross-menu
title: "Urutan guard validasi Approval terhadap Fiscal Period Closed dan Cash/Bank Reconcile Lock"
summary: "Memastikan proses validasi Approval pada Instant Settlement menjalankan guard tanggal SI sama terlebih dahulu sebelum memvalidasi Fiscal Period dan Cash/Bank Reconcile Lock."
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
  - accounting-fiscal-period
  - accounting-cash-bank-reconcile
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu Instant Settlement"
  - "Company aktif: FAT (ID: 112)"
  - "Terdapat batch settlement dengan SI pada tanggal kalender sama (misal 01-08-2026)"
  - "Fiscal Period untuk bulan Agustus 2026 dalam status Closed atau akun Cash/Bank ter-lock rekonsiliasi CBR pada tanggal tersebut"
test_data: []
steps:
  - "1. Buka menu Finance Accounting -> Instant Settlement (/accounting/settlement-upload)"
  - "2. Pastikan batch settlement memuat SI dengan tanggal kalender yang sama (misal 01-08-2026)"
  - "3. Klik tombol Approve pada baris batch settlement"
  - "4. Konfirmasi pada modal ApprovalDialog"
  - "5. Amati pesan validasi penolakan sistem"
expected_result: |
  Guard tanggal SI lolos (karena tanggal SI sama). Sistem kemudian melanjutkan ke pengecekan periode fiskal / CBR lock dan membatalkan Approve dengan pesan error fiskal / CBR lock yang sesuai (memastikan urutan guard validasi integritas akuntansi berjalan benar).
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
- Jira Test Case: [ETM-15708](https://erpintegration.atlassian.net/browse/ETM-15708).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtRTPDkyPi1`.
