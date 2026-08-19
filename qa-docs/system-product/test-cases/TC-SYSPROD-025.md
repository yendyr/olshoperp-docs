---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-025
menu: system-product
menu_name: "System Product"
title: "Import New — semua Master Default OFF → Single tetap mungkin"
summary: "Tanpa Default ON, Import New kandidat Single tidak dipaksa Variant / `-(PARENT)`."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 Semua Default OFF"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "**Semua** Master Variant Default OFF di company uji (atau company tanpa Default). Setelah test, kembalikan Default ON bila dipakai TC lain."
  - "SKU belum ada. Import **New Product**. Variant cols kosong."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Import type"
    value: "New Product"
steps:
  - "Konfirmasi Master Variant tidak ada Default ON."
  - "Import New 1 row Single-eligible. Submit."
  - "Cek tipe datalist = Single; SKU = kode file (bukan `-(PARENT)`)."
expected_result: |
  Single tetap mungkin. Tidak auto parent `-(PARENT)`. Tidak auto Enable Variations.

  [CATATAN QA] AC ETM-15495: Default OFF → Single import/create tetap mungkin. AS-IS Type `single` tetap bisa menolak — jika gagal, coba Type blank (catat). Kembalikan Default ON setelah run.
  Referensi: requirement §6.3.1 baris “Semua Default OFF di master”.
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
jira_key: ETM-15575
last_execution:
  at: null
  jira: null
---

## Catatan QA

Isolasi company: jangan matikan Default di company yang sedang dipakai TC Default ON paralel.
