---
doc_type: menu-capability
menu: accounting-settlement-upload
id: SF-SETU-03
title: All-or-nothing Validasi
aliases: [all or nothing settlement, so failed seluruh file]
scope: menu
summary: >-
  Satu order gagal validasi membatalkan seluruh file. Tidak ada partial success dalam satu upload.
version: 1.0
last_updated: 2026-09-28
status: review
---

# All-or-nothing Validasi

## Apa ini

Aturan import Instant Settlement: jika **satu** order gagal validasi, **seluruh file** dibatalkan. Tidak ada “sebagian SO sukses, sebagian gagal” dalam satu batch.

## Kapan dipakai

- Memahami kenapa badge **Import Failed** meski hampir semua order benar.
- Membaca angka **SO Failed** / log error.

## Cara pakai

1. Setelah gagal, klik angka **SO Failed** / buka log error.
2. Perbaiki data (order tidak shipped, ID salah, mapping, dll.).
3. Upload ulang **seluruh** file yang sudah diperbaiki.

## Catatan

- Berbeda dari error di tahap generate SI/Outbound setelah sebagian dokumen sudah dibuat — itu memakai **Retry**, bukan all-or-nothing Import.
- Re-settlement (upload ulang order yang sama untuk dana susulan) adalah kasus terpisah yang diizinkan aturan bisnis.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 200 SO, 1 belum Shipped | Import | Seluruh file gagal |
| Semua SO valid | Import | Lanjut Upload Progress |

## Lihat juga

- [Retry batch / per order](#sf-lingo:SF-SETU-07)
- KB: [§3 Yang Bisa / Tidak](../knowledge-base.md)

