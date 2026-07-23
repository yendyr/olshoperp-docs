---
doc_type: e2e-test-case
tc_code: TC-COA-001
menu: accounting-chart-of-account
menu_name: "COA"
title: "VIEW — buka datalist Chart of Account"
summary: "Load /accounting/chart-of-account; verifikasi Create, kolom CODE/NAME/CLASS, tanpa error."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/accounting-chart-of-account/knowledge-base.md"
automated: true
automated_spec: "tests/specs/chart-of-account/chart-of-account-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-product-coa-group
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Akses view Chart of Account."
test_data: []
steps:
  - "Buka /accounting/chart-of-account."
  - "Verifikasi breadcrumb/link COA dan tombol Create."
  - "Verifikasi kolom CODE/NAME, PARENT, CLASS, POSITION."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: pass
  started_at: "2026-07-20T04:10:00Z"
  finished_at: "2026-07-20T04:11:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS chart-of-account-crud.spec.ts · TC-COA-001 VIEW · company lumicharmsid"
  report_url: null
---

# TC-COA-001

## Fungsi menu

**COA** — master Chart of Account (FA → Master). CRUD + tree/import/export.

## Catatan automation

- Spec: `@TC-COA-001`
