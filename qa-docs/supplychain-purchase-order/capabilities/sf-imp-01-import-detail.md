---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-IMP-01
title: Import Detail
aliases: [import PO, import excel, template import]
scope: menu
summary: >-
  Upload Excel untuk menambah banyak baris detail sekaligus.
  Semua baris harus With PR (isi kode PR) atau semua Without PR (kode PR kosong).
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Import Detail

## Apa ini

**Import Detail** mengunggah file Excel agar banyak baris produk masuk ke Purchase Order sekaligus, tanpa klik **Use** satu per satu.

## Kapan dipakai

- PO panjang (puluhan–ratusan baris).
- Data harga/qty sudah ada di spreadsheet purchasing.
- With PR atau Without PR massal — asalkan **satu tipe per file**.

## Cara pakai

1. Buka form PO (header sudah tersimpan).
2. Klik **Import Detail** → unduh template bila tersedia.
3. Isi kolom sesuai panduan (SKU, qty, unit, harga, dll.).
4. **Kolom A (kode PR):** isi **semua baris** atau biarkan **semua kosong** — jangan campur.
5. Upload file. Jika satu baris gagal di validasi awal, **seluruh file batal** — perbaiki lalu upload ulang.

### Kolom ringkas

| Kolom | Isi | Wajib? |
|-------|-----|--------|
| A | Kode PR (semua isi atau semua kosong) | Ya jika With PR |
| B | System Product SKU | Ya |
| C | PO Qty (> 0) | Ya |
| D | Unit (kode exact) | Ya |
| E | Unit Price (≥ 1) | Ya |
| F | Disc. (%) | Opsional |
| G | Description | Opsional |
| H | Required Delivery Date (tipe tanggal Excel) | Opsional |

VAT & warranty tidak di template — sistem mengisi otomatis.

## Catatan

- Maksimal **500** baris.
- Qty di import boleh desimal > 0; form manual tetap bilangan bulat.
- Bundle / random ditolak.
- File tipe tidak cocok dengan detail PO yang sudah ada → error **type not match**.
- Template 404 di lingkungan tertentu: buat Excel manual mengikuti kolom di atas, atau minta IT.

## Contoh

| File | Hasil |
|------|--------|
| 50 baris, kolom A semua kosong, Without PR | Detail produk masuk |
| 10 baris, 1 baris harga kosong | Seluruh upload batal |
| PO sudah Without PR + file isi kode PR | Type not match / ditolak |

## Lihat juga

- [With PR / Without PR](#sf-lingo:SF-PO-01)
- [Use / Allocate Full Qty Clearing](#sf-lingo:SF-DET-01)
- Knowledge Base: [§7 Import detail](../knowledge-base.md)
