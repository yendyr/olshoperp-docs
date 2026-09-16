---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-046
menu: system-product
menu_name: "System Product"
test_type: positive
title: "Bulk Upload Multiple Foto untuk Varian Berbeda Sekaligus via 1 File Import"
summary: "Memastikan proses import 1 file template berisi update foto untuk multiple varian child berbeda dipetakan secara akurat ke masing-masing child"
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
  - "Produk parent SKU-DefaultVarianOn-(PARENT) memiliki varian CLR-SP (abu, biru, cream, merah muda)."
test_data:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Import Row 1"
    value: "SKU: SKU-DefaultVarianOn-cream -> File Foto Cream Baru"
  - field: "Import Row 2"
    value: "SKU: SKU-DefaultVarianOn-abu -> File Foto Abu Baru"
steps:
  - "Buka menu Supply Chain ➔ System Product (/supplychain/product)."
  - "Siapkan file template import update gambar produk yang memuat 2 baris data sekaligus:"
  - "  - Baris 1: SKU-DefaultVarianOn-cream dengan link/file foto cream"
  - "  - Baris 2: SKU-DefaultVarianOn-abu dengan link/file foto abu"
  - "Lakukan proses Import File foto produk ke sistem."
  - "Tunggu hingga proses import selesai sukses."
  - "Buka halaman detail produk parent SKU-DefaultVarianOn-(PARENT)."
  - "Periksa foto yang terpasang pada masing-masing varian child (abu, biru, cream, merah muda)."
expected_result: |
  1. SKU-DefaultVarianOn-cream gambarnya ter-update menjadi yang terbaru.
  2. SKU-DefaultVarianOn-abu gambarnya berhasil disimpan untuk child tersebut.
  3. Kedua foto tidak saling tertukar, tidak saling menimpa, dan tidak menimpa varian child lainnya.
test_result:
  status: passed
  started_at: "2026-09-16 14:10"
  finished_at: "2026-09-16 14:20"
  executed_by: "QA Engineer"
  environment: staging
  log_summary: "Bulk upload multiple foto untuk opsi varian berbeda dalam 1 file import berhasil sesuai expected. SKU-DefaultVarianOn-cream gambarnya terupdate jadi yang terbaru dan SKU-DefaultVarianOn-abu gambar berhasil disimpan untuk child tersebut."
  report_url: null
test_data_used:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Target Child SKUs"
    value: "SKU-DefaultVarianOn-cream, SKU-DefaultVarianOn-abu"
run_history:
  - date: "2026-09-16"
    status: passed
    environment: staging
    executed_by: "QA Engineer"
    summary: "Bulk import foto multi-varian berhasil dipetakan ke child yang tepat tanpa tertukar."
origin_jira: ETM-15944
first_execution:
  at: "2026-09-16"
  via: "manual:QA Engineer"
  jira: ETM-15944
last_execution:
  at: "2026-09-16"
  jira: ETM-15944
  status: passed
  via: "manual:QA Engineer"
  notes: "Bulk upload multiple foto via 1 file import berhasil memetakan gambar ke masing-masing SKU child secara akurat sesuai expected."
---

# TC-SYSPROD-046 (TC-05)

## Deskripsi Uji
Memverifikasi fungsionalitas **Import Batch Gambar** ketika memperbarui beberapa SKU *child* sekaligus di bawah satu *parent* yang sama dalam satu file template Excel. Pengujian ini memastikan sistem backend tidak salah mengelompokkan record update berdasarkan `parent_id`, melainkan secara independen mengasosiasikan setiap file foto ke `product_id` (Child SKU) yang sesuai.

## Catatan Eksekusi Uji (Staging - 16 September 2026)
- **Kondisi:** Default variant aktif (`STD`).
- **Data Uji:** 1 file import memuat baris untuk `SKU-DefaultVarianOn-cream` dan `SKU-DefaultVarianOn-abu`.
- **Hasil:** Sesuai expected. `SKU-DefaultVarianOn-cream` terupdate fotonya dan `SKU-DefaultVarianOn-abu` gambar berhasil disimpan tanpa saling menimpa.
- **Status Akhir:** **PASSED**
