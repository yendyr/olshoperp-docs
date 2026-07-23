---
doc_type: e2e-test-case
tc_code: TC-TRXH-003
menu: supplychain-transaction-history
menu_name: "BETA - Transaction History"
title: "Filter Transaction Type + Apply"
summary: "Pilih type Stock Addition lalu Apply; request menyertakan transaction_type=Stock Addition."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/supplychain-transaction-history/requirement.md"
automated: true
automated_spec: "tests/specs/transaction-history/transaction-history-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus: []
preconditions:
  - "TC-TRXH-001 preconditions."
test_data:
  - transaction_type: "Stock Addition"
steps:
  - "Buka Transaction History."
  - "Pilih Transaction Type: Stock Addition."
  - "Klik Apply."
  - "Verifikasi request transaction_type mengandung Stock Addition."
  - "Jika ada baris, Type kolom mengandung Stock Addition / AI-."
expected_result: |
  Filter type ter-apply; API sukses.
test_result:
  status: pass
  started_at: "2026-07-20T04:03:30Z"
  finished_at: "2026-07-20T04:04:20Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-TRXH-003 ~11.9s · transaction_type=Stock Addition OK"
  report_url: null
---

# TC-TRXH-003

## Catatan automation

- Spec: `@TC-TRXH-003`
- Type map AS-IS: Stock Addition = prefix AI-.
