---
doc_type: e2e-test-case
tc_code: TC-PTHIST-002
menu: supplychain-product-transaction-history
menu_name: "Product Transaction History"
title: "Choose Product → KPI data + tab Mutation"
summary: "Pilih Product; verifikasi GET item-transaction-history/data?product_id=; SKU terisi; switch tab Mutation."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-transaction-history/requirement.md"
automated: true
automated_spec: "tests/specs/product-transaction-history/product-transaction-history-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "Minimal 1 product di select2-product item-transaction-history."
test_data: []
steps:
  - "Buka Product Transaction History."
  - "Pilih opsi pertama Choose Product."
  - "Tunggu GET item-transaction-history/data?product_id=."
  - "Verifikasi System Product SKU terisi (bukan '-')."
  - "Klik tab Mutation; verifikasi tab/panel ready (report-mutation)."
expected_result: |
  KPI ter-refresh untuk product; tab Mutation accessible.
test_result:
  status: pass
  started_at: "2026-07-15T08:55:13Z"
  finished_at: "2026-07-15T08:55:32Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS FILTER Choose Product → data KPI SKU filled + tab Mutation · company lumicharmsid · 2/2"
  report_url: null
---

# TC-PTHIST-002

## Catatan automation

- Spec: `@TC-PTHIST-002`
- Watch product_id auto-`fetchDetail()` (tidak perlu Apply).
- Tabs API: report-pr / report-po / report-mutation.
