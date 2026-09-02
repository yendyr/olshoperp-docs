---
code: PENDING-JENNI-2026090201
title: Header Product Bundle Non-Random — Perhitungan Bundle Sum (Σ B.COGS Komponen × Qty BOM)
origin_jira: ETM-15688
first_execution: null
last_execution: null
---

# TC-PBC-JENNI-DRAFT-2026090201: Header Product Bundle Non-Random — Perhitungan Bundle Sum (Σ B.COGS Komponen × Qty BOM)

## Objective
Memastikan header Product Bundle non-random (Single/Variant) menghitung Benchmark COGS dari hasil penjumlahan (B.COGS komponen × Qty BOM) dan menampilkan label Description `Bundle Sum`.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat SKU komponen stockable yang sudah memiliki Benchmark COGS valid:
   - Komponen A: B.COGS = Rp 100.000
   - Komponen B: B.COGS = Rp 50.000
3. Terdapat header Product Bundle non-random (misal SKU `BUNDLE-SETUP-01`) dengan struktur komponen:
   - 1x Komponen A (Qty = 1)
   - 2x Komponen B (Qty = 2)

## Test Steps
1. Buka menu **Finance / Accounting → Report → Benchmark COGS** (`/accounting/product-benchmark-price`).
2. Jalankan recalculate / job scheduler `product-benchmark-price:calculate` atau klik tombol **Sync / Calculate** pada SKU `BUNDLE-SETUP-01`.
3. Cari SKU `BUNDLE-SETUP-01` pada datalist Benchmark COGS.
4. Periksa nilai kolom **Benchmark COGS** dan kolom **Description**.

## Expected Results
1. Nilai Benchmark COGS pada SKU Header `BUNDLE-SETUP-01` terhitung akurat sesuai rumus:
   $$\text{B.COGS Bundle} = (100.000 \times 1) + (50.000 \times 2) = \text{Rp } 200.000$$
2. Kolom **Description** pada datalist Benchmark COGS menampilkan label **`Bundle Sum`**.
