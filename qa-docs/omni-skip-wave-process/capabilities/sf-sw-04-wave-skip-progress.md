---
doc_type: menu-capability
menu: omni-skip-wave-process
id: SF-SW-04
title: Wave Progress & Skip Processing
aliases: [wave progress, skip processing column, batch progress]
scope: menu
summary: >-
  Kolom progress di datalist: Wave Progress = sudah masuk Default Wave; Skip Processing = sudah sampai Shipped.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Wave Progress & Skip Processing

## Apa ini

Dua indikator di datalist batch: **Wave Progress** (berapa order sudah masuk Default Wave) dan kolom **Skip Processing** (berapa sudah sampai **Shipped**).

## Kapan dipakai

- Memantau batch yang sedang Processing.
- Membedakan “sudah di wave” vs “sudah shipped”.

## Cara pakai

1. Buka datalist Skip Wave Process.
2. Lihat status batch: In Queue / Pending / Processing / Completed.
3. Baca **Wave Progress** dan kolom **Skip Processing**.
4. Setelah **Completed**, sistem masih bisa sibuk job latar (stok/sync) — itu normal.

## Catatan

- Progress layar penuh ≠ semua pekerjaan latar selesai (lihat Horizon Jobs).
- Kalau progress hampir penuh tetapi status masih Processing lama → [Redispatch](#sf-lingo:SF-SW-05).

## Lihat juga

- [Redispatch](#sf-lingo:SF-SW-05)
- Horizon Jobs KB: [../horizon-jobs/knowledge-base.md](../horizon-jobs/knowledge-base.md)

