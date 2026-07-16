---
doc_type: e2e-test-case
tc_code: TC-REALSTK-006
menu: supplychain-real-stock
menu_name: "Real Time Stock"
title: "By SKU — mode ALL → datalist + Latest Calculation"
summary: "Klik ALL; tunggu by-sku; verifikasi kolom System Product / Unit / Latest Calculation."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-real-stock/requirement.md"
automated: true
automated_spec: "tests/specs/real-stock/real-stock-by-sku.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Akses tab By SKU."
test_data: []
steps:
  - "Tab By SKU."
  - "Klik ALL (tanpa Multiselect warehouse)."
  - "Tunggu API real-stock/by-sku?menu=all."
  - "Verifikasi kolom System Product, Unit, Latest Calculation."
expected_result: |
  Datalist By SKU load; kolom pivot + Latest Calculation terlihat.
test_result:
  status: pass
  started_at: "2026-07-16T01:53:15Z"
  finished_at: "2026-07-16T01:53:29Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS FILTER By SKU mode ALL → by-sku · System Product/Unit/Latest Calculation · company lumicharmsid"
  report_url: null
---

# TC-REALSTK-006

API: `POST`/`GET` `supplychain/real-stock/by-sku` (type_post=true) · mode ALL tanpa warehouse_id.
