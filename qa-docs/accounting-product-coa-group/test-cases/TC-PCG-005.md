---
doc_type: e2e-test-case
tc_code: TC-PCG-005
menu: accounting-product-coa-group
menu_name: "Product COA Group"
test_type: happy
title: "Soft DELETE + Show deleted data"
summary: "Bulk soft-delete baris automation; hilang dari list aktif; muncul saat Show deleted ON."
status: approved
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-product-coa-group/knowledge-base.md"
automated: true
automated_spec: "tests/specs/product-coa-group/product-coa-group-crud.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Record AT-PCG-{stamp} masih aktif di datalist."
test_data:
  - "Code: AT-PCG-{stamp}"
steps:
  - "Buka datalist; search Code; centang baris."
  - "Klik bulk Delete; konfirmasi Delete."
  - "Search ulang dengan Show deleted OFF — baris tidak tampil."
  - "Nyalakan Show deleted data; search ulang — baris tampil."
expected_result: |
  Soft delete sukses; aktif hilang; deleted masih terlihat via toggle.
test_result:
  status: passed
  environment: staging
  log_summary: "6/6 PASS · TC-PCG-005 Soft DELETE · company lumicharmsid"
last_execution:
  at: null
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-PCG-005

## Catatan automation

- Spec: `@TC-PCG-005`
- Jalankan setelah SEARCH (TC-PCG-004).
