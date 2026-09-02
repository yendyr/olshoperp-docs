---
doc_type: menu-capability
menu: order-processing-trace
id: SF-OPT-02
title: Grid 1 baris = 1 Sales Order
aliases: [SO trace grid, header POV, satu baris satu order]
scope: menu
summary: >-
  Grid read-only: satu baris = satu Sales Order (general + platform) dengan
  kolom referensi proses fulfillment dan tanggalnya.
version: 1.0
last_updated: 2026-09-02
status: draft
---

# Grid 1 baris = 1 Sales Order

## Apa ini

Laporan **trace** dengan POV **header order** — bukan per produk (kecuali saat export detail).

| Kolom (ringkas) | Isi |
|-----------------|-----|
| Trx Code \| Trx Platform | Kode SO internal + nomor platform |
| Trx Date \| Platform Date | Tanggal order (aturan § SF-OPT-04) |
| Skip Wave Process No | Batch skip wave |
| Picking / Checking / Packing / DO | Ref + tanggal masing-masing |
| Failed Ship \| Date | **Satu** ref FS per order |
| Outbound \| Date | **Satu** ref outbound per order |

Order general dan platform **satu grid**. Kolom kosong = **`-`**.

## Kapan dipakai

- Support: *"Order ini sudah sampai picking / DO / outbound belum?"*
- QA: bandingkan rantai dokumen tanpa buka menu satu per satu.
- Operator: cek order yang mentok di stage tertentu.

## Cara pakai

1. Buka **Order Processing Trace**.
2. Default filter **Trx Date** = bulan berjalan; sort **Trx Date** terbaru dulu.
3. Baca baris order — ikuti kolom ref dari kiri ke kanan (Skip Wave → … → Outbound).
4. Klik kode untuk buka dokumen sumber (lihat [Hyperlink Trx & Ref](#sf-lingo:SF-OPT-03)).

## Catatan

- **Bukan** [All Sales Order](../all-sales-order/README.md) — tidak ada sync/recheck/import.
- **Bukan** [Sales Order Report](../omni-sales-order-report/README.md) — bukan rekap revenue harian.
- Picking–DO bisa multi-ref (koma) hanya edge case re-process; FS & Outbound **selalu satu ref** per SO.

## Contoh

| Trx Code | Picking Ref | Failed Ship | Outbound |
|----------|-------------|-------------|----------|
| SO-ABC | PK-001 | `-` | `-` |
| SO-XYZ | PK-002 | FS-010 | OB-020 |

## Lihat juga

- [Trx Date / Platform Date](#sf-lingo:SF-OPT-04)
- [Export With Detail (produk)](#sf-lingo:SF-OPT-06)
