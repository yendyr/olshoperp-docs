---
doc_type: menu-capability
menu: accounting-sales-return
id: SF-SRA-03
title: Order / Return Price & COGS
aliases: [return price, return cogs, order price, order cogs]
scope: menu
summary: >-
  Kolom harga khusus menu Finance: Order Price/COGS untuk qty order penuh,
  Return Price/COGS proporsional qty retur. COGS retur = rata-rata outbound.
version: 1.0
last_updated: 2026-07-29
status: draft
---

# Order / Return Price & COGS

## Apa ini

Kolom nilai di Product Detail yang **hanya tampil di menu Finance** (bukan SCM). Dipakai Finance untuk review sebelum [Complete](#sf-lingo:SF-SRA-01).

## Kapan dipakai

- Membandingkan nilai order vs nilai retur.
- Memastikan Return Price/COGS masuk akal sebelum Complete.
- Audit HPP retur (rata-rata outbound order).

## Cara pakai

1. Buka SR di `/accounting/sales-return` (bukan menu SCM).
2. Di detail produk, baca:
   - **Order Price / Order COGS** — total untuk qty order penuh.
   - **Return Price / Return COGS** — proporsional terhadap total qty retur (Restock+Broken+Lost); berubah saat qty diubah.
3. Return Price mengikuti harga invoice (setelah diskon & pajak per unit × qty retur).
4. **COGS retur** memakai **rata-rata nilai outbound** order (bukan stock ID terbaru).

## Catatan

- Kolom ini butuh tampilan Finance (`with_price`); di SCM tidak ditampilkan.
- Tooltip FE mungkin masih menyebut “stock ID terbaru” — itu drift; aturan backend = rata-rata outbound.
- Partial return: nilai Return mengikuti qty yang diinput.

## Contoh

| Order qty | Retur qty | Yang dilihat Finance |
|-----------|-----------|----------------------|
| 10 | 0 | Belum ada Return Price berarti |
| 10 | 3 | Return Price/COGS ≈ 3/10 proporsi nilai (ikut rumus harga invoice & avg COGS) |

## Lihat juga

- [Complete](#sf-lingo:SF-SRA-01)
- [Restock / Broken / Lost](#sf-lingo:SF-SRA-04)
- Knowledge Base: [§3 Kolom harga & COGS](../knowledge-base.md)
