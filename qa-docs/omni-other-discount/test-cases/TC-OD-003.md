---
doc_type: e2e-test-case
tc_code: TC-OD-003
menu: omni-other-discount
menu_name: "Other Discount"
title: "UPDATE — Name + Description"
summary: "Edit by Code; ubah Name; Description = automation playwright; Save All."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/omni-other-discount/knowledge-base.md"
automated: true
automated_spec: "tests/specs/other-discount/other-discount-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "TC-OD-002: Other Discount AT-OD-* sudah ada."
test_data:
  - description: "automation playwright"
steps:
  - "Search Code → buka edit (Show)."
  - "Ubah Name; set Description = automation playwright."
  - "Save All."
expected_result: |
  Name/Description tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T06:15:00Z"
  finished_at: "2026-07-20T06:16:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-discount-crud.spec.ts � TC-OD-003 � company lumicharmsid"
  report_url: null
---

# TC-OD-003

## Catatan automation

- Spec: `@TC-OD-003`
