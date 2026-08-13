---
doc_type: docs-hub-n8n-workflow
title: Weekly Report
group: Meeting and report
group_order: 5
sort: 2
summary: Rekap Jira Senin–sekarang, optional tarik notulen, tulis page Notion, kirim ke Olshoperp internal IT.
n8n_id: oOAifjAeLDkSqE1M
status: active
version: 0.1
last_updated: 2026-08-13
---

Membangun weekly report dari status Jira (Done, In Progress, QA Review, Outstanding), merangkum dengan Gemini, lalu membuat halaman Notion.

Command (tepat, bukan prefix):

- `/weeklyreport` — langsung generate
- `/weeklyreportwithnotulen` — cari notulen Notion dulu

Tombol: `ya_notulen_` (lanjut meski notulen >10 hari) dan `batal_notulen`.

## Alur

```mermaid
flowchart TD
    A{Command} -->|/weeklyreport| B[Hitung Senin 00:00 WIB sampai sekarang]
    A -->|/weeklyreportwithnotulen| C[Cari page notulen]
    C --> D{Notulen lebih dari 10 hari?}
    D -->|tidak| B
    D -->|ya| E[Konfirmasi tombol Ya / Batal]
    E -->|Ya| B
    E -->|Batal| F[Hapus konfirmasi]
    B --> G[Ambil 4 bucket Jira]
    G --> H[Gemini tulis laporan]
    H --> I[Create page Notion + append blocks]
    I --> J[Kirim laporan ke internal IT]
```

Periode selalu **Senin minggu ini 00:00 WIB** sampai waktu command dijalankan.

## Relasi

Notulen dari [Notulensi Meeting](/docs/n8n-automation/notulensi-meeting). Angka Jira independen dari Reporting Center (itu snapshot harian, ini rekap mingguan).
