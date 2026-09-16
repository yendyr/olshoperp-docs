---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-042
menu: system-product
menu_name: "System Product"
test_type: positive
title: "Upload Gambar via Import pada Spesifik Varian Child saat Default Variant Aktif"
summary: "Memverifikasi bahwa upload gambar via import hanya meng-update SKU child terkait dan menampilkan thumbnail di datalist"
status: review
owner: QA - Yemima
last_updated: 2026-09-16
requirement_ref: "qa-docs/system-product/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "Default variant berstatus aktif (STD) pada Master Variant."
  - "Produk parent terdaftar di System Product: SKU-DefaultVarianOn-(PARENT) menghasilkan child SKU-DefaultVarianOn."
  - "Telah ditambahkan variant type 'CLR-SP' dengan opsi abu, biru, cream, dan merah muda, menghasilkan 4 child baru:"
  - "  - SKU-DefaultVarianOn-abu"
  - "  - SKU-DefaultVarianOn-biru"
  - "  - SKU-DefaultVarianOn-cream"
  - "  - SKU-DefaultVarianOn-merah muda"
test_data:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Target Child SKU"
    value: "SKU-DefaultVarianOn-cream"
  - field: "Upload Method"
    value: "Import Excel"
steps:
  - "Buka menu Supply Chain ➔ System Product (/supplychain/product)."
  - "Siapkan file template import update gambar produk untuk SKU target SKU-DefaultVarianOn-cream."
  - "Lakukan proses Import File foto produk ke sistem."
  - "Buka halaman detail/edit produk parent SKU-DefaultVarianOn-(PARENT) dan periksa foto pada masing-masing child."
  - "Kembali ke Datalist System Product, cari baris produk parent dan expand baris varian child SKU-DefaultVarianOn-cream."
expected_result: |
  1. Gambar berhasil ter-update secara spesifik pada SKU child SKU-DefaultVarianOn-cream saja bukan semua child.
  2. Varian child lainnya (abu, biru, merah muda, dan default STD) TIDAK ikut berubah atau tertimpa gambarnya.
  3. Thumbnail gambar tampil dengan benar pada baris SKU child SKU-DefaultVarianOn-cream di Datalist System Product.
test_result:
  status: failed
  started_at: "2026-09-16 13:45"
  finished_at: "2026-09-16 14:15"
  executed_by: "QA Engineer"
  environment: staging
  log_summary: "Update sukses tersimpan di detail dan otomatis menyimpan di SKU child terkait saja tidak ke semua child di parent yang sama di detail. Namun gambar tidak tampil di datalist pada baris SKU yang diupdate tersebut, sudah di-refresh juga tidak muncul."
  report_url: null
test_data_used:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Target Child SKU"
    value: "SKU-DefaultVarianOn-cream"
  - field: "Variant Type"
    value: "CLR-SP (abu, biru, cream, merah muda)"
run_history:
  - date: "2026-09-16"
    status: failed
    environment: staging
    executed_by: "QA Engineer"
    summary: "Update sukses di detail terisolasi per child, tetapi thumbnail gambar tidak tampil di baris datalist child."
origin_jira: ETM-15944
first_execution:
  at: "2026-09-16"
  via: "manual:QA Engineer"
  jira: ETM-15944
last_execution:
  at: "2026-09-16"
  jira: ETM-15944
  status: failed
  via: "manual:QA Engineer"
  notes: "Update sukses tersimpan dan otomatis menyimpan di SKU child terkait saja tidak ke semua child di parent yang sama di detail, tapi gambar tidak tampil di datalist pada baris SKU yang diupdate tersebut (sudah di-refresh tetap tidak muncul)."
---

# TC-SYSPROD-042 (TC-01)

## Deskripsi Uji
Memverifikasi perbaikan bug ETM-15944 pada metode upload gambar via **Import** ke spesifik varian child saat kondisi *Default System Product (STD)* aktif, serta memverifikasi kemunculan thumbnail gambar di datalist.

## Catatan Eksekusi Uji (Staging - 16 September 2026)
- **Kondisi:** Default variant aktif (`STD`).
- **Data Uji:** Parent `SKU-DefaultVarianOn-(PARENT)` dengan varian baru `CLR-SP` (abu, biru, cream, merah muda).
- **Target Uji:** Upload gambar via import ke `SKU-DefaultVarianOn-cream`.
- **Hasil:**
  - Update sukses tersimpan di detail dan hanya mempengaruhi SKU child terkait (`SKU-DefaultVarianOn-cream`), tidak bocor ke child lain.
  - **Defect / Temuan:** Gambar tidak tampil di Datalist System Product pada baris SKU child yang diupdate tersebut (sudah di-refresh tetap tidak muncul).
- **Status Akhir:** **FAILED**
