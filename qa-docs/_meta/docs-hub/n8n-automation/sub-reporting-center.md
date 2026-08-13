---
doc_type: docs-hub-n8n-workflow
title: Sub - Reporting Center
group: Meeting and report
group_order: 5
sort: 3
summary: Snapshot Telegram — sisa task per dev/label, QA Review window 17:00, dan monitoring TC harian.
n8n_id: vak2vpuD4zbjsaSq
status: active
version: 0.1
last_updated: 2026-08-13
---

Laporan on-demand ke chat pemanggil. Tidak menulis Lark/Notion.

## Alur

```mermaid
flowchart TD
    A[Master Telegram] --> B{Command}
    B -->|/progress| C{dev atau labels?}
    C -->|dev| D[JQL assignee]
    C -->|labels| E[JQL labels + filter todo/done]
    D --> F[Kirim ke Telegram]
    E --> F
    B -->|/qareview| G[Window kemarin 17:00 sampai hari ini 17:00]
    G --> F
    B -->|/testcase update| H[TC open atau Done di window cutoff]
    H --> F
```

## Syntax

```text
/progress dev @dapirdaa
/progress labels: "payment" todo
/progress labels: "payment" done
/qareview update
/qareview testing @yemimatifani
/testcase update
/testcase update labels: payment, checkout
```

Window QA/TC memakai cutoff **17:00**. Help `/help` masih menulis `/qa testing` — yang hidup adalah `/qareview testing @user`.

## Relasi

Hanya dipanggil [Master Telegram](/docs/n8n-automation/master-telegram). Beda tujuan dengan [Weekly Report](/docs/n8n-automation/weekly-report) (mingguan + Notion).
