---
code: PENDING-JENNI-2026091001
title: Verifikasi Semantik Manual COGS (NULL vs 0 vs >0) pada Benchmark COGS
origin_jira: ETM-15850
first_execution: null
last_execution: null
---

# TC-APB-JENNI-DRAFT-2026091001: Verifikasi Semantik Manual COGS (NULL vs 0 vs >0) pada Benchmark COGS

## Objective
Memastikan pengisian nilai Manual COGS NULL mengembalikan kalkulasi COGS ke rumus sistem (Highest Price / Last Inbound / No Inbound), sedangkan pengisian nilai 0 dianggap sebagai Manual COGS aktif (COGS Efektif = 0 & Description = Manual Input).

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat SKU produk pada menu Benchmark COGS (`/accounting/product-benchmark-price`).

## Test Steps
1. Buka menu **Finance / Accounting → Benchmark COGS** (`/accounting/product-benchmark-price`).
2. Cari SKU produk target.
3. Set **Manual COGS = 0** dan isi **Manual COGS Expiry** dengan tanggal valid (misal: H+30). Simpan.
4. Perhatikan kolom **COGS Efektif** dan **Description**.
5. Kosongkan nilai **Manual COGS** menjadi **NULL** (clear override). Simpan.
6. Perhatikan kembali kolom **COGS Efektif** dan **Description**.

## Expected Results
1. Saat Manual COGS diisi `0` + Expiry valid: COGS Efektif bernilai `0` dan Description menampilkan `Manual Input` (bukan kembali ke rumus sistem).
2. Saat Manual COGS diubah menjadi `NULL`: Manual COGS Expiry otomatis di-set `NULL`, dan COGS Efektif secara otomatis mengkalkulasi ulang berdasarkan rumus sistem (Highest Price / Last Inbound / dll.).
