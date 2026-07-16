---
doc_type: e2e-test-case
tc_code: TC-REALSTK-004
menu: supplychain-real-stock
menu_name: "Real Time Stock"
title: "By Location — pilih warehouse → On Hand/ATS"
summary: "Select Building Multiselect; GET by-location?warehouse_id=; kolom On Hand/ATS/Availability; Manual Calculate + Log."
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
  - "Minimal 1 Building di select2-warehouse."
test_data: []
steps:
  - "Tab By Location."
  - "Pilih opsi pertama warehouse."
  - "Tunggu GET real-stock/by-location?warehouse_id=."
  - "Verifikasi kolom System Product, Unit, On Hand, ATS, Availability."
  - "Verifikasi Manual Calculate + Log Data."
expected_result: |
  Datalist By Location load; metrik stok terlihat.
test_result:
  status: pass
  started_at: "2026-07-16T01:52:13Z"
  finished_at: "2026-07-16T01:52:25Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS FILTER By Location warehouse → GET by-location · On Hand/ATS/Availability · Manual Calculate+Log · company lumicharmsid"
  report_url: null
---

# TC-REALSTK-004

API: `GET supplychain/real-stock/by-location?warehouse_id=`
