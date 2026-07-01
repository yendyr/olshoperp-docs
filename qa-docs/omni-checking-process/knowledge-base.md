---
doc_type: knowledge-base
menu: omni-checking-process
menu_name: "Checking Process"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Checking Process — Knowledge Base

> **DRAFT** — Ringkasan operator + relasi Instant Settlement. Konten lengkap menu masih disusun.

## Ringkasan

Menu **Checking Process** dipakai operator gudang untuk **approve transfer QC** (scan QR / kode TF / SO) setelah picking selesai.

| Item | Nilai |
|------|-------|
| Menu | Omni → Checking Process |
| Route UI | `/omni/checking-process` |

## Relasi Instant Settlement (operator)

Checking adalah langkah setelah **Picking** dan sebelum **Packing**. Order harus menyelesaikan seluruh rantai gudang sampai **Shipped WH 3PL** sebelum bisa di-settle.

**Detail:** [Instant Settlement](../accounting-settlement-upload/requirement.md) · [requirement.md](./requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (cross-ref Fase 3)
- Requirement: [requirement.md](./requirement.md) — **draft**
- Technical: **pending**
