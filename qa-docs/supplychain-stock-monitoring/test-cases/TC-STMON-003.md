---
doc_type: e2e-test-case
tc_code: TC-STMON-003
menu: supplychain-stock-monitoring
menu_name: "Dev - Stock Monitoring"
title: "Search SKU + klik Availability → modal colli"
summary: "Setelah warehouse dipilih, search AUTO-SKU001; klik angka Availability biru; modal breakdown colli tampil."
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
  - system-product
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Produk AUTO-SKU001 punya item_stock di WH Gayungsari."
test_data:
  - sku: "AUTO-SKU001"
  - warehouse_search: "Gayungsari"
steps:
  - "Buka Stock Monitoring; pilih warehouse Gayungsari."
  - "Search datalist: AUTO-SKU001."
  - "Klik angka Availability (link biru) pada baris pertama."
  - "Verifikasi modal Available: {qty} {unit} tampil."
expected_result: |
  Modal availability terbuka; API modal-available sukses.
test_result:
  status: pass
  started_at: "2026-07-20T03:16:40Z"
  finished_at: "2026-07-20T03:18:26Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-STMON-003 ~16.2s · AUTO-SKU001 Availability modal-available OK"
  report_url: null
---

# TC-STMON-003

## Fungsi menu

Drill-down Availability untuk melihat breakdown colli per item_stock.

## Catatan automation

- Spec: `@TC-STMON-003`
- API: `GET stock-monitoring/{id}/modal-available`
