---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-028
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Import Update Product — existing Single + Master Default ON tidak auto-convert"
summary: "Single yang sudah hidup jangan diam-diam jadi `-(PARENT)` hanya karena Default ON saat Update."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 Import create only + §13 Update Product"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Ada SKU **Single** existing (bukan Variant). Lebih kuat jika Single ini punya stok atau SO (catat)."
  - "Import **Update Product** — ubah name/price saja, SKU sama."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "Update Product"
steps:
  - "Catat product_id, tipe SINGLE, Stock ID bila ada."
  - "Update Product 1 row SKU itu. Submit."
  - "Cek tipe masih Single; tidak muncul `{sku}-(PARENT)` + child baru; stok/SO tidak pindah SKU."
expected_result: |
  Tetap **Single**. Auto-default **tidak** jalan di Update Product.
  Fail/broken: Update mengubah Single jadi parent `-(PARENT)`, child baru, atau merusak stok/SO pada SKU lama.

  [CATATAN QA] §6.3.1 tabel hanya **Import create**. AC kartu: Import Single-eligible = New. Convert existing Single ke Default = di luar V-03; bila actual convert, catat sebagai celah (bisa pecah relasi).
  Referensi: requirement §6.3.1 vs §13 Update Product.
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
jira_key: ETM-15578
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Worst case update: Default ON “menelan” Single existing. Bukan happy Import New.
