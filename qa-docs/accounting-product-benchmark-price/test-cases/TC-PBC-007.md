---
tc_code: TC-PBC-007
title: Verifikasi Dependency & Job Execution Order Calculation untuk Product Bundle
origin_jira: ETM-15688
first_execution:
  at: "2026-09-07"
  via: "manual:p"
  jira: "ETM-15688"
last_execution:
  at: "2026-09-07"
  jira: "ETM-15688"
  status: passed
  via: "manual:p"
  notes: "Verifikasi eksekusi sekuensial hierarki (Komponen -> Random Komponen -> Bundle Sum -> Highest Bundle Variant) berhasil ter-update akurat dalam 1x run."
---

# TC-PBC-007: Verifikasi Dependency & Job Execution Order Calculation untuk Product Bundle

## Objective
Memastikan batch job / tombol calculate Benchmark COGS mengeksekusi kalkulasi secara sekuensial bertingkat (Komponen Utama → Random Component → Bundle Sum → Highest Bundle Variant) sehingga seluruh level hierarki SKU ter-update akurat secara real-time tanpa race condition.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat struktur SKU bertingkat:
   - **Komponen Single:** `KOMP-STEP-01` (B.COGS awal Rp 100.000)
   - **Komponen Sibling Non-Random:** `KOMP-VAR-B` (B.COGS Rp 300.000)
   - **Komponen Variant Random:** `KOMP-VAR-RND` (Inherit MAX dari `KOMP-VAR-B` = Rp 300.000)
   - **Header Bundle Non-Random:** `BDL-CHAIN-SUM` (Detail: 1x `KOMP-STEP-01` + 1x `KOMP-VAR-RND`)
   - **Header Bundle Random:** `BDL-CHAIN-RND` (Sibling dari `BDL-CHAIN-SUM` & `BDL-CHAIN-VAR2` @450.000)

## Test Steps
1. Buka menu **Finance / Accounting → Report → Benchmark COGS** (`/accounting/product-benchmark-price`).
2. Ubah **Manual COGS** pada `KOMP-STEP-01` menjadi **Rp 150.000**.
3. Ubah **Manual COGS** pada `KOMP-VAR-B` menjadi **Rp 400.000** (menyebabkan `KOMP-VAR-RND` bertambah ke Rp 400.000).
4. Klik tombol **Calculate Benchmark COGS** pada header datalist.
5. Periksa nilai B.COGS dan Description untuk SKU `KOMP-VAR-RND`, `BDL-CHAIN-SUM`, dan `BDL-CHAIN-RND`.

## Expected Results
1. `KOMP-VAR-RND` ter-update ke **Rp 400.000** (`MAX(300k, 400k)`).
2. `BDL-CHAIN-SUM` ter-update ke **Rp 550.000** (`150.000 + 400.000`) dengan Description **`Bundle Sum`**.
3. `BDL-CHAIN-RND` ter-update ke **Rp 550.000** (`MAX(550.000, 450.000)`) dengan Description **`Highest Bundle Variant`**.
