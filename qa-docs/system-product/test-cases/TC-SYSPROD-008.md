---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-008
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Expand saat child berelasi — leftover + confirm; Stock ID/qty tidak berubah; tidak auto-rename"
summary: "Inti ETM-15495: tambah Variant Group; leftover Active; SKU baru; hard-block hilang; stok leftover tetap."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 GAP-SP-18 V-04 V-05"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
  - accounting-stock-remapping
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Child Default punya relasi minimal 1 (SO/PR/PO/inbound/outbound/transfer/WO/binding/BOM/bundle) dan/atau stok di item stock. Catat Stock ID + qty sebelum expand."
  - "Siapkan 2 group baru (total ≤ 3 termasuk Default), contoh Warna biru/hijau + Motif doraemon/pikacu."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Contoh leftover (requirement)"
    value: "SKUPENSIL leftover; SKUPENSIL-biru-doraemon dst new"
steps:
  - "Edit parent. Catat Stock ID + available qty child leftover."
  - "Tambah Variant Group + opsi. Save. Amati confirmation popup leftover."
  - "Cancel → struktur child lama tidak berubah; qty stok sama."
  - "Ulangi → Confirm. Cek child list + Stock ID/qty leftover."
expected_result: |
  Tidak muncul hard-block `Cannot add variant, Product already have relations`.
  Confirm popup wajib (V-05). Cancel: tidak commit expand.
  Confirm: leftover tetap Active under same parent; semua kombinasi baru = ID baru.
  Pola SKU: leftover = kode lama (tidak di-rename). Baru omit opsi Default (`SKUPENSIL-biru-pikacu` bukan `…-Standard-biru-…`).
  Stock ID leftover **tidak ganti**; nilai qty **tidak berubah**. Tidak auto stock remap (mapping baru lewat Stock Remapping).
  Inactive leftover hanya lewat existing inactive rules.

  [CATATAN QA] Inti request user ETM-15495 + TO-BE §6.3.2. Latar belakang user sempat sebut auto-rename (`SKUPENSIL-biru` → `SKUPENSIL-biru-pikacu`) — **TO-BE: tidak ada auto-rename**. Fail jika system masih rename leftover.
  Known residual: SO `detail_sku_name` bisa string lama setelah rename manual — bukan fail expand ini.
  Referensi: qa-docs/system-product/requirement.md §6.3.2.
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
jira_key: ETM-15559
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Port ETM-15512 TC-06 + AC stok. Relasi pengunci: PR, PO, inbound, outbound, transfer, SO, WO, binding, BOM header & detail, bundle header & detail.
