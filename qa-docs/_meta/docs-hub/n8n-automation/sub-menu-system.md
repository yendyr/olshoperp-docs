---
doc_type: docs-hub-n8n-workflow
title: Sub - Menu System
group: Hub
group_order: 1
sort: 2
summary: Menu bantuan /help di Telegram. Isi help belum sinkron dengan semua command hidup.
n8n_id: pDMtfOB7vehKLTg0
status: active
version: 0.1
last_updated: 2026-08-13
---

Menampilkan kategori bantuan bot. Dipanggil dari [Master Telegram](/docs/n8n-automation/master-telegram) saat user ketik `/help` atau klik tombol kategori.

## Alur

```mermaid
flowchart TD
    A["/help atau tombol kategori"] --> B{Kategori}
    B --> C[Test Case Automation]
    B --> D[Bug Reporting]
    B --> E[Task Management]
    B --> F[Progress and Monitoring]
    B --> G[QA Tracking Legacy]
    B --> H[Request User Management]
    C --> I[Tunggu lalu hapus bubble bot]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
```

## Isi help saat ini

| Kategori | Syntax yang ditampilkan |
|---|---|
| Test Case | `/createtestcase`, `/clonetc`, `/starttest`, `/testcase update` |
| Bug | `/bug gemini`, `/bug` manual |
| Task | `/assign`, `/set ST for ... to ...` |
| Progress | `/progress dev @user`, `/progress labels: "..."` |
| QA Tracking | `/qa testing @username`, `/qareview update` |
| Request User Management | `/cancelrequest` saja; tulis “Update Status (Soon)” — kategori help bot, bukan nama grup Telegram |

## Belum ada di help (tapi command-nya hidup)

`/approverequest`, `/pendingrequest`, `/updatenotulen`, `/weeklyreport`, `/weeklyreportwithnotulen`, `/submitrequest`, `/submitbug`, `/qareview testing` (help masih tulis `/qa testing`).

`/donetesting` juga tidak ada di help — dan memang belum di-wire di Master Telegram.

## Relasi

Hanya dipanggil Master Telegram. Tidak menulis Jira/Lark/Notion.
