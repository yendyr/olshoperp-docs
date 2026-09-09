---
doc_type: e2e-test-case
tc_code: PENDING-JENNI-2026090902
menu: all-sales-order
menu_name: "All Sales Order"
test_type: happy
title: Konsolidasi Order Under / Below Benchmark COGS ke Datalist Pill Button Failed Process
summary: "Memastikan order dengan harga jual di bawah benchmark COGS masuk ke dalam filter tab Failed Process."
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

# TC-ASO-JENNI-DRAFT-2026090902: Konsolidasi Order Under / Below Benchmark COGS ke Datalist Pill Button Failed Process

## Objective
Memastikan ketika pill button `Failed Process` diklik, seluruh order yang mengalami error/flagging `Under Benchmark COGS` (Selling Price < Benchmark COGS) tampil secara lengkap di dalam datalist tersebut bersama order gagal proses lainnya.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat transaksi Sales Order yang terkena flagging *Under / Below Benchmark COGS = YES*.

## Test Steps
1. Buka menu **All Sales Order** (`/businessdevelopment/sales-order-general`).
2. Klik pill button **`Failed Process`**.
3. Periksa daftar transaksi Sales Order yang dimunculkan pada datalist.
4. Cari transaksi Sales Order yang terkena flag *Under Benchmark COGS*.

## Expected Results
1. Datalist **`Failed Process`** menampilkan seluruh order yang bermasalah, termasuk transaksi yang terkena flag **`Under / Below Benchmark COGS`**.
2. Operator dapat meninjau seluruh transaksi bermasalah di satu tempat tanpa perlu berpindah ke tab terpisah.
