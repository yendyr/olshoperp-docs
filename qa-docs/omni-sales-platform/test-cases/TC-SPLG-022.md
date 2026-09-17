---
doc_type: e2e-test-case
tc_code: TC-SPLG-022
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Verifikasi Aksi Void & Recreate Langsung dari Dialog Void"
summary: "Memastikan opsi Void & Recreate pada modal dialog void langsung memberi prefix void- pada SO lama dan secara otomatis membentuk SO baru dari platform."
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
  - "Tersedia dokumen SO Platform berstatus APPROVED (belum terkait sales invoice): SO-684ABC4F dengan Platform Order ID: 250612CE5GEJ01."
test_data:
  - field: "Sales Order Code"
    value: "SO-684ABC4F"
  - field: "Initial Status"
    value: "APPROVED"
  - field: "Platform Order ID"
    value: "250612CE5GEJ01"
steps:
  - "Buka menu Dev - Sales Platform (/omni/sales-order)."
  - "Cari dan buka form detail dokumen SO-684ABC4F (status APPROVED)."
  - "Verifikasi Platform Order ID bernilai 250612CE5GEJ01."
  - "Klik tombol/icon Void pada form detail."
  - "Pada dialog konfirmasi, pilih opsi Void & Recreate."
  - "Masukkan alasan void dan klik tombol konfirmasi Simpan."
  - "Periksa perubahan status dokumen lama SO-684ABC4F dan keberadaan SO baru di datalist."
expected_result: |
  Dokumen lama SO-684ABC4F otomatis berubah status menjadi VOID dan kolom Platform Order ID langsung diberi prefix 'void-250612CE5GEJ01'.
  Sistem secara otomatis men-generate dokumen Sales Order baru berstatus OPEN dengan Platform Order ID asli '250612CE5GEJ01'.
test_result:
  status: skipped
  started_at: "2026-09-17T14:50:00+07:00"
  finished_at: "2026-09-17T15:00:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Skipped. Hasil investigasi database staging_olshoperp di Company ID 13 menunjukkan token otorisasi API marketplace sudah kedaluwarsa (expired) / sandbox tidak dapat dihubungi sehingga muncul error 'gabisa manggil API store'. Pengujian logika duplikasi/copy dialihkan ke menu Sales Order General / All Sales Order (TC-SPLG-DRAFT-20260917133106)."
  report_url: null
test_data_used:
  - field: "Company ID"
    value: "13"
  - field: "Kondisi API Store"
    value: "Token API marketplace expired / unreachable di staging"
  - field: "Solusi Pengujian"
    value: "Dialihkan ke Sales Order General / All Sales Order"
run_history: []
origin_jira: ETM-15798
first_execution:
  at: "2026-09-17"
  via: "manual:Yemima"
  jira: ETM-15798
last_execution:
  at: "2026-09-17"
  jira: ETM-15798
  status: skipped
  via: "manual:Yemima"
  notes: "Pengujian void copy SO platform dilewati karena token API toko marketplace di staging Company 13 expired sehingga verifikasi dialihkan ke menu Sales Order General."
---
