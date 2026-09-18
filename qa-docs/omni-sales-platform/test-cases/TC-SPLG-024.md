---
doc_type: e2e-test-case
tc_code: TC-SPLG-024
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: cross-menu
title: "Verifikasi Paritas Alur Void Only pada Menu All Sales Order"
summary: "Memastikan aksi Void Only pada menu All Sales Order berhasil mengubah status menjadi VOID dengan nomor Platform Order ID tetap asli tanpa penambahan prefix void-."
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
  - "User memiliki akses ke menu All Sales Order (/businessdevelopment/all-sales-order)."
  - "Tersedia dokumen SO: SO-693B8BF7 dengan Platform Order ID: 346357434232."
test_data:
  - field: "Menu Test"
    value: "All Sales Order (/businessdevelopment/all-sales-order)"
  - field: "Sales Order Code"
    value: "SO-693B8BF7"
  - field: "Platform Order ID"
    value: "346357434232"
steps:
  - "Buka menu All Sales Order (/businessdevelopment/all-sales-order)."
  - "Cari dan buka form detail dokumen SO SO-693B8BF7."
  - "Lakukan aksi Void murni (Void Only, tanpa recreate)."
  - "Periksa status dan nilai Platform Order ID pada dokumen SO-693B8BF7 pasca void."
  - "Periksa ketersediaan tombol Recreate pada detail dokumen SO yang telah berstatus VOID."
expected_result: |
  Sales order SO-693B8BF7 berhasil di-void dan nilai Platform Order ID tetap asli nomor 346357434232 tanpa prefix void-.
test_result:
  status: failed
  started_at: "2026-09-17T15:20:00+07:00"
  finished_at: "2026-09-17T15:35:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "FAILED (Defect Paritas UI): Status SO-693B8BF7 berhasil void dan platform order id tetap 346357434232 tanpa prefix void-, namun tombol Recreate TIDAK MUNCUL / belum diimplementasikan pada halaman detail All Sales Order untuk order void (melanggar Acceptance Criteria ETM-15859)."
  report_url: null
test_data_used:
  - field: "Sales Order Code"
    value: "SO-693B8BF7"
  - field: "Platform Order ID"
    value: "346357434232"
  - field: "Status Akhir"
    value: "void"
  - field: "Ketersediaan Tombol Recreate"
    value: "Tidak ada tombol Recreate di halaman detail All Sales Order (Bug)"
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
  notes: "Status SO-693B8BF7 sukses void dan platform order id tetap 346357434232 tanpa prefix, namun FAILED/BUG pada paritas UI: Tombol Recreate tidak muncul/tidak diimplementasikan pada halaman detail All Sales Order untuk order berstatus VOID (melanggar AC ETM-15859)."
---
