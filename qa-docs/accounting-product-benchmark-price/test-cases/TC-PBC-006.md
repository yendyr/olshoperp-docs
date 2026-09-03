---
tc_code: TC-PBC-006
title: Regresi Auto-Approve & Snapshot Benchmark COGS pada Sales Order untuk Product Bundle
origin_jira: ETM-15688
first_execution:
  at: null
  via: null
  jira: null
last_execution:
  at: null
  jira: null
  status: not_run
  via: null
---

# TC-PBC-006: Regresi Auto-Approve & Snapshot Benchmark COGS pada Sales Order untuk Product Bundle

## Objective
Memastikan transaksi Sales Order yang memuat Product Bundle menyimpan snapshot Benchmark COGS hasil rumus baru dan melakukan validasi `Below Benchmark COGS` secara akurat.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Product Bundle `BUNDLE-SETUP-01` memiliki Benchmark COGS master = Rp 200.000 (`Bundle Sum`).

## Test Steps
1. Buka menu **Business Development → Sales Order General** (`/businessdevelopment/sales-order-general`).
2. Buat transaksi Sales Order baru dengan menambah 1 line item `BUNDLE-SETUP-01`.
3. Skenario A: Set Selling Price = Rp 250.000 (di atas benchmark).
4. Skenario B: Set Selling Price = Rp 180.000 (di bawah benchmark).
5. Simpan transaksi Sales Order dan periksa status approval & error flag `Below Benchmark COGS`.

## Expected Results
1. Skenario A (Price Rp 250.000 > B.COGS Rp 200.000):
   - Kolom `Benchmark COGS` pada line item menyimpan snapshot **Rp 200.000**.
   - Sales Order ter-auto-approve (tidak kena flag `Below Benchmark COGS`).
2. Skenario B (Price Rp 180.000 < B.COGS Rp 200.000):
   - Kolom `Benchmark COGS` pada line item menyimpan snapshot **Rp 200.000**.
   - Sales Order memicu flag **Below Benchmark COGS** (membutuhkan manual approval).
