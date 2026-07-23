---
doc_type: e2e-test-case
tc_code: TC-PCG-003
menu: accounting-product-coa-group
menu_name: "Product COA Group"
title: "UPDATE — ubah Name + Description"
summary: "Edit PCG hasil CREATE; ubah Name + Description; Save All."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-product-coa-group/requirement.md"
automated: true
automated_spec: "tests/specs/product-coa-group/product-coa-group-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "PCG dari TC-PCG-002 ada."
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
  started_at: "2026-07-20T04:25:00Z"
  finished_at: "2026-07-20T04:26:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-PCG-003 UPDATE Name + Description"
  report_url: null
---

# TC-PCG-003

## Catatan automation

- Spec: `@TC-PCG-003`
