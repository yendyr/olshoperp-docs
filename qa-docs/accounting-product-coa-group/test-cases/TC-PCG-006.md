---
doc_type: e2e-test-case
tc_code: TC-PCG-006
menu: accounting-product-coa-group
menu_name: "Product COA Group"
test_type: happy
title: "Audit Log — buka slideover dari edit"
summary: "Create record audit terpisah; buka Audit Log di sidenav edit."
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
  - "Buat AT-PCG-AUD-{stamp} (record sebelumnya sudah soft-deleted)."
test_data:
  - "Code: AT-PCG-AUD-{stamp}"
steps:
  - "Create Purchased Item singkat + Save & Next."
  - "Di halaman edit, klik sidenav Audit Log."
  - "Verifikasi slideover Audit Log terbuka."
expected_result: |
  Panel Audit Log tampil (judul Audit Log).
test_result:
  status: passed
  environment: staging
  log_summary: "6/6 PASS · TC-PCG-006 Audit Log · company lumicharmsid"
first_execution:
  at: "null"
  via: "legacy:test_result"
  jira: null
last_execution:
  at: null
  jira: null
  status: passed
  via: "legacy:test_result"
---

# TC-PCG-006

## Catatan automation

- Spec: `@TC-PCG-006`
