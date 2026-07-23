---
doc_type: e2e-test-case
tc_code: TC-TAX-002
menu: accounting-tax
menu_name: "Tax"
title: "CREATE — Tax Code/Name/Tariff + Purchase/Sales COA"
summary: "Create Tax unik AT-TAX-*; Tariff 11; pilih Purchase + Sales COA; Description automation playwright; Save & Next."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-tax/knowledge-base.md"
automated: true
automated_spec: "tests/specs/tax/tax-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-chart-of-account
preconditions:
  - "Minimal 1 COA Activa (Purchase) dan 1 COA Passiva (Sales) di company."
test_data:
  - code_prefix: "AT-TAX-"
  - tariff: "11"
  - description: "automation playwright"
steps:
  - "Klik Create."
  - "Isi Code/Name unik; Tariff 11; Coefficient OFF; Active ON."
  - "Pilih Purchase COA dan Sales COA (Choose COA)."
  - "Description = automation playwright; Save & Next."
expected_result: |
  Redirect /edit/{id}; Tax tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T04:32:30Z"
  finished_at: "2026-07-20T04:33:30Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-TAX-002 CREATE AT-TAX-* Tariff 11 + Purchase/Sales COA"
  report_url: null
---

# TC-TAX-002

## Catatan automation

- Spec: `@TC-TAX-002`
- Jangan aktifkan Default Tax POS pada create automation (hindari overwrite default company).
