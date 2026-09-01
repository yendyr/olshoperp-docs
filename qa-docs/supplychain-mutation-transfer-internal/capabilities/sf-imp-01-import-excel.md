---
doc_type: menu-capability
menu: supplychain-mutation-transfer-internal
id: SF-IMP-01
title: Import Excel detail
aliases: [import transfer, excel import, import detail]
scope: menu
summary: >-
  Upload Excel untuk banyak baris transfer sekaligus (maks. 500 baris).
  Alokasi stok sama Select Product (Fulfill-after-FIFO). Colli: target 1 kolom code (TO-BE).
version: 1.0
last_updated: 2026-09-01
status: review
---

# Import Excel detail

## Apa ini

Mengisi banyak baris detail Transfer Internal lewat file **Excel** — cocok untuk transfer massal antar lokasi.

## Kapan dipakai

- Banyak SKU/qty sekaligus.
- Data sudah disiapkan di spreadsheet.

## Cara pakai

1. Dari form edit TFI → **Import** → unduh template.
2. Isi kolom wajib: SKU, Qty, Unit, **Location Destination** (per baris).
3. Upload — tunggu job selesai; cek log error per baris.
4. Review grid → **Approve** (jangan approve saat import masih jalan).

## Catatan

- Maks. **500** baris data.
- Alokasi stok mengikuti [Fulfill-after-FIFO](#sf-lingo:SF-TFI-01) (sama Select Product).
- **Colli (BETA):** requirement target = **satu kolom colli code** (kosong = tanpa colli; code baru = New; code ada = Existing jika lokasi cocok). Implementasi UI import mungkin masih format lama — cek pesan error saat uji.
- Baris gagal tidak selalu membatalkan seluruh file — baris valid lain tetap bisa masuk.

## Contoh

| Colli code di Excel | Lokasi dest baris | Hasil baris |
|--------------------|-------------------|-------------|
| (kosong) | RAK005 | Loose OK |
| COL-BARU | RAK005 | New colli (BETA) |
| COL-ADA @ RAK005 | RAK005 | Existing OK |
| COL-ADA @ RAK001 | RAK005 | **Gagal** — lokasi beda |

## Lihat juga

- [Select Product / Available Product / Import](#sf-lingo:SF-DET-01)
- [Requirement §6.3](../requirement.md)
