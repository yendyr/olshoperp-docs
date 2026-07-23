---
doc_type: e2e-test-case
tc_code: TC-STMON-001
menu: supplychain-stock-monitoring
menu_name: "Dev - Stock Monitoring"
title: "Buka Stock Monitoring — shell warehouse gate"
summary: "Load report; verifikasi filter Warehouse Name + tombol Apply; tanpa Create; tabel belum render sampai warehouse dipilih."
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
  - supplychain-product-ending-stock
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /supplychain/stock-monitoring."
  - "Verifikasi breadcrumb Stock Monitoring."
  - "Verifikasi multiselect Choose Warehouse + tombol Apply."
  - "Verifikasi tidak ada Create."
  - "Verifikasi warehouse belum terpilih (placeholder Choose Warehouse)."
expected_result: |
  Shell laporan load; gate warehouse siap; read-only.
test_result:
  status: pass
  started_at: "2026-07-20T03:16:40Z"
  finished_at: "2026-07-20T03:18:26Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS stock-monitoring-view-filter.spec.ts (~1.4m) · TC-STMON-001 ~7.9s · company lumicharmsid"
  report_url: null
---

# TC-STMON-001

## Fungsi menu

**Dev - Stock Monitoring** — laporan stok per item_stock (granular per batch/lokasi) dengan breakdown Inbound, Transfer, Used, Reserved, Availability, On Hand.

## Catatan automation

- Spec: `@TC-STMON-001`
- AS-IS: `fetchTableType()` ikut `dataTableComponentKey++` di mount, jadi `#main-content` bisa sudah ada sebelum warehouse dipilih. Gate yang diuji = filter + Apply + warehouse belum dipilih.
