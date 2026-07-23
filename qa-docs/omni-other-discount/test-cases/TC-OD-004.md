---
doc_type: e2e-test-case
tc_code: TC-OD-004
menu: omni-other-discount
menu_name: "Other Discount"
title: "SEARCH — Code di datalist"
summary: "Searchbox Code AT-OD-*; baris dengan Code + Name updated tampil."
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
  - "TC-OD-002/003: Other Discount AT-OD-* ada."
test_data:
  - code_prefix: "AT-OD-"
steps:
  - "Buka datalist Other Discount."
  - "Search Code."
  - "Verifikasi baris Code + Name."
expected_result: |
  Baris Other Discount tampil di datalist.
test_result:
  status: pass
  started_at: "2026-07-20T06:15:00Z"
  finished_at: "2026-07-20T06:16:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-discount-crud.spec.ts � TC-OD-004 � company lumicharmsid"
  report_url: null
---

# TC-OD-004

## Catatan automation

- Spec: `@TC-OD-004`
