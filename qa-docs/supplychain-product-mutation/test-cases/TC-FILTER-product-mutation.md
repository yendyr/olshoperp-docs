---
doc_type: e2e-test-case
tc_code: TC-FILTER-product-mutation
menu: supplychain-product-mutation
menu_name: "Product Mutation History"
title: "Pilih Product → load history + kolom In/Out/Balance"
summary: "Choose Product + Apply; verifikasi GET product-mutation?product_id= dan kolom Date / stock mutation / Product In-Out / Ending Balance."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-mutation/requirement.md"
automated: true
automated_spec: "tests/specs/product-mutation/product-mutation-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Minimal 1 product muncul di select2-product (calculating=true)."
test_data: []
steps:
  - "Buka Product Mutation History."
  - "Pilih opsi pertama di Choose Product (atau cari token generik)."
  - "Tunggu GET product-mutation?product_id=."
  - "Verifikasi kolom: Date, stock mutation, Product In, Product Out, Ending Balance."
  - "Verifikasi baris data atau empty state valid."
expected_result: |
  History load untuk product terpilih; kolom qty/balance terlihat.
test_result:
  status: pass
  started_at: "2026-07-15T08:36:12Z"
  finished_at: "2026-07-15T08:36:26Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS FILTER Choose Product → history · Date/In/Out/Ending Balance · company lumicharmsid · 2/2 VIEW+FILTER"
  report_url: null
---

# TC-FILTER-product-mutation

## Catatan automation

- Spec: `@TC-FILTER-product-mutation`
- API: `GET supplychain/product-mutation?product_id=` · select2 `.../select2-product`
- Watch `product_id` auto-`click_select` (Apply).
