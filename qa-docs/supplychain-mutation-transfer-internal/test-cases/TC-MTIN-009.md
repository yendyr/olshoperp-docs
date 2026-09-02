---
doc_type: e2e-test-case
tc_code: TC-MTIN-009
menu: supplychain-mutation-transfer-internal
menu_name: "Transfer Internal"
test_type: happy
title: "Otomatis Sembunyikan SKU dari List/Dropdown saat Full Allocated (Outstanding Qty = 0)"
summary: "Memastikan SKU produk yang sudah ter-alokasi secara penuh (full transfer) tidak muncul lagi dalam pilihan modal Available Product atau dropdown Select Product."
status: draft
owner: QA - Yemima
last_updated: 2026-08-30
requirement_ref: "qa-docs/supplychain-mutation-transfer-internal/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus: []
preconditions:
  - "User login ke OlshopERP."
  - "Company aktif: DEV-STG (13)."
  - "Tersedia stok produk SKU-COLLI01 dan SKU-COLLI02 di lokasi origin."
test_data:
  - field: "Products"
    value: "SKU-COLLI01, SKU-COLLI02"
steps:
  - "Buka dokumen Transfer Internal baru (Draft/Open)."
  - "Pilih SKU-COLLI01 melalui field 'Select Product' di grid detail."
  - "Ubah kuantitas (Qty) menjadi full stock/full transfer (outstanding = 0) dan klik Save."
  - "Klik untuk membuka modal 'Available Product'."
  - "Cari SKU-COLLI01 menggunakan global search pada modal tersebut."
  - "Hapus semua SKU di detail (Clear detail)."
  - "Tambahkan SKU-COLLI02 melalui modal Available Product dengan alokasi penuh (full allocated)."
  - "Klik input field dropdown 'Select Product' pada baris baru di grid detail."
  - "Cari SKU-COLLI02 di dropdown tersebut."
expected_result: |
  1. SKU-COLLI01 tidak muncul dan tidak dapat ditemukan di modal Available Product (baik list maupun pencarian) karena outstanding qty-nya sudah 0 (full allocated).
  2. SKU-COLLI02 tidak muncul dan tidak dapat ditemukan di dropdown Select Product setelah ditambahkan secara full allocated via modal.
test_result:
  status: passed
  started_at: "2026-08-30T12:00:00+07:00"
  finished_at: "2026-08-30T12:30:00+07:00"
  executed_by: "QA Manual"
  environment: staging
  log_summary: "PASS — SKU-COLLI01 tidak muncul di modal Available Product setelah full transfer. SKU-COLLI02 juga tidak muncul di dropdown Select Product maupun global search setelah full allocated."
  report_url: null
test_data_used: []
run_history:
  - at: "2026-08-30"
    status: passed
    environment: staging
    note: "PASS — Produk yang full allocated disembunyikan dari pilihan."
origin_jira: ETM-15553
last_execution:
  at: "2026-08-30"
  jira: "ETM-15553"
  status: passed
  via: "manual:p"
  notes: "Verifikasi pengujian manual: status tersimpan, respon validasi dan datalist sesuai expected."
first_execution:
  at: "2026-08-30"
  via: "manual:p"
  jira: "ETM-15553"
---

# TC-MTIN-009

## Catatan QA
- **Latar Belakang:** Pengujian dilakukan untuk memverifikasi penyembunyian produk yang alokasi stoknya telah habis.
- **Relasi JIRA:** Terkait dengan card `ETM-15553`.
