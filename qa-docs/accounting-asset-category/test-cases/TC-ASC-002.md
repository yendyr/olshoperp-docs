---
doc_type: e2e-test-case
tc_code: TC-ASC-002
menu: accounting-asset-category
menu_name: "Asset Category"
test_type: happy
title: "CREATE — Asset Category + Depreciation Details"
summary: "Create kategori baru dengan method Straight Line dan parameter depresiasi."
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
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data:
  - "Code: AT-ASC-{stamp}"
  - "Name: Automation Asset Cat {stamp}"
  - "Description: automation playwright"
  - "Method: Straight Line"
  - "Frequency: 1 · Total: 12 · Salvage: 10 · Posting date: 1"
steps:
  - "Dari datalist, klik Create."
  - "Isi Code, Name, Description (automation playwright)."
  - "Pilih Depreciation Method = Straight Line."
  - "Isi Frequency=1, Total Number=12, Salvage Value=10, Posting Date=1."
  - "Pastikan Active ON."
  - "Klik Save All; tunggu redirect ke edit."
expected_result: |
  Toast sukses; URL edit; Code tersimpan; field depresiasi terisi.
test_result:
  status: passed
  started_at: "2026-07-24T08:00:00Z"
  finished_at: "2026-07-24T08:20:00Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "6/6 PASS · TC-ASC-002 CREATE · company lumicharmsid"
  report_url: null
last_execution:
  at: "2026-07-24"
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-ASC-002

## Catatan automation

- Spec: `@TC-ASC-002`
- Create UI memakai **Save All** (bukan Save & Next).
