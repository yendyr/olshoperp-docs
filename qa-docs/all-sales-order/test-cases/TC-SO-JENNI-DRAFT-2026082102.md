---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082102
title: "Extract SKU Bundle tipe Single pada Detail Sales Order"
module: BusinessDevelopment
menu: All Sales Order
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
  - "Navigasi ke menu All Sales Order"
  - "Tersedia Sales Order yang memiliki item SKU Bundle dengan komponen Single SKU"
test_data:
  - field: "Sales Order Code"
    value: "SO-FIXTURE-001"
steps:
  - "Buka detail Sales Order"
  - "Temukan baris SKU Bundle (Single components)"
  - "Klik tombol "Extract this bundle""
  - "Verifikasi perubahan baris detail SKU dan simpan Sales Order"
expected_result: |
  SKU Bundle ter-extract menjadi komponen SKU Single penyusunnya dengan qty dan harga unit yang sesuai, serta dapat disimpan tanpa error.
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

# PENDING-JENNI-2026082102: Extract SKU Bundle tipe Single pada Detail Sales Order

## Deskripsi Uji
Memastikan eksekusi fitur Extract this bundle pada SKU Bundle bertipe Single berhasil menguraikan bundle menjadi item-item komponen Single.

## Catatan QA
* Origin Jira: [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605)
