---
doc_type: knowledge-base
menu: accounting-product-coa-group
menu_name: "Product COA Group"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Product COA Group — Knowledge Base

> **DRAFT** — Ringkasan operator + relasi Instant Settlement. Konten lengkap menu masih disusun.

## Ringkasan

Menu **Product COA Group** menghubungkan produk ke akun COA untuk jurnal otomatis (penjualan, persediaan, HPP).

| Item | Nilai |
|------|-------|
| Menu | Accounting → Product COA Group |
| Route UI | `/accounting/product-coa-group` |

## Relasi Instant Settlement (operator)

| Yang perlu Anda tahu | Penjelasan singkat |
|----------------------|-------------------|
| Kapan setup | **Sebelum** upload settlement — semua SKU di order harus punya mapping |
| Gejala COA kosong | Error jurnal di grid settlement (SI Journal / Out Journal merah) |
| Setelah perbaikan | Klik **retry** di settlement — mapping baru dipakai |

**Detail:** [Instant Settlement](../accounting-settlement-upload/requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (cross-ref Fase 2)
- Requirement: [requirement.md](./requirement.md) — **draft**
- Technical: **pending**
