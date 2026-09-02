---
doc_type: e2e-test-case
tc_code: TC-SETU-004
menu: accounting-settlement-upload
menu_name: "Instant Settlement"
test_type: happy
title: "Approve batch dengan 1 Sales Invoice (Single Invoice)"
summary: "Memastikan proses Approve pada Instant Settlement yang hanya memiliki 1 baris Sales Invoice berhasil membentuk AR dengan tanggal dan jam yang identik."
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
  - "Store target memiliki konfigurasi Cash/Bank Receiving yang aktif"
test_data:
  - field: sales_invoices
    value: "SI-Single (01-09-2026 14:15:20)"
steps:
  - "1. Buka menu Finance Accounting -> Instant Settlement (/accounting/settlement-upload)"
  - "2. Upload file settlement yang hanya memuat 1 transaksi Sales Invoice (misal tanggal 01-09-2026 14:15:20)"
  - "3. Tunggu hingga tahapan upload progress selesai (status: journals approved)"
  - "4. Klik tombol Approve pada baris batch settlement tersebut"
  - "5. Konfirmasi approval pada modal ApprovalDialog"
  - "6. Buka menu Customer Payment (/accounting/customer-payment) dan periksa dokumen AR yang terbentuk"
expected_result: |
  Proses Approve berhasil diproses. Sistem membentuk 1 dokumen Account Receive (AR) dengan tanggal dan jam transaksi persis sama dengan tanggal & jam SI tersebut (01-09-2026 14:15:20).
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
- Jira Test Case: [ETM-15705](https://erpintegration.atlassian.net/browse/ETM-15705).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtRTPDkyPi1`.
