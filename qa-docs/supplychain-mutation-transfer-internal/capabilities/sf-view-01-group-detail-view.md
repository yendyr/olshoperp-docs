---
doc_type: menu-capability
menu: supplychain-mutation-transfer-internal
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

Dua tampilan grid detail Transfer Internal:

- **Group View** — ringkas per SKU (default).
- **Detail View** — per **stock ID** / batch (muncul jika satu SKU diambil dari beberapa batch).

## Kapan dipakai

| View | Pakai jika |
|------|------------|
| **Group View** | Review qty total per SKU sebelum Approve |
| **Detail View** | Perlu cek batch/rak asal tiap baris (multi stock ID) |

## Cara pakai

1. Setelah tambah detail, tetap di **Group View** untuk cek qty agregat.
2. Klik **Detail View** bila perlu lihat pemecahan batch.
3. BETA Colli: kolom **Colli Origin** / **Colli Destination** tampil di kedua view; di Group View info colli **read-only**.

## Catatan

- Detail View bukan mode edit terpisah — edit qty tetap dari baris yang aktif.
- Reserved stok tercermin di Stock Monitoring, bukan hanya di label view.

## Lihat juga

- [Fulfill-after-FIFO](#sf-lingo:SF-TFI-01)
- [Colli v2 (BETA)](#sf-lingo:SF-TFI-02)
