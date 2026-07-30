---
doc_type: menu-capability
menu: system-product
id: SF-SP-06
title: Import / Export
aliases: [bulk import product, excel product, import bundle random, bulk update vat]
scope: menu
summary: >-
  Import/Export Excel hanya tersedia di menu System Product full. Mendukung
  create, update, bundle, random, unit alternatif, dan bulk VAT (maks 5000 baris).
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Import / Export

## Apa ini

Alat bulk untuk membuat/mengubah SKU lewat file Excel. Hanya tersedia di menu **System Product full** (bukan General/Inventory Configuration).

## Kapan dipakai

- Membuat/ubah banyak SKU sekaligus.
- Import resep bundle, opsi random, atau unit alternatif secara massal.

## Cara pakai

1. Buka menu **System Product** full.
2. Klik **Import**, pilih tipe (New/Update/Bundle/Random/Alt Unit/Update Variant/Bulk VAT).
3. Download template yang sesuai, isi data.
4. Upload file dan pantau **progress bar**.
5. Cek import log/history bila ada error.

## Catatan

- Maksimal **5000** baris per file.
- SKU pada import di-scope ke `owned_by` company (berbeda dengan create manual — GAP-SP-01).
- Import Bundle memakai endpoint Bill of Material header.
- **Export** tersedia untuk download data (with/without detail — lihat shared card).

## Contoh

| Tipe import | Kegunaan |
|-------------|----------|
| New Product | Bulk create SKU |
| Product Bundle | Import resep bundle |
| Bulk Update VAT | Update pajak massal |

## Lihat juga

- [Export (with/without detail)](#sf-lingo:SF-DL-05)
- [Variant Configuration](#sf-lingo:SF-SP-03)
