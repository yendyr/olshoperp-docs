---
doc_type: e2e-test-case
tc_code: TC-SPLG-004
menu: omni-sales-platform
menu_name: "Platform Sales Order"
test_type: happy
title: "Memastikan Akurasi Filter Datalist saat Pill Net Sales < COGS Aktif di Sales Platform (Positive Filter)"
summary: "Verifikasi pengaktifan pill Net Sales < COGS mengirim query param type=platform&net_sales_below_cogs=true dan hanya menampilkan SO platform dengan Total Net Sales < Total COGS."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-pill-net-sales-cogs-tc2.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Terdapat dokumen Platform Sales Order di company FAT yang memiliki Total Net Sales < Total Benchmark COGS"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Klik tombol pill "Net Sales < COGS""
  - "Periksa network inspect memastikan query param type=platform&net_sales_below_cogs=true dikirimkan ke endpoint datalist"
  - "Ambil sampel dokumen Sales Order platform yang muncul di tabel"
  - "Hitung manual Total Net Sales dan Total COGS per SO"
  - "Verifikasi bahwa seluruh SO yang tampil memenuhi kondisi Total Net Sales < Total COGS"
expected_result: |
  Datalist terfilter secara akurat dan hanya menampilkan dokumen Platform Sales Order yang memiliki nilai Net Sales lebih kecil dari Total Benchmark COGS.
test_result:
  status: passed
  started_at: "2026-08-20T20:20:00+07:00"
  finished_at: "2026-08-20T20:33:19+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Request datalist type=platform&net_sales_below_cogs=true berhasil memfilter transaksi platform under-COGS."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15447
request_id: recvqWrTHZ1dOV
last_execution:
  at: "2026-08-20 20:33:19"
  jira: "ETM-15447"
  status: passed
  via: "legacy:test_result"
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15447** ([Pill Filter Net Sales < COGS pada Platform Sales Order](https://erpintegration.atlassian.net/browse/ETM-15447)):
- Scope: Platform Sales Order (`/omnichannel/sales-order`).
- Target Testing Company: **FAT** (ID: 112).
- Request ID: `recvqWrTHZ1dOV`.
