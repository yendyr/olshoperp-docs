---
doc_type: e2e-test-case
tc_code: TC-FILTER-product-ending-stock
menu: supplychain-product-ending-stock
menu_name: "Product Ending Stock"
title: "Switch tab By SKU + verify kolom agregat"
summary: "Pindah ke tab By SKU; verifikasi API by-sku + kolom On hand / ATS / Availability."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-ending-stock/requirement.md"
automated: true
automated_spec: "tests/specs/product-ending-stock/product-ending-stock-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "User bisa membuka Product Ending Stock."
test_data: []
steps:
  - "Buka Product Ending Stock."
  - "Klik tab By SKU."
  - "Tunggu GET product-ending-stock-by-sku."
  - "Verifikasi kolom: System Product, Inbound/On hand/ATS/Availability/Unit (visible defaults)."
  - "Opsional: search SKU token → tabel tetap valid."
expected_result: |
  Tab By SKU load; kolom agregat terlihat; search (jika dijalankan) tidak error.
test_result:
  status: pass
  started_at: "2026-07-15T08:28:14Z"
  finished_at: "2026-07-15T08:28:27Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS FILTER tab By SKU · On hand/ATS/Availability · search soft · company lumicharmsid · 2/2 VIEW+FILTER"
  report_url: null
---

# TC-FILTER-product-ending-stock

## Catatan automation

- Spec: `@TC-FILTER-product-ending-stock`
- Tab By SKU = view mode filter (bukan Create/Update).
- API: `GET supplychain/product-ending-stock-by-sku`
