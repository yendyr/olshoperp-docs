---
doc_type: menu-capability
menu: system-product
id: SF-SP-03
title: Variant Configuration
aliases: [enable variations, variant child sku, product options, random variant, leftover variant, Add New Variant, -DUPLICATE]
scope: menu
summary: >-
  Aktifkan Enable Variations untuk membuat SKU child dari kombinasi opsi (maks 3 tipe).
  Leftover hanya untuk tambah tipe/opsi; hapus tipe = flow delete; ganti in-place ditolak.
version: 1.1
last_updated: 2026-11-12
status: review
---

# Variant Configuration

## Apa ini

Fitur membuat beberapa SKU turunan (child) dari satu parent berdasarkan kombinasi opsi seperti Warna dan Ukuran.

## Kapan dipakai

- Produk punya beberapa varian (warna/ukuran/model).
- Ingin satu induk data dengan banyak SKU jual.
- Menambah tipe/opsi baru pada produk yang child-nya sudah dipakai transaksi (**leftover**).

## Cara pakai

1. Aktifkan **Enable Variations**.
2. Pilih tipe variant (maks **3**, mis. Warna + Ukuran).
3. Isi opsi tiap tipe.
4. Sistem auto-generate SKU child: `PARENT-MERAH-L` (Default-origin: **omit** segment opsi Default).
5. Edit tiap child (retail price, stok, min order, wholesale, D&W) via modal.

### Edit — tambah / hapus / ganti tipe

| Aksi | Jalur | Hasil |
|------|-------|-------|
| **+ Add New Variant** / tambah opsi | Leftover | Konfirmasi → child berelasi tetap + kombinasi baru |
| Hapus tipe / opsi | Delete varian | Soft-delete hanya child zero-relation; **bukan** regenerate; **dilarang** `-DUPLICATE` |
| Ganti tipe in-place (dropdown baris tersimpan) | Tolak | Pakai **+ Add New Variant** ([ETM-17377](https://erpintegration.atlassian.net/browse/ETM-17377)) |

## Catatan

- Maksimal **3** tipe variant — enforced **FE saja** (GAP-SP-06).
- Hanya **child** yang muncul di PO/SO/inbound; parent tidak stockable.
- Opsi **random** membuat segment `-random` → lihat [Random SKU](../../random-sku/).
- Kolom datatable variant dinamis dari API `specification/variant-column`.
- Residual expand UI: [ETM-17215](https://erpintegration.atlassian.net/browse/ETM-17215). Hapus tipe → `-DUPLICATE`: [ETM-17304](https://erpintegration.atlassian.net/browse/ETM-17304).
- Detail gate: [requirement §6.3.2a](../requirement.md).

## Contoh

| Tipe | Opsi | SKU child |
|------|------|-----------|
| Warna | Merah, Biru | `SKU-MERAH`, `SKU-BIRU` |
| Warna + Ukuran | Merah/L | `SKU-MERAH-L` |
| Default → Warna+Motif (leftover) | biru/pikacu | leftover `SKUPENSIL` + baru `SKUPENSIL-biru-pikacu` |

## Lihat juga

- [Product Type & transactability](#sf-lingo:SF-SP-01)
- [Import / Export](#sf-lingo:SF-SP-06) — Update Variant **bukan** leftover
- [Random SKU](../../random-sku/)
