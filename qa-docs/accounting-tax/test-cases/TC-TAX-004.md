---
doc_type: e2e-test-case
tc_code: TC-TAX-004
menu: accounting-tax
menu_name: "Tax"
title: "SEARCH — cari Code di datalist"
summary: "Search Code Tax automation; baris ditemukan."
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
  - "Tax dari TC-TAX-002/003 ada."
test_data: []
steps:
  - "Buka datalist; search by Code."
  - "Verifikasi baris Code (+ Name hasil UPDATE)."
expected_result: |
  Search menemukan Tax.
test_result:
  status: pass
  started_at: "2026-07-20T04:32:30Z"
  finished_at: "2026-07-20T04:33:30Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-TAX-004 SEARCH Code"
  report_url: null
---

# TC-TAX-004

## Catatan automation

- Spec: `@TC-TAX-004`
