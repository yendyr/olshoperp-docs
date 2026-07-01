---
doc_type: knowledge-base
menu: omni-packing-process
menu_name: "Packing Process"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Packing Process — Knowledge Base

> **DRAFT** — Ringkasan operator + relasi Instant Settlement. Konten lengkap menu masih disusun.

## Ringkasan

Menu **Packing Process** dipakai untuk **approve transfer packing** setelah checking — lanjut ke collecting/shipping list dan Delivery Order.

| Item | Nilai |
|------|-------|
| Menu | Omni → Packing Process |
| Route UI | `/omni/packing-process` |

## Relasi Instant Settlement (operator)

Packing harus selesai agar collecting & DO bisa jalan. Settlement **tidak** otomatis saat packing — outbound muncul dari proses settlement setelah order **Shipped**.

**Detail:** [Instant Settlement](../accounting-settlement-upload/requirement.md) · [requirement.md](./requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (cross-ref Fase 3)
- Requirement: [requirement.md](./requirement.md) — **draft**
- Technical: **pending**
