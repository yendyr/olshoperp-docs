---
doc_type: knowledge-base
menu: accounting-opening-stock
menu_name: "Opening Stock"
version: 1.1
last_updated: 2026-07-09
owner: QA - Yemima
status: pending
audience: operator
---

# Opening Stock — Knowledge Base

> Dokumentasi menu ini sedang disusun. Konten akan diperbarui oleh tim QA.

## Ringkasan

Menu **Opening Stock** (Accounting) mencatat saldo awal stok. Alur teknis mengikuti Stock Opname dengan flag `is_opening_stock: true`, kode transaksi **`OS`**, dan auto-generate Stock Addition (`AI`) saat approve.

## Relasi Benchmark COGS (v1.1)

| Arah | Detail |
|------|--------|
| **Opening Stock → Benchmark** | Setelah approve, addition inbound dengan `each_price_before_vat` **ikut** sumber kalkulasi [Benchmark COGS](../accounting-product-benchmark-price/requirement.md) v1.1 |
| Identifikasi DB | Parent opname punya record di `accounting_opening_stock_coas` |

Detail: [Benchmark COGS requirement §7.4](../accounting-product-benchmark-price/requirement.md#74-opening-stock) · [pending items §13](../accounting-product-benchmark-price/requirement.md#13-hal-yang-perlu-diperhatikan--pending-items)

## Relasi Stock Remapping (TO-BE)

| Arah | Detail |
|------|--------|
| **Opening Stock ↔ Remapping** | Opening stock memasukkan saldo awal; **remap** identitas variant (mis. acak → pink) dilakukan terpisah lewat [Stock Remapping](../accounting-stock-remapping/requirement.md) di modul FA |

## Status dokumentasi

- Knowledge Base: **pending** (relasi benchmark ditambahkan 2026-07-09)
- Requirement: **pending**
- Technical: **pending**
