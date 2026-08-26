---
doc_type: menu-capability
menu: supplychain-colli-type
id: SF-CT-03
title: Active vs used
aliases: [active colli type, inactive colli type, dipakai colli code]
scope: menu
summary: >-
  Active ON = bisa dipilih di New Colli. Active OFF ditolak jika sudah ada
  colli code memakai type ini. Code/Name tetap boleh diubah.
version: 1.0
last_updated: 2026-08-14
status: review
---

# Active vs used

## Apa ini

**Active** mengontrol apakah type muncul di pilihan transaksi. **Digunakan** = sudah ada colli code (wadah aktual) yang memakai type ini. Kalau sudah dipakai, matikan Active **ditolak**.

## Kapan dipakai

- Sembunyikan jenis yang tidak dipakai lagi (**hanya** jika belum ada colli code).
- Type masih dipakai di gudang — biarkan Active ON; buat type baru untuk jenis ke depan.
- Rename tanpa mengubah Active.

## Cara pakai

1. Cek apakah type sudah punya colli code.
2. Belum dipakai → boleh **Active OFF**.
3. Sudah dipakai → **jangan** matikan Active; buat type baru jika perlu jenis lain.
4. Code/Name tetap boleh diedit di kedua kondisi.

## Catatan

- Active OFF → type tidak muncul di New Colli.
- Pesan penolakan (bahasa Inggris): type tidak bisa Inactive karena sudah dipakai satu atau lebih colli code.
- Show for all company boleh diubah meski type sudah dipakai.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Type belum dipakai | Active OFF | Sukses; tidak muncul di New Colli |
| Type sudah punya colli code | Active OFF | Ditolak |
| Type sudah dipakai | Ganti Code | Sukses |

## Lihat juga

- [Delete when unused](#sf-lingo:SF-CT-04)
- [Use in New Colli](#sf-lingo:SF-CT-05)
- [Create Colli Type](#sf-lingo:SF-CT-01)
