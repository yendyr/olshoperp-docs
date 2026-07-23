---
doc_type: e2e-test-case
tc_code: TC-OC-003
menu: omni-other-cost
menu_name: "Other Cost"
title: "UPDATE — Name + Description"
summary: "Edit Other Cost by Code; ubah Name; Description = automation playwright; Save All. Jangan ubah COA/Active (auto-save watcher)."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/omni-other-cost/knowledge-base.md"
automated: true
automated_spec: "tests/specs/other-cost/other-cost-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "TC-OC-002: Other Cost AT-OC-* sudah ada."
test_data:
  - description: "automation playwright"
steps:
  - "Search Code → buka edit."
  - "Ubah Name; set Description = automation playwright."
  - "Save All."
expected_result: |
  Name/Description tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T06:00:00Z"
  finished_at: "2026-07-20T06:01:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-cost-crud.spec.ts � TC-OC-003 � company lumicharmsid"
  report_url: null
---

# TC-OC-003

## Catatan automation

- Spec: `@TC-OC-003`
- Jangan toggle Active / ganti COA di edit (watcher auto POST).
