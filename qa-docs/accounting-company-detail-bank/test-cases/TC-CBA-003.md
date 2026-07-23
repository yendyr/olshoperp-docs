---
doc_type: e2e-test-case
tc_code: TC-CBA-003
menu: accounting-company-detail-bank
menu_name: "Cash/Bank Account"
title: "UPDATE — ubah Label + Description"
summary: "Edit account hasil CREATE; ubah Label + Description; Save All."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-company-detail-bank/"
automated: true
automated_spec: "tests/specs/company-detail-bank/company-detail-bank-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Account dari TC-CBA-002 ada."
test_data:
  - description: "automation playwright"
steps:
  - "Buka edit by Label dari datalist."
  - "Ubah Label (suffix U, tetap ≤30) dan Description = automation playwright."
  - "Klik Save All."
expected_result: |
  Label ter-update di form.
test_result:
  status: pass
  started_at: "2026-07-20T04:42:30Z"
  finished_at: "2026-07-20T04:43:10Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-CBA-003 UPDATE Label + Description"
  report_url: null
---

# TC-CBA-003

## Catatan automation

- Spec: `@TC-CBA-003`
