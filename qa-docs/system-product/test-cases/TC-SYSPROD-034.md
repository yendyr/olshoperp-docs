---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-034
menu: system-product
menu_name: "System Product"
test_type: happy
title: "Expand Variant Group saat child tanpa relasi — soft delete obsolete + regenerate SKU baru"
summary: "Tambah Variant Group pada produk Variant yang child-nya belum dipakai transaksi: child obsolete di-soft-delete, kombinasi baru dengan product ID baru, tanpa auto-rename."
status: draft
owner: QA - Yemima
last_updated: 2026-08-18
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 GAP-SP-18 (zero relation)"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "Akun playwright@gmail.com / 12345678. Company FAT (id 112)."
  - "Datalist: https://staging.olshoperp.com/supplychain/product"
  - "Master Variant: group Warna (biru, hijau) dan group Motif (doraemon, pikacu). Max 3 types per produk."
  - "Buat produk Variant baru khusus TC ini (jangan reuse leftover TC). Parent ETM15495-CLEAN, child ETM15495-CLEAN-biru dan ETM15495-CLEAN-hijau via Enable Variations, Add New Variant, Save All."
  - "Semua child belum dipakai di PR, PO, inbound, outbound, transfer, SO, WO, binding, BOM, bundle. Qty stok = 0. Tidak ada Stock ID aktif."
  - "URL edit parent: https://staging.olshoperp.com/supplychain/product/edit/{id}"
test_data:
  - field: Parent SKU
    value: ETM15495-CLEAN
  - field: Child sebelum expand
    value: ETM15495-CLEAN-biru, ETM15495-CLEAN-hijau
  - field: Variant Group baru
    value: Motif — doraemon, pikacu
steps:
  - "Login FAT. Buka https://staging.olshoperp.com/supplychain/product"
  - "Buka URL edit parent ETM15495-CLEAN. Catat child SKU dan product ID jika tampil di UI."
  - "Tambah Variant Group Motif (doraemon, pikacu). Jangan rename SKU manual."
  - "Klik Save All."
  - "Tetap di halaman edit. Catat daftar child setelah save: SKU lama vs SKU baru."
  - "Kembali ke datalist, search ETM15495-CLEAN. Verifikasi child obsolete tidak lagi Active."
expected_result: |
  Expand tidak di-hard-block. Pesan "Cannot add variant, Product already have relations" tidak muncul.

  Karena semua child zero-relation (requirement §6.3.2):
  - Child obsolete (ETM15495-CLEAN-biru, ETM15495-CLEAN-hijau) di-soft-delete.
  - Semua kombinasi baru digenerate dengan product ID baru, contoh:
    ETM15495-CLEAN-biru-doraemon
    ETM15495-CLEAN-hijau-doraemon
    ETM15495-CLEAN-biru-pikacu
    ETM15495-CLEAN-hijau-pikacu
  - Tidak ada leftover Active dengan SKU lama.
  - Tidak ada auto-rename ke opsi pertama group baru.
  - Confirmation popup leftover tidak wajib pada path ini (popup wajib hanya jika expand menghasilkan leftover).

  [CATATAN QA] Jika child ternyata punya relasi tersembunyi, skenario pindah ke TC leftover (TC-SYSPROD-033), bukan FAIL cabang zero-relation.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15495
last_execution:
  at: null
  jira: null
---

# Catatan QA

Cabang kedua GAP-SP-18: zero relation = soft delete + regenerate.
Jangan pakai fixture yang sama dengan TC leftover (TC-SYSPROD-033).
Label UI: Enable Variations, Add New Variant, Save All.
