---
doc_type: menu-capability
menu: supplychain-sales-returns
id: SF-SR-04
title: Restock / Broken / Lost
aliases: [restock qty, broken items, lost items, qty sales return]
scope: menu
summary: >-
  Bagi qty retur per SKU menjadi Restock, Broken, atau Lost. Total tidak boleh
  melebihi sisa qty outbound dan minimal satu kategori harus terisi.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Restock / Broken / Lost

## Apa ini

Tiga kategori kondisi barang retur. Gudang mengisi qty; Finance menjalankan dampak stok dan jurnal saat Complete.

## Kapan dipakai

| Kategori | Kondisi barang | Setelah Finance Complete |
|----------|----------------|---------------------------|
| **Restock** | Layak dijual kembali | Masuk Return Warehouse |
| **Broken** | Rusak | Dipindah otomatis ke Scrap Warehouse |
| **Lost** | Hilang | Stock deduction + expense |

## Cara pakai

1. Buka detail SR hasil scan.
2. Isi qty per SKU pada kategori yang sesuai.
3. Pastikan total tidak melebihi sisa qty yang dapat diretur.
4. Tunggu auto-save dan pesan sukses.
5. Serahkan ke Finance untuk Complete.

## Catatan

- Qty harus bilangan bulat.
- Minimal satu kategori > 0.
- Lost membutuhkan Return Expense COA sebelum Finance bisa Complete.
- Setelah Finance Complete, qty menjadi read-only.

## Contoh

| Restock | Broken | Lost | Total |
|---------|--------|------|-------|
| 2 | 1 | 0 | 3 |
| 0 | 0 | 1 | 1 |

## Lihat juga

- [Save & handoff to Finance](#sf-lingo:SF-SR-05)
- Finance: [Restock / Broken / Lost](../../accounting-sales-return/capabilities/sf-sra-04-restock-broken-lost.md)
