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
  - "Tersedia dokumen SO Platform berstatus APPROVED: SO-5UFPTLZ4 (Platform Order ID: 2609141HMRM1GF) dan SO-5UGRZMC7 (Platform Order ID: 2609178TUP0JNX)."
test_data:
  - field: "Menu Test"
    value: "All Sales Order (/businessdevelopment/all-sales-order)"
  - field: "Dokumen Void Only"
    value: "SO-5UFPTLZ4 (ID: 2521720, Platform ID: 2609141HMRM1GF)"
  - field: "Dokumen Void & Recreate"
    value: "SO-5UGRZMC7 (ID: 2522162, Platform ID: 2609178TUP0JNX)"
steps:
  - "Buka menu All Sales Order (/businessdevelopment/all-sales-order)."
  - "Cari dan buka form detail dokumen SO Platform SO-5UFPTLZ4."
  - "Lakukan aksi Void murni (Void Only, tanpa recreate)."
  - "Verifikasi notifikasi 'The document has been successfully voided.' dan pastikan status transaksi menjadi voided dengan Platform Order ID tetap asli."
  - "Buka kembali detail dokumen SO-5UFPTLZ4 yang sudah void dan periksa ketersediaan tombol Recreate."
  - "Klik tombol Recreate, lalu periksa pembentukan dokumen SO baru serta penambahan prefix void- pada order lama."
  - "Uji pula aksi Void & Recreate langsung pada dokumen SO-5UGRZMC7 dan periksa hasil generasi SO barunya."
expected_result: |
  Pada order bertipe Platform di menu All Sales Order, tombol Recreate tampil pada halaman show/detail order void.
  Eksekusi Recreate berhasil membentuk Sales Order baru berstatus OPEN dengan Platform Order ID asli, dan menambahkan prefix void- pada Platform Order ID dokumen lama.
test_result:
  status: passed
  started_at: "2026-09-18T16:15:00+07:00"
  finished_at: "2026-09-18T16:35:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "PASSED (Retest ETM-15971): Tombol Recreate terbukti tampil dan berfungsi pada order bertipe Platform di All Sales Order. Uji Void Only pada SO-5UFPTLZ4 berhasil void dengan ID asli, dan tombol Recreate sukses mengenerate SO baru SO-5UH7JSIK (open) serta mengubah ID lama jadi void-2609141HMRM1GF. Uji Void & Recreate pada SO-5UGRZMC7 juga sukses membentuk SO baru SO-5UH85FVM (open) dan ID lama jadi void-2609178TUP0JNX."
  report_url: null
test_data_used:
  - field: "Void Only Lama"
    value: "SO-5UFPTLZ4 (ID: 2521720) -> void-2609141HMRM1GF"
  - field: "Hasil Recreate SO Baru"
    value: "SO-5UH7JSIK (ID: 2522782, Status: open, Platform ID: 2609141HMRM1GF)"
  - field: "Void & Recreate Lama"
    value: "SO-5UGRZMC7 (ID: 2522162) -> void-2609178TUP0JNX"
  - field: "Hasil Void & Recreate Baru"
    value: "SO-5UH85FVM (ID: 2522792, Status: open, Platform ID: 2609178TUP0JNX)"
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
  notes: "Retest ETM-15971 di All Sales Order berhasil: tombol Recreate pada order platform tampil dan berhasil mengenerate SO baru status open (SO-5UH7JSIK dan SO-5UH85FVM)."
---
