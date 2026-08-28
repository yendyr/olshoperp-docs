---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-033
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Expand Variant Group saat child sudah punya stok — leftover + confirm, stok tidak pindah"
summary: "Tambah Variant Group pada produk Variant yang child-nya sudah punya stok: tidak hard-block, confirm leftover, SKU lama tetap, stok/Stock ID tidak berubah."
status: draft
owner: QA - Yemima
last_updated: 2026-08-18
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 GAP-SP-18"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
  - supplychain-stock-monitoring
  - supplychain-adjustment-addition
  - accounting-stock-remapping
preconditions:
  - "Akun playwright@gmail.com / 12345678. Company FAT (id 112)."
  - "Datalist: https://staging.olshoperp.com/supplychain/product"
  - "Master Variant: group Warna (biru, hijau) dan Motif (doraemon, pikacu). Max 3 types per produk."
  - "Produk Variant parent ETM15495-PENSIL dengan child ETM15495-PENSIL-biru dan ETM15495-PENSIL-hijau. Buat dulu jika belum ada (Enable Variations, Add New Variant, Save All)."
  - "Child ETM15495-PENSIL-biru punya stok qty > 0. Catat Stock ID, warehouse, qty dari Dev - Stock Monitoring sebelum expand."
  - "Relasi pengunci soft delete: PR/PO/inbound/outbound/transfer/SO/WO/binding/BOM/bundle (requirement §6.3.2). Stok bukan syarat tunggal."
  - "URL edit parent: https://staging.olshoperp.com/supplychain/product/edit/{id}"
test_data:
  - field: Parent SKU
    value: ETM15495-PENSIL
  - field: Child leftover (punya stok)
    value: ETM15495-PENSIL-biru
  - field: Variant Group baru
    value: Motif — doraemon, pikacu
steps:
  - "Login FAT. Buka https://staging.olshoperp.com/supplychain/product"
  - "Buka URL edit parent ETM15495-PENSIL. Catat child SKU."
  - "Buka Stock Monitoring. Catat Stock ID dan qty ETM15495-PENSIL-biru (baseline)."
  - "Kembali ke edit parent. Tambah Variant Group Motif (doraemon, pikacu). Jangan rename SKU manual."
  - "Klik Save All."
  - "Skenario A: Cancel pada confirmation popup leftover. Child dan stok tidak berubah. Ulangi Save All."
  - "Skenario B: Confirm pada confirmation popup leftover."
  - "Tetap di edit parent. Catat leftover vs SKU baru."
  - "Cek Stock Monitoring: Stock ID dan qty leftover sama dengan baseline. SKU baru tidak menerima stok otomatis."
expected_result: |
  Expand tidak di-hard-block. Pesan "Cannot add variant, Product already have relations" tidak muncul (requirement §6.3.2 GAP-SP-18).

  Confirmation popup wajib sebelum commit leftover. Cancel: child dan stok tidak berubah.

  Setelah Confirm:
  - Leftover ETM15495-PENSIL-biru tetap Active, SKU tidak di-auto-rename (bukan ETM15495-PENSIL-biru-pikacu).
  - Kombinasi baru sebagai product ID baru:
    ETM15495-PENSIL-biru-doraemon
    ETM15495-PENSIL-hijau-doraemon
    ETM15495-PENSIL-biru-pikacu
    ETM15495-PENSIL-hijau-pikacu
  - Child tanpa relasi boleh di-soft-delete. Child berelasi tetap leftover Active.
  - Stock ID dan qty leftover sama dengan baseline. Tidak ada auto stock remap. Mapping stok lewat Stock Remapping (manual).
  - Inactive leftover hanya lewat existing inactive rules.

  [CATATAN QA] Request user di card menyebut auto-rename SKU berstok. Expected mengikuti requirement §6.3.2: tidak ada auto-rename.
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
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# Catatan QA

TC-SYSPROD-002 / 003 hanya create Variant. GAP-SP-17 create/import Default adalah scope ETM-15512, bukan TC ini.
Label UI: Enable Variations, Add New Variant, Save All.
Requirement layer review v2.3. GAP-SP-18 masih TO-BE vs AS-IS hard-block.
