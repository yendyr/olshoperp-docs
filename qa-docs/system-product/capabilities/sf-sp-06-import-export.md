---
doc_type: menu-capability
menu: system-product
id: SF-SP-06
title: Import / Export
aliases: [bulk import product, excel product, import bundle random, bulk update vat, Import Product Images, Google Drive product image]
scope: menu
summary: >-
  Import/Export Excel hanya di System Product full. New/Update/Bundle/Random/Alt Unit/VAT
  (max 5000). TO-BE: Import Product Images dari Google Drive publik (max 1000, replace primary).
version: 1.1
last_updated: 2026-08-11
status: draft
---

# Import / Export

## Apa ini

Alat bulk untuk membuat/mengubah SKU lewat file Excel, termasuk (TO-BE) set gambar default dari link Google Drive. Hanya tersedia di menu **System Product full** (bukan General/Inventory Configuration).

## Kapan dipakai

- Membuat/ubah banyak SKU sekaligus.
- Import resep bundle, opsi random, atau unit alternatif secara massal.
- Bulk ganti **foto default** produk dari Google Drive publik (**Import Product Images**).

## Cara pakai

1. Buka menu **System Product** full.
2. Klik **Import**, pilih tipe (New/Update/Bundle/Random/Alt Unit/Update Variant/Bulk VAT/**Import Product Images**).
3. Download template yang sesuai, isi data.
4. Upload file dan pantau **progress bar**.
5. Cek import log/history bila ada error.

### Import Product Images

1. Download **Template Import Product Images.xlsx** (kolom wajib merah: **SKU Code**, **Image URL**).
2. Pastikan setiap link Google Drive di-share **Anyone with the link**.
3. Satu baris = satu SKU. Jangan ulang SKU yang sama di file.
4. Setelah sukses: hanya foto **default** diganti; foto lain tetap.

## Catatan

- Tipe import biasa: maks **5000** baris. **Import Product Images**: maks **1000** baris.
- SKU pada import di-scope ke company (Data Owner).
- Import Bundle memakai endpoint Bill of Material header.
- **Export** tersedia untuk download data (with/without detail — lihat shared card).
- Drive belum publik → error English yang menjelaskan harus set sharing Viewer.

## Contoh

| Tipe import | Kegunaan |
|-------------|----------|
| New Product | Bulk create SKU |
| Product Bundle | Import resep bundle |
| Bulk Update VAT | Update pajak massal |
| Import Product Images | Set/ganti foto default dari GDrive |

## Lihat juga

- [Export (with/without detail)](#sf-lingo:SF-DL-05)
- [Variant Configuration](#sf-lingo:SF-SP-03)
- Requirement [§13.1](../requirement.md#131-import-product-images-to-be)
