---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-043
menu: system-product
menu_name: "System Product"
test_type: positive
title: "Upload Manual Foto Produk ke Varian Child melalui Section Product Detail"
summary: "Memverifikasi bahwa upload foto manual pada section detail child hanya meng-update varian tersebut dan menampilkan thumbnail di datalist"
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
    value: "SKU-DefaultVarianOn-biru"
  - field: "Upload Method"
    value: "Manual Upload via Product Detail Photos"
steps:
  - "Buka menu Supply Chain ➔ System Product (/supplychain/product)."
  - "Cari dan klik tombol Edit pada produk parent SKU-DefaultVarianOn-(PARENT)."
  - "Buka section detail varian child untuk SKU-DefaultVarianOn-biru."
  - "Upload file gambar khusus untuk varian biru melalui bagian Photos/Gambar produk detail."
  - "Klik tombol Save All / Simpan."
  - "Periksa kembali gambar pada seluruh varian child (abu, biru, cream, merah muda, STD)."
  - "Kembali ke halaman Datalist System Product dan expand baris varian untuk memeriksa tampilan gambar SKU-DefaultVarianOn-biru."
expected_result: |
  1. Gambar berhasil ter-update secara spesifik pada SKU child SKU-DefaultVarianOn-biru saja bukan semua child.
  2. Varian child lainnya (abu, cream, merah muda, dan default STD) TIDAK ikut tertimpa oleh gambar biru tersebut.
  3. Thumbnail gambar tampil dengan benar pada baris SKU child SKU-DefaultVarianOn-biru di Datalist System Product.
test_result:
  status: failed
  started_at: "2026-09-16 13:50"
  finished_at: "2026-09-16 14:15"
  executed_by: "QA Engineer"
  environment: staging
  log_summary: "Update sukses tersimpan dan otomatis menyimpan di SKU child terkait saja tidak ke semua child di parent yang sama di detail. Namun gambar tidak tampil di datalist pada baris SKU yang diupdate tersebut, sudah di-refresh juga tidak muncul."
  report_url: null
test_data_used:
  - field: "Parent SKU"
    value: "SKU-DefaultVarianOn-(PARENT)"
  - field: "Target Child SKU"
    value: "SKU-DefaultVarianOn-biru"
  - field: "Variant Type"
    value: "CLR-SP (abu, biru, cream, merah muda)"
run_history:
  - date: "2026-09-16"
    status: failed
    environment: staging
    executed_by: "QA Engineer"
    summary: "Gambar terupdate spesifik di child biru, tapi gambar tidak tampil di datalist baris child."
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
  notes: "Update sukses tersimpan di detail hanya pada SKU-DefaultVarianOn-biru (tidak bocor ke child lain), tetapi gambar tidak tampil di datalist pada baris SKU yang diupdate tersebut (sudah di-refresh tetap tidak muncul)."
---

# TC-SYSPROD-043 (TC-02)

## Deskripsi Uji
Memverifikasi perbaikan bug ETM-15944 pada metode upload gambar secara **Manual** melalui section *product detail* ke spesifik varian child saat kondisi *Default System Product (STD)* aktif, serta memverifikasi kemunculan thumbnail gambar di datalist.

## Catatan Eksekusi Uji (Staging - 16 September 2026)
- **Kondisi:** Default variant aktif (`STD`).
- **Data Uji:** Parent `SKU-DefaultVarianOn-(PARENT)` dengan varian baru `CLR-SP` (abu, biru, cream, merah muda).
- **Target Uji:** Upload gambar manual ke `SKU-DefaultVarianOn-biru`.
- **Hasil:**
  - Update sukses tersimpan di detail dan hanya mempengaruhi SKU child terkait (`SKU-DefaultVarianOn-biru`), tidak bocor ke child lain.
  - **Defect / Temuan:** Gambar tidak tampil di Datalist System Product pada baris SKU child yang diupdate tersebut (sudah di-refresh tetap tidak muncul).
- **Status Akhir:** **FAILED**
