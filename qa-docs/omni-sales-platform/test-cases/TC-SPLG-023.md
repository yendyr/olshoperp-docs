---
doc_type: e2e-test-case
tc_code: TC-SPLG-023
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: cross-menu
title: "Verifikasi Alur Void & Recreate pada Menu All Sales Order"
summary: "Memastikan aksi Void & Recreate pada menu All Sales Order berhasil memberikan prefix 'void-' pada order lama dan men-generate Sales Order baru berstatus draft dengan nomor asli."
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
  - "Tersedia dokumen SO dengan Platform Order ID: SO-693B9036 (Platform Order ID: 2326754324234)."
test_data:
  - field: "Menu Test"
    value: "All Sales Order (/businessdevelopment/all-sales-order)"
  - field: "Sales Order Code"
    value: "SO-693B9036"
  - field: "Platform Order ID"
    value: "2326754324234"
steps:
  - "Buka menu All Sales Order (/businessdevelopment/all-sales-order)."
  - "Cari dan buka form detail dokumen SO SO-693B9036."
  - "Lakukan aksi Void dengan memilih opsi Void & Recreate."
  - "Periksa status dan nilai Platform Order ID pada dokumen SO-693B9036 pasca eksekusi."
  - "Lakukan pencarian pada datalist dengan filter Platform Order ID contains '2326754324234'."
  - "Verifikasi apakah dokumen Sales Order baru terbentuk dengan Platform Order ID asli."
expected_result: |
  Sales order SO-693B9036 berhasil di-void dan nilai Platform Order ID otomatis memiliki prefix 'void-' sehingga menjadi 'void-2326754324234'.
  Sistem berhasil men-generate Sales Order baru (tercatat: SO-5UGWKBDY) dengan Platform Order ID asli '2326754324234' berstatus DRAFT.
test_result:
  status: passed
  started_at: "2026-09-17T15:00:00+07:00"
  finished_at: "2026-09-17T15:20:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Sales order SO-693B9036 berhasil di-void setelah di-void & recreate otomatis platform order id memiliki prefix 'void-' sehingga menjadi void-2326754324234. Berhasil tergenerate sales order baru dengan trx code SO-5UGWKBDY dan platform order id 2326754324234 dengan status 'draft'."
  report_url: null
test_data_used:
  - field: "Dokumen Void Lama"
    value: "SO-693B9036"
  - field: "Platform Order ID Lama Pasca Void"
    value: "void-2326754324234"
  - field: "Dokumen Baru Tergenerate"
    value: "SO-5UGWKBDY"
  - field: "Platform Order ID Dokumen Baru"
    value: "2326754324234"
  - field: "Status Dokumen Baru"
    value: "draft"
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
  notes: "Order SO-693B9036 berhasil void dengan platform order id void-2326754324234 dan tergenerate SO baru SO-5UGWKBDY status draft ber-id asli 2326754324234."
---
