---
code: PENDING-JENNI-2026090704
title: Regresi Pemrosesan Void & Clone untuk Sales Order Internal / General (Non-Platform)
origin_jira: ETM-15717
first_execution: null
last_execution: null
---

# TC-SPO-JENNI-DRAFT-2026090704: Regresi Pemrosesan Void & Clone untuk Sales Order Internal / General (Non-Platform)

## Objective
Memastikan proses Void & Clone pada Sales Order Internal/General (non-platform) tetap menghasilkan Sales Order Internal tanpa terpengaruh oleh perbaikan tipe Sales Platform.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat transaksi Sales Order Internal/General di menu `/businessdevelopment/sales-order-general` yang sedang diproses.

## Test Steps
1. Buka menu **Sales Order General** (`/businessdevelopment/sales-order-general`).
2. Lakukan proses **Void & Clone** pada transaksi Sales Order Internal tersebut.
3. Periksa tipe transaksi dan lokasi datalist dari order baru yang terbentuk.

## Expected Results
1. Order baru hasil Void & Clone dari Sales Order Internal **tetap bertipe Sales Order Internal/General**.
2. Order baru terdaftar di datalist Sales Order General (`/businessdevelopment/sales-order-general`).
3. Pemrosesan void & clone untuk order non-platform berjalan normal tanpa regresi.
