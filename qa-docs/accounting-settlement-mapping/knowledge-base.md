---
doc_type: knowledge-base
menu: accounting-settlement-mapping
menu_name: "Settlement Mapping"
version: 1.0
last_updated: 2026-06-23
owner: QA - Yemima
status: draft
audience: operator
---

# Settlement Mapping — Knowledge Base

> **DRAFT** — Ringkasan operator + relasi Instant Settlement. Konten lengkap menu masih disusun.

## Ringkasan

Menu **Settlement Mapping** mengatur pemetaan **kolom biaya/pendapatan** dari file settlement marketplace ke akun COA di OlshopERP. Tanpa mapping yang benar, upload **Instant Settlement** bisa gagal atau menimbulkan selisih total.

| Item | Nilai |
|------|-------|
| Menu | Accounting → Settlement Mapping |
| Route UI | `/accounting/settlement-mapping` |

## Relasi Instant Settlement (operator)

| Yang perlu Anda tahu | Penjelasan singkat |
|----------------------|-------------------|
| Kapan setup | **Sebelum** upload file settlement pertama kali per platform/store |
| Gejala mapping salah | Error import, jurnal gagal, atau selisih besar di panel **Difference Settlement-SI** |
| Apakah ubah mapping mempengaruhi upload lama? | Tidak — hanya batch **baru** setelah perubahan |

**Detail teknis & alur bulk:** [Instant Settlement — requirement](../accounting-settlement-upload/requirement.md)

## Status dokumentasi

- Knowledge Base: **draft** (cross-ref Fase 1)
- Requirement: [requirement.md](./requirement.md) — **draft**
- Technical: **pending**
