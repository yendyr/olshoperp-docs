---
doc_type: e2e-test-case
tc_code: TC-PCG-004
menu: accounting-product-coa-group
menu_name: "Product COA Group"
title: "SEARCH — cari Code di datalist"
summary: "Search Code PCG automation; baris ditemukan."
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
  - "PCG dari TC-PCG-002/003 ada."
test_data: []
steps:
  - "Buka datalist; search by Code."
  - "Verifikasi baris Code (+ Name hasil UPDATE)."
expected_result: |
  Search menemukan PCG.
test_result:
  status: pass
  started_at: "2026-07-20T04:25:00Z"
  finished_at: "2026-07-20T04:26:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-PCG-004 SEARCH Code"
  report_url: null
---

# TC-PCG-004

## Catatan automation

- Spec: `@TC-PCG-004`
