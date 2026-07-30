---
doc_type: menu-capability
menu: system-product
id: SF-SP-04
title: Bundle Configuration & tax hide
aliases: [product bundle, set as bundle, bundle validity, bundle tax hidden]
scope: menu
summary: >-
  Set as Product Bundle menggabungkan beberapa SKU jadi satu paket jual di
  Sales Order. Section Accounting & Tax parent disembunyikan; pajak per komponen.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Bundle Configuration & tax hide

## Apa ini

Bundle (`is_bom=0`) adalah paket beberapa SKU yang dijual sebagai satu item di Sales Order. Stok dan pajak dihitung dari komponen, bukan header.

## Kapan dipakai

- Menjual paket produk (mis. hampers, combo) di Sales Order.
- Bukan untuk produksi/assembly — itu Header BOM di [Bill of Material](../../bill-of-material/).

## Cara pakai

1. Aktifkan **Set as Product Bundle**.
2. Isi komponen + qty.
3. Pastikan resep valid sebelum activate.
4. Simpan; bundle siap dipakai di Sales Order.

## Catatan

- **Resep valid:** ≥2 baris **ATAU** 1 baris dengan qty **≥2**.
- **Invalid:** 1 baris dengan qty = 1 → activate diblok.
- Section **Accounting & Tax Setting** parent **disembunyikan** saat bundle ON — pajak & COA mengacu **detail komponen**.
- Bundle tidak bisa inbound langsung; stok = lowest denominator komponen.
- Toggle terkunci bila SKU sudah punya relasi/transaksi.
- Distribusi harga di SO memakai basis **Price Before VAT** (lihat requirement §11).

## Contoh

| Resep | Valid? |
|-------|--------|
| 2× SKU-A + 1× SKU-B | Ya |
| 1× SKU-A qty 2 | Ya |
| 1× SKU-A qty 1 | Tidak |

## Lihat juga

- [Product Type & transactability](#sf-lingo:SF-SP-01)
- [Availability / On Hand / ATS](#sf-lingo:SF-SP-05)
- Header BOM: [Bill of Material](../../bill-of-material/)
