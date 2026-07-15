---
doc_type: e2e-test-case
tc_code: TC-FILTER-product-mutation-stock
menu: supplychain-product-mutation-stock
menu_name: "Stock History"
title: "Choose Product + Apply → history per warehouse"
summary: "Pilih Product → Apply; verifikasi GET product-mutation-stock?product_id= dan kolom Date / Trx. Code / In-Out / Ending Balance."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-mutation-stock/requirement.md"
automated: true
automated_spec: "tests/specs/product-mutation-stock/product-mutation-stock-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Minimal 1 product di select2-product."
test_data: []
steps:
  - "Buka Stock History."
  - "Pilih opsi pertama Choose Product; klik Apply."
  - "Tunggu GET product-mutation-stock?product_id=."
  - "Verifikasi kolom: Date, Trx. Code, Receiving Process, Product In, Product Out, Ending Balance."
  - "Verifikasi baris data atau empty state valid."
expected_result: |
  History per warehouse load; kolom qty/balance terlihat.
test_result:
  status: pass
  started_at: "2026-07-15T08:45:06Z"
  finished_at: "2026-07-15T08:45:16Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS FILTER Product+Apply · API stock-history · Date/In/Out/Ending Balance · company lumicharmsid · 2/2"
  report_url: null
---

# TC-FILTER-product-mutation-stock

## Catatan automation

- Spec: `@TC-FILTER-product-mutation-stock`
- **AS-IS:** route `product-mutation-stock` memuat `StockHistory/DataList.vue` → API `GET supplychain/stock-history?product_id=`
- Apply wajib (`show_table`); beda Product Mutation History (auto-apply on select).
