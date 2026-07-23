---
doc_type: e2e-test-case
tc_code: TC-COA-003
menu: accounting-chart-of-account
menu_name: "COA"
title: "UPDATE — ubah Name + Description"
summary: "Edit COA hasil CREATE; ubah Name dan Description; Save All; verifikasi di form."
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
  - "COA dari TC-COA-002 sudah ada."
test_data:
  - description: "automation playwright"
steps:
  - "Buka edit COA by Code (dari datalist #updateButton)."
  - "Ubah Name (suffix UPD) dan Description = automation playwright."
  - "Klik Save All."
  - "Verifikasi Name ter-update di form."
expected_result: |
  Update sukses (toast/HTTP); Name baru tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T04:10:00Z"
  finished_at: "2026-07-20T04:11:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-COA-003 UPDATE Name + Description automation playwright"
  report_url: null
---

# TC-COA-003

## Catatan automation

- Spec: `@TC-COA-003`
