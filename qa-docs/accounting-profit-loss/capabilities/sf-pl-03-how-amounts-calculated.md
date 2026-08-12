---
doc_type: menu-capability
menu: accounting-profit-loss
id: SF-PL-03
title: How amounts are calculated
aliases: [sumber angka P&L, journal approved, COA class, debit credit]
scope: menu
summary: >-
  Angka P&L = saldo in-period dari journal Approved pada 4 class akun
  (Revenue, Other, COGS, Expense) dalam IDR; parent mengagregasi anak.
version: 1.0
last_updated: 2026-08-12
status: review
---

# How amounts are calculated

## Apa ini

Setiap amount di tabel adalah **saldo transaksi dalam rentang tanggal kolom itu**, dari journal berstatus **Approved**, untuk akun Revenue / Other Revenue & Expenses / Cost Of Goods Sold / Expense. Ditampilkan dalam mata uang utama (IDR).

## Kapan dipakai

- Memahami kenapa angka 0 padahal ada transaksi.
- Menjelaskan ke tim kenapa Revenue bisa terlihat negatif.
- Hover amount untuk baca tooltip basis kalkulasi + FX.

## Cara pakai

1. Pastikan journal di periode terkait sudah **Approved**.
2. **Apply** filter → baca baris akun (induk tebal + indent; anak di bawahnya).
3. Total per class di footer = jumlah **akun paling bawah** saja (bukan dijumlah induk lagi).
4. Hover amount → tooltip menjelaskan periode dan bahwa FX memakai kurs saat transaksi.

## Catatan

- Journal **Draft / Open / Rejected** tidak masuk untuk akun biasa.
- Kurs valuta asing **tidak** dihitung ulang di laporan — pakai nilai yang sudah tersimpan di journal.
- Tampilan = debit dikurangi credit (mentah). Akun pendapatan yang normal credit sering **negatif** di menu ini (beda dari Dev Profit & Loss yang di-flip).
- Belum ada baris terpisah **Laba Kotor / Laba Bersih** — hanya total per class.
- Akun Current Profit/Loss punya path khusus; perlakuan status journal-nya masih dalam tinjauan.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Journal Approved revenue di Mei | Filter Mei → Apply | Amount muncul di class Revenue |
| Journal masih Open | Filter periode yang sama | Tidak masuk angka |
| Journal USD rate 16.000 | Lihat amount IDR | Ikuti nilai journal × rate tersimpan |

## Lihat juga

- [Period filter & Apply](#sf-lingo:SF-PL-01)
- [Compared Period](#sf-lingo:SF-PL-02)
- Journal: [../journal/](../journal/)
- Dev P&L (tampilan beda): [../accounting-profit-loss-v1/](../accounting-profit-loss-v1/)
