---
doc_type: docs-hub-n8n-workflow
title: Jira Events Monitor
group: Olshoperp dengan enduser
group_order: 2
sort: 3
summary: Sync status Jira ke Lark, notif tiket baru atau re-open, dan tombol release fitur ke grup user.
n8n_id: ZvaT4E7rfjNVyeot
status: active
version: 0.1
last_updated: 2026-08-13
---

Mendengarkan Jira project ETM, lalu menjaga Lark dan Telegram tetap selaras dengan kartu yang lahir dari request user.

Trigger:

- Jira `issue_created`
- Jira `issue_updated`
- Tombol `release_fitur:` dari [Master Telegram](/docs/n8n-automation/master-telegram)

## Alur

```mermaid
flowchart TD
    A[Jira issue created] --> B{Ada Lark ID / clone / manual?}
    B -->|automated| C[Notif Request Baru]
    B -->|clone re-open| D[Notif Card Clone]
    B -->|tanpa Lark ID| E[Notif Tiket Manual]
    F[Jira issue updated] --> G{Re-open atau sync status?}
    G -->|re-open| H[Notif internal IT]
    G -->|punya Lark ID| I[Update status di Lark]
    I --> J{Semua sibling card Done?}
    J -->|ya| K[Tombol release di internal IT]
    K --> L[Klik release_fitur]
    L --> M[Update RQ di Lark + notif Olshoperp dengan enduser]
```

**Keterangan langkah:**

- Update **diabaikan** jika tiket tidak punya custom field Lark ID **dan** bukan re-open.
- Tombol release hanya muncul setelah **The Judge** menilai semua kartu saudara di request yang sama sudah Done.
- Klik release mengedit bubble internal IT dan mengirim notif ke grup **[Olshoperp dengan enduser](https://t.me/c/2223489920/1)**.

## Relasi

Sumber kartu: [Feedback User](/docs/n8n-automation/feedback-user) dan [Notulensi Meeting](/docs/n8n-automation/notulensi-meeting).

## Catatan

Node Search Parent masih memakai URL placeholder `[APP_ID]` / `[TABLE_ID]`. Flow menonaktifkan parent saat clone mungkin belum lengkap — cek di n8n sebelum andalkan perilaku itu.
