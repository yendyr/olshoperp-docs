---
doc_type: docs-hub-n8n-workflow
title: Test Case Create & Clone Engine
group: Test Case
group_order: 3
sort: 1
summary: Buat test case baru atau clone regresi ke Jira, sync toggle Notion, dan log Google Sheets.
n8n_id: ucxzYCePNqrMS4K0
status: active
version: 0.1
last_updated: 2026-08-13
---

Membuat atau menggandakan tiket **Test Case** di Jira ETM, menempelkan synced block ke halaman Notion “Test Case {Menu}”, dan mencatat baris di Google Sheets.

Dipanggil Master Telegram untuk `/createtestcase` dan `/clonetc`.

## Alur

```mermaid
flowchart TD
    A{Command} -->|/createtestcase| B[Parse field wajib]
    A -->|/clonetc| C[Ambil TC sumber + healing sync block]
    B --> D{Page Notion ketemu?}
    C --> D
    D -->|tidak| E[Pesan Page Not Found]
    D -->|ya| F[Create issue Jira]
    F --> G[Link ke tiket requirement]
    G --> H[Synced toggle di Notion primary]
    H --> I{Regression?}
    I -->|ya| J[Update TC baru + optional update sumber]
    I -->|tidak| K[Toggle children]
    J --> L[Log Google Sheets]
    K --> L
    L --> M{Ada page related?}
    M -->|ya| N[Synced block di page lain]
    M -->|tidak| O[Ringkasan Telegram]
    N --> O
```

## Syntax create

Wajib: Summary, `Page:`, `Linked Issue:`, `Labels:`. Multi-page dipisah koma — page pertama primary, sisanya related.

```text
/createtestcase
Summary: [Judul skenario]
Page: Menu Utama, Menu Tambahan
Linked Issue: ETM-123
Labels: tag1, tag2
Expected Result: ...
```

## Syntax clone

```text
/clonetc ETM-111, ETM-112
Page: Nama Menu
Linked Issue: ETM-999
Labels: regression
```

ID boleh angka saja (`111` → `ETM-111`). Clone menandai regresi dan mencoba menyembuhkan sync block Notion di TC sumber.

## Relasi

TC yang Done FAILED/PASSED memicu [Testcase Gatekeeper](/docs/n8n-automation/testcase-gatekeeper). Hasil uji ditulis ke Notion oleh [Jira Backend - TC Docs](/docs/n8n-automation/jira-backend-testcase-docs).
