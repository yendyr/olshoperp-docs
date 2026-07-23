---
doc_type: e2e-test-case
tc_code: TC-STMON-004
menu: supplychain-stock-monitoring
menu_name: "Dev - Stock Monitoring"
title: "Buka detail item stock → tab Product Trx History / Certificate"
summary: "Dari datalist, klik link SKU AUTO-SKU001 ke halaman detail; verifikasi tab Product Trx History, Certificate, Product Interchange."
status: draft
owner: QA - Cursor
last_updated: 2026-07-20
requirement_ref: "qa-docs/supplychain-stock-monitoring/requirement.md"
automated: true
automated_spec: "tests/specs/stock-monitoring/stock-monitoring-view-filter.spec.ts"
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - supplychain-product-transaction-history
preconditions:
  - "User login: playwright@gmail.com / 12345678."
  - "Company: lumicharmsid (153)."
  - "Item stock AUTO-SKU001 ada di WH Gayungsari."
test_data:
  - sku: "AUTO-SKU001"
steps:
  - "Buka Stock Monitoring; pilih warehouse Gayungsari."
  - "Search AUTO-SKU001."
  - "Klik link SKU ke /supplychain/stock-monitoring/{item_stock_id}."
  - "Verifikasi tab Product Trx History, Certificate, Product Interchange."
  - "Verifikasi tombol Back To Datalist."
expected_result: |
  Halaman detail item stock load dengan tab ledger/sertifikat/interchange.
test_result:
  status: pass
  started_at: "2026-07-20T03:16:40Z"
  finished_at: "2026-07-20T03:18:26Z"
  executed_by: "Playwright local (olshoperp-docs)"
  environment: staging
  log_summary: "4/4 PASS · TC-STMON-004 ~28.3s · detail tabs History/Certificate/Interchange (goto same-tab, link target=_blank)"
  report_url: null
---

# TC-STMON-004

## Fungsi menu

Detail per item_stock: riwayat transaksi produk, sertifikat, dan produk interchangeable.

## Catatan automation

- Spec: `@TC-STMON-004`
- Route detail: `/supplychain/stock-monitoring/{item_stock_id}`
