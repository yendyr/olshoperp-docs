---
doc_type: menu-capability
menu: manage-platform-product
id: SF-MPP-06
title: Bulk Binding
aliases: [bind massal lintas toko, bulk bind]
scope: menu
summary: >-
  Bulk Binding mengikat satu Platform SKU yang sama di semua toko aktif
  ke satu System Product yang kamu pilih — berbeda dari Auto Binding per store.
  TO-BE: sanitize saat match (tanpa ubah SKU tersimpan).
version: 1.1
last_updated: 2026-09-23
status: review
---

# Bulk Binding

## Apa ini

**Bulk Binding** membuka panel di kanan: kamu pilih **satu Platform Product SKU**, lihat preview toko mana saja yang punya SKU itu, lalu pilih **satu System Product**. Sistem mengikat semua baris dengan SKU identik di toko aktif company ke produk internal tersebut.

## Kapan dipakai

- SKU yang sama dipakai di banyak toko / channel.
- Auto Binding tidak cukup karena kamu ingin **memilih** System Product target (bukan hanya match otomatis).
- Menyeragamkan binding lintas store dalam satu aksi.

## Cara pakai

1. Klik **Bulk Binding** (panel kanan terbuka).
2. Pilih **Platform Product SKU** — cek preview toko yang match.
3. Pilih **Binded to System Product** (Single atau Variant).
4. Klik **Save**.
5. Baca **Bulk Binding Log** di panel yang sama untuk toko yang ter-update.

## Catatan

- **AS-IS:** SKU harus **100% sama persis** di DB (huruf, spasi, newline). Beda sedikit / Enter tersembunyi = tidak ikut.
- **TO-BE (GAP-MPP-01 / ETM-16016):** match memakai kunci sanitized (trim, lowercase, buang newline/HTML) — **tanpa** rewrite SKU platform. Target System Product tetap yang kamu pilih.
- System Product harus milik company yang sama; kalau tidak, seluruh operasi ditolak.
- Beda dengan **Auto Binding**: Auto = per store + match otomatis SKU sama; Bulk = lintas toko + kamu pilih System Product.
- Tidak ada bulk unbind dedicated — unbind lewat [Manual Binding](#sf-lingo:SF-MPP-04) per baris.
- Related: [System Product](../system-product/README.md).

## Lihat juga

- [Auto Binding](#sf-lingo:SF-MPP-05)
- [Manual Binding](#sf-lingo:SF-MPP-04)
- [Feature Map](../feature-map.md) · [KB §6 Bulk Binding](../knowledge-base.md#skenario-sku-sama-di-banyak-toko--bulk-binding)
