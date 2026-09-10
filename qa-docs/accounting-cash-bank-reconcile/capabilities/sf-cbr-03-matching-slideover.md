---
doc_type: menu-capability
menu: accounting-cash-bank-reconcile
id: SF-CBR-03
title: Matching Slideover (2 arah)
aliases: [see other, find and match, POV matching, difference bar]
scope: menu
summary: >-
  Panel matching diganti slideover dengan dua arah: 1 bank→banyak journal
  atau 1 journal→banyak bank. Match aktif hanya jika Difference = 0.
version: 1.0
last_updated: 2026-09-10
status: review
---

# Matching Slideover (2 arah)

## Apa ini

Panel **Matching with Bank Statement** (dari See Other / See more) dalam bentuk **slideover** — halaman reconcile tetap terlihat di belakang. Kamu pilih pasangan sampai **Difference** menjadi 0, lalu klik **Match**.

> **Status:** TO-BE ([ETM-15856](https://erpintegration.atlassian.net/browse/ETM-15856)). AS-IS masih modal Dialog dengan 1 baris bank terkunci.

## Kapan dipakai

- Tidak ada saran tunggal yang pas, atau ingin pilih beberapa baris sekaligus.
- Perlu ganti baris acuan tanpa menutup panel (**Change bank statement** / **Change internal transaction**).

## Cara pakai

1. Dari Reconcile Process, buka **See Other……**.
2. Pilih arah kerja:
   - **1 bank statement → many GL** — satu baris bank, centang beberapa journal.
   - **1 GL → many bank statements** — satu journal, centang beberapa baris bank (hasil import).
3. Filter **Select Period** / **Amount** bila perlu.
4. Lihat bar **Difference** di bawah panel — angka merah jika belum 0.
5. Kalau masih kurang di arah bank→GL: [Quick Journal](#sf-lingo:SF-CBR-04).
6. Difference = 0 → klik **Match** (tetap manual).

## Catatan

- Bank statement **tidak bisa dibuat** di panel — hanya ganti / pilih baris import.
- Ganti acuan (**Change…**) membersihkan centangan sebelumnya (ada catatan di pemilih baris).
- Setelah buat journal & approve: baris baru bisa **tercentang otomatis**; Match tetap kamu klik.

## Contoh

Bank Receive **3.000.000**, journal terpilih **2.850.000** → Difference **150.000** (Match mati). Tutup selisih dengan journal 150.000 → Difference **0** → klik **Match**.

## Lihat juga

- [Quick Journal dari matching](#sf-lingo:SF-CBR-04)
- [Match, Unmatch & Approve](#sf-lingo:SF-CBR-05)
- Requirement: [../requirement.md](../requirement.md) §6.5
