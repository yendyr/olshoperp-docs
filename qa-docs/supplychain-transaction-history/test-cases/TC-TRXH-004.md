---
doc_type: e2e-test-case
tc_code: TC-TRXH-004
menu: supplychain-transaction-history
menu_name: "BETA - Transaction History"
title: "Search SKU + verifikasi baris / link Trx. Code"
summary: "Search AUTO-SKU001 di datalist; pastikan baris muncul; link Trx. Code mengarah ke edit mutation."
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
  - system-product
preconditions:
  - "Produk AUTO-SKU001 pernah punya mutasi di company (dari simulasi stok sebelumnya)."
test_data:
  - sku: "AUTO-SKU001"
steps:
  - "Buka Transaction History (opsional filter Building Gayungsari + Apply)."
  - "Search datalist: AUTO-SKU001."
  - "Verifikasi minimal 1 baris mengandung AUTO-SKU001."
  - "Verifikasi link Trx. Code ada (href mengandung /supplychain/)."
expected_result: |
  Search menemukan transaksi terkait SKU; Trx. Code link valid.
test_result:
  status: pass
  started_at: "2026-07-20T04:03:30Z"
  finished_at: "2026-07-20T04:04:20Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-TRXH-004 ~19.9s · AUTO-SKU001 + Trx. Code link OK"
  report_url: null
---

# TC-TRXH-004

## Catatan automation

- Spec: `@TC-TRXH-004`
- Link Trx. Code sering `target=_blank` — cukup assert href, tidak wajib buka tab.
