---
doc_type: e2e-test-case
tc_code: TC-CT-006
menu: supplychain-colli-type
menu_name: "Colli Type"
title: "Create Colli Type — Code duplikat di company yang sama ditolak"
summary: "Code unik per company; create dengan Code yang sudah ada harus reject unique."
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
  - "Sudah ada Colli Type dengan Code yang akan diuji (contoh BOX)."
  - "URL create: https://staging.olshoperp.com/supplychain/colli-type/create"
test_data:
  - field: "Code (duplikat)"
    value: "BOX"
  - field: "Name"
    value: "Box Duplicate"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/colli-type/create"
  - "Isi Code sama dengan type existing (contoh BOX), Name bebas."
  - "Simpan form."
expected_result: |
  Save ditolak (unique Code per company scope, requirement §5 + §7).
  [MENUNGGU REQUIREMENT] Copy pesan unique exact belum ditetapkan (GAP-CT-04). Catat pesan UI aktual di log; QA lead update requirement sebelum TC final.
test_result:
  status: pass
  started_at: "2026-08-14 12:31"
  finished_at: "2026-08-14 12:32"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    PASS — create Code BOX (existing) / Name Box Duplicate. Tetap di /create.
    Toast + inline Code: "The code has already been taken." (GAP-CT-04: copy aktual Laravel unique).
  report_url: null
test_data_used:
  - field: "Code (duplikat)"
    value: "BOX"
  - field: "Name"
    value: "Box Duplicate"
  - field: "Pesan UI"
    value: "The code has already been taken."
run_history:
  - at: "2026-08-14 12:32"
    status: pass
    by: "QA - Yemima (Playwright MCP)"
origin_jira: ETM-15543
last_execution:
  at: "2026-08-14 12:32"
  jira: ETM-15543
---

# TC-CT-006

## Catatan QA

Card: [ETM-15543](https://erpintegration.atlassian.net/browse/ETM-15543). Behavior = reject unique; exact message = GAP-CT-04.
