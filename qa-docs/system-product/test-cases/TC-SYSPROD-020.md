---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-020
menu: system-product
menu_name: "System Product"
test_type: edge
title: "OFF Enable Variations — import Default ON, zero relation"
summary: "Path import (bukan manual create). Setelah row jadi parent/child Default, OFF+Save mengikuti identitas SKU yang sama dengan DRAFT TC-SYSPROD-013."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 import + V-02"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Import 1 row Single-eligible (bukan explicit variant, SKU belum dipakai parent). Import sukses: parent `{sku}-(PARENT)`, child `{sku}`."
  - "Zero stok, zero haveRelations. (Import skip explicit/parent-used = DRAFT TC-SYSPROD-006, jangan ulangi skip di sini.)"
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Cari SKU hasil import. Edit parent. OFF Enable Variations → confirm → Save."
  - "Cek datalist + edit: Single = SKU file import, bukan `-(PARENT)` ghost; child tidak orphan."
expected_result: |
  Sama semangat DRAFT TC-SYSPROD-013: Confirm+Save → Single dengan **SKU row import**. Tidak boleh tinggal `{sku}-(PARENT)` sebagai satu-satunya baris.
  Popup V-02 tetap wajib.

  [CATATAN QA] §6.3.1 import = mekanisme create yang sama (parent suffix, child = user SKU). OFF tidak boleh beda antara manual vs import.
  Referensi: requirement §6.3.1 Import create; DRAFT TC-SYSPROD-006 hanya cover skip, bukan OFF.
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
jira_key: ETM-15570
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Path import. Jangan pakai file explicit-variant / parent-used (itu skip, bukan kandidat OFF).
