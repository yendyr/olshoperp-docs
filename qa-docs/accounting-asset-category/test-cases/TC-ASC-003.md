---
doc_type: e2e-test-case
tc_code: TC-ASC-003
menu: accounting-asset-category
menu_name: "Asset Category"
title: "UPDATE — Name, Method, Salvage"
summary: "Ubah Name, Depreciation Method ke Written Down Value, Salvage Value."
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
  - "TC-ASC-002 sudah membuat record AT-ASC-{stamp}."
  - "User login + company lumicharmsid."
test_data:
  - "Name baru: Automation Asset Cat UPD {stamp}"
  - "Method: Written Down Value"
  - "Salvage: 15"
steps:
  - "Buka datalist; search Code; buka Edit."
  - "Ubah Name."
  - "Pilih Depreciation Method = Written Down Value."
  - "Ubah Salvage Value (%) = 15."
  - "Klik Save All."
expected_result: |
  Toast sukses; Name, method, dan salvage ter-update di form.
test_result:
  status: pass
  started_at: "2026-07-24T08:00:00Z"
  finished_at: "2026-07-24T08:20:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "6/6 PASS · TC-ASC-003 UPDATE · company lumicharmsid"
  report_url: null
---

# TC-ASC-003

## Catatan automation

- Spec: `@TC-ASC-003`
