---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-027
menu: system-product
menu_name: "System Product"
title: "Import Update Product — Default Variant sudah persist, update field saja"
summary: "Update Product (bukan New, bukan Update Variant). Ubah name/price child atau parent. Tree Default dan Stock ID tidak boleh berubah."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §13 Update Product + §6.3.1 identitas parent/child"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Produk Default sudah ada (create manual atau Import New `TC-SYSPROD-006`): parent `{sku}-(PARENT)`, child `{sku}`. Zero relasi OK; bila ada stok, catat Stock ID+qty."
  - "Import type **Update Product**. Download template update."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "Update Product"
steps:
  - "Export/isi template Update: ubah SKU Name dan/atau Retail Price pada **child** `{sku}`. Jangan ubah kode SKU."
  - "Submit Update Product. Cek parent masih `{sku}-(PARENT)`, child masih `{sku}`, Variations ON, Default group tetap."
  - "Jika ada stok: Stock ID + qty child sama."
expected_result: |
  Field yang diisi template ter-update. Struktur Variant Default **utuh**. Tidak auto-rename SKU. Tidak auto-remap stok. Tidak collapse ke Single. Tidak generate `-(PARENT)-(PARENT)`.

  [CATATAN QA] GAP-SP-17 auto-default = **Import create / New**, bukan Update field. Update Product §13 = bulk update field.
  Referensi: requirement §13 Update Product; §6.3.2 no auto-rename / no auto stock remap (sibling).
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

## Catatan QA

Path **Update Product**. Jangan pakai New Product (itu create). Expand group = `TC-SYSPROD-030`/`TC-SYSPROD-031` (Update Variant Product).
