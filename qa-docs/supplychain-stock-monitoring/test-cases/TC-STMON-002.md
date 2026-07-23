---
doc_type: e2e-test-case
tc_code: TC-STMON-002
menu: supplychain-stock-monitoring
menu_name: "Dev - Stock Monitoring"
title: "Pilih warehouse → datalist qty breakdown + Latest Calculation"
summary: "Pilih warehouse WH Gayungsari (Apply otomatis/manual) → datalist load dengan kolom Inbound/Transfer/Used/Availability + banner Latest Calculation."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/supplychain-stock-monitoring/requirement.md"
automated: true
automated_spec: "tests/specs/stock-monitoring/stock-monitoring-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-real-stock
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Warehouse WH Gayungsari tersedia di select2."
test_data:
  - warehouse_search: "Gayungsari"
steps:
  - "Buka /supplychain/stock-monitoring."
  - "Pilih warehouse (search Gayungsari) → Apply."
  - "Verifikasi kolom System Product, Inbound, Transfer, Used, Availability, Unit."
  - "Verifikasi banner Latest Calculation terisi."
  - "Verifikasi datalist menampilkan baris data atau empty state valid."
expected_result: |
  Datalist scoped warehouse load; kolom qty breakdown tampil; Latest Calculation ada.
test_result:
  status: pass
  started_at: "2026-07-20T03:16:40Z"
  finished_at: "2026-07-20T03:18:26Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-STMON-002 ~23.8s · warehouse Gayungsari · kolom qty + Latest Calculation"
  report_url: null
---

# TC-STMON-002

## Fungsi menu

Monitor kuantitas stok per item_stock di satu warehouse dengan breakdown qty operasional.

## Catatan automation

- Spec: `@TC-STMON-002`
- API: `GET supplychain/stock-monitoring?warehouse_id={id}`
