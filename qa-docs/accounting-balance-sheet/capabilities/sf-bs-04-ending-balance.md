---
doc_type: menu-capability
menu: accounting-balance-sheet
id: SF-BS-04
title: How Ending Balance is calculated
aliases: [ending balance, saldo neraca, beginning as of, cut-off]
scope: menu
summary: >-
  Ending Balance di tabel = saldo akun sampai cut-off As at dari journal
  Approved (akun biasa). Transaksi pada hari As at biasanya belum masuk
  saldo akun biasa.
version: 1.0
last_updated: 2026-08-12
status: review
---

# How Ending Balance is calculated

## Apa ini

Kolom **Ending Balance** menampilkan posisi saldo akun pada tanggal As at. Untuk akun Assets/Liabilities/Equity biasa, yang dihitung adalah saldo kumulatif dari journal **Approved** dengan tanggal **sebelum** hari As at (transaksi **pada** hari As at belum masuk path ini).

## Kapan dipakai

- Memahami kenapa journal tanggal = As at belum kelihatan di baris akun.
- Menjelaskan beda label “Ending Balance” vs cara hitung “sampai sebelum tanggal”.
- Troubleshooting angka 0 / tidak berubah.

## Cara pakai

1. Pastikan journal terkait sudah **Approved**.
2. [Apply As at](#sf-lingo:SF-BS-01).
3. Baca Ending Balance di [dual table](#sf-lingo:SF-BS-03).
4. Induk = akumulasi anak; akun paling bawah = saldo sendiri.
5. Untuk baris/mapping Current Profit/Loss, lihat [SF-BS-05](#sf-lingo:SF-BS-05) — path-nya berbeda.

## Catatan

- Journal Draft/Open/Rejected tidak masuk saldo akun biasa.
- Cut-off hari As at untuk Current P/L bisa **ikut** di kartu/baris khusus — beda dari akun biasa.
- Tidak ada mutasi “dalam range” seperti P&L — ini posisi as-of, bukan income statement.

## Contoh

| Given | Hasil di baris akun biasa |
|-------|---------------------------|
| Journal Approved 30 Mar, As at 31 Mar | Masuk Ending Balance |
| Journal Approved 31 Mar, As at 31 Mar | Belum masuk path beginning akun biasa |
| Journal masih Open | Tidak masuk |

## Lihat juga

- [As at & Apply](#sf-lingo:SF-BS-01)
- [Current Profit/Loss & Equity](#sf-lingo:SF-BS-05)
- Journal: [../journal/](../journal/)
