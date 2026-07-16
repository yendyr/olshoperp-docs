---
doc_type: e2e-test-case
tc_code: TC-ADJDED-002
menu: supplychain-adjustment-deduction
menu_name: "Stock Deduction"
title: "Update Stock Deduction header (Description / Open)"
summary: "Update Description dokumen hasil create; opsional status Open."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-adjustment-deduction/requirement.md"
automated: true
automated_spec: "tests/specs/adjustment-deduction/adjustment-deduction-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-ADJDED-001 (serial)."
test_data:
  - field: "Description (updated)"
    value: "AO automation updated {stamp}"
steps:
  - "Edit dokumen hasil create."
  - "Ubah Description; opsional Open."
  - "Save All; verifikasi datalist."
expected_result: |
  Description ter-update di form dan datalist.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~37s) — update description (+ Open), datalist sync OK.
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-ADJDED-002"
---

# TC-ADJDED-002

## Catatan automation

- Spec tag: `@TC-ADJDED-002`
- Approve tidak diuji di SCM.
