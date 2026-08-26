---
doc_type: e2e-test-case
tc_code: TC-ASC-004
menu: accounting-asset-category
menu_name: "Asset Category"
title: "SEARCH — Code di datalist"
summary: "Cari Code hasil create/update; baris tampil dengan Name terbaru."
status: approved
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-asset-category/knowledge-base.md"
automated: true
automated_spec: "tests/specs/asset-category/asset-category-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Record dari TC-ASC-002/003 masih ada (belum dihapus)."
test_data:
  - "Code: AT-ASC-{stamp}"
steps:
  - "Buka /accounting/asset-category."
  - "Ketik Code di searchbox."
  - "Verifikasi baris berisi Code + Name updated."
expected_result: |
  Baris ditemukan; Name sesuai update TC-ASC-003.
test_result:
  status: passed
  started_at: "2026-07-24T08:00:00Z"
  finished_at: "2026-07-24T08:20:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "6/6 PASS · TC-ASC-004 SEARCH · company lumicharmsid"
  report_url: null
last_execution:
  at: "2026-07-24"
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-ASC-004

## Catatan automation

- Spec: `@TC-ASC-004`
