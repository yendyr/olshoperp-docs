---
doc_type: menu-capability
menu: supplychain-mutation-transfer-internal
id: SF-TFI-01
title: Fulfill-after-FIFO
aliases: [FIFO, single rack, batch allocation, fulfill after fifo]
scope: menu
summary: >-
  Alokasi stok otomatis saat Select Product/Import: coba cukup dari satu batch/rak
  dulu; kalau tidak, ambil dari beberapa batch terlama.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Fulfill-after-FIFO

## Apa ini

Aturan sistem saat **Select Product** atau **Import**: cari stok dari batch inbound **paling lama** dulu. Kalau satu batch/rak sudah cukup qty, pakai **batch itu saja**; kalau tidak, gabung beberapa batch.

## Kapan dipakai

- Otomatis saat **Select Product** dan **Import** (bukan Available Product).
- Baris **loose** (tanpa colli): hanya stok **tanpa** colli — stok yang sudah dalam colli tidak diambil lewat jalur ini.

## Cara pakai

1. Tambah SKU lewat **Select Product** (atau Import).
2. Isi qty transfer.
3. Sistem alokasi batch — lihat hasil di **Detail View** jika lebih dari satu stock ID.
4. Edit qty → sistem hitung ulang.

## Catatan

- Barang di **Outrack** / **WIP** tidak diambil otomatis.
- **Available Product** **tidak** pakai aturan ini — kamu pilih stock ID sendiri.
- BETA Colli: baris colli-bound punya aturan qty maks sendiri.

## Contoh

Stok pensil: 1 Jan rack A 50 · 2 Jan B 100 · 3 Jan C 150.

| Pindah | Dari |
|--------|------|
| 50 | A saja |
| 75 | B saja |
| 250 | A + B + C (gabungan) |

## Lihat juga

- [Select Product / Available Product / Import](#sf-lingo:SF-DET-01)
- [Requirement §6.1](../requirement.md)
