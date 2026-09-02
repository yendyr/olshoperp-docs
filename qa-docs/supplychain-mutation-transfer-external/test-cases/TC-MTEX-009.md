---
doc_type: e2e-test-case
tc_code: TC-MTEX-009
menu: supplychain-mutation-transfer-external
menu_name: "Transfer External"
test_type: happy
title: "Validasi Lokasi Destination Baris Detail Mengikuti Header (Available Product Modal) - Transfer External"
summary: "Memastikan ketika menambahkan SKU (baik loose maupun packed dengan colli) melalui modal Available Product, inline location destination di detail mengikuti destination yang ada di header pada Transfer External."
status: draft
owner: QA - Yemima
last_updated: 2026-08-31
requirement_ref: "qa-docs/supplychain-mutation-transfer-external/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login ke OlshopERP."
  - "Company aktif: DEV-STG (13)."
  - "Sudah disiapkan stok produk: SKU-COLLI01 (COL-6A912EB5), SKU-COLLI02 (COL-6A912EB5), SKU-COLLI03 (loose), SKU-COLLI04 (COL-6A912ED9), SKU-COLLI05 (loose)."
test_data:
  - field: "Location Origin"
    value: "seruni dropoff"
  - field: "Location Destination"
    value: "rak-s-1-a-1"
steps:
  - "Buka dokumen Transfer External baru (Draft/Open)."
  - "Pilih Location Origin = 'seruni dropoff' dan Location Destination = 'rak-s-1-a-1'."
  - "Buka modal 'Available Product'."
  - "Pilih produk yang tidak punya colli code (SKU-COLLI03 dan SKU-COLLI05), klik Bulk Use."
  - "Periksa kolom inline location destination pada grid detail untuk kedua SKU tersebut."
  - "Buka kembali modal 'Available Product'."
  - "Pilih produk yang sudah memiliki colli code (SKU-COLLI01 dan SKU-COLLI02), klik Bulk Use."
  - "Periksa kembali kolom inline location destination pada grid detail."
expected_result: |
  Inline location destination pada seluruh produk detail (baik loose SKU-COLLI03/05 maupun packed SKU-COLLI01/02) otomatis terisi 'rak-s-1-a-1' mengikuti header dokumen, bukan mengikuti lokasi origin/asal colli.
test_result:
  status: passed
  started_at: "2026-08-31T11:00:00+07:00"
  finished_at: "2026-08-31T12:00:00+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — Lokasi destination inline pada detail mengikuti destination di header (rak-s-1-a-1) dengan benar untuk loose product maupun product yang memiliki colli code origin."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-31"
    status: passed
    environment: staging
    note: "PASS — Lokasi destination inline detail mengikuti header."
origin_jira: ETM-15646
last_execution:
  at: "2026-08-31"
  jira: "ETM-15646"
  status: passed
  via: "manual:p"
  notes: "Verifikasi pengujian manual: status tersimpan, respon validasi dan datalist sesuai expected."
first_execution:
  at: "2026-08-31"
  via: "manual:p"
  jira: "ETM-15646"
---

# TC-MTEX-009

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi inheritansi lokasi tujuan di grid detail transaksi Transfer External.
- **Relasi JIRA:** Terkait dengan card `ETM-15646`.
