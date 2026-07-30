---
doc_type: menu-capability
menu: system-product
id: SF-SP-02
title: Unit Configuration & D&W per unit
aliases: [primary unit, alternate unit, dimension weight per unit, platform default trx default]
scope: menu
summary: >-
  Atur primary + alternate unit dengan konversi, dan profil dimensi/berat (D&W)
  per satuan. Platform Default & Trx Default bersifat global lintas semua unit.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Unit Configuration & D&W per unit

## Apa ini

Konfigurasi satuan produk (primary + alternate) beserta profil **Dimensi & Berat (D&W)** per satuan. Sejak refactor 7 Mei 2026, D&W diatur **per unit**, bukan satu nilai flat di Shipping.

## Kapan dipakai

- Menambah satuan alternatif (Box, Lusin) dengan konversi ke primary.
- Mengatur dimensi/berat untuk sync marketplace dan transaksi.

## Cara pakai

1. Buka accordion **Unit Configuration**.
2. Primary unit terisi otomatis (biasanya Pieces, konversi = 1).
3. Tambah **Alternate Unit** + rate konversi bila perlu.
4. Klik **Edit** pada satuan → isi profil D&W (L×W×H, Weight, label).
5. Pilih radio default sesuai kebutuhan.

## Catatan

- **Platform Default** dan **Trx & Report Default** bersifat **global** — memilih di satu unit otomatis melepas di unit lain.
- **Unit Default** bersifat per unit.
- Primary unit **tidak bisa dihapus/diganti** bila SKU sudah dipakai di PR, PO, inbound, outbound, atau BoM.
- Alternate unit yang sudah dipakai transaksi: unit & konversi terkunci, tapi D&W masih bisa diedit.
- D&W baru default 1×1×1×1 cm/g; qty conversion field FE selalu disabled (GAP-SP-14/15).
- Section **All D&W table + summary cards** dari artifact belum ada di main form (GAP-SP-09).

## Lihat juga

- [Product Type & transactability](#sf-lingo:SF-SP-01)
- Master satuan: [Master Unit](../../supplychain-unit/)
- Master label: [Dimension & Weight Label](../../supplychain-dimension-and-weight-label/)
