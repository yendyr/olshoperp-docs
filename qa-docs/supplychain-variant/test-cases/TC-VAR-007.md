---
doc_type: e2e-test-case
tc_code: TC-VAR-007
menu: supplychain-variant
menu_name: "Master Variant"
test_type: edge
title: "Mutual exclusive Default Variant — ON baru men-OFF yang lama"
summary: "Hanya satu Default Variant ON per company; record lama otomatis OFF."
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
  - "Sudah ada Default ON: DV3738 / edit 2964 (Standard)."
test_data:
  - field: "Existing default"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2964"
  - field: "New default Code"
    value: "D24378"
  - field: "New default Name"
    value: "DefTwo4378"
  - field: "New default Option"
    value: "Std2"
steps:
  - "Create Variant Group baru, 1 opsi, **Default Variant** ON, **Save & Next**."
  - "Buka edit record default lama (2964)."
  - "Cek toggle **Default Variant** di kedua record."
expected_result: |
  Max 1 Default ON per company. ON baru → record lama OFF otomatis (requirement §6.3).
  Semua Default OFF boleh (tidak wajib keep one).
test_result:
  status: passed
  started_at: "2026-08-14 06:23"
  finished_at: "2026-08-14 06:25"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    Create D24378 / DefTwo4378 / Std2 Default ON → edit 2966, Default ON, opsi Std2 saja.
    Reload 2964 DV3738: Default Variant OFF, opsi tetap Standard, Active ON, Show for all company OFF.
    Turn OFF default terakhir (2966) tidak dijalankan di UI (overlay intercept click); all-OFF last-default tidak diverifikasi terpisah.
  report_url: null
test_data_used:
  - field: "URL default baru"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2966"
  - field: "URL default lama (unset)"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2964"
run_history:
  - at: "2026-08-14 06:25"
    status: pass
    note: "ETM-15511 — mutual exclusive OK; all-OFF last default not separately clicked"
origin_jira: ETM-15511
last_execution:
  at: "2026-08-14 06:25"
  jira: "ETM-15511"
  status: passed
  via: "legacy:test_result"
---

# TC-VAR-007

## Catatan QA

Active dan **Show for all company** tidak rusak (tetap ON / OFF sesuai save). Hide default di select2 System Product = sibling [ETM-15512](https://erpintegration.atlassian.net/browse/ETM-15512), tidak diuji di card ini.
