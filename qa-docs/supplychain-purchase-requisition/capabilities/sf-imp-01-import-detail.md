---
doc_type: menu-capability
menu: supplychain-purchase-requisition
id: SF-IMP-01
title: Import Detail
aliases: [import PR, template import PR, import detail requisition]
scope: menu
summary: >-
  Upload Excel 5 kolom untuk menambah detail PR massal.
  Satu baris salah di validasi awal → seluruh file batal; max 100 baris total.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Import Detail

## Apa ini

**Import Detail** mengunggah template Excel agar banyak SKU masuk ke PR sekaligus. Template resmi: **Template-Import-Detail-PR.xlsx**.

## Kapan dipakai

- PR panjang (puluhan SKU).
- Data permintaan sudah ada di spreadsheet.

## Cara pakai

1. Download template dari panel import.
2. Isi kolom (baris 1 = header, jangan diubah):

| Kolom | Isi | Wajib? |
|-------|-----|--------|
| A Product ID | ID angka System Product | Salah satu A atau B |
| B System Product SKU | Kode SKU | Salah satu A atau B |
| C Qty | Angka ≥ 1 (boleh desimal di import) | Ya |
| D Unit | Kode unit produk | Ya |
| E Description | Catatan | Opsional |

3. Upload file. Validasi awal: **satu baris salah → seluruh file batal**.
4. Jika lolos, insert berjalan di background — cek notifikasi / Import Log.
5. PR yang sebelumnya **Rejected** bisa berubah ke **Draft** setelah import.

## Catatan

- Total baris existing + import ≤ **100**.
- SKU sama 2× = **2 baris terpisah** (tidak digabung).
- Bundle/random tidak ditemukan di lookup.
- Import lain masih berjalan → tunggu selesai.
- Qty form manual tetap bilangan bulat; import boleh desimal ≥ 1.

## Contoh

| File | Hasil |
|------|--------|
| 40 baris valid | Detail masuk (setelah job) |
| 1 baris unit salah | 0 insert — cek Import Log |
| Header template diubah | Format doesn't match template |

## Lihat juga

- [Add / edit detail SKU](#sf-lingo:SF-DET-01)
- Knowledge Base: [§6 Import detail](../knowledge-base.md)
