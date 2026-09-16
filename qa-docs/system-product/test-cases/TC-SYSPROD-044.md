---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-044
menu: system-product
menu_name: "System Product"
test_type: positive
title: "Upload Foto Utama pada Level Parent Tidak Menimpa Foto Spesifik Varian Child"
summary: "Memverifikasi bahwa upload foto utama pada level Parent tidak menimpa atau mereset foto yang sudah terpasang khusus di varian child"
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
  - "Minimal satu atau dua varian child sudah memiliki foto spesifik (misal: varian cream dan biru)."
test_data:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Existing Child with Photo"
    value: "SKU-DefaultVarianOn-cream, SKU-DefaultVarianOn-biru"
  - field: "Upload Action"
    value: "Upload Foto Utama di Level Parent Product"
steps:
  - "Buka menu Supply Chain ➔ System Product (/supplychain/product)."
  - "Cari produk parent SKU-DefaultVarianOn-(PARENT) lalu klik tombol Edit."
  - "Pada bagian foto utama produk (level Parent), unggah file gambar cover baru."
  - "Klik tombol Save All / Simpan."
  - "Buka kembali detail produk dan periksa foto pada masing-masing varian child (terutama varian cream dan biru)."
  - "Periksa tampilan di Datalist System Product."
expected_result: |
  1. Foto yang diunggah di level Parent berhasil tersimpan sebagai foto cover/utama produk parent.
  2. Foto spesifik yang sudah terpasang pada varian child (SKU-DefaultVarianOn-cream dan SKU-DefaultVarianOn-biru) TIDAK TERTIMPA atau ter-reset kembali menjadi foto parent.
  3. Varian child yang belum memiliki foto khusus (abu, merah muda) dapat mewarisi cover parent atau tetap tanpa foto sesuai konfigurasi sistem.
test_result:
  status: passed
  started_at: "2026-09-16 14:00"
  finished_at: "2026-09-16 14:15"
  executed_by: "QA Engineer"
  environment: staging
  log_summary: "Upload success -> set menjadi main image, hasilnya berhasil, gambar juga ditampilkan di datalist pada SKU parent terkait tanpa mengubah gambar pada child-childnya."
  report_url: null
test_data_used:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
run_history:
  - date: "2026-09-16"
    status: passed
    environment: staging
    executed_by: "QA Engineer"
    summary: "Upload foto utama parent berhasil tampil di datalist parent tanpa mengubah gambar varian child."
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
  notes: "Upload foto utama parent berhasil dan diset sebagai main image. Gambar tampil di datalist pada baris SKU parent tanpa mengubah gambar pada child-childnya."
---

# TC-SYSPROD-044 (TC-03)

## Deskripsi Uji
Memverifikasi batas isolasi pembaruan gambar pada kartu ETM-15944 ketika user melakukan upload/update foto utama pada level **Parent Product**. Pengujian ini memastikan foto varian *child* yang sudah di-custom sebelumnya tidak tertimpa secara massal oleh foto parent.

## Catatan Eksekusi Uji (Staging - 16 September 2026)
- **Kondisi:** Default variant aktif (`STD`).
- **Target Uji:** Upload foto utama pada level parent `SKU-DefaultVarianOn-(PARENT)` dan set main image.
- **Hasil:** Upload berhasil, gambar tampil di datalist baris parent, dan varian child tetap mempertahankan fotonya masing-masing.
- **Status Akhir:** **PASSED**
