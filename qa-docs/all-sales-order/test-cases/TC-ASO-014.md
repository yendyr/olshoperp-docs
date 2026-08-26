---
owner: QA - Jenni
tc_code: TC-ASO-014
title: "Extract SKU Bundle tipe VARIANT RANDOM pada Detail Sales Order"
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
  - "Tersedia Sales Order dengan SKU Bundle yang komponennya berjenis Variant RANDOM"
test_data:
  - field: "Sales Order Code"
    value: "SO-FIXTURE-001"
steps:
  - "Buka detail Sales Order"
  - "Klik tombol "Extract this bundle" pada SKU Bundle Variant RANDOM"
  - "Jika muncul modal pemilih Variant / alokasi random, pilih opsi yang valid"
  - "Verifikasi hasil penguraian bundle di detail order"
  - "Simpan Sales Order"
expected_result: |
  Sistem menangani ekstraksi SKU Bundle Variant RANDOM dengan benar, varian teralokasi sesuai kriteria, dan data detail tersimpan.
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

# TC-ASO-014: Extract SKU Bundle tipe VARIANT RANDOM pada Detail Sales Order

## Deskripsi Uji
Memastikan eksekusi fitur Extract this bundle pada SKU Bundle bertipe Variant RANDOM mengalokasikan / memicu pemilih variant yang sesuai.

## Catatan QA
* Origin Jira: [ETM-15605](https://erpintegration.atlassian.net/browse/ETM-15605)
