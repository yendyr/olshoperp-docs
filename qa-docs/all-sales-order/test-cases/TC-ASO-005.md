---
doc_type: e2e-test-case
tc_code: TC-ASO-005
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: "Memastikan Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif (Positive Filter)"
summary: "Verifikasi pengaktifan pill Net Sales < COGS mengirim query param net_sales_below_cogs=true dan hanya menampilkan SO dengan Total Net Sales < Total COGS."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: true
automated_spec: tests/specs/sales-order/aso-pill-net-sales-cogs-tc2.spec.ts
execution_company:
  id: 153
  code: lumicharmsid
related_menus:
  - omni-sales-platform
preconditions:
  - User login ke staging dengan akun yang memiliki hak akses menu All Sales Order
  - Terdapat data Sales Order dengan variasi kondisi harga jual dan Benchmark COGS
  - Company aktif: lumicharmsid (id: 153)
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> All Sales Order (/sales-order/all)"
  - "Klik tombol pill "Net Sales < COGS""
  - "Periksa network inspect memastikan query param net_sales_below_cogs=true dikirimkan ke endpoint datalist"
  - "Ambil beberapa sampel dokumen Sales Order yang muncul di tabel"
  - "Hitung manual Total Net Sales (Grand Total Before VAT) dan Total COGS (sum benchmark_cogs * qty) per SO"
  - "Verifikasi bahwa seluruh SO yang tampil memenuhi kondisi Total Net Sales < Total COGS"
expected_result: |
  Datalist terfilter secara akurat dan hanya menampilkan dokumen Sales Order yang memiliki nilai Net Sales (Grand Total Before VAT) lebih kecil dari Total Benchmark COGS.
test_result:
  status: passed
  started_at: "2026-08-20T17:15:00+07:00"
  finished_at: "2026-08-20T17:16:39+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: |
    Automated Playwright E2E test PASSED di menu All Sales Order (/businessdevelopment/all-sales-order) Staging (Company: lumicharmsid):
    1. Request Filter URL: PASSED - Frontend mentrigger query param net_sales_below_cogs=true ke endpoint datalist.
    2. Data Filtering: PASSED - Datalist berhasil memfilter dan me-render transaksi yang under-COGS (Total Net Sales < Total Benchmark COGS) tanpa error.
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15446
request_id: recvqWrTHZ1dOV
last_execution:
  at: "2026-08-20 17:16:39"
  jira: "ETM-15446"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15446** ([Pill Filter Net Sales < COGS](https://erpintegration.atlassian.net/browse/ETM-15446)):
- Scope: All Sales Order (`/sales-order/all`) & Platform Sales Order (`/omnichannel/sales-order`).
- Integrasi Error Flag `cogs-error` (dollar icon) & auto-approval blockage.
