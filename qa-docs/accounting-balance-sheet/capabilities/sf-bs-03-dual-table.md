---
doc_type: menu-capability
menu: accounting-balance-sheet
id: SF-BS-03
title: Dual table Assets vs L&E
aliases: [tabel assets, liabilities and equity, dual table neraca]
scope: menu
summary: >-
  Dua tabel berdampingan: kiri Assets, kanan Liabilities and Equity.
  Kolom Code, Name, Ending Balance; induk tebal + indent.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Dual table Assets vs L&E

## Apa ini

Layout utama neraca: **tabel kiri = Assets**, **tabel kanan = Liabilities and Equity**. Keduanya menampilkan hierarki COA dengan kolom Code, Name, dan Ending Balance.

## Kapan dipakai

- Menelusuri akun mana yang membentuk total di kartu.
- Membandingkan sisi aset vs utang+modal pada tanggal yang sama.
- Cek induk vs anak (induk tebal, nilai = akumulasi anak).

## Cara pakai

1. [As at → Apply](#sf-lingo:SF-BS-01).
2. Scroll tabel **Assets** (kiri) — class Assets saja.
3. Scroll tabel **Liabilities and Equity** (kanan) — class Liabilities + Equity.
4. Bandingkan Ending Balance baris dengan [kartu](#sf-lingo:SF-BS-02).

## Catatan

- Tidak ada Search Builder, pagination tipikal, action baris, atau drill-down ke Journal.
- Tidak ada export dari tabel.
- Hanya class Assets / Liabilities / Equity — Revenue/Expense/COGS tidak muncul di sini (itu di Profit & Loss).

## Contoh

| Panel | Isi class |
|-------|-----------|
| Kiri | Cash, Inventory, AR, … (Assets) |
| Kanan | AP, Loan, Capital, Current P/L COA, … (Liabilities + Equity) |

## Lihat juga

- [Summary cards](#sf-lingo:SF-BS-02)
- [How Ending Balance is calculated](#sf-lingo:SF-BS-04)
- Profit & Loss (class kinerja): [../accounting-profit-loss/](../accounting-profit-loss/)
