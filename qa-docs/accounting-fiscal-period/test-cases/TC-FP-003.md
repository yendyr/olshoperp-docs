---
doc_type: e2e-test-case
tc_code: TC-FP-003
menu: accounting-fiscal-period
menu_name: "Fiscal Period"
title: "UPDATE — Description periode December 2024"
summary: "Edit period Open covering Dec 2024; set Description = automation playwright; Save All. Skip jika Closed / fields disabled."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-fiscal-period/knowledge-base.md"
automated: true
automated_spec: "tests/specs/fiscal-period/fiscal-period-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "TC-FP-002: period Dec 2024 tersedia."
test_data:
  - description: "automation playwright"
steps:
  - "Buka edit period December 2024 / yang cover Dec 2024."
  - "Jika can_update: isi Description = automation playwright → Save All."
  - "Jika Closed / disabled: skip update (PASS dengan note)."
expected_result: |
  Description tersimpan, atau skip valid jika period tidak editable.
test_result:
  status: pass
  started_at: "2026-07-20T05:55:00Z"
  finished_at: "2026-07-20T05:56:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-FP-003 UPDATE Description automation playwright"
  report_url: null
---

# TC-FP-003

## Catatan automation

- Spec: `@TC-FP-003`
