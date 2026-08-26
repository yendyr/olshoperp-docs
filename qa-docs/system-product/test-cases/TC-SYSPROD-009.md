---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-009
menu: system-product
menu_name: "System Product"
test_type: edge
title: "SKU baru omit opsi Default; kolom Default group hidden di datatable variant"
summary: "Setelah expand: naming tanpa segment Default; kolom dynamic Default visible false."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 / §6.3.2 V-07"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Parent Default-origin sudah di-expand minimal 1 group tambahan (hasil TC-SYSPROD-007 atau 240)."
  - "Nama opsi Default master diketahui (mis. Standard)."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Edit parent Variant. Lihat header kolom datatable variant."
  - "Catat semua SKU child hasil generate."
expected_result: |
  Kolom dynamic Default group tidak tampil (visible: false, fase 1 UI).
  SKU baru bukan `…-{DefaultOpt}-biru-…`. Benar: `SKUPENSIL-biru-pikacu`.

  [CATATAN QA] V-07 + naming Default-origin §6.3.2. Hide Default di export template = out of scope.
  Referensi: qa-docs/system-product/requirement.md §6.3.1–§6.3.2.
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
jira_key: ETM-15558
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

## Catatan QA

Port ETM-15512 TC-07 (tanpa max-3 — itu TC-SYSPROD-010).
