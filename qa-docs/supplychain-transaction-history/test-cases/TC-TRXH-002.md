---
doc_type: e2e-test-case
tc_code: TC-TRXH-002
menu: supplychain-transaction-history
menu_name: "BETA - Transaction History"
title: "Filter Building + Apply → warehouse_id"
summary: "Pilih Building (Gayungsari) lalu Apply; request GET transaction-history?warehouse_id= sukses."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/supplychain-transaction-history/requirement.md"
automated: true
automated_spec: "tests/specs/transaction-history/transaction-history-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-real-stock
preconditions:
  - "TC-TRXH-001 preconditions."
  - "Building Gayungsari tersedia di select2-warehouse."
test_data:
  - building_search: "Gayungsari"
steps:
  - "Buka Transaction History."
  - "Pilih Building yang mengandung Gayungsari (PrimeVue MultiSelect)."
  - "Klik Apply."
  - "Verifikasi request menyertakan warehouse_id non-kosong."
  - "Verifikasi tabel tetap valid (baris atau empty)."
expected_result: |
  Filter building ter-apply; datalist scoped warehouse.
test_result:
  status: pass
  started_at: "2026-07-20T04:03:30Z"
  finished_at: "2026-07-20T04:04:20Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-TRXH-002 ~9.9s · Building Gayungsari warehouse_id OK"
  report_url: null
---

# TC-TRXH-002

## Catatan automation

- Spec: `@TC-TRXH-002`
- Building select2: `GET supplychain/real-stock/select2-warehouse`.
