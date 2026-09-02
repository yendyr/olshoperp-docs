---
doc_type: menu-capability
menu: supplychain-mutation-transfer-external
id: SF-DET-01
title: Select Product / Available Products / Import
aliases: [select product, available products, import detail, three sources]
scope: menu
summary: >-
  Tiga cara menambah baris Transfer External: Select Product (FIFO otomatis),
  Available Products (stock ID spesifik), Import Excel (bulk).
version: 1.0
last_updated: 2026-09-01
status: review
---

# Select Product / Available Products / Import

## Apa ini

Cara menambah **baris detail** Transfer External — barang mana, qty berapa, dari batch mana.

## Kapan dipakai

| Cara | Pakai jika |
|------|------------|
| **Select Product** | Umum; sistem pilih batch/rak otomatis ([Single Rack FIFO](#sf-lingo:SF-TFE-02)) |
| **Available Products** | Kamu tahu **stock ID** / batch spesifik |
| **Import** | Banyak baris sekaligus lewat Excel |

## Cara pakai

1. Simpan header (**Origin**, **Location Destination**, tanggal).
2. **Select Product** — pilih SKU; qty default 1; sesuaikan lokasi tujuan per baris bila perlu.
3. **Available Products** — buka modal → centang baris stok → **Use** (single atau bulk).
4. **Import** — unduh template, isi, upload.
5. Review di [Group View / Detail View](#sf-lingo:SF-VIEW-01) → **Approve** pengirim.

## Catatan

- **Available Products:** qty maks = availability **stock ID terpilih** — bukan total SKU semua batch.
- Outrack/WIP tidak diambil otomatis oleh Select Product/Import.
- Colli **tidak** ada di produksi; route BETA experimental saja.

## Contoh

| Given | Cara | Hasil |
|-------|------|--------|
| SKU total 80 = batch A 50 + B 30 | Available Products batch B, qty 40 | **Ditolak** — max 30 |
| SKU total 80 | Select Product qty 75 | Sistem ambil batch terlama (FIFO) |
| Banyak baris | Import | Baris valid masuk; gagal per baris di log |

## Lihat juga

- [Single Rack FIFO / FIFO klasik](#sf-lingo:SF-TFE-02)
- [Import Excel](#sf-lingo:SF-IMP-01)
- [Requirement §6.2](../requirement.md)
