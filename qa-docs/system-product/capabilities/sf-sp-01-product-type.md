---
doc_type: menu-capability
menu: system-product
id: SF-SP-01
title: Product Type & transactability
aliases: [single variant bundle, parent child sku, transactable product]
scope: menu
summary: >-
  Empat tipe SKU: Single, Variant Parent, Variant Child, dan Bundle. Hanya
  Single, Child, dan Bundle (di Sales Order) yang bisa ditransaksikan.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Product Type & transactability

## Apa ini

Tipe produk menentukan apakah SKU bisa dijual, distock, dan muncul di transaksi. Ditentukan dari toggle Variant/Bundle saat create.

## Kapan dipakai

- Membuat SKU baru dan memilih apakah Single, Variant, atau Bundle.
- Mencari alasan sebuah SKU tidak muncul di PO/PR/SO.

## Cara pakai

| Tipe | Cara buat | Bisa ditransaksikan? |
|------|-----------|----------------------|
| **Single** | Create biasa, tanpa toggle | Ya |
| **Variant Parent** | Enable Variations ON | **Tidak** — hanya pembungkus |
| **Variant Child** | Auto-generate dari parent | Ya |
| **Bundle** | Set as Product Bundle ON | Ya, **Sales Order saja** |

## Catatan

- Parent variant tidak stockable; yang muncul di PO/PR/SO hanya **child**.
- Bundle tidak bisa inbound langsung — inbound komponennya masing-masing.
- Bundle (`is_bom=0`) **bukan** Header BOM Assembly (`is_bom=1`, menu Bill of Material).
- Tooltip datalist menyebut stok parent `-`, tetapi backend tetap menghitung angka.

## Contoh

| Kondisi | Hasil |
|---------|-------|
| Cari parent variant di PO | Tidak muncul; pilih child |
| Pilih bundle di Sales Order | Muncul; stok dipotong per komponen |
| Toggle bundle di SKU yang sudah transaksi | Terkunci |

## Lihat juga

- [Variant Configuration](#sf-lingo:SF-SP-03)
- [Bundle Configuration & tax hide](#sf-lingo:SF-SP-04)
- BOM: [Bill of Material](../../bill-of-material/)
