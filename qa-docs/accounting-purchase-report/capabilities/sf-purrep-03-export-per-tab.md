---
doc_type: menu-capability
menu: accounting-purchase-report
id: SF-PURREP-03
title: Export per tab (PO vs PI)
aliases: [PurchaseReportExportJob, export select_menu, async export PO PI]
scope: menu
summary: >-
  Export All async mengikuti tab aktif (PO atau PI); file list & progress
  terpisah per POV.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Export per tab (PO vs PI)

## Apa ini

Export **Purchase Report** selalu untuk **tab yang sedang aktif**:

| Tab aktif | Isi export |
|-----------|------------|
| Purchase Order | Hanya data PO |
| Purchase Invoice | Hanya data PI |

Mode: **Export All** (async batch) · **This Page Only** · daftar file export **per tab**.

## Kapan dipakai

- Kirim rekap PO bulan ini ke procurement (tab PO → Export All).
- Kirim rekap PI ke finance AP (tab PI → Export All).

## Cara pakai

1. Pilih tab dan filter yang benar **sebelum** export.
2. Klik Export All — pantau progress / tab Export File.
3. Pindah tab → ulangi jika butuh file PO **dan** PI (dua file terpisah).

## Catatan

- Filter aktif (tanggal, search, advanced filter) ikut ke job export.
- Export PO **tidak** menyertakan baris PI dan sebaliknya.

## Lihat juga

- [Tab PO / PI](#sf-lingo:SF-PURREP-01)
- [technical.md](../technical.md)
