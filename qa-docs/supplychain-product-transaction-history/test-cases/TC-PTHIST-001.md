---
doc_type: e2e-test-case
tc_code: TC-PTHIST-001
menu: supplychain-product-transaction-history
menu_name: "Product Transaction History"
title: "Buka Product Transaction History — shell filter + KPI"
summary: "Load dashboard; verifikasi Choose Product / date / status + KPI Product Information + tabs PR/PO/Mutation; tanpa Create."
status: draft
owner: QA - Cursor
last_updated: 2026-07-15
requirement_ref: "qa-docs/supplychain-product-transaction-history/requirement.md"
automated: true
automated_spec: "tests/specs/product-transaction-history/product-transaction-history-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-product-mutation
  - supplychain-purchase-requisition
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /supplychain/product-transaction-history."
  - "Verifikasi filter: Choose Product, Start/End Date, Choose Status."
  - "Verifikasi section Product Information + Day Count + Purchase Requisition Overview."
  - "Verifikasi tab Purchase Requisition / Purchase Order / Mutation."
  - "Verifikasi tidak ada Create."
expected_result: |
  Dashboard shell load; filter + KPI visible; read-only.
test_result:
  status: pass
  started_at: "2026-07-15T08:55:00Z"
  finished_at: "2026-07-15T08:55:13Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "PASS VIEW shell · Product/date/status + KPI + tabs PR/PO/Mutation · company lumicharmsid"
  report_url: null
---

# TC-PTHIST-001

## Fungsi menu

**Product Transaction History** — dashboard analytics per SKU (PR/PO/inbound/outbound KPI + detail tabs). API `item-transaction-history`.

## Catatan automation

- Spec: `@TC-PTHIST-001`
- AS-IS breadcrumb `to` salah mengarah ke `/supplychain/product-mutation` — assert teks / URL path.
