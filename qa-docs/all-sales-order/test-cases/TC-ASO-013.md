---
owner: QA - Jenni
tc_code: TC-ASO-013
title: "Extract SKU Bundle tipe VARIANT pada Detail Sales Order"
module: BusinessDevelopment
menu: All Sales Order
test_type: happy
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
  - "Tersedia Sales Order yang memiliki item SKU Bundle dengan komponen Variant SKU spesifik"
test_data:
  - field: "Sales Order Code"
    value: "SO-FIXTURE-001"
steps:
  - "Buka detail Sales Order"
  - "Temukan baris SKU Bundle (Variant components)"
  - "Klik tombol "Extract this bundle""
  - "Verifikasi komponen Variant yang muncul di detail order"
  - "Klik Save All"
expected_result: |
  SKU Bundle ter-extract secara presisi menjadi opsi/item Variant penyusunnya dan tersimpan dengan baik.
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
  status: not_run
  via: null
---

# TC-ASO-013: Extract SKU Bundle tipe VARIANT pada Detail Sales Order

## Deskripsi Uji
Memastikan eksekusi fitur Extract this bundle pada SKU Bundle bertipe Variant berhasil menguraikan bundle menjadi item Variant penyusunnya.

## Catatan QA
* Origin Jira: [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605)
