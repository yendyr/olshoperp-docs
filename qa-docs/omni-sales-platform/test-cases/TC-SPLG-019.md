---
doc_type: e2e-test-case
tc_code: TC-SPLG-019
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: happy
title: "Verifikasi Sync Gate Anti Auto-Create SO Baru pada Order Void Ber-ID Asli"
summary: "Memastikan proses sinkronisasi background/bulk marketplace men-skip pembuatan SO baru saat mendeteksi nomor Platform Order ID sudah ada di database berstatus VOID (anti-duplikat)."
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
  - "Dokumen SO-681D7C9C sudah berstatus VOID dengan Platform Order ID tetap asli: 2622880139669007."
test_data:
  - field: "Sales Order Code"
    value: "SO-681D7C9C"
  - field: "Status"
    value: "VOID"
  - field: "Platform Order ID"
    value: "2622880139669007"
steps:
  - "Buka halaman datalist Dev - Sales Platform (/omni/sales-order)."
  - "Filter dan pastikan dokumen SO-681D7C9C berstatus VOID dengan Platform Order ID: 2622880139669007."
  - "Jalankan trigger proses sinkronisasi untuk toko/store sumber (via tombol Bulk Sync atau sync store)."
  - "Tunggu hingga background sync selesai dieksekusi."
  - "Cari order berdasarkan nomor Platform Order ID 2622880139669007 pada datalist."
expected_result: |
  Background sync mendeteksi Platform Order ID 2622880139669007 sudah ada dengan status VOID, sehingga sync men-skip pembuatan SO baru (skip create).
  TIDAK ada baris Sales Order baru yang terbentuk di datalist untuk ID tersebut (anti-duplikat berhasil).
test_result:
  status: passed
  started_at: "2026-09-17T14:15:00+07:00"
  finished_at: "2026-09-17T14:30:00+07:00"
  executed_by: "QA - Yemima"
  environment: staging
  log_summary: "Anti-duplikat lolos (order ditemukan 1 baris berstatus VOID, tidak ada SO baru yang terbentuk). Catatan: Pencarian via Global Search terkena error 500, sehingga verifikasi dilakukan via Advanced Filter dengan kondisi 'platform id equals 2622880139669007'."
  report_url: null
test_data_used:
  - field: "Sales Order Code"
    value: "SO-681D7C9C"
  - field: "Platform Order ID"
    value: "2622880139669007"
  - field: "Metode Pencarian"
    value: "Advanced Filter: platform id equals 2622880139669007 (Global Search error 500)"
  - field: "Hasil Baris Data"
    value: "1 baris (tidak ada baris SO baru/duplikat)"
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
  notes: "Order 2622880139669007 ditemukan 1 baris berstatus VOID via advanced filter dan tidak ada duplikasi SO baru. Catatan: pencarian global search mengalami HTTP error 500."
---
