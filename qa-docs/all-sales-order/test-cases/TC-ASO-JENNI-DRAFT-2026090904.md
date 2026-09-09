---
doc_type: e2e-test-case
tc_code: PENDING-JENNI-2026090904
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: "Tampilan Multiple Icon Indicator pada Kolom Error Flag untuk Transaksi dengan > 1 Error Flag"
summary: "Verifikasi tampilan multiple icon indicator pada kolom Error Flag Datalist All Sales Order."
status: draft
owner: QA - Jeiniffer
last_updated: 2026-09-09
requirement_ref: "qa-docs/all-sales-order/requirement.md"
automated: false
automated_spec: null
origin_jira: ETM-15821
first_execution:
  at: null
  jira: null
  via: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-ASO-JENNI-DRAFT-2026090904: Tampilan Multiple Icon Indicator pada Kolom Error Flag untuk Transaksi dengan > 1 Error Flag

## Objective
Memastikan jika 1 transaksi Sales Order mengalami multiple error flag (misal: *Unavailable Stock* + *Under Benchmark COGS* + *Unbinded Product*), kolom Error Flag wajib menampilkan seluruh icon error yang sesuai (> 1 icon secara berdampingan).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat transaksi Sales Order yang memiliki lebih dari 1 error flag sekaligus (contoh: stok tidak cukup & harga di bawah benchmark COGS).

## Test Steps
1. Buka menu **All Sales Order** (`/businessdevelopment/sales-order-general`).
2. Klik tab **`Failed Process`**.
3. Periksa kolom **Error Flag** pada transaksi yang memicu multiple error.

## Expected Results
1. Kolom Error Flag pada transaksi tsb **menampilkan seluruh icon error yang sesuai (> 1 icon)** secara berdampingan (misal: icon stok + icon `fa-arrow-trend-down`).
2. Tidak ada icon error yang tertimpa atau tersembunyi.
