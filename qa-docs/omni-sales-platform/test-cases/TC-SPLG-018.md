---
doc_type: e2e-test-case
tc_code: TC-SPLG-018
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Verifikasi Void Murni Tanpa Prefix Platform Order ID pada Status APPROVED"
summary: "Memastikan aksi Void murni pada SO Platform berstatus APPROVED (belum terkait invoice/outbound) berhasil mengubah status menjadi VOID dan mempertahankan Platform Order ID nomor asli tanpa penambahan prefix void-."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-17
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "User memiliki akses ke menu Dev - Sales Platform (/omni/sales-order)."
  - "Tersedia dokumen SO Platform berstatus APPROVED (belum terkait sales invoice): SO-681D7C9C dengan Platform Order ID: 2622880139669007."
test_data:
  - field: "Sales Order Code"
    value: "SO-681D7C9C"
  - field: "Initial Status"
    value: "APPROVED"
  - field: "Platform Order ID"
    value: "2622880139669007"
steps:
  - "Buka menu Dev - Sales Platform (/omni/sales-order)."
  - "Cari dan buka form detail dokumen SO-681D7C9C."
  - "Verifikasi nilai kolom Platform Order ID adalah 2622880139669007 dan status APPROVED."
  - "Klik tombol/icon Void."
  - "Pada modal dialog konfirmasi Void, pilih opsi Void saja (tanpa copy/recreate)."
  - "Masukkan alasan void dan klik tombol konfirmasi Simpan."
  - "Periksa status dan nilai kolom Platform Order ID pada form detail dan datalist."
expected_result: |
  Status transaksi berhasil berubah menjadi VOID.
  Nilai Platform Order ID TETAP nomor asli 2622880139669007 tanpa penambahan prefix void-.
test_result:
  status: passed
  started_at: "2026-09-17T14:00:00+07:00"
  finished_at: "2026-09-17T14:15:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Status transaksi berhasil berubah menjadi void dan nilai platform order id tetap tanpa ada prefix void (sudah dipastikan di datalist maupun di detail transaksi)."
  report_url: null
test_data_used:
  - field: "Sales Order Code"
    value: "SO-681D7C9C"
  - field: "Platform Order ID"
    value: "2622880139669007"
  - field: "Hasil Status"
    value: "VOID"
  - field: "Hasil Platform Order ID"
    value: "2622880139669007 (tanpa prefix void-)"
run_history: []
origin_jira: ETM-15798
first_execution:
  at: "2026-09-17"
  via: "manual:Yemima"
  jira: ETM-15798
last_execution:
  at: "2026-09-17"
  jira: ETM-15798
  status: passed
  via: "manual:Yemima"
  notes: "Status order SO-681D7C9C berhasil berubah menjadi void dan nilai platform order id tetap 2622880139669007 tanpa prefix void pada datalist dan detail."
---
