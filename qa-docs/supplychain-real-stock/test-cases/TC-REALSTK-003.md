---
doc_type: e2e-test-case
tc_code: TC-REALSTK-003
menu: supplychain-real-stock
menu_name: "Real Time Stock"
title: "By Location — shell + Multiselect warehouse"
summary: "Tab By Location: filter Select one or more items; tanpa Create; data belum load sampai WH dipilih."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-real-stock/requirement.md"
automated: true
automated_spec: "tests/specs/real-stock/real-stock-by-location.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User login playwright@gmail.com / company lumicharmsid."
test_data: []
steps:
  - "Buka /supplychain/real-stock (default By Location)."
  - "Verifikasi Multiselect Select one or more items to view data."
  - "Verifikasi tab By SKU visible; tanpa Create."
expected_result: |
  Shell By Location siap; Manual Calculate belum muncul.
test_result:
  status: pass
  started_at: "2026-07-16T01:52:00Z"
  finished_at: "2026-07-16T01:52:13Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS VIEW By Location shell + Multiselect WH · no Create · company lumicharmsid"
  report_url: null
---

# TC-REALSTK-003

Tab **By Location** — stok per warehouse location (On Hand, ATS, Availability).
