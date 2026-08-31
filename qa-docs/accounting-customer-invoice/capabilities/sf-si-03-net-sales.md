---
doc_type: menu-capability
menu: accounting-customer-invoice
id: SF-SI-03
title: Net Sales
aliases: [net sales, total tagihan SI, grand total SI]
scope: menu
summary: >-
  Net Sales = total produk − diskon item + VAT + Other Cost − Other Discount.
  Ini total tagihan yang jadi dasar piutang setelah Approve.
version: 1.0
last_updated: 2026-08-31
status: review
---

# Net Sales

## Apa ini

**Net Sales** adalah total tagihan Sales Invoice setelah produk, diskon item, PPN, Other Cost, dan Other Discount diperhitungkan. Setelah SI **Approved**, nilai ini menjadi dasar piutang di Account Receive.

## Kapan dipakai

- Mengecek total sebelum Approve.
- Membandingkan Total Product vs Net Sales di datalist.
- Menjelaskan kenapa angka di layar berbeda dari “harga sebelum PPN” di jurnal.

## Cara pakai

1. Isi detail SO + opsional [Other Cost/Discount](#sf-lingo:SF-SI-02).
2. Lihat ringkasan: Total Products, Disc, VAT, Other Cost/Discount, **Net Sales**.
3. Pastikan angka masuk akal → **Approve**.
4. Lanjut pelunasan di Account Receive.

## Catatan

- Kolom Unit Price di outstanding sering menampilkan harga seperti di SO (bisa termasuk PPN di UI); dasar sebelum PPN dihitung sistem untuk jurnal.
- Total Product di datalist = after discount **including VAT** (lihat tooltip UI).

## Contoh

| Given | Komponen | Arah Net Sales |
|-------|----------|----------------|
| Produk + PPN | Total Products + VAT | Naik |
| Other Cost | + | Naik |
| Other Discount | − | Turun |

## Lihat juga

- [Other Cost / Other Discount](#sf-lingo:SF-SI-02)
- [How SI is created](#sf-lingo:SF-SI-01)
- Account Receive: [../accounting-customer-payment/](../accounting-customer-payment/)
