---
doc_type: e2e-test-case
tc_code: TC-VIEW-real-stock
menu: supplychain-real-stock
menu_name: "Real Time Stock"
title: "Buka Real Time Stock — shell By Location"
summary: "Load report; verifikasi tab By Location/By SKU + filter warehouse Multiselect; tanpa Create; data belum load sampai warehouse dipilih."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-real-stock/requirement.md"
automated: true
automated_spec: "tests/specs/real-stock/real-stock-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-product-ending-stock
  - supplychain-inventory-detail
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /supplychain/real-stock."
  - "Verifikasi breadcrumb Real Time Stock; tab By Location + By SKU."
  - "Verifikasi placeholder Select one or more items to view data."
  - "Verifikasi tidak ada Create."
expected_result: |
  Shell laporan load; filter warehouse siap; read-only.
test_result:
  status: pass
  started_at: "2026-07-15T09:20:00Z"
  finished_at: "2026-07-15T09:20:25Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS VIEW shell By Location + By SKU + Multiselect warehouse · no Create · company lumicharmsid"
  report_url: null
---

# TC-VIEW-real-stock

## Fungsi menu

**Real Time Stock** — laporan stok real-time (on hand / ATS / booked) per lokasi & per SKU, dengan Manual Calculate.

## Catatan automation

- Spec: `@TC-VIEW-real-stock`
- AS-IS V2: `api_datalist_url` kosong sampai warehouse dipilih.
