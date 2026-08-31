---
doc_type: menu-capability
menu: accounting-opening-stock
id: SF-OS-02
title: Expected Stock & Adjustment
aliases: [expected stock, adjustment qty, transaction stock, unit price]
scope: menu
summary: >-
  Isi Expected Stock dan Unit Price per SKU di lokasi. Adjustment Qty =
  Expected − Transaction Stock; angka bulat; menghasilkan Addition/Deduction.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Expected Stock & Adjustment

## Apa ini

Di baris detail kamu mengisi **Expected Stock** (qty yang diinginkan) dan **Unit Price**. Sistem menampilkan **Transaction Stock** (snapshot saat baris dibuat) lalu menghitung **Adjustment Qty** = Expected − Transaction Stock.

## Kapan dipakai

- Memasukkan saldo awal per SKU + lokasi.
- Menentukan apakah sistem akan menambah stok (+) atau mengurangi (−).

## Cara pakai

1. Tambah produk (Single/Variant Active — bukan jasa/random).
2. Pilih **Location** (rack terkecil Active).
3. Isi **Expected Stock** dan **Unit Price** (bilangan bulat).
4. Cek **Adjustment Qty** dan **Availability** (stok realtime).
5. Simpan — sistem siapkan [Generated Trx](#sf-lingo:SF-OS-03).

## Catatan

- **Transaction Stock** = snapshot saat insert, bukan angka realtime.
- Qty & harga harus **bilangan bulat**.
- Duplikat SKU + lokasi yang sama ditolak.
- Boleh ratusan/ribuan baris; import melewati batas max 500 opname.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Expected 100, Transaction Stock 0 | Isi baris | Adjustment +100 → Addition |
| Expected 80, Transaction Stock 100 | Isi baris | Adjustment −20 → Deduction |
| Harga 10.5 | Save | Ditolak — harus bilangan bulat |

## Lihat juga

- [Generated Trx](#sf-lingo:SF-OS-03)
- [Opening Balance COA](#sf-lingo:SF-OS-01)
- Knowledge Base: [knowledge-base.md](../knowledge-base.md)
