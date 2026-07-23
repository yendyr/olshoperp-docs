---
doc_type: e2e-test-case
tc_code: TC-PCG-002
menu: accounting-product-coa-group
menu_name: "Product COA Group"
title: "CREATE — Purchased Item + COA bindings"
summary: "Create PCG unik; Type Purchased Item; isi COA binding wajib; Description automation playwright; Save & Next."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-product-coa-group/requirement.md"
automated: true
automated_spec: "tests/specs/product-coa-group/product-coa-group-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-chart-of-account
preconditions:
  - "Minimal 1 COA per class yang dibutuhkan binding Purchased Item."
test_data:
  - code_prefix: "AT-PCG-"
  - type: "Purchased Item"
  - description: "automation playwright"
steps:
  - "Klik Create."
  - "Isi Code/Name unik; Type = Purchased Item."
  - "Matikan Set as Default System Product (hindari overwrite default company)."
  - "Pastikan semua COA binding wajib terisi (prefill atau pilih opsi pertama)."
  - "Description = automation playwright; Save & Next."
expected_result: |
  Redirect /edit/{id}; PCG tersimpan.
test_result:
  status: pass
  started_at: "2026-07-20T04:25:00Z"
  finished_at: "2026-07-20T04:26:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-PCG-002 CREATE Purchased Item + COA bindings OK"
  report_url: null
---

# TC-PCG-002

## Catatan automation

- Spec: `@TC-PCG-002`
- Return Expense optional; binding lain wajib.
