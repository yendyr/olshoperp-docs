---
doc_type: e2e-test-case
tc_code: TC-OC-002
menu: omni-other-cost
menu_name: "Other Cost"
title: "CREATE — Code/Name + Other Cost COA (All Stores)"
summary: "Create Other Cost unik AT-OC-*; pilih Expense COA; All Stores; Description automation playwright; Active ON; Save & Next."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/omni-other-cost/knowledge-base.md"
automated: true
automated_spec: "tests/specs/other-cost/other-cost-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-chart-of-account
preconditions:
  - "Minimal 1 Expense COA selectable di company."
test_data:
  - code_prefix: "AT-OC-"
  - description: "automation playwright"
steps:
  - "Klik Create."
  - "Isi Code/Name unik."
  - "Pilih Other Cost COA (Expense)."
  - "Biarkan All Stores; Description = automation playwright; Active ON."
  - "Save & Next."
expected_result: |
  Redirect /edit/{id}; Other Cost tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T06:00:00Z"
  finished_at: "2026-07-20T06:01:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-cost-crud.spec.ts � TC-OC-002 � company lumicharmsid"
  report_url: null
---

# TC-OC-002

## Catatan automation

- Spec: `@TC-OC-002`
- Default All Stores (hindari dependency store list).
