---
doc_type: e2e-test-case
tc_code: TC-SOPNAME-PASS-03
menu: supplychain-stock-opname
menu_name: "Stock Opname"
test_type: happy
title: "Import Detail Stock Opname via Excel dengan Nilai Unit Price Desimal"
summary: "Memastikan file Excel import detail Stock Opname yang memuat nilai Unit Price berkoma (desimal) berhasil di-upload dan diproses tanpa terganjal validasi whole numbers."
status: draft
owner: "QA - Yemima"
last_updated: 2026-09-23
requirement_ref: "qa-docs/supplychain-stock-opname/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15968
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - accounting-stock-opname-approval
test_data:
  - field: "Transaction Code"
    value: "SP-5UJ19320"
  - field: "SKU"
    value: "SKU-WONDERSTICK"
  - field: "Imported Unit Price"
    value: "25000.55"
steps:
  - "1. Buat dokumen Stock Opname di menu /supplychain/stock-opname dengan item produk SKU-WONDERSTICK"
  - "2. Buka menu Stock Opname Approval (/accounting/stock-opname-approval) dan buka dokumen yang sama SP-5UJ19320"
  - "3. Amati bahwa baris SKU sudah ada dengan unit price awal bernilai 0"
  - "4. Masukkan nilai unit price desimal 25000,55 ke dalam template file Excel untuk di-import"
  - "5. Lakukan import file Excel tersebut ke dalam dokumen opname"
  - "6. Verifikasi nilai unit price yang muncul pada tabel detail setelah proses import selesai"
expected_result: |
  1. File Excel berhasil di-import dengan status sukses (tidak ada penolakan validasi whole number).
  2. Nilai Unit Price produk di tabel detail ter-update dari 0 menjadi angka desimal 25.000,55.
  3. Tidak muncul error duplikasi produk ("Product has been added in stock opname details").
test_result:
  status: passed
  started_at: "2026-09-23T11:27:00+07:00"
  finished_at: "2026-09-23T11:38:00+07:00"
  executed_by: "QA - Yemima / OlshopERP"
  environment: staging
  log_summary: "PASSED: Dokumen SP-5UJ19320 (SKU-WONDERSTICK) berhasil di-update nilai unit price-nya via import Excel dari 0 menjadi desimal 25.000,55 tanpa error validasi whole number maupun duplikasi."
  report_url: null
test_data_used:
  - trx_code: "SP-5UJ19320"
    sku: "SKU-WONDERSTICK"
    initial_unit_price: 0
    imported_unit_price: 25000.55
    actual_unit_price_after_import: 25000.55
run_history:
  - run_at: "2026-09-18T16:54:00+07:00"
    status: failed
    via: "manual:QA - Jeiniffer"
    jira: "ETM-15968"
    note: "Row 2: Product has been added in stock opname details. SO: SP-5UHA64EA"
  - run_at: "2026-09-23T11:38:00+07:00"
    status: passed
    via: "manual:OlshopERP"
    jira: "ETM-15982"
first_execution:
  at: "2026-09-18T16:54:00+07:00"
  via: "manual:QA - Jeiniffer"
  jira: "ETM-15968"
last_execution:
  at: "2026-09-23T11:38:00+07:00"
  jira: "ETM-15982"
  status: passed
  via: "manual:OlshopERP"
---

# TC-SOPNAME-PASS-03: Import Detail Stock Opname via Excel dengan Nilai Unit Price Desimal

## Catatan QA & Referensi Data Testing (Evidence)
Mengacu pada parent card re-open **ETM-15982** (asal: **ETM-15968**).
- Jira Card: [ETM-15982](https://erpintegration.atlassian.net/browse/ETM-15982) (`REOPEN [Stock Opname Approval] Lakukan penyesuaian pada kolom unit price agar user dapat input nilai desimal 2 angka dibelakang koma`).
- Company: **Dev Staging (DEV-STG, ID: 13)**.

### Bukti Eksekusi (Actual Result)
- **Dokumen Stock Opname:** `SP-5UJ19320`
- **Produk / SKU:** `SKU-WONDERSTICK`
- **Kondisi Awal:** Dokumen dibuka di menu Stock Opname Approval, SKU tertera dengan Unit Price awal = `0`.
- **Aksi Import:** Nilai Unit Price diisi `25000,55` pada file Excel, kemudian di-upload/import ke dokumen `SP-5UJ19320`.
- **Hasil:** File Excel berhasil di-import dan Unit Price langsung ter-update dari 0 menjadi **25.000,55** ✅.
- **Kesimpulan:** **PASSED**. Isu sebelumnya di mana import gagal karena validasi duplikasi detail atau whole number telah teratasi dengan baik. Sistem kini menerima dan memproses angka desimal 2 angka di belakang koma via import Excel secara presisi.
