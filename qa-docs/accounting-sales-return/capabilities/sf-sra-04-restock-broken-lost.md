---
doc_type: menu-capability
menu: accounting-sales-return
id: SF-SRA-04
title: Restock / Broken / Lost
aliases: [restock, broken, lost items, qty retur]
scope: menu
summary: >-
  Tiga jenis qty retur: Restock ke gudang return, Broken transfer ke scrap,
  Lost deduction + jurnal expense. Minimal satu qty > 0 sebelum Complete.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Restock / Broken / Lost

## Apa ini

Qty retur per SKU dipecah menjadi tiga nasib barang. Saat [Complete](#sf-lingo:SF-SRA-01), sistem menjalankan proses stok berbeda untuk masing-masing.

## Kapan dipakai

| Jenis | Pakai jika | Setelah Complete |
|-------|------------|------------------|
| **Restock** | Barang layak jual kembali | Stok masuk gudang return |
| **Broken** | Rusak / scrap | Transfer internal ke gudang scrap (otomatis) |
| **Lost** | Hilang / tidak bisa dilacak | Pengurangan stok + jurnal expense |

## Cara pakai

1. Idealnya gudang mengisi qty di menu SCM; Finance boleh mengedit sebelum Complete.
2. Pastikan total qty retur masuk akal vs qty outbound.
3. Jika ada **Lost** — pastikan produk punya **Return Expense COA**.
4. Review [Price/COGS](#sf-lingo:SF-SRA-03) → **Complete**.

## Catatan

- Minimal **satu** dari Restock/Broken/Lost > 0 untuk Complete.
- Setelah Complete, qty **read-only**.
- Lost tanpa Return Expense COA → Complete ditolak.
- Partial return: sisa order bisa punya SR lanjutan (aturan omni/SCM).

## Contoh

| Restock | Broken | Lost | Hasil Complete (ringkas) |
|---------|--------|------|---------------------------|
| 2 | 0 | 0 | Inbound return WH |
| 0 | 1 | 0 | Transfer ke scrap |
| 0 | 0 | 1 | Deduction + expense journal |
| 1 | 1 | 1 | Ketiga proses jalan |

## Lihat juga

- [Complete](#sf-lingo:SF-SRA-01)
- Sales Return SCM: [../supplychain-sales-returns/](../supplychain-sales-returns/)
