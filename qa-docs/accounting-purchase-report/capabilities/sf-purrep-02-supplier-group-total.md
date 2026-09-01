---
doc_type: menu-capability
menu: accounting-purchase-report
id: SF-PURREP-02
title: Group Supplier + total header
aliases: [supplier group, total tagihan header, RowGroup supplier]
scope: menu
summary: >-
  Baris digroup per supplier; header group menampilkan nama supplier + total
  nominal supplier (sum line amounts terfilter).
version: 1.0
last_updated: 2026-09-01
status: review
---

# Group Supplier + total header

## Apa ini

Datalist **Purchase Report** mengelompokkan baris per **Supplier**. Header group menampilkan:

- Nama supplier (kiri)
- **Total nominal supplier** (kanan) = jumlah amount baris terfilter untuk supplier itu

Kolom **Total Tagihan** per baris = amount **line** (bukan running Excel per row) — lihat GAP-PURREP-02.

## Kapan dipakai

- Quick scan total pembelian per vendor dalam periode.
- Bandingkan kontribusi supplier tanpa export dulu.

## Cara baca

1. Expand/collapse group supplier.
2. Jumlahkan mental: total header harus = sum **Total Tagihan** baris di group (untuk filter aktif).
3. Global search mempersempit baris → total header supplier ikut menyesuaikan.

## Contoh konsep

Beberapa baris SKU dari supplier yang sama → header group supplier menampilkan total gabungan; setiap baris tetap punya Total Tagihan line sendiri.

## Lihat juga

- [requirement §2.2](../requirement.md#22-grouping--total-tagihan)
- [Tab PO / PI](#sf-lingo:SF-PURREP-01)
