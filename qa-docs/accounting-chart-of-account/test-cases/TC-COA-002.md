---
doc_type: e2e-test-case
tc_code: TC-COA-002
menu: accounting-chart-of-account
menu_name: "COA"
title: "CREATE — COA baru Code/Name/Class"
summary: "Create COA unik AT-COA-*; pilih Class; Description automation playwright; Save & Next → edit URL."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-chart-of-account/knowledge-base.md"
automated: true
automated_spec: "tests/specs/chart-of-account/chart-of-account-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "TC-COA-001 preconditions."
  - "Minimal 1 Class tersedia di select2."
test_data:
  - code_prefix: "AT-COA-"
  - description: "automation playwright"
steps:
  - "Klik Create."
  - "Isi Code (unik AT-COA-{stamp}), Name, Class (tanpa Parent), Description = automation playwright, Active ON."
  - "Klik Save & Next."
  - "Verifikasi redirect /edit/{id}."
expected_result: |
  COA tersimpan; masuk halaman edit.
test_result:
  status: pass
  started_at: "2026-07-20T04:10:00Z"
  finished_at: "2026-07-20T04:11:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-COA-002 CREATE AT-COA-* Save & Next → edit"
  report_url: null
---

# TC-COA-002

## Catatan automation

- Spec: `@TC-COA-002`
- Tanpa Parent agar Class editable.
