---
doc_type: docs-hub-n8n-workflow
title: Jira Backend - Testcase Documentation
group: Test Case
group_order: 3
sort: 3
summary: Menulis hasil actual test ke toggle Notion, dengan ringkasan Gemini jika teks terlalu panjang.
n8n_id: Oi_a2GLxnkK9gi5VV3kvx
status: active
version: 0.1
last_updated: 2026-08-13
---

Backend silent: tidak ada command Telegram. Jira (automation) POST ke webhook `jira-update-status` setiap actual result / status TC berubah.

## Alur

```mermaid
flowchart TD
    A[Webhook jira-update-status] --> B[Ambil issue Jira]
    B --> C{Actual result lebih dari 1500 karakter?}
    C -->|ya| D[Gemini summarize]
    C -->|tidak| E[Prepare Smart Logic]
    D --> E
    E --> F[Update header toggle Notion]
    F --> G{Ganti child atau append?}
    G -->|ada child lama| H[Hapus block lama]
    H --> I[Append toggle baru]
    G -->|baru| I
    I --> J[Simpan block ID ke field Jira]
```

**Keterangan langkah:**

- Satu toggle Notion per TC, ID-nya disimpan di field custom Jira supaya update berikutnya menimpa toggle yang sama, bukan menumpuk.
- Ringkasan AI hanya jika actual result tembus ~1500 karakter (batas Notion/block).

## Relasi

Pelengkap [Test Case Engine](/docs/n8n-automation/test-case-create-clone) (engine membuat toggle kosong/synced; workflow ini mengisi hasil uji).
