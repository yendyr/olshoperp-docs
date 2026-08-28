---
doc_type: e2e-test-case
tc_code: TC-SPLG-010
menu: omni-sales-platform
menu_name: "Platform Sales Order"
test_type: edge
title: "Memastikan Platform SKU yang Belum Terbinding (Unbound) Tidak Memicu Filter Net Sales < COGS (benchmark_cogs = 0)"
summary: "Verifikasi order platform dengan SKU belum terbinding (unbound) memiliki benchmark_cogs = 0 dan tidak masuk ke hasil filter Net Sales < COGS (mencegah false positive)."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-unbound-sku-tc8.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Terdapat order platform baru di company FAT yang SKU marketplace-nya belum di-binding ke System Product (system_product_id is null)"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Cari order yang memiliki SKU unbound (memiliki error flag product-not-bound di list Failed Process)"
  - "Periksa nilai snapshot benchmark_cogs pada detail item (bernilai 0)"
  - "Aktifkan tombol pill "Net Sales < COGS""
  - "Verifikasi bahwa order dengan SKU unbound ini TIDAK masuk ke hasil filter Net Sales < COGS"
expected_result: |
  Transaksi dengan SKU platform yang belum terbinding memiliki benchmark_cogs = 0 dan tidak memicu false positive pada filter Net Sales < COGS.
test_result:
  status: passed
  started_at: "2026-08-20T20:53:00+07:00"
  finished_at: "2026-08-20T20:55:56+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Platform SKU belum terbinding (unbound) memiliki snapshot benchmark_cogs = 0 dan diexclude dari filter Net Sales < COGS."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15447
request_id: recvqWrTHZ1dOV
first_execution:
  at: "2026-08-20 20:55:56"
  via: "legacy:test_result"
  jira: "ETM-15447"
last_execution:
  at: "2026-08-20 20:55:56"
  jira: "ETM-15447"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15447** ([Pill Filter Net Sales < COGS pada Platform Sales Order](https://erpintegration.atlassian.net/browse/ETM-15447)):
- Scope: Platform Sales Order (`/omnichannel/sales-order`).
- Target Testing Company: **FAT** (ID: 112).
- Request ID: `recvqWrTHZ1dOV`.
