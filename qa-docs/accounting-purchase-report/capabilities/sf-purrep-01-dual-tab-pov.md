---
doc_type: menu-capability
menu: accounting-purchase-report
id: SF-PURREP-01
title: Tab Purchase Order / Purchase Invoice
aliases: [dual tab, select_menu PO PI, POV Purchase Report]
scope: menu
summary: >-
  Satu menu, dua tab: Purchase Order vs Purchase Invoice. Satu load API = satu
  POV; tidak campur PO+PI dalam satu grid.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Tab Purchase Order / Purchase Invoice

## Apa ini

**Purchase Report** punya **dua tab** — bukan radio “Type” kosong:

| Tab | Dataset |
|-----|---------|
| **Purchase Order** | Baris detail PO (With PR + Without PR) |
| **Purchase Invoice** | Baris detail Purchase Invoice / Supplier Invoice |

Ganti tab = ganti sumber data (`select_menu`). **Tidak** menampilkan PO dan PI bersamaan.

## Kapan dipakai

- Tab **PO** → rekap pesanan pembelian per SKU/supplier.  
- Tab **PI** → rekap faktur/tagihan beli per SKU/supplier.

## Cara pakai

1. Buka Purchase Report — tab **Purchase Order** aktif default (data langsung load).
2. Set filter tanggal / search sesuai kebutuhan.
3. Pindah tab **Purchase Invoice** untuk dataset PI — filter & export **terpisah** per tab.

## Catatan

- **Tidak** ada join PO↔PI di report ini.
- **Tidak** terkait Account Payable Report.
- Default tanggal FE: **bulan berjalan** (GAP-PURREP-01 vs card 30 hari).

## Lihat juga

- [Group Supplier + total](#sf-lingo:SF-PURREP-02)
- [Purchase Order](../../supplychain-purchase-order/README.md) · [Purchase Invoice](../../accounting-supplier-invoice/README.md)
