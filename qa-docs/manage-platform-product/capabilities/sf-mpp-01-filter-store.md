---
doc_type: menu-capability
menu: manage-platform-product
id: SF-MPP-01
title: Filter Store
aliases: [pilih toko, store filter, multi select store]
scope: menu
summary: >-
  Filter Store di atas DataList menentukan toko mana yang ditampilkan
  dan mengaktifkan tombol Pull, Push, serta Auto Binding.
version: 1.0
last_updated: 2026-07-31
status: review
---

# Filter Store

## Apa ini

**Filter Store** (multi-select di atas halaman) membatasi daftar Platform Product ke toko yang kamu pilih. Tanpa store terpilih, tombol aksi header (**Pull Products**, **Push Stock**, **Auto Binding**) tetap disabled.

## Kapan dipakai

- Membuka katalog satu atau beberapa toko marketplace.
- Sebelum Pull / Push / Auto Binding — wajib pilih minimal satu store.
- Membandingkan SKU yang sama di beberapa toko sekaligus.

## Cara pakai

1. Buka **Manage Platform Product**.
2. Di filter atas, pilih satu atau lebih **Store**.
3. DataList memuat produk toko tersebut.
4. Tombol **Pull Products** / **Push Stock** / **Auto Binding** menjadi aktif (jika tidak ada job yang sedang jalan).

## Catatan

- Store harus sudah connected / authorized di menu Store Binding.
- Kalau tombol masih abu-abu setelah pilih store: tunggu proses background selesai, lalu refresh.
- Filter store tidak menggantikan Advanced Filter kolom di dalam tabel.

## Lihat juga

- [Pull Products](#sf-lingo:SF-MPP-02)
- [Push Stock](#sf-lingo:SF-MPP-03)
- [Auto Binding](#sf-lingo:SF-MPP-05)
- [Feature Map](../feature-map.md) · [Requirement §3 A-01](../requirement.md#3-as-is-feature-map)
