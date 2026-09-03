---
tc_code: TC-PBC-003
title: Manual COGS Override pada Header Product Bundle — Abaikan Rumus Bundle
origin_jira: ETM-15688
first_execution:
  at: "2026-09-03"
  via: "manual:p"
  jira: "ETM-15688"
last_execution:
  at: "2026-09-03"
  jira: "ETM-15688"
  status: passed
  via: "manual:p"
---

# TC-PBC-003: Manual COGS Override pada Header Product Bundle — Abaikan Rumus Bundle

## Objective
Memastikan pengisian Manual COGS pada header Product Bundle meng-override rumus `Bundle Sum` / `Highest Bundle Variant` dan menampilkan label Description `Manual Input`. Setelah di-clear, nilai kembali ke rumus bundle.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Terdapat header Product Bundle (misal `BUNDLE-SETUP-01`) dengan B.COGS hasil rumus Bundle Sum = Rp 200.000 (`Bundle Sum`).

## Test Steps
1. Buka menu **Finance / Accounting → Report → Benchmark COGS**.
2. Masukkan nilai **Manual COGS** pada `BUNDLE-SETUP-01` sebesar Rp 250.000 dan tetapkan tanggal expiry.
3. Simpan data dan jalankan recalculate.
4. Periksa nilai COGS efektif dan label Description.
5. Hapus (clear) nilai Manual COGS dan jalankan recalculate kembali.

## Expected Results
1. Saat Manual COGS aktif:
   - Nilai COGS efektif = **Rp 250.000** (mengabaikan hasil rumus Rp 200.000).
   - Kolom **Description** menampilkan label **`Manual Input`**.
2. Saat Manual COGS di-clear:
   - Nilai COGS efektif kembali ke hasil rumus bundle = **Rp 200.000**.
   - Kolom **Description** kembali menjadi **`Bundle Sum`**.
