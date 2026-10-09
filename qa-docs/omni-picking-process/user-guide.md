---
doc_type: user-guide
menu: omni-picking-process
menu_name: "Picking Process"
version: 1.0
last_updated: 2026-10-09
source_docs: [requirement.md, knowledge-base.md, technical.md]
source_version: "1.2"
owner: QA - Yemima
status: review
---

# Picking Process — Panduan Pengguna

**Menu:** Omni → Picking Process · **Route:** `/omni/picking-process`

## Apa itu

Approve transfer internal ke **virtual warehouse wave** (tahap picking). Biasanya lewat **scan QR** atau ketik kode TF / Sales Order.

**Bukan** [Picking List](../omni-picking-list/user-guide.md) — itu dokumen picklist operasional (scan item, pause, complete).

## Langkah singkat

1. Buka Picking Process.
2. Scan QR label / masukkan kode TF atau SO.
3. Sistem approve transfer (DRAFT jadi OPEN lalu APPROVED).
4. Lanjut ke Checking Process / Checking List.

## Tips

- Dokumen yang sudah scanned tidak bisa approve lagi.
- Skip Processing = jalur khusus unassign wave — bukan operasi harian biasa.

Detail: [knowledge-base.md](./knowledge-base.md)
