---
doc_type: e2e-test-case
tc_code: TC-TAX-003
menu: accounting-tax
menu_name: "Tax"
title: "UPDATE — ubah Name + Description"
summary: "Edit Tax hasil CREATE; ubah Name + Description; Save All."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-tax/knowledge-base.md"
automated: true
automated_spec: "tests/specs/tax/tax-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Tax dari TC-TAX-002 ada."
test_data:
  - description: "automation playwright"
steps:
  - "Buka edit by Code dari datalist."
  - "Ubah Name (suffix UPD) dan Description = automation playwright."
  - "Klik Save All."
expected_result: |
  Name ter-update di form.
test_result:
  status: pass
  started_at: "2026-07-20T04:32:30Z"
  finished_at: "2026-07-20T04:33:30Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-TAX-003 UPDATE Name + Description"
  report_url: null
---

# TC-TAX-003

## Catatan automation

- Spec: `@TC-TAX-003`
