---
owner: QA - Jenni
tc_code: TC-ASO-011
title: "UI Visibility: Tombol Extract This Bundle hanya muncul pada SKU ter-flagging BUNDLE"
module: BusinessDevelopment
menu: All Sales Order
test_type: edge
menu_slug: all-sales-order
type: functional
priority: high
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus:
  - sales-order-general
preconditions:
  - "User login ke OlshopERP pada company FAT (112)"
  - "Navigasi ke menu All Sales Order (https://staging.olshoperp.com/businessdevelopment/all-sales-order)"
  - "Dokumen Sales Order (edit mode) berisi campuran SKU Non-Bundle dan SKU Bundle"
test_data:
  - field: "Sales Order Code"
    value: "SO-FIXTURE-001"
steps:
  - "Buka halaman detail Sales Order"
  - "Buka section Order Detail"
  - "Inspeksi baris SKU Non-Bundle -> pastikan tombol Extract tidak ada"
  - "Inspeksi baris SKU Bundle -> pastikan tombol Extract muncul dan aktif"
expected_result: |
  1. Tombol "Extract this bundle" TIDAK MUNCUL pada baris SKU Non-Bundle.
2. Tombol "Extract this bundle" MUNCUL dan aktif hanya pada baris SKU ter-flagging BUNDLE.
test_result:
  status: not_run
  started_at: null
  finished_at: null
  executed_by: null
  environment: staging
  log_summary: null
  report_url: null
test_data_used: []
run_history: []
origin_jira: ETM-15605
last_execution:
  at: null
  jira: null
---

# TC-ASO-011: UI Visibility: Tombol Extract This Bundle hanya muncul pada SKU ter-flagging BUNDLE

## Deskripsi Uji
Memastikan bahwa UI tombol/action "Extract this bundle" pada halaman detail Sales Order hanya muncul pada baris SKU yang ter-flagging sebagai BUNDLE.

## Catatan QA
* Origin Jira: [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605)
