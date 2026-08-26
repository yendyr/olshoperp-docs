---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-007
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Expand Variant Group — child zero-relation: soft delete + regenerate ID baru"
summary: "Tanpa relasi: child obsolete soft-delete; kombinasi baru ID baru; tidak auto-rename; tidak auto stock remap."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.2 GAP-SP-18"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Produk Default-origin: parent `{sku}-(PARENT)`, child `{sku}` tanpa PR/PO/inbound/outbound/transfer/SO/WO/binding/BOM/bundle."
  - "Total group setelah expand ≤ 3 termasuk Default."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Group baru"
    value: "Warna — merah, biru"
steps:
  - "Edit parent Variant. Tambah Variant Group (bukan Default) + opsi. Save All."
  - "Catat child SKU + apakah child Default lama masih Active."
expected_result: |
  Tidak hard-block `Cannot add variant, Product already have relations`.
  Child Default lama obsolete **soft-deleted** (zero relation).
  Kombinasi baru = product ID baru. SKU baru omit opsi Default. Tidak auto-rename. Tidak auto stock remap.

  [CATATAN QA] Cabang zero-relation §6.3.2. Bukan kasus stok-ada (itu TC-SYSPROD-011).
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
jira_key: ETM-15557
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Port ETM-15512 TC-05.
