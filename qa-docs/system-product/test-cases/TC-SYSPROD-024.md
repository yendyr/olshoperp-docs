---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-024
menu: system-product
menu_name: "System Product"
title: "Import New — kolom Type = single vs blank (GAP-SP-17 AS-IS vs TO-BE)"
summary: "AS-IS Type `single` ditolak. TO-BE: path yang menghasilkan Single + Default ON harus jadi Variant. Blank Type = kandidat Single."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3.1 Import create + GAP-SP-17 Type single"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Master Default ON. Template New punya kolom Type (cek header staging). Dua SKU belum ada."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
  - field: "Row A"
    value: "Type = single; Variant cols kosong"
  - field: "Row B"
    value: "Type blank/kosong; Variant cols kosong (kandidat Single)"
steps:
  - "Import New file 2 row (atau 2 file): Type `single` vs Type blank. Variant Type/Option kosong. Bukan parent-used."
  - "Submit. Catat import log per row + hasil datalist."
expected_result: |
  Row B (blank / Single-eligible): TO-BE sama `TC-SYSPROD-006` — parent `-(PARENT)` + child = SKU.
  Row A (Type `single`): TO-BE kartu = “Type/path yang menghasilkan Single + Default ON → Variant” (boleh sukses pola Default). AS-IS `ProductImport`: pesan `Product type 'single' is not supported`.

  [CATATAN QA] Fail TO-BE jika Default ON tapi Type `single` masih hard-reject sementara blank Type sukses — operator yang isi Type=single dari template lama tidak kebagian auto-default. Catat actual vs AC ETM-15495.
  Referensi: requirement §6.3.1; technical ProductImport Type single reject; kartu AS-IS Import Type single ditolak.
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
jira_key: ETM-15574
last_execution:
  at: null
  jira: null
---

## Catatan QA

Celah template lama. Jangan samakan dengan Default OFF (`TC-SYSPROD-025`).
