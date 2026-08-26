---
doc_type: e2e-test-case
tc_code: TC-ASC-001
menu: accounting-asset-category
menu_name: "Asset Category"
test_type: happy
title: "VIEW — buka datalist Asset Category"
summary: "Load /accounting/asset-category; verifikasi Create + kolom utama."
status: approved
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-asset-category/knowledge-base.md"
automated: true
automated_spec: "tests/specs/asset-category/asset-category-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - accounting-asset-list
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /accounting/asset-category."
  - "Verifikasi tombol Create."
  - "Verifikasi kolom CODE, NAME, DEPRECIATION METHOD."
expected_result: |
  Datalist load; Create terlihat; kolom utama tampil.
test_result:
  status: passed
  started_at: "2026-07-24T08:00:00Z"
  finished_at: "2026-07-24T08:20:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "6/6 PASS asset-category-crud.spec.ts · TC-ASC-001 VIEW · company lumicharmsid"
  report_url: null
last_execution:
  at: "2026-07-24"
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-ASC-001

## Fungsi menu

**Asset Category** — master kategori aset + default depresiasi.

## Catatan automation

- Spec: `@TC-ASC-001`
