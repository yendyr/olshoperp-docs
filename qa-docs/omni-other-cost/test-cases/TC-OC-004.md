---
doc_type: e2e-test-case
tc_code: TC-OC-004
menu: omni-other-cost
menu_name: "Other Cost"
title: "SEARCH — Code di datalist"
summary: "Searchbox Code AT-OC-*; baris dengan Code + Name updated tampil."
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
  - "TC-OC-002/003: Other Cost AT-OC-* ada."
test_data:
  - code_prefix: "AT-OC-"
steps:
  - "Buka datalist Other Cost."
  - "Search Code."
  - "Verifikasi baris Code + Name."
expected_result: |
  Baris Other Cost tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-20T06:00:00Z"
  finished_at: "2026-07-20T06:01:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-cost-crud.spec.ts � TC-OC-004 � company lumicharmsid"
  report_url: null
---

# TC-OC-004

## Catatan automation

- Spec: `@TC-OC-004`
