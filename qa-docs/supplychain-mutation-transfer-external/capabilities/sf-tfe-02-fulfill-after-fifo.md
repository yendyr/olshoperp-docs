---
doc_type: menu-capability
menu: supplychain-mutation-transfer-external
id: SF-TFE-02
title: Single Rack FIFO / FIFO klasik
aliases: [FIFO, single rack FIFO, fulfill after fifo, alokasi stok]
scope: menu
summary: >-
  Alokasi stok otomatis saat Select Product/Import: coba cukup dari satu batch/rak
  dulu; kalau tidak, ambil bertahap dari batch terlama. Skip WIP dan Outrack.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Single Rack FIFO / FIFO klasik

## Apa ini

Aturan sistem saat **Select Product** atau **Import**: cari batch inbound **paling lama**. Kalau satu rak/batch sudah cukup qty → pakai **itu saja** (Single Rack FIFO). Kalau tidak → gabung beberapa batch terlama (FIFO klasik).

## Kapan dipakai

- Otomatis pada **Select Product** dan **Import**.
- **Tidak** pada **Available Products** (kamu pilih stock ID sendiri).

## Cara pakai

1. Tambah SKU lewat **Select Product** atau **Import**.
2. Isi qty transfer.
3. Sistem alokasi batch — cek hasil di **Detail View** bila multi stock ID.
4. Edit qty → sistem hitung ulang.

## Catatan

- Stok di **Outrack** / **WIP** tidak diambil otomatis.
- Origin level harus memenuhi aturan approve (level 20 ke atas sesuai pesan sistem).
- Pastikan lokasi stok SKU bukan hanya di WIP/Outrack.

## Contoh

Stok pensil: 1 Jan rack A 50 · 2 Jan B 100 · 3 Jan C 150 · 4 Jan D 200.

| Pindah | Dari |
|--------|------|
| 50 | A saja |
| 75 | B saja |
| 250 | A + B + C (FIFO klasik) |

## Lihat juga

- [Select Product / Available Products / Import](#sf-lingo:SF-DET-01)
- [Requirement §6.1](../requirement.md)
