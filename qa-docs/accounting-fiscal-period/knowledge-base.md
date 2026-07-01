---
doc_type: knowledge-base
menu: accounting-fiscal-period
menu_name: "Fiscal Period"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Fiscal Period — Knowledge Base

> **DRAFT** — Ringkasan operator + relasi Instant Settlement. Konten lengkap menu masih disusun.

## Ringkasan

Menu **Fiscal Period** mengatur periode akuntansi buka/tutup. Transaksi dengan tanggal di luar periode aktif ditolak sistem.

| Item | Nilai |
|------|-------|
| Menu | Accounting → Fiscal Period |
| Route UI | `/accounting/fiscal-period` |

## Relasi Instant Settlement (operator)

| Yang perlu Anda tahu | Penjelasan singkat |
|----------------------|-------------------|
| Kapan dicek | Saat upload settlement & saat approve/generate dokumen |
| Gejala periode tutup | Error fiscal period — upload atau approve gagal |
| Solusi | Buka periode yang sesuai atau sesuaikan tanggal settlement |

**Detail:** [Instant Settlement](../accounting-settlement-upload/requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (cross-ref Fase 2)
- Requirement: [requirement.md](./requirement.md) — **draft**
- Technical: **pending**
