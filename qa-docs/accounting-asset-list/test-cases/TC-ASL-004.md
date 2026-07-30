---
doc_type: e2e-test-case
tc_code: TC-ASL-004
menu: accounting-asset-list
menu_name: "Asset List"
title: "DETAIL — buka /accounting/asset-list/{id} + section"
summary: "Klik link Asset Code; verifikasi Basic Information, Product Trx History, Certificate, Product Interchange."
status: pass
owner: QA - Cursor
last_updated: 2026-07-24
requirement_ref: "qa-docs/accounting-asset-list/knowledge-base.md"
automated: true
automated_spec: "tests/specs/asset-list/asset-list-view.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Minimal 1 baris fixed asset di datalist; jika kosong → skip assert detail, catat WH data."
test_data: []
steps:
  - "Dari datalist, buka link Asset Code (href /accounting/asset-list/{id})."
  - "Verifikasi URL detail."
  - "Verifikasi section/sidenav: Basic Information, Product Trx History, Certificate, Product Interchange."
expected_result: |
  Halaman detail load; empat section terlihat.
test_result:
  status: pass
  environment: staging
  log_summary: "5/5 PASS · TC-ASL-004 · company lumicharmsid"
---

# TC-ASL-004

## Catatan automation

- Spec: `@TC-ASL-004`
- Link Asset Code: `target=_blank` — automation navigasi same-tab via href.
