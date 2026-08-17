---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-023
menu: system-product
menu_name: "System Product"
title: "Import New — skip auto-default karena SKU dipakai sebagai Parent di row lain"
summary: "Row parent + child merefer Parent. SKU parent-used tidak di-auto-default."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 Import create V-03 skip parent-used"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Import **New Product**. SKU belum ada."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "New Product"
  - field: "Parent SKU"
    value: "ETM15495-IMPPAR-{stamp}"
  - field: "Child row"
    value: "merefer kolom Parent = SKU parent di atas"
steps:
  - "Satu file: row parent + minimal 1 row child yang kolom Parent-nya = SKU parent."
  - "Submit. Bandingkan: parent tidak boleh diubah jadi `{sku}-(PARENT)` Default di atas mapping user."
expected_result: |
  **Skip** auto-default untuk SKU yang dipakai sebagai Parent di row lain.
  Mapping Parent–Child yang user nyatakan di file tetap. Tidak merusak child naming kolom user.

  [CATATAN QA] V-03: “SKU dipakai sebagai Parent di row lain → Skip”.
  Referensi: requirement §6.3.1; ETM-15512 TC-04 skenario B.
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

Beda dari skip explicit (`TC-SYSPROD-022`): di sini trigger-nya **parent-used**, bukan kolom variant terisi semata.
