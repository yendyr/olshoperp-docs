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
  status: passed
  started_at: "2026-09-18T16:00:00+07:00"
  finished_at: "2026-09-18T16:15:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "PASSED (Retest ETM-15971): Error 500 telah diperbaiki dengan graceful error handling. Recreate pada order dengan store deleted (2622880139669007) memunculkan notifikasi 'Unable to get data from platform because store has been deleted'. Recreate pada order dengan store inactive (250802R6NPC0CF) memunculkan notifikasi 'Unable to get data from platform because store is inactive'."
  report_url: null
test_data_used:
  - field: "Sales Order Code 1"
    value: "SO-681D7C9C"
  - field: "Platform Order ID 1"
    value: "2622880139669007 (Store: Deleted)"
  - field: "Respon 1"
    value: "Unable to get data from platform because store has been deleted"
  - field: "Platform Order ID 2"
    value: "250802R6NPC0CF (Store: Inactive)"
  - field: "Respon 2"
    value: "Unable to get data from platform because store is inactive"
run_history: []
origin_jira: ETM-15798
first_execution:
  at: "2026-09-17"
  via: "manual:Yemima"
  jira: ETM-15798
last_execution:
  at: "2026-09-18"
  jira: ETM-15971
  status: passed
  via: "manual:Yemima"
  notes: "Retest ETM-15971 lolos dengan penanganan notifikasi: store deleted memunculkan 'Unable to get data from platform because store has been deleted' dan store inactive memunculkan 'Unable to get data from platform because store is inactive'."
---
