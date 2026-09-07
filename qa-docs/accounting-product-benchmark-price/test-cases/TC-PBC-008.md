---
tc_code: TC-PBC-008
title: Header Product Bundle Non-Random dengan Detail Komponen Ber-COGS = 0 (No Inbound)
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
  notes: "Verifikasi Header Bundle dengan detail komponen No Inbound (B.COGS=0) berhasil terhitung Bundle Sum tanpa error."
---

# TC-PBC-008: Header Product Bundle Non-Random dengan Detail Komponen Ber-COGS = 0 (No Inbound)

## Objective
Memastikan jika salah satu SKU komponen di dalam detail bundle belum memiliki transaksi masuk stok (B.COGS = 0 / No Inbound), kalkulasi `Bundle Sum` tetap berjalan normal menjumlahkan komponen yang memiliki nilai tanpa menyebabkan error / bernilai 0 seluruhnya.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat SKU komponen dengan kondisi:
   - **Komponen A:** `KOMP-ACTIVE-01` (Manual COGS / B.COGS approved = Rp 120.000)
   - **Komponen B:** `KOMP-NOINBOUND-01` (SKU baru, B.COGS = 0 / No Inbound)
3. Terdapat header Product Bundle non-random `BDL-ZERO-COMP` dengan detail:
   - 1x `KOMP-ACTIVE-01` (Qty = 1)
   - 2x `KOMP-NOINBOUND-01` (Qty = 2)

## Test Steps
1. Buka menu **Finance / Accounting → Report → Benchmark COGS** (`/accounting/product-benchmark-price`).
2. Cari SKU `BDL-ZERO-COMP` pada datalist atau klik tombol **Calculate Benchmark COGS**.
3. Periksa nilai kolom **Benchmark COGS** dan **Description** pada baris `BDL-ZERO-COMP`.

## Expected Results
1. Nilai Benchmark COGS `BDL-ZERO-COMP` terhitung **Rp 120.000** (`(120.000 * 1) + (0 * 2)`).
2. Kolom Description menampilkan label **`Bundle Sum`** (bukan `No Inbound` atau `0`).
3. Sistem tidak melempar exception error / crash.
