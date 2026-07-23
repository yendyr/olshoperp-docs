---
doc_type: e2e-test-case
tc_code: TC-TRXH-001
menu: supplychain-transaction-history
menu_name: "BETA - Transaction History"
title: "Buka Transaction History — shell filter + kolom"
summary: "Load laporan; verifikasi filter Building/Period/Type + Apply; tanpa Create; kolom Date/Trx. Code/Type/Product tampil."
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
  - supplychain-product-transaction-history
  - supplychain-stock-monitoring
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
test_data: []
steps:
  - "Buka /supplychain/transaction-history."
  - "Verifikasi breadcrumb BETA - Transaction History."
  - "Verifikasi filter Building, Select Period, Transaction Type + tombol Apply."
  - "Verifikasi tidak ada Create."
  - "Verifikasi kolom Date, Trx. Code, Type, Product, Building Origin, Trx. Ref."
expected_result: |
  Shell laporan load; filter siap; datalist read-only dengan kolom utama.
test_result:
  status: pass
  started_at: "2026-07-20T04:03:30Z"
  finished_at: "2026-07-20T04:04:20Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS transaction-history-view-filter.spec.ts (~49s) · TC-TRXH-001 ~6.9s · company lumicharmsid"
  report_url: null
---

# TC-TRXH-001

## Fungsi menu

**BETA - Transaction History** — laporan union inbound/outbound/transfer mutation detail (bukan Product Transaction History / ScmReport).

## Catatan automation

- Spec: `@TC-TRXH-001`
- AS-IS: datalist load segera tanpa wajib filter (berbeda Stock Monitoring gate).
