---
doc_type: e2e-test-case
tc_code: TC-ASC-005
menu: accounting-asset-category
menu_name: "Asset Category"
title: "Soft DELETE + Show deleted data"
summary: "Bulk soft-delete baris automation; hilang dari list aktif; muncul saat Show deleted ON."
status: pass
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
  - "Record AT-ASC-{stamp} masih aktif di datalist."
test_data:
  - "Code: AT-ASC-{stamp}"
steps:
  - "Buka datalist; search Code; centang baris."
  - "Klik bulk Delete; konfirmasi Delete."
  - "Search ulang dengan Show deleted OFF — baris tidak tampil."
  - "Nyalakan Show deleted data; search ulang — baris tampil."
expected_result: |
  Soft delete sukses; aktif hilang; deleted masih terlihat via toggle.
test_result:
  status: pass
  started_at: "2026-07-24T08:00:00Z"
  finished_at: "2026-07-24T08:20:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "6/6 PASS · TC-ASC-005 Soft DELETE · company lumicharmsid"
  report_url: null
---

# TC-ASC-005

## Catatan automation

- Spec: `@TC-ASC-005`
- Jalankan **setelah** SEARCH (TC-ASC-004) agar data masih ada untuk assert search.
