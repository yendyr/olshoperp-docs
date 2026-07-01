---
doc_type: knowledge-base
menu: omni-checking-list
menu_name: "Checking List"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Checking List — Knowledge Base

> **DRAFT** — Ringkasan operator + relasi Instant Settlement. Konten lengkap menu masih disusun.

## Ringkasan

**Checking List** = dokumen daftar barang untuk QC gudang. Berbeda dari **Checking Process** (approve transfer by scan).

| Item | Nilai |
|------|-------|
| Menu | Omni → Checking List |
| Route UI | `/omni/checking-list` |

## Relasi Instant Settlement (operator)

Jika checking list belum selesai, order tidak lanjut ke packing/DO → upload settlement gagal (belum Shipped).

**Detail:** [Instant Settlement](../accounting-settlement-upload/requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (cross-ref Fase 3)
- Requirement: [requirement.md](./requirement.md) — **draft**
- Technical: **pending**
