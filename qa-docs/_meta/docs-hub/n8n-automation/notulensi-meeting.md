---
doc_type: docs-hub-n8n-workflow
title: Notulensi Meeting
group: Meeting and report
group_order: 5
sort: 1
summary: Tombol Draft/Final di Notion jadi ringkasan Telegram, kartu Jira, dan record Lark.
n8n_id: et8zW0Id2n65No00
status: active
version: 0.1
last_updated: 2026-08-13
---

Mengubah halaman notulen Notion menjadi action item yang terlacak.

Trigger:

- Webhook `notulen-draft` (tombol Draft di Notion)
- Webhook `notulen-final` (tombol Final)
- Command `/updatenotulen` dari [Master Telegram](/docs/n8n-automation/master-telegram) — cari notulen by tanggal, heal/trace ID Jira ke Notion

## Alur Final

```mermaid
flowchart TD
    A[Tombol FINAL di Notion] --> B{Page sudah Final?}
    B -->|sudah| C[Tolak + warning Telegram 10 detik]
    B -->|belum| D[Parse block notulen]
    D --> E[Gemini pecah jadi kartu]
    E --> F{Masuk Lark?}
    F -->|ya Request| G[Create Lark RQ + Jira card]
    F -->|bug| H[Create Jira BUG]
    G --> I[Merge hasil]
    H --> I
    I --> J[Update Notion + kirim ringkasan Telegram]
```

Draft hanya format + kirim ke Olshoperp internal IT, tanpa Jira.

`/updatenotulen` menelusuri database Notion, filter tanggal, lalu menulis ulang jejak Jira di block (heal & trace) dan kirim progress ke chat pemanggil.

## Relasi

Kartu Jira/Lark yang dihasilkan ikut [Jira Events Monitor](/docs/n8n-automation/jira-events-monitor). Teks notulen bisa dipakai [Weekly Report](/docs/n8n-automation/weekly-report) lewat `/weeklyreportwithnotulen`.
