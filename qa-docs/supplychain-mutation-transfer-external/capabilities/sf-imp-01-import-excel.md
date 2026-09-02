---
doc_type: menu-capability
menu: supplychain-mutation-transfer-external
id: SF-IMP-01
title: Import Excel detail
aliases: [import transfer external, excel import, import detail]
scope: menu
summary: >-
  Upload Excel untuk banyak baris Transfer External. Template 4 kolom: Product ID,
  System Product SKU, Qty, Unit. Alokasi stok mengikuti Single Rack FIFO.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Import Excel detail

## Apa ini

Mengisi banyak baris detail Transfer External lewat file **Excel** — cocok untuk kiriman massal antar gedung.

## Kapan dipakai

- Banyak SKU/qty sekaligus.
- Data sudah disiapkan di spreadsheet.

## Cara pakai

1. Dari form edit TF Ext → **Import** → unduh template.
2. Isi header baris 1 **persis**: `Product ID` \| `System Product SKU` \| `Qty` \| `Unit`.
3. Upload — tunggu selesai; cek log success/failed per baris.
4. Review grid → **Approve** pengirim (jangan approve saat import masih jalan).

## Catatan

- Alokasi stok mengikuti [Single Rack FIFO](#sf-lingo:SF-TFE-02) (sama Select Product).
- Import **tidak** mengisi Colli / Lost / Broken.
- Baris gagal tidak selalu membatalkan seluruh file — baris valid lain bisa tetap masuk.
- Unit harus **kode** master unit yang valid untuk produk (bukan nama bebas).

## Contoh

| Kondisi baris | Hasil |
|---------------|--------|
| SKU + Qty + Unit valid | Masuk; batch diisi FIFO |
| Header kolom salah | File ditolak — format tidak cocok template |
| Qty kosong / bukan angka | Baris gagal di log |
| Unit pakai nama, bukan code | Baris gagal |

## Lihat juga

- [Select Product / Available Products / Import](#sf-lingo:SF-DET-01)
- [Requirement §6.3 & §7](../requirement.md)
