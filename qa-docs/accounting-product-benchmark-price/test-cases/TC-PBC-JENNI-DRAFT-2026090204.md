---
code: PENDING-JENNI-2026090204
title: Komponen Variant Random di Dalam Detail Bundle — Pakai B.COGS Final Komponen
origin_jira: ETM-15688
first_execution: null
last_execution: null
---

# TC-PBC-JENNI-DRAFT-2026090204: Komponen Variant Random di Dalam Detail Bundle — Pakai B.COGS Final Komponen

## Objective
Memastikan kalkulasi `Bundle Sum` pada header bundle yang mengandung komponen variant random menggunakan B.COGS final komponen setelah meng-inherit MAX sibling non-bundle.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Komponen B (Non-bundle) memiliki variant random `KOMPONEN-B-RANDOM` dengan B.COGS final (setelah inherit sibling) = Rp 75.000.
3. Terdapat Header Product Bundle `BUNDLE-MIX-01` dengan detail komponen 1x `KOMPONEN-B-RANDOM`.

## Test Steps
1. Buka menu **Benchmark COGS**.
2. Jalankan recalculate urutan job (Single/Variant non-bundle → resolve random non-bundle → Bundle Sum).
3. Periksa nilai Benchmark COGS pada `BUNDLE-MIX-01`.

## Expected Results
1. Urutan job menyelesaikan perhitungan B.COGS `KOMPONEN-B-RANDOM` terlebih dahulu (Rp 75.000).
2. Header bundle `BUNDLE-MIX-01` menghitung B.COGS dari kontribusi `KOMPONEN-B-RANDOM` = Rp 75.000.
3. Description menampilkan **`Bundle Sum`**.
