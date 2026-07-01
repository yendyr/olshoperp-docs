---
doc_type: knowledge-base
menu: accounting-customer-payment
menu_name: "Account Receive"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Account Receive — Knowledge Base

> **DRAFT** — Ringkasan operator + relasi Instant Settlement. Konten lengkap menu masih disusun.

## Ringkasan

Menu **Account Receive** mencatat penerimaan uang dari customer dan mengalokasikannya ke Sales Invoice yang masih outstanding.

| Item | Nilai |
|------|-------|
| Menu | Accounting → Account Receive |
| Route UI | `/accounting/customer-payment` |

## Relasi Instant Settlement (operator)

| Yang perlu Anda tahu | Penjelasan singkat |
|----------------------|-------------------|
| Kapan AR otomatis muncul | Setelah upload settlement **selesai** (SI/OB/jurnal) dan Anda klik **Approve** di Instant Settlement |
| Berapa dokumen AR | Biasanya **1 AR per batch upload** (per store), berisi banyak referensi invoice |
| AR manual sebelumnya | Invoice yang sudah punya AR manual **tidak** digenerate lagi (Smart AR) |
| Reject settlement | Tidak membuat AR — SI/OB tetap ada |
| Delete settlement | Diblokir jika ada SI dengan AR **manual** |

**Prasyarat:** Cash/Bank Receiving di **Store Setting** harus terisi sebelum Approve settlement.

**Detail teknis:** [Instant Settlement — requirement](../accounting-settlement-upload/requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (cross-ref Fase 1)
- Requirement: [requirement.md](./requirement.md) — **draft**
- Technical: **pending**
