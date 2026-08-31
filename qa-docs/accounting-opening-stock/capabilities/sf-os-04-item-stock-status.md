---
doc_type: menu-capability
menu: accounting-opening-stock
id: SF-OS-04
title: Item Stock Status
aliases: [item stock status, stock id progress, opening stock job]
scope: menu
summary: >-
  Setelah Approve, Stock ID digenerate di background. Kolom Item Stock Status
  menunjukkan progress; Draft/Open menampilkan tanda strip.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Item Stock Status

## Apa ini

Kolom **Item Stock Status** di datalist Opening Stock menandai apakah generate **Stock ID** setelah Approve sudah selesai. Karena bisa ribuan SKU, proses berjalan di **background**.

## Kapan dipakai

- Setelah klik **Approve**.
- Saat memantau dokumen besar (banyak baris).
- Sebelum menganggap stok siap dipakai di transaksi lain.

## Cara pakai

1. Siapkan detail + [Opening Balance COA](#sf-lingo:SF-OS-01).
2. Klik **Approve** — muncul pesan generate di background.
3. Lihat kolom **Item Stock Status** (progress / selesai).
4. Draft atau Open yang belum approve: kolom biasanya **`-`**.

## Catatan

- Ribuan baris = loading lebih lama — bukan selalu error.
- Bersamaan dengan itu, **satu jurnal** opening terbit dari COA header.
- Setelah Approved, dokumen **final** di production (tidak dibatalkan).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| OS Open, belum Approve | Lihat list | Item Stock Status = `-` |
| Approve 500+ SKU | Pantau kolom | Progress lalu selesai / check |
| Approve sukses | Cek stok | Stock ID tersedia; jurnal Assets/Equity ada |

## Lihat juga

- [Generated Trx](#sf-lingo:SF-OS-03)
- [Opening Balance COA](#sf-lingo:SF-OS-01)
- Knowledge Base troubleshooting: [knowledge-base.md](../knowledge-base.md)
