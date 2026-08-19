---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-022
menu: system-product
menu_name: "System Product"
title: "Import New — skip auto-default karena Variant Group+Option eksplisit"
summary: "Row sudah isi variant cols. Jangan dipaksa pola Default `-(PARENT)` + child = SKU user."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 Import create V-03 skip explicit"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Import type **New Product**. SKU belum ada."
  - "Pakai Variant Group **bukan** Default (atau Default + group lain) + Option terisi di kolom template. Parent–child mapping mengikuti pola import variant existing."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "New Product"
  - field: "SKU"
    value: "ETM15495-IMPEX-{stamp}"
steps:
  - "Isi row dengan Variant Type + Variant Option terisi (bukan kosong). Mapping Parent sesuai template variant existing."
  - "Submit Import New. Cek hasil SKU parent/child vs pola Default."
expected_result: |
  **Skip** auto-default. Naming mengikuti kolom variant yang user isi (bukan paksa `{sku}-(PARENT)` + child = `{sku}` ala Default).
  Mapping Parent–Child di file tidak dirusak.

  [CATATAN QA] V-03: “Sudah isi variant group & option → Skip auto-default”.
  Referensi: requirement §6.3.1 tabel Import create; ETM-15512 TC-04 skenario A.
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
jira_key: ETM-15572
last_execution:
  at: null
  jira: null
---

## Catatan QA

Jangan gabung dengan happy Single-eligible (`TC-SYSPROD-006`).
