---
doc_type: e2e-test-case
tc_code: PENDING-20260918155503
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: happy
title: "Import Detail Stock Opname via Excel dengan Nilai Unit Price Desimal"
summary: "Memastikan file Excel import detail Stock Opname yang memuat nilai Unit Price berkoma (desimal) berhasil di-upload dan diproses tanpa terganjal validasi whole numbers."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-18
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15968
execution_company:
  id: 112
  code: FAT
related_menus:
  - accounting-stock-opname-approval
first_execution:
  at: null
  jira: null
  via: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-SOPNAME-DRAFT-20260918155503: Import Detail Stock Opname via Excel dengan Nilai Unit Price Desimal

## Objective
Menguji fungsi import Excel detail Stock Opname (`StockOpnameDetailImportJob`), memastikan fungsi `validationUnitPrice` menerima angka desimal dan tidak lagi memblokir file Excel yang mencantumkan harga satuan berkoma.

## Preconditions
1. User login ke OlshopERP Staging.
2. Terdapat dokumen Stock Opname kosong atau terbuka untuk import.
3. Telah disiapkan file Excel template Stock Opname Detail dengan kolom Unit Price diisi angka desimal (contoh: `15000.75` dan `25430.25`).

## Test Steps
1. Buka detail dokumen Stock Opname (`/supplychain/stock-opname/edit/{id}`).
2. Klik tombol **Import Detail / Upload Excel**.
3. Pilih file Excel yang memuat unit price desimal.
4. Klik tombol **Upload / Submit**.
5. Tunggu hingga proses import background job selesai.

## Expected Results
1. File Excel berhasil di-import dengan status sukses (tidak ada baris gagal akibat validasi unit price).
2. Detail produk yang ter-import menampilkan nilai Unit Price desimal sesuai data di Excel (`15000.75`).
3. Log import tidak memunculkan error *"Unit Price must be entered in whole numbers not decimals"*.
