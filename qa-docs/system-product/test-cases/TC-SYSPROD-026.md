---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-026
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Import New — satu file campur: Single-eligible + skip + row gagal (partial)"
summary: "Auto-default hanya row eligible. Skip dan error tidak boleh menggagalkan / merusak row sukses."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 V-03 + §13 import log"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Satu file **New Product** berisi minimal 3 row: (A) Single-eligible; (B) explicit variant; (C) SKU duplikat existing / category invalid agar ada log gagal."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "New Product"
steps:
  - "Submit 1 file campur. Tunggu progress selesai (jangan anggap 1 error = seluruh file rollback tanpa cek log)."
  - "Cek import history/log per SKU. Cek datalist row A vs B vs C."
expected_result: |
  Row A: pola Default (`-(PARENT)` + child).
  Row B: skip auto-default; mapping user.
  Row C: gagal tercatat di import log; tidak create SKU rusak.
  Row A tidak ikut terhapus karena C gagal (partial — selaras pipeline import log §13).

  [CATATAN QA] V-03 matrix per-row. Jangan expected “seluruh file sukses”. Fail jika eligible A ikut kena pola skip B atau sebaliknya semua dipaksa Default.
  Referensi: requirement §6.3.1 + §13 Logs import-log / import-history.
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
jira_key: ETM-15576
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

Satu file, tiga nasib. Bukan 3 kali import terpisah (`TC-SYSPROD-006`/`TC-SYSPROD-022`).
