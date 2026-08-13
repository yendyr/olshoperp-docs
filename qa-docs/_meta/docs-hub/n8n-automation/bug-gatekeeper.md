---
doc_type: docs-hub-n8n-workflow
title: Bug Gatekeeper
group: Bug and tickets
group_order: 4
sort: 2
summary: AI cek kelengkapan bug dan kecocokan dengan requirement Notion. Approve hanya Yemima.
n8n_id: 3KbJXK6YZnl62AYe
status: active
version: 0.1
last_updated: 2026-08-13
---

Menjaga kualitas tiket bug sebelum dianggap “lolos gate”.

Trigger:

- Webhook `bug-gatekeeper-n8n` (Jira automation saat bug dibuat/diubah)
- Tombol `approve_bug` / `recheck_bug` dari [Master Telegram](/docs/n8n-automation/master-telegram)

## Alur

```mermaid
flowchart TD
    A[Webhook atau Get issue] --> B[Gemini cek format bug]
    B --> C{Format valid?}
    C -->|tidak| D[Notif mismatch format]
    C -->|perlu cek Notion| E[Cari page requirement]
    E --> F[Ambil isi toggle Notion]
    F --> G[AI Deep Requirement Audit]
    G --> H[Verdict ke internal IT]
    H --> I{Tombol}
    I -->|approve_bug| J{User Yemima?}
    J -->|ya| K[Tandai Checked]
    J -->|tidak| L[Alert tidak berwenang]
    I -->|recheck_bug| A
```

**Keterangan langkah:**

- Screening pertama: kelengkapan format (summary, langkah, expected, dsb.).
- Screening kedua: teks bug vs requirement di Notion (header toggle + isi yang tertangkap API).
- Recheck menghapus bubble mismatch lama lalu menjalankan audit ulang.

## Relasi

Masuk dari bug yang dibuat [Ticket Actions](/docs/n8n-automation/sub-ticket-actions) atau [Testcase Gatekeeper](/docs/n8n-automation/testcase-gatekeeper).
