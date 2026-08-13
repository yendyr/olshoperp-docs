---
doc_type: docs-hub-n8n-workflow
title: Reminder Request Pending
group: Olshoperp dengan enduser
group_order: 2
sort: 2
summary: Tandai RQ pending dari Telegram, plus scan otomatis jam 08:00.
n8n_id: rkVhys845YjF9Xkz
status: active
version: 0.1
last_updated: 2026-08-13
---

Dua pintu:

1. Command `/pendingrequest` dari [Master Telegram](/docs/n8n-automation/master-telegram).
2. **Schedule jam 08:00** — scan record Lark yang masih perlu diingatkan.

## Alur command

```mermaid
flowchart TD
    A["/pendingrequest RQ-xxx notes: ..."] --> B{Syntax valid?}
    B -->|tidak| C[Peringatan 10 detik lalu hapus]
    B -->|ya| D[Cari RQ di Lark]
    D --> E{Ketemu?}
    E -->|tidak| C
    E -->|ya| F[Update Lark jadi Pending]
    F --> G[Edit notif original di internal IT]
    G --> H[Notif sukses sementara 15 detik]
```

## Alur jam 08:00

Schedule → token Lark → cari RQ pending / reminder aktif → (lanjut ke notif sesuai record yang ketemu).

Command mengubah status + mematikan alur “masih under review”. Cron adalah pengingat harian, bukan pengganti command.

## Relasi

Baca/tulis Lark yang sama dengan [Feedback User](/docs/n8n-automation/feedback-user). `/cancelrequest` di Feedback User mematikan reminder.
