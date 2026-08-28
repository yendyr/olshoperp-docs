---
doc_type: e2e-test-case
tc_code: TC-VAR-005
menu: supplychain-variant
menu_name: "Master Variant"
test_type: edge
title: "Create Default Variant OFF + 1 opsi — tetap inject random"
summary: "Create tanpa Default ON masih menambahkan opsi random seperti AS-IS."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-variant/requirement.md"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login staging, company FAT (112)."
  - "Akses Create Master Variant."
test_data:
  - field: "Code"
    value: "NR9551"
  - field: "Variant Group Name"
    value: "NoDef9551"
  - field: "Option Name"
    value: "Red"
  - field: "Default Variant"
    value: "OFF"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/variant/create"
  - "Isi Code, Variant Group Name, Option Name `Red`."
  - "Biarkan **Default Variant** OFF."
  - "Klik **Save & Next**."
  - "Cek Option Name di Edit."
expected_result: |
  Save sukses. Opsi tersimpan `[random, Red]` — inject `random` AS-IS (requirement §6.2 create Default OFF).
test_result:
  status: passed
  started_at: "2026-08-14 06:17"
  finished_at: "2026-08-14 06:18"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    Create Default OFF, option payload Red saja. Setelah save Edit 2965 menampilkan tag random + Red. Default tetap OFF.
  report_url: null
test_data_used:
  - field: "URL edit"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2965"
  - field: "Code / Name"
    value: "NR9551 / NoDef9551"
  - field: "Options after save"
    value: "random, Red"
run_history:
  - at: "2026-08-14 06:18"
    status: pass
    note: "ETM-15511 — inject random on create Default OFF"
origin_jira: ETM-15511
first_execution:
  at: "2026-08-14 06:18"
  via: "legacy:test_result"
  jira: "ETM-15511"
last_execution:
  at: "2026-08-14 06:18"
  jira: "ETM-15511"
  status: passed
  via: "legacy:test_result"
---

# TC-VAR-005

## Catatan QA

Fixture: [edit 2965](https://staging.olshoperp.com/supplychain/variant/edit/2965).
