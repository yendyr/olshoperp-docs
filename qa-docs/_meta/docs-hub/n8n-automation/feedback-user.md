---
doc_type: docs-hub-n8n-workflow
title: Feedback User Automation
group: Olshoperp dengan enduser
group_order: 2
sort: 1
summary: Intake request/bug user ke Lark, preview AI, approve jadi Jira card, cancel, dan finalize.
n8n_id: 7R6J-wdmikSSROg4SEL3J
status: active
version: 0.1
last_updated: 2026-08-13
---

Pintu masuk **request user**. Mencatat ke Lark Bitable, kasih notif ke dua grup, enrich dengan Gemini, lalu buat kartu Jira setelah di-approve.

Punya **dua trigger Telegram yang disengaja**:

1. Telegram Trigger sendiri — grup **[Olshoperp dengan enduser](https://t.me/c/2223489920/1)** dan submit `/submitrequest` / `/submitbug`.
2. Dipanggil [Master Telegram](/docs/n8n-automation/master-telegram) — tombol dan command di grup **Olshoperp internal IT**.

Tambahan: webhook Lark form `lark-form-submit`.

## Alur

```mermaid
flowchart TD
    A[User isi Lark form atau PIC kirim /submitrequest] --> B[Record Lark status Under Review]
    B --> C[Notif ke topic asal + Olshoperp dengan enduser]
    C --> D[Notif internal IT + tombol Create Card]
    D --> E[Gemini enrich + preview /approverequest]
    E --> F{Approve}
    F -->|/approverequest atau Auto AI| G[Create Jira card]
    G --> H[Status On Queue + simpan card di Lark]
    H --> I{Add card atau Close Finalize}
    I -->|add_card| G
    I -->|close_finalize| J[Bubble final di internal IT]
    D --> K["/cancelrequest RQ reason"]
    K --> L[Status Cancelled + matikan reminder]
```

**Keterangan langkah:**

- `/submitrequest` vs `/submitbug` hanya beda Type di Lark (`Request` / `Bug`). Field wajib: **Summary, Menu, Detail**.
- Boleh reply ke pesan user (requester diambil dari pesan yang di-reply) atau isi `Request by:`.
- `/approverequest` wajib `Record`, `Summary`, `Assign to`, `Labels`. Mode Auto AI mengisi label `ai-generated` + slug menu + `goals-{JumatBerikutnya}`.
- Assignee kosong → Jira tanpa assignee (cabang Create Jira Task by AI).

## Syntax

Submit:

```text
/submitrequest
Summary: ...
Menu: ...
Detail: ...
Request by: @username
Department: ...
```

Approve (setelah preview AI, atau ketik manual):

```text
/approverequest
Record: recXXXX
Summary: ...
Assign to: @username
Labels: tag1, tag2
Description: ...
```

Cancel:

```text
/cancelrequest RQ-123
reason: ...
```

## Relasi

- Mengisi Lark yang nanti di-scan [Reminder Pending](/docs/n8n-automation/reminder-request-pending).
- Kartu Jira yang dibuat memicu [Jira Events Monitor](/docs/n8n-automation/jira-events-monitor) (sync + release).
- Tombol `create_card::`, `add_card::`, `close_finalize::`, `auto_approve::` di-route Master Telegram ke sini.
