---
doc_type: e2e-test-case
tc_code: TC-OD-002
menu: omni-other-discount
menu_name: "Other Discount"
title: "CREATE — Code/Name + Other Discount COA (All Stores)"
summary: "Create Other Discount unik AT-OD-*; pilih COA; set All Stores; Description automation playwright; Active ON; Save & Next."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/omni-other-discount/knowledge-base.md"
automated: true
automated_spec: "tests/specs/other-discount/other-discount-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-chart-of-account
preconditions:
  - "Minimal 1 COA selectable di Choose Other Discount COA."
test_data:
  - code_prefix: "AT-OD-"
  - description: "automation playwright"
steps:
  - "Klik Create."
  - "Isi Code/Name unik."
  - "Pilih Other Discount COA."
  - "Set radio All Stores (default FE = Applied Store)."
  - "Description = automation playwright; Active ON; Save & Next."
expected_result: |
  Redirect /edit/{id}; Other Discount tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T06:15:00Z"
  finished_at: "2026-07-20T06:16:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS other-discount-crud.spec.ts � TC-OD-002 � company lumicharmsid"
  report_url: null
---

# TC-OD-002

## Catatan automation

- Spec: `@TC-OD-002`
- Wajib set All Stores — default create adalah Applied Store.
