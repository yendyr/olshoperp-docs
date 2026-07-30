---
doc_type: menu-capability
menu: supplychain-purchase-order
id: SF-COST-01
title: Additional Cost & Discount
aliases: [other cost, other discount, additional cost, biaya tambahan PO]
scope: menu
summary: >-
  Biaya atau diskon tambahan di level header PO. Nominal ikut ke Net Purchase
  dan menjadi default di Purchase Invoice; di PI akun masih bisa diganti sebelum approve.
version: 1.0
last_updated: 2026-07-28
status: draft
---

# Additional Cost & Discount

## Apa ini

Section **Additional Cost** dan **Additional Discount** di form Purchase Order untuk biaya/diskon di luar baris barang (misalnya ongkir, potongan khusus). Nilai ini masuk ke panel **Total** (Net Purchase) dan terbawa sebagai default saat tagihan di Purchase Invoice.

## Kapan dipakai

- Ada biaya tambahan yang ditagihkan bersama PO (bukan di harga unit SKU).
- Ada diskon header yang tidak masuk % diskon per baris.
- Perlu memastikan Net Purchase di layar sudah termasuk biaya/diskon sebelum approve.

## Cara pakai

1. Setelah header & detail utama terisi, buka section **Additional Cost** / **Additional Discount**.
2. Pilih master cost/discount yang **active**, isi nominal.
3. Cek panel **Total** — Net Purchase harus sudah mencerminkan perubahan.
4. Lanjut **Approve** bila status sudah **Open**.

## Catatan

- Kalau Other Cost/Disc membuat total sebelum PPN **negatif**, sistem menolak.
- Di Purchase Invoice, **nominal** dari PO terkunci; **akun (COA)** masih bisa diganti sebelum approve PI.
- **Print PDF** PO saat ini **belum** selalu include Other Cost/Discount — jangan andalkan print untuk total final termasuk biaya tambahan.
- Penjurnalan biaya/diskon header terjadi di jalur Purchase Invoice (bukan saat approve PO).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Subtotal barang 10.000.000 | Tambah Additional Cost 200.000 | Net Purchase naik (ikut aturan VAT di Totals) |
| Sudah ada Additional Cost | Buat PI dari inbound PO ini | Baris cost muncul sebagai default di PI |

## Lihat juga

- [Complete vs Closed](#sf-lingo:SF-PO-02)
- [DPP & VAT di detail](#sf-lingo:SF-PRICE-01)
- Purchase Invoice: [Additional Cost & Discount](../../accounting-supplier-invoice/feature-map.md) (SF-COST-01 di PI)
