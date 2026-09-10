---
code: PENDING-JENNI-2026091002
title: Validasi Mandatory Expiry Date dan Penghapusan Override Permanen
origin_jira: ETM-15850
first_execution: null
last_execution: null
---

# TC-APB-JENNI-DRAFT-2026091002: Validasi Mandatory Expiry Date dan Penghapusan Override Permanen

## Objective
Memastikan sistem menolak/mencegah pembuatan Manual COGS tanpa Expiry Date (menghapus konsep override permanen). Setiap Manual COGS terisi (termasuk nilai 0) wajib memiliki Expiry Date yang valid.

## Preconditions
1. User login ke OlshopERP Staging (`tim_dev@mail.com`).
2. Berada di halaman Benchmark COGS (`/accounting/product-benchmark-price`).

## Test Steps
1. Buka menu **Benchmark COGS**.
2. Pilih SKU produk dan lakukan inline edit pada kolom **Manual COGS** (isi nilai 50.000 atau 0).
3. Hapus / kosongkan field **Manual COGS Expiry** hingga bernilai `NULL`.
4. Coba simpan perubahan.

## Expected Results
1. Sistem mencegah/menolak penyimpanan Manual COGS tanpa Expiry Date.
2. Muncul notifikasi error validasi yang jelas bahwa **Manual COGS Expiry wajib terisi** apabila Manual COGS diisi.
3. Konsep override permanen (Manual COGS terisi tanpa Expiry Date) tidak dapat diterapkan lagi di sistem.
