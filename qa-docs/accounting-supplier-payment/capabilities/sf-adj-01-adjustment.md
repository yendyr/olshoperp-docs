---
doc_type: menu-capability
menu: accounting-supplier-payment
id: SF-ADJ-01
title: Adjustment
aliases: [payment adjustment, biaya admin, rounding payment]
scope: menu
summary: >-
  Baris penyesuaian manual (Debit atau Credit ke COA pilihan) yang memengaruhi
  grand total detail sebelum balancing dengan Payment Source.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Adjustment

## Apa ini

Section **Adjustment** menambah baris jurnal penyesuaian pada payment — misalnya biaya admin atau pembulatan. Tiap baris memilih **COA**, lalu **Debit** atau **Credit** (salah satu), plus deskripsi opsional.

## Kapan dipakai

- Perlu menyesuaikan total agar Source dan Detail bisa balance.
- Ada biaya/pendapatan terkait pembayaran yang bukan alokasi PI murni.
- Rounding kecil yang tidak masuk Cash Diff otomatis.

## Cara pakai

1. Buka section **Adjustment** pada form payment (sebelum approved).
2. Pilih **Account (COA)**.
3. Isi **Debit** atau **Credit** (saling eksklusif per baris).
4. Simpan baris; ulangi bila perlu.
5. Cek ulang [Strict balancing](#sf-lingo:SF-PAY-01) — pada Account Payment, adjustment **mengurangi** total detail (credit − debit).

## Catatan

- Hanya bisa diubah sebelum payment approved.
- Tetap butuh minimal satu alokasi PI dan satu Payment Source untuk Approve.
- Jangan pakai adjustment sebagai pengganti Void — Void approved belum tersedia.

## Contoh

| Situasi | Adjustment | Efek ringkas |
|---------|------------|--------------|
| Detail PI 10.001.000, Source 10.000.000 | Sesuaikan agar grand total = Source | Balance tercapai lalu Approve |
| Biaya transfer ke COA biaya | Debit COA biaya sesuai nominal | Ikut jurnal saat Approve |

## Lihat juga

- [Strict balancing](#sf-lingo:SF-PAY-01)
- [Payment Source](#sf-lingo:SF-SRC-01)
