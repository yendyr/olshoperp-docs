---
doc_type: e2e-test-case
tc_code: TC-PMUTSTK-001
menu: supplychain-product-mutation-stock
menu_name: "Stock History"
title: "Buka Stock History — shell filter Product/Warehouse"
summary: "Load Stock History; verifikasi Choose Product + Filter Building + Show data as + Select Period + Apply; tanpa Create."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-mutation-stock/requirement.md"
automated: true
automated_spec: "tests/specs/product-mutation-stock/product-mutation-stock-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-product-mutation
  - supplychain-product-ending-stock
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /supplychain/product-mutation-stock."
  - "Verifikasi breadcrumb Stock History."
  - "Verifikasi filter: Choose Product*, Filter Building, Show data as, Select Period, Apply."
  - "Verifikasi tidak ada Create; datalist belum tampil tanpa product_id."
expected_result: |
  Shell laporan load; filter siap; read-only.
test_result:
  status: pass
  started_at: "2026-07-15T08:45:00Z"
  finished_at: "2026-07-15T08:45:06Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS VIEW shell · Product/Building/Period/Apply · show_table false · company lumicharmsid"
  report_url: null
---

# TC-PMUTSTK-001

## Fungsi menu

**Stock History** — riwayat mutasi stok per SKU **per warehouse** (beda Product Mutation History yang global). Wajib Product + Apply.

## Catatan automation

- Spec: `@TC-PMUTSTK-001`
- Helper: `tests/helpers/product-mutation-stock.ts`
- AS-IS: `v-if="product_id"`; Apply membangun query product/warehouse/level/periode.
