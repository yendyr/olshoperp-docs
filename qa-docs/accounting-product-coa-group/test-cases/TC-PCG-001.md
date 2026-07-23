---
doc_type: e2e-test-case
tc_code: TC-PCG-001
menu: accounting-product-coa-group
menu_name: "Product COA Group"
title: "VIEW — buka datalist Product COA Group"
summary: "Load datalist; verifikasi Create + kolom CODE/NAME/TYPE."
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
  - system-product
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /accounting/product-coa-group."
  - "Verifikasi tombol Create."
  - "Verifikasi kolom CODE, NAME, TYPE."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: pass
  started_at: "2026-07-20T04:25:00Z"
  finished_at: "2026-07-20T04:26:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS product-coa-group-crud.spec.ts · TC-PCG-001 VIEW · company lumicharmsid"
  report_url: null
---

# TC-PCG-001

## Fungsi menu

**Product COA Group** — mapping System Product type → akun COA untuk jurnal (Sales, Inventory, COGS, dll.).

## Catatan automation

- Spec: `@TC-PCG-001`
