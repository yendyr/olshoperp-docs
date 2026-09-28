---
doc_type: docs-hub-horizon-index
title: Horizon Jobs Docs
subtitle: Queue and Horizon job pipelines — primary vs derived jobs across menus.
version: "1.0"
last_updated: 2026-09-28
status: review
source_type: derived
visual_slug: "index"
source_ref: "docs/qa-docs/_meta/horizon-jobs/ + docs/qa-docs/horizon-jobs/"
---

Katalog dokumentasi **job antrean (Laravel Horizon)** OlshopERP. Bukan satu menu produk — dipakai saat investigasi batch macet, antrean padat, atau memahami rantai job di balik Skip Wave, Instant Settlement, Sales Order, dan transfer gudang.

Buka **Visual board** di tiap artikel (jika tersedia) untuk tampilan HTML interaktif; artikel markdown = isi yang sama dengan standar Docs Hub.

## Dua lapisan

| Lapisan | Isi |
|---------|-----|
| Job-flow per menu | Settlement Upload, Sales Order, Transfer Picking/Packing — alur end-to-end + contoh awam |
| Pipeline kanonik | Skip Wave Process — fan-out, gerbang, redispatch, derived jobs |

Aturan QA lintas menu (HJ-01…08, primary vs derived): tetap di folder `qa-docs/horizon-jobs/` (requirement / KB / technical). Katalog ini adalah **cara membuka** job-flow di Help Center.

## Mulai dari sini

1. [Settlement Upload](/docs/horizon-jobs/settlement-upload) — observer state machine Instant Settlement  
2. [Sales Order](/docs/horizon-jobs/sales-order) — approve sync vs async queues  
3. [Skip Wave Process](/docs/horizon-jobs/skip-wave-process) — pipeline kanonik fulfillment batch  
4. [Transfer Picking / Packing](/docs/horizon-jobs/transfer-picking-packing) — lanjutan wave / skip processing  

Peta zoom-out banyak menu: buka artikel mana pun lalu tab **Visual** jika ada peta, atau file `index.html` di repo `_meta/horizon-jobs` (juga bisa dilayani sebagai visual slug `map`).

## Pola estafet job

1. **Observer state machine** — counter naik → observer dispatch tahap berikutnya (Settlement Upload).  
2. **Fan-out + Bus::batch** — orkestrator pecah banyak job kecil + `finally` (Skip Wave / export).  
3. **`dispatchSync`** — jalan inline di request (contoh: masuk Wave saat approve SO) — bisa membuat UI terasa lambat tanpa antrian Horizon.
