---
doc_type: e2e-test-case
tc_code: TC-ASMBLY-002
menu: supplychain-assembly
menu_name: "Assembly"
title: "Update Assembly description (remain Draft)"
summary: "Update Description dokumen hasil create; tetap Draft (Open butuh detail FG)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-assembly/requirement.md"
automated: true
automated_spec: "tests/specs/assembly/assembly-create-update.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Dokumen dari TC-ASMBLY-001 (serial)."
test_data:
  - field: "Description (updated)"
    value: "AS automation updated {stamp}"
steps:
  - "Edit dokumen hasil create."
  - "Ubah Description → Save All."
  - "Pastikan status tetap Draft; Description sync di datalist."
expected_result: |
  Description ter-update; status tetap draft.
test_result:
  status: passed
  started_at: null
  finished_at: null
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: |
    PASS (~31s) — update description, remain Draft.
  report_url: null
run_history:
  - at: "2026-07-15"
    status: passed
    note: "Playwright @TC-ASMBLY-002"
---

# TC-ASMBLY-002

## Catatan automation

- Spec: `@TC-ASMBLY-002`
- Jangan klik Open di TC ini (A-21: minimal 1 detail).
