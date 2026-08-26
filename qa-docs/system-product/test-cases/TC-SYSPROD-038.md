---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-038
menu: system-product
menu_name: "System Product"
test_type: edge
title: "Import skip explicit variant / parent-used"
summary: "Mengimpor produk yang berisi variasi eksplisit atau SKU yang dipakai parent row lain dilewati (tidak dikenakan auto-default)."
status: draft
owner: QA - Antigravity
last_updated: 2026-08-21
requirement_ref: "qa-docs/system-product/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - supplychain-variant
preconditions:
  - "Master Default Variant ON."
test_data:
  - field: Excel file
    value: "Excel file with explicit variant groups or parent rows"
steps:
  - "Buka System Product → Import."
  - "Unggah file excel uji sesuai skenario berikut:"
  - "  - Case 1: SKU dengan Variant Type/Option terisi, kolom Type & Parent dikosongi."
  - "  - Case 2: SKU dengan Variant Type/Option terisi, kolom Type diisi, Parent dikosongi."
  - "  - Case 3.1: SKU dengan Variant Type/Option terisi, kolom Type dikosongi, SKU Code = Parent = SKU-UUU."
  - "  - Case 3.2: SKU dengan Variant Type/Option terisi, kolom Type dikosongi, SKU Code = SKU-KKK, Parent = SKU-KKK-(PARENT)."
  - "  - Case 4.1: SKU dengan Variant Type/Option terisi, kolom Type & Parent diisi, SKU Code = SKU-VVV, Parent = SKU-VVV-(PARENT)."
  - "  - Case 4.2: SKU dengan Variant Type/Option terisi, kolom Type & Parent diisi, SKU Code = Parent = SKU-CCC."
  - "Amati status history dan error log import."
expected_result: |
  Sistem melewati (skip) auto-default untuk baris variant eksplisit.
  Detail observasi error import:
  - Case 1: Status history success, failed row = 0, success row = 0, SKU tidak terdaftar di datalist.
  - Case 2: Import gagal. Log: 'Row 2: Parent is required for variant product.'.
  - Case 3.1: Failed row = 1. Log: 'Invalid SKU Parent' & 'Invalid product type'.
  - Case 3.2: Failed row = 1. Log: 'Invalid Product type' & 'Parent SKU not found in import file'.
  - Case 4.1: Failed row = 1. Log: 'Parent SKU not found in import file'.
  - Case 4.2: Failed row = 1. Log: 'Invalid SKU Parent'.
test_result:
  status: pass
  started_at: 2026-08-21T14:53:00+07:00
  finished_at: 2026-08-21T14:56:00+07:00
  executed_by: User
  environment: staging
  log_summary: "Verifikasi impor skip/gagal pada skenario eksplisit variant dengan 4 sub-case berhasil didokumentasikan."
  report_url: null
test_data_used:
  - SKU-UUU
  - SKU-KKK
  - SKU-VVV
  - SKU-CCC
run_history:
  - status: pass
    executed_by: User
    at: 2026-08-21T14:56:00+07:00
    jira: ETM-15512
origin_jira: ETM-15512
last_execution:
  at: 2026-08-21T14:56:00+07:00
  jira: ETM-15512
---
