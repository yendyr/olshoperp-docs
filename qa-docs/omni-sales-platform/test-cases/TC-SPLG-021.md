---
doc_type: e2e-test-case
tc_code: TC-SPLG-021
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: edge
title: "Verifikasi Penanganan Prefix Bertingkat (void-2-) pada Multiple Recreate"
summary: "Memastikan proses recreate berulang pada nomor order yang sama menghasilkan prefix bertingkat (void-2-) secara tertib tanpa bentrok duplicate key di database."
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
  - "Tersedia SO baru berstatus OPEN hasil Recreate dari SO-681D7C9C dengan ID asli 2622880139669007."
  - "Dokumen void pertama SO-681D7C9C sudah ber-prefix void-2622880139669007."
test_data:
  - field: "Platform Order ID Asli"
    value: "2622880139669007"
  - field: "Void Prefix 1"
    value: "void-2622880139669007"
  - field: "Void Prefix 2 (Expected)"
    value: "void-2-2622880139669007"
steps:
  - "Buka form detail dokumen SO baru yang memegang nomor Platform Order ID asli 2622880139669007."
  - "Lakukan aksi Void murni pada dokumen tersebut."
  - "Buka kembali detail dokumen SO yang baru saja di-void tersebut."
  - "Klik tombol Recreate sekali lagi."
  - "Amati respon sistem dan periksa seluruh baris riwayat order void dengan ID tersebut pada datalist/database."
expected_result: |
  Sistem berhasil mengeksekusi recreate tanpa bentrok duplikasi key di database.
  Dokumen void pertama tetap memegang 'void-2622880139669007'.
  Dokumen void kedua otomatis memegang prefix bertingkat 'void-2-2622880139669007'.
  Dokumen SO baru ke-3 terbentuk dengan Platform Order ID asli '2622880139669007'.
test_result:
  status: blocked
  started_at: "2026-09-17T14:45:00+07:00"
  finished_at: "2026-09-17T14:50:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Belum bisa dilanjutkan (blocked) karena aksi Recreate pada TC-03 mengalami error 500 ('Attempt to read property \"data_owner_id\" on null') sehingga pembentukan dokumen hasil Recreate tertahan."
  report_url: null
test_data_used:
  - field: "Dependency"
    value: "TC-SPLG-DRAFT-20260917133103 (Recreate SO-681D7C9C gagal error 500)"
run_history: []
origin_jira: ETM-15798
first_execution:
  at: "2026-09-17"
  via: "manual:Yemima"
  jira: ETM-15798
last_execution:
  at: "2026-09-17"
  jira: ETM-15798
  status: blocked
  via: "manual:Yemima"
  notes: "Pengujian prefix bertingkat belum dapat dilanjutkan karena tombol Recreate pada TC-03 mengalami error 500 data_owner_id."
---
