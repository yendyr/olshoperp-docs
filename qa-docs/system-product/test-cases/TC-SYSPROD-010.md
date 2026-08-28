---
doc_type: e2e-test-case
tc_code: TC-SYSPROD-010
menu: system-product
menu_name: "System Product"
test_type: negative
title: "Error — Default group hitung ke max 3 types; group ke-4 ditolak (GAP-SP-06 FE only)"
summary: "Default + 2 group = 3. Tambah group ke-4 harus ditolak. Cek FE vs BE (GAP-SP-06 partial)."
status: draft
owner: QA - Yemima
last_updated: 2026-08-17
requirement_ref: "qa-docs/system-product/requirement.md §6.3 max 3 types; §6.3.1 Default counts; GAP-SP-06; DEV-SP-03"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - supplychain-variant
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Parent sudah punya Default + 2 Variant Group (total 3)."
test_data:
  - field: "UI"
    value: "https://staging.olshoperp.com/supplychain/product"
steps:
  - "Edit parent. Coba tambah Variant Group ke-4. Save."
  - "Jika UI memblok: catat pesan. Jika UI lolos: cek apakah BE tetap simpan (GAP-SP-06)."
expected_result: |
  Default group menghitung ke max **3** variant types (V-06 / §6.3.1). Group ke-4 tidak tersimpan.

  [CATATAN QA] GAP-SP-06: max 3 **enforced FE only**, BE belum (DEV-SP-03). Fail jika UI lolos **dan** BE menyimpan type ke-4. Jika UI blok tapi API tanpa validasi — catat residual GAP-SP-06, bukan lulus penuh.
  Referensi: qa-docs/system-product/requirement.md §6.3, GAP-SP-06, DEV-SP-03.
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
jira_key: ETM-15560
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

Skenario error dari gap registry requirement — bukan asumsi ERP.
