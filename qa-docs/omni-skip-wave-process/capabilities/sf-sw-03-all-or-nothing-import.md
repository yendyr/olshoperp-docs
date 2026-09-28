---
doc_type: menu-capability
menu: omni-skip-wave-process
id: SF-SW-03
title: All-or-nothing Import
aliases: [all or nothing, screening gagal, import failed]
scope: menu
summary: >-
  Satu baris gagal screening di Import membuat seluruh file tidak masuk proses batch. Perbaiki file lalu upload ulang seluruhnya.
version: 1.0
last_updated: 2026-09-28
status: review
---

# All-or-nothing Import

## Apa ini

Aturan validasi file: kalau **satu** baris gagal screening, **seluruh** file ditolak di tahap Import. Tidak ada “sebagian order masuk, sebagian gagal” di tahap ini.

## Kapan dipakai

- Memahami kenapa upload “gagal semua” meski hampir semua baris benar.
- Membaca **Log Data** setelah Import Failed.

## Cara pakai

1. Setelah upload gagal, buka **Log Data**.
2. Cari baris / pesan error screening.
3. Perbaiki Excel (Order No, format, dll.).
4. **Upload ulang seluruh file** — tidak ada Retry untuk Import gagal.

## Catatan

- Berbeda dari gagal di **Wave** setelah Import sukses (bisa beda penyebab).
- Tidak ada tombol Retry untuk batch gagal validasi Import.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 100 baris, 1 Order No kosong | Upload | Import Failed — 0 order masuk datalist utama |
| File diperbaiki semua baris | Upload ulang | Batch masuk antrian |

## Lihat juga

- [Log Data — Import Logs](#sf-lingo:SF-SW-06)
- Requirement: [§7.3 All-or-nothing](../requirement.md)

