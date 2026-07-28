---
doc_type: shared-capability
id: SF-PRICE-01
title: DPP & VAT di detail
aliases:
  [
    dpp,
    vat,
    ppn di detail,
    pembulatan dpp,
    breakdown dpp vat,
    total price vs dpp vat,
  ]
scope: global
menus_that_may_surface:
  [
    supplychain-purchase-order,
    accounting-supplier-invoice,
  ]
summary: >-
  Kolom DPP dan VAT di detail menampilkan angka 2 desimal. Kalau dijumlahkan
  manual, kadang 1 sen lebih dari Total/Net — itu normal; acuan hutang tetap
  Total Price / Net Purchase.
version: 0.1
last_updated: 2026-07-27
status: draft
---

# DPP & VAT di detail

## Apa ini

Di grid detail Purchase Order dan Purchase Invoice, kolom **DPP** dan **VAT** menampilkan pecahan pajak per baris (2 desimal, seperti Rupiah biasa). Angka **Total Price** (PO) atau **Net Purchase Invoice** (PI) mengikuti hitungan sistem yang lebih teliti — itu yang jadi acuan hutang dan jurnal.

## Kapan dipakai

- Membaca pecahan PPN per baris di layar.
- Cross-check manual DPP + VAT vs total baris / Net.
- Menjelaskan ke user kenapa kadang ada selisih **1 sen** saat dijumlah di kalkulator/Excel.

## Cara pakai

1. Lihat kolom **DPP** dan **VAT** di baris detail (tampilan 2 desimal).
2. Bandingkan dengan **Total Price** (PO) atau **Net Purchase Invoice** / Invoice Total (PI) — **bukan** hanya dengan hasil jumlah manual dua kolom itu.
3. Untuk audit yang butuh angka lebih panjang: unduh **Export** (rencana: DPP/VAT export 4 desimal; layar tetap 2 desimal).

## Catatan

- Selisih **1 sen** hanya muncul jika kamu **menjumlahkan sendiri** DPP + VAT yang tampil di layar.
- **Total / Net di panel** dan nilai jurnal **tidak** ikut selisih itu.
- Sering muncul saat **qty bukan** kelipatan rapi (contoh 25, 75, 175). Qty 500 atau 1.000 sering terlihat “pas” — itu kebetulan, bukan jaminan semua kasus.
- Beda kasus dari [Supplier's Invoice Amount](#sf-lingo:SF-HDR-02): itu untuk total **faktur fisik** supplier vs Net sistem.

## Contoh

Semua contoh: PPN **include** 11%. Angka dari data uji yang sudah divalidasi (27 Jul 2026).

### Case A — qty memicu selisih tampilan 1 sen

| Given | Aksi | Hasil |
|-------|------|--------|
| Unit Price **38.000**, Disc **0%**, Qty **25** | Simpan baris, lihat kolom DPP & VAT | DPP tampil **855.855,86** · VAT tampil **94.144,15** |
| Sama | Jumlahkan manual DPP + VAT di kalkulator | **950.000,01** |
| Sama | Baca **Total Price** / Net di panel | **950.000,00** (= 38.000 × 25) — **ini acuan** |

Ringkas: layar breakdown bisa “lebih” **0,01**; total hutang tetap **950.000,00**.

### Case B — sama, dengan diskon persen bulat

| Given | Aksi | Hasil |
|-------|------|--------|
| Unit Price **40.000**, Disc **5%**, Qty **25** | Simpan baris | Harga setelah disc = **38.000** (sama seperti Case A) |
| Sama | Baca DPP, VAT, Total | Sama Case A: jumlah manual **950.000,01** · Total/Net **950.000,00** |

Diskon persen bulat **tidak** menambah sumber selisih baru — yang beda tetap hanya penjumlahan manual di layar.

### Case C — qty kelipatan rapi (tidak memicu)

| Given | Hasil di layar |
|-------|----------------|
| Unit **38.000**, Qty **1.000**, Disc 0% | Jumlah DPP + VAT = Total **38.000.000,00** (pas) |
| Unit **45.000**, Qty **500**, Disc 0% | Jumlah DPP + VAT = Total **22.500.000,00** (pas) |

## Lihat juga

- [Net Purchase Invoice](#sf-lingo:SF-TOT-01) — acuan total di PI
- [Export (with/without detail)](#sf-lingo:SF-DL-05) — unduh data (rencana DPP/VAT 4 desimal)
- Requirement PO: [§9.2 Rounding tie](../../supplychain-purchase-order/requirement.md#92-rounding-tie--selisih-tampilan-ui-saja-final--accepted)
- Requirement PI: [§5.4 Totals](../../accounting-supplier-invoice/requirement.md#54-totals)
- SoT: [dpp-vat-rounding-calculation.md](../dpp-vat-rounding-calculation.md)
