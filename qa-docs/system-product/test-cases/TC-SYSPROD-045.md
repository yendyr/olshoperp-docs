---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-045
menu: system-product
menu_name: "System Product"
test_type: positive
title: "Ganti / Replace Foto pada Varian Child yang Sudah Memiliki Gambar"
summary: "Memverifikasi bahwa proses penggantian foto pada varian child yang sudah memiliki gambar hanya memperbarui varian tersebut tanpa merusak varian lain"
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
  - "Produk parent SKU-DefaultVarianOn-(PARENT) memiliki varian CLR-SP."
  - "Varian child target SKU-DefaultVarianOn-cream sudah memiliki foto yang tersimpan sebelumnya."
  - "Varian child SKU-DefaultVarianOn-biru juga sudah memiliki foto yang berbeda."
test_data:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Target Child SKU"
    value: "SKU-DefaultVarianOn-biru"
  - field: "Action"
    value: "Replace Image with New Image File"
steps:
  - "Buka menu Supply Chain ➔ System Product (/supplychain/product)."
  - "Cari produk parent SKU-DefaultVarianOn-(PARENT) lalu klik tombol Edit."
  - "Buka section detail varian child untuk SKU-DefaultVarianOn-biru."
  - "Unggah file foto baru untuk menggantikan foto lama pada varian biru tersebut."
  - "Klik tombol Save All / Simpan."
  - "Periksa kembali foto pada varian SKU-DefaultVarianOn-biru dan SKU-DefaultVarianOn-cream."
expected_result: |
  1. Foto pada varian SKU-DefaultVarianOn-biru berhasil diperbarui dengan file foto yang baru.
  2. Foto pada varian child lainnya (seperti SKU-DefaultVarianOn-cream, abu, merah muda) TETAP UTUH dan tidak ikut berubah.
  3. Foto pada level Parent tidak terpengaruh oleh pergantian foto varian child ini.
test_result:
  status: passed
  started_at: "2026-09-16 14:05"
  finished_at: "2026-09-16 14:15"
  executed_by: "QA Engineer"
  environment: staging
  log_summary: "Replace foto pada SKU-DefaultVarianOn-biru berhasil diperbarui dengan gambar baru tanpa memengaruhi gambar pada parent maupun varian child lain."
  report_url: null
test_data_used:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Target Child SKU"
    value: "SKU-DefaultVarianOn-biru"
run_history:
  - date: "2026-09-16"
    status: passed
    environment: staging
    executed_by: "QA Engineer"
    summary: "Replace foto pada varian child berhasil terisolasi tanpa memengaruhi parent atau child lain."
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
  notes: "Replace foto pada varian child SKU-DefaultVarianOn-biru berhasil dan tidak memengaruhi gambar parent serta child lainnya."
---

# TC-SYSPROD-045 (TC-04)

## Deskripsi Uji
Memverifikasi proses pembaruan ulang / penggantian (*replace*) foto produk pada varian *child* yang sebelumnya telah memiliki foto tersendiri. Memastikan update foto baru tetap terisolasi hanya pada baris SKU varian yang dituju.

## Catatan Eksekusi Uji (Staging - 16 September 2026)
- **Kondisi:** Default variant aktif (`STD`).
- **Target Uji:** Replace foto pada SKU varian `SKU-DefaultVarianOn-biru`.
- **Hasil:** Gambar berhasil diperbarui dan tidak memengaruhi gambar pada SKU parent maupun varian child lainnya.
- **Status Akhir:** **PASSED**
