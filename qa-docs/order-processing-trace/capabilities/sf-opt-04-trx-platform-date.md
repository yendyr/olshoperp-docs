---
doc_type: menu-capability
menu: order-processing-trace
id: SF-OPT-04
title: Trx Date / Platform Date
aliases: [transaction date, platform date column, tanggal order]
scope: menu
summary: >-
  Kolom tanggal order: general pakai Trx Date SO; platform pakai created_at +
  Platform Date dari tanggal transaksi marketplace.
version: 1.0
last_updated: 2026-09-02
status: draft
---

# Trx Date / Platform Date

## Apa ini

Kolom **Trx Date \| Platform Date** menampilkan dua sisi tanggal sesuai tipe order:

| Tipe SO | Trx Date | Platform Date |
|---------|----------|---------------|
| **General** | Tanggal transaksi SO | `-` |
| **Platform** | Tanggal SO masuk sistem | Tanggal transaksi di platform |

Tooltip/grid header menjelaskan perbedaan ini agar filter & export tidak ambigu.

## Kapan dipakai

- Filter periode operasional (Trx Date bulan berjalan = default).
- Analisis platform: bandingkan **Platform Date** vs tanggal proses fulfillment.

## Cara pakai

1. Baca kolom **Trx Date \| Platform Date** di baris order.
2. Order general — fokus **Trx Date**; Platform Date = `-`.
3. Order platform — gunakan **Platform Date** untuk align dengan laporan marketplace bila perlu.
4. **Advanced Filter** bisa filter Trx Date dan Platform Date terpisah.

## Catatan

- Bukan tanggal picking/DO — itu di kolom ref masing-masing stage.
- Timezone display mengikuti pola report company (lihat requirement gap timezone).

## Lihat juga

- [Grid 1 baris = 1 Sales Order](#sf-lingo:SF-OPT-02)
- [requirement §3](../requirement.md)
