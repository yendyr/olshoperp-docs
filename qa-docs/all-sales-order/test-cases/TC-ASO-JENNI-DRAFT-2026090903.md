---
doc_type: e2e-test-case
tc_code: PENDING-JENNI-2026090903
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: Tampilan Icon Error fa-arrow-trend-down pada Kolom Error Flag untuk Order Under Benchmark COGS
summary: "Verifikasi icon indikator error pada kolom Error Flag Datalist All Sales Order untuk transaksi under benchmark COGS."
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

# TC-ASO-JENNI-DRAFT-2026090903: Tampilan Icon Error fa-arrow-trend-down pada Kolom Error Flag untuk Order Under Benchmark COGS

## Objective
Memastikan pada datalist `Failed Process`, baris order yang terkena flag Under Benchmark COGS secara spesifik menampilkan icon FontAwesome `fa-solid fa-arrow-trend-down` di kolom Error Flag.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat transaksi Sales Order dengan status *Under Benchmark COGS*.

## Test Steps
1. Buka menu **All Sales Order** (`/businessdevelopment/sales-order-general`).
2. Klik tab pill button **`Failed Process`**.
3. Amati kolom **Error Flag** pada baris transaksi Sales Order yang terkena flag *Under Benchmark COGS*.

## Expected Results
1. Baris order yang terkena flag *Under Benchmark COGS* menampilkan icon FontAwesome **`fa-solid fa-arrow-trend-down`** (`<i class="fa-solid fa-arrow-trend-down"></i>`) pada kolom Error Flag.
2. Tooltip / visual indicator icon dengan jelas mengindikasikan bahwa harga jual di bawah nilai Benchmark COGS.
