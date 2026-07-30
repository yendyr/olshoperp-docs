---
doc_type: menu-capability
menu: system-product
id: SF-SP-03
title: Variant Configuration
aliases: [enable variations, variant child sku, product options, random variant]
scope: menu
summary: >-
  Aktifkan Enable Variations untuk membuat SKU child otomatis dari kombinasi
  opsi (maks 3 tipe). Hanya child yang bisa ditransaksikan.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Variant Configuration

## Apa ini

Fitur membuat beberapa SKU turunan (child) dari satu parent berdasarkan kombinasi opsi seperti Warna dan Ukuran.

## Kapan dipakai

- Produk punya beberapa varian (warna/ukuran/model).
- Ingin satu induk data dengan banyak SKU jual.

## Cara pakai

1. Aktifkan **Enable Variations**.
2. Pilih tipe variant (maks **3**, mis. Warna + Ukuran).
3. Isi opsi tiap tipe.
4. Sistem auto-generate SKU child: `PARENT-MERAH-L`.
5. Edit tiap child (retail price, stok, min order, wholesale, D&W) via modal.

## Catatan

- Maksimal **3** tipe variant — enforced **FE saja** (GAP-SP-06).
- Hanya **child** yang muncul di PO/SO/inbound; parent tidak stockable.
- Opsi **random** membuat segment `-random` → lihat [Random SKU](../../random-sku/).
- Kolom datatable variant dinamis dari API `specification/variant-column`.

## Contoh

| Tipe | Opsi | SKU child |
|------|------|-----------|
| Warna | Merah, Biru | `SKU-MERAH`, `SKU-BIRU` |
| Warna + Ukuran | Merah/L | `SKU-MERAH-L` |

## Lihat juga

- [Product Type & transactability](#sf-lingo:SF-SP-01)
- [Random SKU](../../random-sku/)
