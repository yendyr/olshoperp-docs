---
owner: QA - Jenni
tc_code: PENDING-JENNI-2026082105
title: "Extract SKU Bundle pada Sales Order dengan > 100 baris detail SKU"
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
  - "Navigasi ke menu All Sales Order"
  - "Tersedia Sales Order dengan 100 baris detail SKU (termasuk minimal 1 SKU Bundle)"
test_data:
  - field: "Sales Order Code"
    value: "SO-FIXTURE-001"
steps:
  - "Buka detail Sales Order (100 rows detail)"
  - "Jalankan fitur "Extract this bundle" pada SKU Bundle"
  - "Verifikasi jumlah total baris detail meningkat menjadi > 100 rows"
  - "Lakukan navigasi pagination / scroll pada tabel detail"
  - "Klik Save All"
expected_result: |
  1. Total baris detail bertambah melebihi 100 rows tanpa freeze/crash.
2. Pagination dan render tabel detail berjalan normal.
3. Dokumen Sales Order dengan > 100 rows detail berhasil disimpan (Save All).
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

# PENDING-JENNI-2026082105: Extract SKU Bundle pada Sales Order dengan > 100 baris detail SKU

## Deskripsi Uji
Memastikan performa dan stabilitas ekstraksi bundle pada Sales Order yang memiliki 100 baris detail SKU sehingga total baris menjadi > 100 rows.

## Catatan QA
* Origin Jira: [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605)
