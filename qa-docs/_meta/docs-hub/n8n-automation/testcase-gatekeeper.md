---
doc_type: docs-hub-n8n-workflow
title: Testcase Gatekeeper
group: Test Case
group_order: 3
sort: 2
summary: Notif saat TC FAILED+DONE, AI audit saat PASSED+DONE, tombol create bug atau ignore mismatch.
n8n_id: iALUU1kOj6SkIqcq
status: active
version: 0.1
last_updated: 2026-08-13
---

Nama di n8n: **Testcase Gatekeeper & Bug Automator** (Master Telegram masih label *Auto-Alert: Failed Test Case to Telegram*).

Trigger:

- Webhook `jira-bug-trigger-from-testcase` (Jira automation saat TC di-update)
- Tombol `CREATE_BUG:` dan `ignore_tc:` dari [Master Telegram](/docs/n8n-automation/master-telegram)

## Alur

```mermaid
flowchart TD
    A[Webhook Jira TC update] --> B{Status}
    B -->|FAILED dan Done| C[Notif internal IT + tombol Create Bug]
    C --> D[Klik CREATE_BUG]
    D --> E[Gemini susun payload bug]
    E --> F[Create bug Jira + link ke TC]
    F --> G[Edit pesan Telegram jadi tiket bug]
    B -->|PASSED dan Done| H[AI audit langkah vs requirement]
    H --> I{Mismatch?}
    I -->|ya| J[Notif mismatch + tombol Ignore]
    I -->|tidak| K[Selesai]
    J --> L[Klik ignore_tc]
    L --> M{User Yemima?}
    M -->|ya| N[Tandai Checked]
    M -->|tidak| O[Alert tidak berwenang]
```

**Keterangan langkah:**

- Create bug dari tombol memakai data TC (reporter, langkah, expected) + Gemini, lalu issue link ke TC sumber.
- Tombol ignore mismatch **hanya Yemima** (`yemimatifani`). User lain dapat alert.

## Relasi

Masuk dari hasil [Create & Clone](/docs/n8n-automation/test-case-create-clone). Keluar ke Jira bug yang kemudian bisa masuk [Bug Gatekeeper](/docs/n8n-automation/bug-gatekeeper).
