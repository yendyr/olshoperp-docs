---
doc_type: e2e-test-case
tc_code: TC-SPLG-020
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Verifikasi Tombol dan Aksi Recreate pada Halaman Show SO Void"
summary: "Memastikan tombol Recreate pada SO Void berfungsi memberikan prefix void- pada order void lama dan berhasil membentuk SO baru dengan nomor asli marketplace."
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
  - "Tersedia dokumen SO Platform berstatus VOID (SO-681D7C9C setelah di-void pada TC-01)."
test_data:
  - field: "Sales Order Code"
    value: "SO-681D7C9C"
  - field: "Status"
    value: "VOID"
  - field: "Platform Order ID"
    value: "2622880139669007"
steps:
  - "Buka menu Dev - Sales Platform (/omni/sales-order)."
  - "Cari dan buka detail dokumen SO-681D7C9C yang berstatus VOID."
  - "Verifikasi kolom Platform Order ID saat ini memegang nomor asli 2622880139669007."
  - "Periksa ketersediaan tombol Recreate pada toolbar/header detail dokumen."
  - "Klik tombol Recreate."
  - "Amati respon notifikasi dan periksa perubahan data pada form dan datalist."
expected_result: |
  Tombol Recreate tampil dan dapat diklik.
  Sistem menampilkan notifikasi respon sukses: 'Sales order recreated'.
  Dokumen lama SO-681D7C9C kini Platform Order ID-nya berubah menjadi 'void-2622880139669007'.
  Sistem berhasil membentuk dokumen Sales Order platform baru berstatus OPEN dengan nomor Platform Order ID asli '2622880139669007'.
test_result:
  status: failed
  started_at: "2026-09-17T14:30:00+07:00"
  finished_at: "2026-09-17T14:45:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Tombol recreate tampil dan dapat diklik. Namun, ketika diklik muncul notifikasi error 500: 'Attempt to read property \"data_owner_id\" on null'."
  report_url: null
test_data_used:
  - field: "Sales Order Code"
    value: "SO-681D7C9C"
  - field: "Platform Order ID"
    value: "2622880139669007"
  - field: "Status Order Saat Recreate"
    value: "VOID"
  - field: "Error Response"
    value: "HTTP 500: Attempt to read property \"data_owner_id\" on null"
run_history: []
origin_jira: ETM-15798
first_execution:
  at: "2026-09-17"
  via: "manual:Yemima"
  jira: ETM-15798
last_execution:
  at: "2026-09-17"
  jira: ETM-15798
  status: failed
  via: "manual:Yemima"
  notes: "Tombol recreate tampil dan dapat diklik namun memicu notifikasi error 500 Attempt to read property data_owner_id on null."
---
