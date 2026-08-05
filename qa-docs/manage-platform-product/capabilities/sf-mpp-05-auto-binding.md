---
doc_type: menu-capability
menu: manage-platform-product
id: SF-MPP-05
title: Auto Binding
aliases: [auto bind, cocokkan SKU otomatis]
scope: menu
summary: >-
  Auto Binding mencocokkan SKU platform yang belum bind ke System Product
  dengan SKU sama (per store terpilih). Tidak cocok jika SKU sengaja beda.
version: 1.0
last_updated: 2026-07-31
status: review
---

# Auto Binding

## Apa ini

**Auto Binding** mencoba menghubungkan otomatis semua Platform Product **belum bind** di store terpilih ke System Product yang **SKU-nya sama** (abaikan huruf besar/kecil). Cocok untuk katalog yang sudah diseragamkan antara marketplace dan master internal.

## Kapan dipakai

- Setelah **Pull Products** atau sync otomatis selesai.
- Onboarding toko baru dengan SKU yang sudah selaras.
- Membersihkan sisa **Not Binded** yang seharusnya match 1:1.

## Cara pakai

1. Pilih **Store** ([Filter Store](#sf-lingo:SF-MPP-01)).
2. Klik **Auto Binding**.
3. Tunggu batch selesai — jangan dispatch ulang jika pesan "Previous batch is still running".
4. Refresh DataList; sisanya yang tidak match → [Manual Binding](#sf-lingo:SF-MPP-04) atau [Bulk Binding](#sf-lingo:SF-MPP-06).

## Catatan

- Hanya SKU **belum bind**; yang sudah Binded dilewati.
- Baris **PARENT** dilewati — yang di-bind variannya.
- Fix Asset / System Product inactive tidak ikut.
- Pesan **"No product to be bound"** = tidak ada kandidat (semua sudah bind atau SKU tidak match).
- Sering jalan otomatis setelah sync sukses — klik manual tetap boleh untuk memaksa ulang.

## Lihat juga

- [Pull Products](#sf-lingo:SF-MPP-02)
- [Bulk Binding](#sf-lingo:SF-MPP-06)
- [Feature Map](../feature-map.md) · [KB FAQ Auto vs Bulk](../knowledge-base.md#8-faq)
