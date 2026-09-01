---
doc_type: menu-capability
menu: supplychain-mutation-transfer-internal
id: SF-DET-01
title: Select Product / Available Product / Import
aliases: [select product, available product, import detail, three sources]
scope: menu
summary: >-
  Tiga cara menambah baris transfer: Select Product (FIFO otomatis),
  Available Product (stock ID spesifik), Import Excel (bulk).
version: 1.0
last_updated: 2026-09-01
status: review
---

# Select Product / Available Product / Import

## Apa ini

Cara menambah **baris detail** Transfer Internal — barang mana, qty berapa, dari batch stok mana.

## Kapan dipakai

| Cara | Pakai jika |
|------|------------|
| **Select Product** | Umum; sistem pilih batch/rak otomatis ([Fulfill-after-FIFO](#sf-lingo:SF-TFI-01)) |
| **Available Product** | Kamu tahu **stock ID** / batch / colli spesifik yang mau dipindah |
| **Import** | Banyak baris sekaligus lewat Excel |

## Cara pakai

1. Simpan header (**Origin**, **Location Destination**, tanggal).
2. **Select Product** — pilih SKU; qty default 1; sesuaikan lokasi tujuan per baris.
3. **Available Product** — buka modal → centang baris stok → **Use** (single atau bulk).
4. **Import** — unduh template, isi, upload (maks. 500 baris).
5. Review di [Group View / Detail View](#sf-lingo:SF-VIEW-01) → **Approve**.

## Catatan

- **Available Product:** qty maks = availability **baris yang dipilih** — bukan total SKU di semua batch.
- Outrack/WIP tidak diambil otomatis oleh Select Product/Import.
- Colli v2 (BETA): lihat [Colli v2](#sf-lingo:SF-TFI-02).

## Contoh

| Given | Cara | Hasil |
|-------|------|--------|
| SKU total 80 = batch A 50 + B 30 | Available Product batch B, qty 40 | **Ditolak** — max 30 |
| SKU total 80 | Select Product qty 75 | Sistem ambil dari batch terlama (FIFO) |
| 20 baris SKU | Import | Semua masuk jika valid |

## Lihat juga

- [Fulfill-after-FIFO](#sf-lingo:SF-TFI-01)
- [Import Excel](#sf-lingo:SF-IMP-01)
- [Requirement §6.2](../requirement.md)
