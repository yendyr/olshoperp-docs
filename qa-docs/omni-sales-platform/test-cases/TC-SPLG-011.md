---
doc_type: e2e-test-case
tc_code: TC-SPLG-011
menu: omni-sales-platform
menu_name: "Platform Sales Order"
title: "Memastikan Deteksi Realtime Under Benchmark COGS (Icon cogs-error & Counter Update) Pasca Binding Platform SKU"
summary: "Verifikasi setelah platform SKU di-binding ke System Product dengan Benchmark COGS tinggi, snapshot COGS terisi dan sistem secara realtime memicu cogs-error serta menambah counter Net Sales < COGS."
status: draft
owner: QA - Yemima
last_updated: 2026-08-20
requirement_ref: "qa-docs/omni-sales-platform/requirement.md"
automated: true
automated_spec: tests/specs/sales-platform/splg-bind-realtime-tc9.spec.ts
execution_company:
  id: 112
  code: FAT
related_menus:
  - all-sales-order
preconditions:
  - "Terdapat order platform dengan SKU unbound di company FAT"
  - "Terdapat master System Product dengan Benchmark COGS > Unit Price order platform tersebut"
  - "Company aktif: FAT (id: 112)"
test_data:
  - field: filter_pill
    value: "Net Sales < COGS"
steps:
  - "Buka menu Omnichannel -> Platform Sales Order (/omnichannel/sales-order)"
  - "Ambil order platform dengan SKU unbound"
  - "Lakukan proses binding SKU ke System Product yang memiliki Benchmark COGS lebih tinggi dari harga jual order"
  - "Selesaikan proses binding SKU dan kembali ke halaman Platform Sales Order"
  - "Verifikasi snapshot benchmark_cogs terisi dari master produk"
  - "Verifikasi icon dollar (cogs-error) otomatis muncul di kolom Error Flag"
  - "Verifikasi counter badge pada pill "Net Sales < COGS" bertambah dan order tersebut kini muncul di hasil filter"
expected_result: |
  Sistem secara realtime mengupdate snapshot benchmark_cogs, memicu icon dollar (cogs-error), dan memasukkan order ke dalam filter Net Sales < COGS pasca binding SKU berhasil dilakukan.
test_result:
  status: passed
  started_at: "2026-08-20T20:53:00+07:00"
  finished_at: "2026-08-20T20:55:56+07:00"
  executed_by: playwright@gmail.com
  environment: staging
  log_summary: "Automated Playwright E2E test PASSED: Deteksi realtime pasca binding platform SKU ke System Product memicu cogs-error dan mengupdate counter Net Sales < COGS."
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15447
request_id: recvqWrTHZ1dOV
last_execution:
  at: "2026-08-20 20:55:56"
  jira: ETM-15447
---

# Catatan QA & Referensi
Mengacu pada card **ETM-15447** ([Pill Filter Net Sales < COGS pada Platform Sales Order](https://erpintegration.atlassian.net/browse/ETM-15447)):
- Scope: Platform Sales Order (`/omnichannel/sales-order`).
- Target Testing Company: **FAT** (ID: 112).
- Request ID: `recvqWrTHZ1dOV`.
