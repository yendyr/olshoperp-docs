---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-029
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Import Update Product — target child SKU vs parent -(PARENT); stok tidak pindah"
summary: "Default-origin punya 2 kode. Update salah baris tidak boleh menimpa identitas atau Stock ID child."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3 transactable child + ETM-15495 stok"
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
  - "Default Variant persist. Child punya stok > 0. Catat Stock ID, qty, product_id child vs parent."
  - "Template Update Product: satu row pakai SKU **child**; ulang (file ke-2) pakai SKU **parent** `-(PARENT)`."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "Update Product"
steps:
  - "Update Product row = child SKU, ubah name/price. Cek stok masih di child."
  - "Update Product row = parent `{sku}-(PARENT)`. Cek parent tetap non-transactable; stok tidak pindah ke parent."
  - "Cek SKU not found vs update parent fields only."
expected_result: |
  Update child: field child berubah; Stock ID/qty child **tidak berubah**.
  Update parent: tidak membuat parent jadi stockable; tidak menghapus child; tidak remap stok.
  Template yang lookup SKU harus ketemu keduanya secara terpisah (parent vs child beda product_id).

  [CATATAN QA] §6.3: hanya child transactable. Request user ETM-15495: Stock ID di SKU variant tidak berubah nilainya. Fail jika update parent menelan child atau stok nempel di `-(PARENT)`.
  Referensi: requirement §6.3 Transactable; kartu Additional Context stok.
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
jira_key: ETM-15579
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Identitas dua SKU. Jangan Update Variant Product di sini.
