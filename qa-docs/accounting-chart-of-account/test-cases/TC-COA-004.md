---
doc_type: e2e-test-case
tc_code: TC-COA-004
menu: accounting-chart-of-account
menu_name: "COA"
title: "SEARCH — cari Code di datalist"
summary: "Search Code COA automation di datalist; baris ditemukan dengan Name hasil update."
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
  - "COA dari TC-COA-002/003 ada di company."
test_data: []
steps:
  - "Buka datalist COA."
  - "Search by Code."
  - "Verifikasi baris tampil dengan Code (+ Name jika UPDATE sudah jalan)."
expected_result: |
  Search menemukan COA automation.
test_result:
  status: pass
  started_at: "2026-07-20T04:10:00Z"
  finished_at: "2026-07-20T04:11:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-COA-004 SEARCH Code di datalist"
  report_url: null
---

# TC-COA-004

## Catatan automation

- Spec: `@TC-COA-004`
