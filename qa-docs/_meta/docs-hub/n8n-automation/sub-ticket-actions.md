---
doc_type: docs-hub-n8n-workflow
title: Sub - Ticket Actions
group: Bug and tickets
group_order: 4
sort: 1
summary: Command tiket harian — create bug, assign, story point, start test. Done testing belum di-wire.
n8n_id: mKXgw6BpTXwAWM1R
status: active
version: 0.1
last_updated: 2026-08-13
---

Command operasional tiket di grup Olshoperp internal IT. Dipanggil Master Telegram untuk `/bug`, `/assign`, `/set`, `/starttest`.

Ada parser `/donetesting` di dalam workflow ini, tapi Master Telegram **belum** mengarahkannya ke sini — anggap belum selesai.

## Alur

```mermaid
flowchart TD
    A[Master Telegram] --> B{Command}
    B -->|/bug| C{gemini atau manual?}
    C -->|gemini| D[Gemini ke JSON]
    C -->|manual| E[Create issue]
    D --> E
    E --> F{Ada lampiran?}
    F -->|ya| G[Attach ke Jira]
    F -->|tidak| H[Notif sukses]
    G --> H
    B -->|/assign| I[Set assignee Jira]
    I --> J[Kirim ringkasan ke topic Dev]
    B -->|/set ST| K{User di allowlist?}
    K -->|ya| L[Update story point]
    K -->|tidak| M[Tolak]
    B -->|/starttest| N[Assign QA + transition Testing Progress]
    B -->|/donetesting| O[Belum di-route dari Master]
```

## Syntax

`/bug` hanya di **topic 3958**. Wajib baris `Labels:` di akhir.

```text
/bug gemini cerita singkat...
Labels: payment, checkout
```

```text
/bug
Summary: ...
Deskripsi: ...
Labels: payment
```

```text
/assign 12176 to @dapirdaa
/set ST for ETM-12176 to 3
/starttest 12176
```

`/set ST` hanya: `yemimatifani`, `yendyrach`, `Jeiniiii`, `dapirdaa`.

`/starttest` menolak jika tipe/status tiket tidak valid (harus Test Case yang siap diuji).

## Relasi

Bug baru bisa masuk [Bug Gatekeeper](/docs/n8n-automation/bug-gatekeeper). `/starttest` memakai TC dari [Test Case Engine](/docs/n8n-automation/test-case-create-clone).
