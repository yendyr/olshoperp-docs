---
doc_type: menu-capability
menu: supplychain-mutation-transfer-external
id: SF-VIEW-01
title: Group View / Detail View
aliases: [group view, detail view, multi stock id]
scope: menu
summary: >-
  Group View merangkum per SKU; Detail View menampilkan per batch stok (stock ID)
  saat alokasi FIFO menghasilkan lebih dari satu baris.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Group View / Detail View

## Apa ini

Dua tampilan grid detail Transfer External:

- **Group View** — ringkas per SKU (default).
- **Detail View** — per **stock ID** / batch (jika satu SKU dari beberapa batch).

## Kapan dipakai

| View | Pakai jika |
|------|------------|
| **Group View** | Review qty total per SKU sebelum Approve pengirim |
| **Detail View** | Cek batch/rak asal tiap baris (multi stock ID) |

## Cara pakai

1. Setelah tambah detail, tetap di **Group View** untuk cek qty agregat.
2. Klik **Detail View** bila perlu lihat pemecahan batch.
3. Lanjut **Approve** pengirim setelah qty benar.

## Catatan

- Detail View bukan mode edit terpisah — edit qty dari baris aktif.
- Di **Transfer Inbound**, view yang sama dipakai untuk review Qty Received / Lost / Broken.

## Lihat juga

- [Single Rack FIFO / FIFO klasik](#sf-lingo:SF-TFE-02)
- [Select Product / Available Products / Import](#sf-lingo:SF-DET-01)
