---
doc_type: menu-capability
menu: accounting-balance-sheet
id: SF-BS-02
title: Summary cards
aliases: [kartu neraca, total assets, total liabilities, total equity, current profit loss card]
scope: menu
summary: >-
  Kartu ringkasan di atas tabel: Total Assets, Total Liabilities & Equity
  (plus sub Liabilities/Equity), dan Current Profit/Loss.
version: 1.0
last_updated: 2026-08-12
status: review
---

# Summary cards

## Apa ini

Baris **kartu** di atas dual table menampilkan ringkasan neraca untuk tanggal As at: Total Assets, Total Liabilities and Equity (dengan sub Total Liabilities / Total Equity), dan **Current Profit/Loss**.

## Kapan dipakai

- Cek cepat apakah Assets mendekati Liabilities + Equity.
- Lihat dampak laba/rugi berjalan ke modal tanpa scroll tabel.
- Audit setelah tutup bulan / sebelum closing fiscal period.

## Cara pakai

1. [As at → Apply](#sf-lingo:SF-BS-01).
2. Baca kartu kiri: **Total Assets**.
3. Baca kartu tengah: **Total Liabilities and Equity** (+ sub Liabilities / Equity).
4. Baca kartu kanan: **Current Profit/Loss** — lihat juga [dampak ke Equity](#sf-lingo:SF-BS-05).

## Catatan

- Idealnya Total Assets ≈ Total Liabilities + Total Equity. Sistem **tidak memblok** jika belum sama.
- Current P/L positif menambah Total Equity; negatif menguranginya.
- Angka kartu mengikuti journal **Approved** (saldo akun biasa) + mapping Current P/L.

## Contoh

| Given | Yang terlihat |
|-------|----------------|
| Assets 100, Liabilities 40, Equity COA 50, Current P/L +10 | Total Equity 60; L&E 100; Assets 100 |
| Current P/L −5 | Total Equity turun 5 dibanding modal COA saja |

## Lihat juga

- [Current Profit/Loss & Equity](#sf-lingo:SF-BS-05)
- [Dual table Assets vs L&E](#sf-lingo:SF-BS-03)
- [How Ending Balance is calculated](#sf-lingo:SF-BS-04)
