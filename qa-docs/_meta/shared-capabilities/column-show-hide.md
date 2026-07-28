---
doc_type: shared-capability
id: SF-DL-04
title: Column Show/Hide
aliases: [column manager, filter column, tampilkan kolom, sembunyikan kolom]
scope: global
summary: >-
  Atur kolom mana yang terlihat di datalist tanpa mengubah data transaksi
  atau hak akses.
version: 0.2
last_updated: 2026-07-27
status: draft
---

# Column Show/Hide

## Apa ini

Pengaturan tampilan kolom di tabel daftar. Kamu bisa menampilkan atau menyembunyikan kolom agar grid lebih rapi — **data di server tidak berubah**.

## Kapan dipakai

- Menyembunyikan kolom yang jarang dipakai agar tabel lebih lega.
- Menampilkan kolom yang default-nya tersembunyi saat butuh cek detail.
- Menyesuaikan layar kerja pribadi tanpa mengubah setup menu untuk orang lain.

## Cara pakai

1. Buka datalist.
2. Buka kontrol kolom (ikon/filter kolom di toolbar tabel).
3. Centang kolom yang ingin ditampilkan; hilangkan centang untuk menyembunyikan.
4. Tutup kontrol — grid langsung menyesuaikan.

## Catatan

- Beberapa kolom memang default tersembunyi sampai diaktifkan.
- Preferensi tampilan biasanya mengikuti browser/sesi user — bukan pengaturan company-wide.
- File **Export** mengikuti mapping export menu, **bukan selalu** sama dengan kolom yang sedang terlihat di layar.

## Contoh

| Aksi | Hasil |
|------|--------|
| Sembunyikan kolom Desc | Kolom hilang dari grid; data tetap ada |
| Tampilkan kolom yang default hidden | Kolom muncul di grid |

## Lihat juga

- [Export (with / without detail)](#sf-lingo:SF-DL-05)
- Daftar kolom default: Feature Map / requirement menu terkait
