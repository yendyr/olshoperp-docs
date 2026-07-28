---
doc_type: menu-capability
menu: accounting-supplier-invoice
id: SF-TOT-01
title: Net Purchase Invoice
aliases: [net purchase invoice, net PI, total tagihan sistem]
scope: menu
menus_that_may_surface: [accounting-supplier-invoice, supplychain-purchase-order, accounting-supplier-payment]
summary: >-
  Total akhir tagihan di sistem untuk satu Purchase Invoice — hasil hitungan
  produk, diskon, PPN, dan biaya/diskon tambahan. Pembanding utama ke faktur
  fisik supplier.
version: 0.3
last_updated: 2026-07-27
status: draft
---

# Net Purchase Invoice

## Apa ini

**Net Purchase Invoice** adalah total akhir yang dihitung sistem untuk satu Purchase Invoice. Angka ini yang kamu bandingkan dengan nominal di faktur kertas/PDF dari supplier — dan yang jadi acuan hutang/jurnal.

## Kapan dipakai

- Mengecek apakah total di layar PI masuk akal sebelum approve.
- Membandingkan dengan faktur fisik supplier (lihat juga TO-BE [Supplier's Invoice Amount](#sf-lingo:SF-HDR-02)).
- Saat pelunasan di Account Payment — net PI jadi acuan alokasi.
- Saat kolom [DPP & VAT di detail](#sf-lingo:SF-PRICE-01) dijumlah manual dan tampak “lebih” 1 sen — **Net** tetap yang benar.

## Cara pakai

1. Isi detail produk (dan additional cost/discount bila ada) di form PI.
2. Di area **Totals**, baca baris **Net Purchase Invoice**.
3. Jika transaksi foreign currency, cek juga **Net (IDR)** = net × kurs header.
4. Sesuaikan baris / biaya tambahan sampai net sesuai yang diharapkan, lalu simpan.

### Cara membaca baris totals

| Baris | Arti |
|-------|------|
| Total Products | Jumlah nilai barang |
| Disc Products | Jumlah diskon per baris |
| Total VAT | Jumlah PPN |
| Additional Cost / Disc | Biaya atau diskon tambahan di header |
| **Net Purchase Invoice** | Hasil akhir di atas |
| Net (IDR) | Net × kurs (jika mata uang asing) |

## Catatan

- Jangan andalkan jumlah **manual** kolom DPP + VAT di detail untuk menggantikan Net — lihat [DPP & VAT di detail](#sf-lingo:SF-PRICE-01).
- Istilah ini boleh muncul di docs PO / Account Payment; **rumah penjelasan total PI tetap di sini**.

## Contoh

### Panel totals (umum)

| Baris | Amount |
|-------|--------|
| Total Products | 37.500.000 |
| Disc Products | 100.000 |
| Total VAT | 4.114.000 |
| Additional Cost | 500.000 |
| Additional Disc | 0 |
| **Net Purchase Invoice** | **42.014.000** |

Contoh lain: Products 8.738,74 + VAT 961,26 + Cost 144,50 − Disc 86,00 = Net **9.758,50**.

### DPP + VAT di layar vs Net (Case validasi)

PPN include 11%. Baris warisan PO: Unit **38.000**, Disc **0%**, Qty **25**.

| Yang dilihat | Angka |
|--------------|-------|
| DPP di detail (tampilan) | 855.855,86 |
| VAT di detail (tampilan) | 94.144,15 |
| Jumlah **manual** DPP + VAT | **950.000,01** |
| **Net / Invoice Total** (acuan) | **950.000,00** |

Sama hasilnya jika Unit **40.000** + Disc **5%** (harga setelah disc tetap 38.000). Detail & case lain: [DPP & VAT di detail](#sf-lingo:SF-PRICE-01).

## Lihat juga

- [DPP & VAT di detail](#sf-lingo:SF-PRICE-01)
- [Supplier's Invoice Amount (TO-BE)](#sf-lingo:SF-HDR-02)
- Requirement: [§5.4 Totals](../requirement.md#54-totals)
