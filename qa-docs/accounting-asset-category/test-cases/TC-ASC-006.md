---
doc_type: e2e-test-case
tc_code: TC-ASC-006
menu: accounting-asset-category
menu_name: "Asset Category"
test_type: happy
title: "Audit Log — buka slideover dari edit"
summary: "Dari record deleted (view) atau create ulang singkat; buka Audit Log di sidenav."
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
  - "Buat record baru AT-ASC-AUD-{stamp} (karena record sebelumnya sudah soft-deleted)."
test_data:
  - "Code: AT-ASC-AUD-{stamp}"
steps:
  - "Create kategori singkat (Straight Line defaults) + Save All."
  - "Di halaman edit, klik sidenav Audit Log."
  - "Verifikasi slideover Audit Log terbuka."
expected_result: |
  Panel Audit Log tampil (judul Audit Log).
test_result:
  status: passed
  started_at: "2026-07-24T08:00:00Z"
  finished_at: "2026-07-24T08:20:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "6/6 PASS · TC-ASC-006 Audit Log · company lumicharmsid"
  report_url: null
first_execution:
  at: "2026-07-24"
  via: "legacy:test_result"
  jira: null
last_execution:
  at: "2026-07-24"
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-ASC-006

## Catatan automation

- Spec: `@TC-ASC-006`
- Record audit terpisah agar tidak bergantung pada soft-deleted row.
