---
code: PENDING-JENNI-2026090202
title: Header Product Bundle Variant Random — Perhitungan Highest Bundle Variant (MAX Sibling Non-Random)
origin_jira: ETM-15688
first_execution: null
last_execution: null
---

# TC-PBC-JENNI-DRAFT-2026090202: Header Product Bundle Variant Random — Perhitungan Highest Bundle Variant (MAX Sibling Non-Random)

## Objective
Memastikan header Product Bundle dengan variant **Random** (`-random`) menghitung Benchmark COGS dari nilai MAX (tertinggi) seluruh sibling header variant non-random dan menampilkan label Description `Highest Bundle Variant`.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat Product Bundle yang memiliki varian:
   - `BUNDLE-VAR-BLUE` (Non-random): B.COGS = Rp 830.000 (Bundle Sum)
   - `BUNDLE-VAR-WHITE` (Non-random): B.COGS = Rp 835.000 (Bundle Sum)
   - `BUNDLE-VAR-RANDOM` (Variant Random): Belum terkalkulasi.

## Test Steps
1. Buka menu **Finance / Accounting → Report → Benchmark COGS** (`/accounting/product-benchmark-price`).
2. Aktifkan toggle **Show Detail** untuk menampilkan seluruh child variant.
3. Jalankan recalculate / job calculation `product-benchmark-price:calculate`.
4. Periksa baris SKU `BUNDLE-VAR-RANDOM`.

## Expected Results
1. Nilai Benchmark COGS untuk variant random `BUNDLE-VAR-RANDOM` di-set **SAMA DENGAN** nilai tertinggi dari sibling header non-random:
   $$\text{B.COGS Random} = \max(830.000, 835.000) = \text{Rp } 835.000$$
2. Perhitungan variant random **TIDAK** menghitung ulang dari detail struktur BOM-nya sendiri.
3. Kolom **Description** pada `BUNDLE-VAR-RANDOM` menampilkan label **`Highest Bundle Variant`**.
