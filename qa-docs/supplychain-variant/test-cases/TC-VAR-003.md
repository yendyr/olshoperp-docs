---
doc_type: e2e-test-case
tc_code: TC-VAR-003
menu: supplychain-variant
menu_name: "Master Variant"
title: "Form toggle Default Variant + kolom list Default"
summary: "Create/Edit Master Variant menampilkan toggle default; datalist punya kolom Default Yes/No."
status: draft
owner: QA - Yemima
last_updated: 2026-08-14
requirement_ref: "qa-docs/supplychain-variant/requirement.md"
automated: true
automated_spec: "tests/specs/variant/variant-fail-cases.spec.ts"
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "User login staging, company FAT (112)."
  - "Menu SCM → Master → Variant accessible."
  - "URL list: https://staging.olshoperp.com/supplychain/variant"
test_data:
  - field: "Menu"
    value: "/supplychain/variant"
  - field: "Company"
    value: "FAT (112)"
steps:
  - "Buka https://staging.olshoperp.com/supplychain/variant"
  - "Cek header kolom datalist (termasuk Columns Show/Hide bila ada)."
  - "Klik Create → buka https://staging.olshoperp.com/supplychain/variant/create"
  - "Cek label toggle di area Active / Show for all company, plus tooltip."
expected_result: |
  Form Create/Edit punya toggle **Set as Default System Product** (requirement §6.1).
  Datalist punya kolom **Default** (Yes/No).
  Default toggle awal = OFF.
test_result:
  status: failed
  started_at: "2026-08-14 06:11"
  finished_at: "2026-08-14 06:16"
  executed_by: "QA - Yemima (Playwright MCP)"
  environment: staging
  log_summary: |
    Toggle ada di Create/Edit, default OFF, tooltip ada.
    Label UI = **Default Variant** (bukan **Set as Default System Product**).
    Datalist header FAT: code, variant name, options, description, active, created by/created at, action — kolom **Default** tidak ada.
    Field payload = is_default_variant (bukan is_default).
    FE build Thu Aug 13 16:05 +0700 · API 2026-08-13 16:03:47.
  report_url: null
test_data_used:
  - field: "URL list"
    value: "https://staging.olshoperp.com/supplychain/variant"
  - field: "URL create"
    value: "https://staging.olshoperp.com/supplychain/variant/create"
  - field: "URL edit (Default ON lalu di-unset)"
    value: "https://staging.olshoperp.com/supplychain/variant/edit/2964"
run_history:
  - at: "2026-08-14 06:16"
    status: fail
    note: "ETM-15511 — label toggle + kolom list Default tidak sesuai AC"
origin_jira: ETM-15511
last_execution:
  at: "2026-08-14 06:16"
  jira: "ETM-15511"
  status: failed
  via: "legacy:test_result"
---

# TC-VAR-003

## Catatan QA

**AC card:** Toggle **Set as Default System Product** + kolom list **Default**.

**Actual:** switch label **Default Variant**. Tooltip: *When enabled, this Default Variant is automatically applied when creating a new SINGLE System Product. Only one Default Variant is allowed per company, and Option Name must contain exactly one option.*

Kolom list **Default** tidak diimplementasikan di datalist staging.
