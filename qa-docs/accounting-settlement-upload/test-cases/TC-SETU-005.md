---
doc_type: e2e-test-case
tc_code: TC-SETU-005
menu: accounting-settlement-upload
menu_name: "Instant Settlement"
test_type: edge
title: "Validasi penolakan Approve pada boundary jam pergantian hari (23:59 vs 00:01)"
summary: "Memastikan proses Approve pada Instant Settlement menolak batch dengan SI yang berbeda tanggal kalender meskipun selisih jam sangat tipis di batas pergantian hari."
status: review
owner: QA - Yemima
last_updated: 2026-09-03
requirement_ref: "qa-docs/accounting-settlement-upload/requirement.md"
automated: true
automated_spec: tests/specs/accounting/etm-15746-settlement-approval-diff-date.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login ke staging dengan akun yang memiliki hak akses menu Instant Settlement"
  - "Company aktif: FAT (ID: 112)"
test_data:
  - field: sales_invoices
    value: "SI-1 (01-09-2026 23:59:50), SI-2 (02-09-2026 00:01:10)"
steps:
  - "1. Buka menu Finance Accounting -> Instant Settlement (/accounting/settlement-upload)"
  - "2. Upload file settlement yang memuat 2 Sales Invoice dengan selisih waktu sangat dekat tetapi berbeda tanggal kalender (01-09-2026 23:59:50 dan 02-09-2026 00:01:10)"
  - "3. Tunggu hingga progress upload selesai (status: journals approved)"
  - "4. Klik tombol Approve pada baris settlement tersebut"
  - "5. Konfirmasi approval pada modal ApprovalDialog"
  - "6. Amati pesan penolakan validasi dari sistem"
expected_result: |
  Meskipun selisih waktu hanya 2 menit, karena tanggal kalendernya berbeda (01 vs 02), sistem wajib menolak proses Approve dan memunculkan notifikasi error yang menyatakan bahwa tanggal transaksi Sales Invoice tidak sama. Tidak ada AR yang terbentuk.
test_result:
  status: passed
  started_at: "2026-09-03T06:56:40Z"
  finished_at: "2026-09-03T06:56:55Z"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Eksekusi approve settlement dengan SI multi-date (01-09 vs 02-09) ditolak HTTP 422 dengan pesan 'Unable to approve settlement, the transaction date of all invoices must be within a single day.'"
  report_url: null
test_data_used:
  - "Batch Settlement ST-5UBPORWI (Upload ID: 730, Company FAT)"
run_history:
  - run_at: "2026-09-03T13:56:55+07:00"
    status: passed
    jira: ETM-15706
    via: tests/specs/accounting/etm-15746-settlement-approval-diff-date.spec.ts
origin_jira: ETM-15701
last_execution:
  at: "2026-09-03"
  jira: ETM-15706
  status: passed
  via: tests/specs/accounting/etm-15746-settlement-approval-diff-date.spec.ts
first_execution:
  at: "2026-09-03"
  via: tests/specs/accounting/etm-15746-settlement-approval-diff-date.spec.ts
  jira: ETM-15706
---

# Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada card **ETM-15701** ([Instant Settlement - Tambahkan validasi approval instant settlement transaksi tanggal SI harus sama semua](https://erpintegration.atlassian.net/browse/ETM-15701)).
- Jira Test Case: [ETM-15706](https://erpintegration.atlassian.net/browse/ETM-15706).
- Target Testing Company: **FAT (ID: 112)**.
- Request ID: `recvtRTPDkyPi1`.
