---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-IMP-01
title: Import Detail
aliases: [import PO, import excel, template import, VAT import]
scope: menu
summary: >-
  Upload Excel untuk menambah banyak baris detail sekaligus.
  Semua baris harus With PR (isi kode PR) atau semua Without PR (kode PR kosong).
  TO-BE: kolom VAT / VAT Code / VAT Type + partial success per baris.
version: 1.1
last_updated: 2026-08-05
status: draft
---

# Import Detail

## Apa ini

**Import Detail** mengunggah file Excel agar banyak baris produk masuk ke Purchase Order sekaligus, tanpa klik **Use** satu per satu.

## Kapan dipakai

- PO panjang (puluhan–ratusan baris).
- Data harga/qty sudah ada di spreadsheet purchasing.
- With PR atau Without PR massal — asalkan **satu tipe per file**.
- (Setelah rilis) Atur pajak per baris lewat kolom VAT di Excel.

## Cara pakai

1. Buka form PO (header sudah tersimpan).
2. Klik **Import Detail** → unduh template bila tersedia.
3. Isi kolom sesuai panduan (SKU, qty, unit, harga, dll.).
4. **Kolom A (kode PR):** isi **semua baris** atau biarkan **semua kosong** — jangan campur.
5. Upload file.

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
| I | **VAT** — `yes` / `no` saja | Opsional (TO-BE) |
| J | **VAT Code** | Opsional (TO-BE) |
| K | **VAT Type** — `include` / `exclude` | Opsional (TO-BE) |

**AS-IS:** I–K belum dipakai — VAT otomatis dari produk + supplier.  
**TO-BE:** Excel explicit mengalahkan supplier; ketiga kosong = perilaku otomatis lama; `VAT=no` = tanpa pajak. File tanpa kolom I–K tetap valid.

Warranty tidak di template.

## Catatan

- Maksimal **500** baris.
- Qty di import boleh desimal > 0; form manual tetap bilangan bulat.
- Bundle / random ditolak.
- File tipe tidak cocok dengan detail PO yang sudah ada → error **type not match**.
- Template 404: buat Excel manual atau minta IT.
- **Partial success (TO-BE):** baris valid tetap masuk; baris gagal di Import Log + notifikasi partial. **AS-IS:** error validasi awal sering membatalkan seluruh file.

## Contoh

| File | Hasil |
|------|--------|
| 50 baris, kolom A semua kosong, Without PR | Detail produk masuk |
| 10 baris, 1 baris harga kosong (AS-IS pre-val) | Seluruh upload bisa batal |
| 3 baris, 1 VAT invalid (TO-BE) | 2 detail masuk, 1 di log error |
| PO sudah Without PR + file isi kode PR | Type not match / ditolak |
| `VAT=yes`, supplier auto_add = no (TO-BE) | Pajak tetap ditambahkan (override) |

## Lihat juga

- [With PR / Without PR](#sf-lingo:SF-PO-01)
- [Use / Allocate Full Qty Clearing](#sf-lingo:SF-DET-01)
- Requirement: [§12 Import](../requirement.md#12-import-detail-purchase-order)
- Knowledge Base: [§7 Import detail](../knowledge-base.md)
