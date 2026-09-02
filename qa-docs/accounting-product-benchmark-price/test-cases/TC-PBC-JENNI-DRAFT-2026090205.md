---
code: PENDING-JENNI-2026090205
title: SKU Rakitan / BOM Assembly (Stockable) — Tidak Menggunakan Rumus Bundle Sum
origin_jira: ETM-15688
first_execution: null
last_execution: null
---

# TC-PBC-JENNI-DRAFT-2026090205: SKU Rakitan / BOM Assembly (Stockable) — Tidak Menggunakan Rumus Bundle Sum

## Objective
Memastikan produk rakitan / BOM Assembly (stockable) **TIDAK** menggunakan rumus `Bundle Sum` / `Highest Bundle Variant`, melainkan tetap menggunakan B.COGS transaksi/manual dirinya sendiri.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat produk rakitan/BOM Assembly `RAKITAN-PC-01` (stockable & memiliki transaksi PO inbound sebesar Rp 5.000.000).
3. Struktur BOM `RAKITAN-PC-01` berisi komponen A + B (total B.COGS komponen = Rp 4.500.000).

## Test Steps
1. Buka menu **Benchmark COGS**.
2. Jalankan recalculate `product-benchmark-price:calculate`.
3. Periksa nilai Benchmark COGS dan Description pada `RAKITAN-PC-01`.

## Expected Results
1. Produk rakitan `RAKITAN-PC-01` **TIDAK** menggunakan rumus `Bundle Sum` (Rp 4.500.000).
2. Benchmark COGS `RAKITAN-PC-01` menggunakan B.COGS transaksi inbound dirinya sendiri = **Rp 5.000.000**.
3. Label **Description** menampilkan `Highest Price` / `Last Inbound` (bukan `Bundle Sum`).
