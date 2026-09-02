---
doc_type: e2e-test-case
tc_code: TC-SETU-003
menu: accounting-settlement-upload
menu_name: "Instant Settlement"
test_type: happy
title: "Approve berhasil jika Sales Invoice memiliki tanggal kalender sama walau jam berbeda"
summary: "Memastikan proses Approve pada Instant Settlement berhasil membuat AR dengan tanggal kalender SI bersama dan jam AR mengikuti jam SI paling akhir dalam batch."
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
  - "Fiscal Period pada tanggal transaksi dalam status Open"
test_data:
  - field: sales_invoices
    value: "SI-1 (01-09-2026 08:30:00), SI-2 (01-09-2026 17:45:00)"
steps:
  - "1. Buka menu Finance Accounting -> Instant Settlement (/accounting/settlement-upload)"
  - "2. Pilih Store target pada filter kanan atas"
  - "3. Upload file settlement dengan minimal 2 Sales Invoice pada tanggal kalender yang sama tetapi jam berbeda (misal 01-09-2026 08:30:00 dan 01-09-2026 17:45:00)"
  - "4. Tunggu hingga tahapan upload progress selesai (status: journals approved)"
  - "5. Klik tombol Approve pada baris batch settlement tersebut"
  - "6. Konfirmasi approval pada modal ApprovalDialog"
  - "7. Pantau progress approve hingga tuntas (status: approved)"
  - "8. Buka menu Customer Payment (/accounting/customer-payment) dan periksa dokumen AR yang terbentuk"
expected_result: |
  Proses Approve berhasil diproses tanpa kendala. Sistem membentuk 1 dokumen Account Receive (AR) pada menu Customer Payment dengan tanggal transaksi 01-09-2026 dan jam transaksi 17:45:00 (mengikuti jam SI paling akhir dalam batch).
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
- Jira Test Case: [ETM-15704](https://erpintegration.atlassian.net/browse/ETM-15704).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtRTPDkyPi1`.
