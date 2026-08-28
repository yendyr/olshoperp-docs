---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-014
menu: system-product
menu_name: "System Product"
test_type: edge
title: "OFF Enable Variations — child punya stok, zero haveRelations"
summary: "Stok di child bukan syarat leftover/haveRelations. OFF tidak boleh menghilangkan Stock ID/qty atau memindahkan stok diam-diam ke parent."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 V-02 + §6.3.2 stok bukan syarat relasi"
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
  - "Variant Default sudah persist. Child punya **qty stok > 0** di item stock. **Tidak** ada PR/PO/SO/inbound/outbound/transfer/WO/binding/BOM/bundle."
  - "Catat Stock ID + available qty child **sebelum** OFF. (Sama tegangan dengan DRAFT TC-SYSPROD-011 expand stock-only.)"
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Edit parent. Catat child SKU, product_id, Stock ID, qty."
  - "OFF Enable Variations → amati popup. Cancel → stok tidak berubah."
  - "Confirm + Save (atau catat error jika BE menolak)."
  - "Cek item stock: Stock ID masih ada? qty sama? product_id stok masih child atau pindah ke parent `-(PARENT)`? Child masih Active?"
expected_result: |
  Cancel: stok tidak berubah.
  Confirm: stok **tidak hilang** dan **tidak auto-remap** (mapping baru hanya lewat Stock Remapping — sibling §6.3.2).
  Single yang tersisa harus tetap punya qty yang sama pada identitas stockable (child/SKU user), bukan parent wrapper kosong.

  [CATATAN QA] §6.3.2: stok **bukan** syarat `haveRelations` — expand stock-only boleh soft-delete child. OFF Variations **tidak** di-spec terpisah. Infer: jangan silent-delete child berstok (pecah inventory). Fail jika child dihapus, Stock ID orphan, qty 0, atau stok nempel di `{sku}-(PARENT)` yang tidak transactable.
  Bandingkan hasil dengan DRAFT TC-SYSPROD-011 (expand, bukan OFF).
  Referensi: requirement §6.3.1–§6.3.2; technical.md soft-delete gate = relation-only (not stock-only).
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
jira_key: ETM-15564
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

## Catatan QA

Worst case: OFF menghapus child (`enable_variant=false` → `Product::whereIn(children)->delete()`) sementara `haveRelations` false karena stok tidak dihitung — inventory pecah tanpa error.
