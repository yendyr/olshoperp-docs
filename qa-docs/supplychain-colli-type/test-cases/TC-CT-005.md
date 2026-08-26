---
doc_type: e2e-test-case
tc_code: TC-CT-005
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Create Colli Type — Code atau Name kosong diblok save"
summary: "Code dan Name wajib; kosongkan salah satu lalu simpan harus ditolak."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-colli-type/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company aktif: FAT (id: 112)."
  - "URL create: https://staging.olshoperp.com/supplychain/colli-type/create"
test_data:
  - field: "Code (kasus A)"
    value: "(kosong)"
  - field: "Name (kasus A)"
    value: "Box"
  - field: "Code (kasus B)"
    value: "BOX"
  - field: "Name (kasus B)"
    value: "(kosong)"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/colli-type/create"
  - "Kasus A: Name terisi, Code kosong → simpan."
  - "Kasus B: Code terisi, Name kosong → simpan."
expected_result: |
  Save diblok. Code / Name kosong = required (requirement §7, AC CT-01).
test_result:
  status: passed
  started_at: "2026-08-14 12:29"
  finished_at: "2026-08-14 12:31"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    PASS — tetap di /create (tidak redirect).
    Kasus A Name=Box Code kosong → toast "The code field is required. (and 1 more error)"; inline Code: "The code field is required."
    Kasus B Code=BOX Name kosong → toast "The code has already been taken. (and 1 more error)"; inline Name: "The name field is required." (unique BOX ikut muncul karena Code=BOX existing — unique diuji penuh di TC-CT-006).
  report_url: null
test_data_used:
  - field: "Kasus A"
    value: "Code kosong, Name Box → The code field is required."
  - field: "Kasus B"
    value: "Code BOX, Name kosong → The name field is required. (+ unique BOX)"
run_history:
  - at: "2026-08-14 12:31"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 12:31"
  jira: "ETM-15543"
  status: passed
  via: "legacy:test_result"
---

# TC-CT-005

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Requirement tidak menetapkan copy pesan required exact — catat pesan UI aktual di log saat run.
