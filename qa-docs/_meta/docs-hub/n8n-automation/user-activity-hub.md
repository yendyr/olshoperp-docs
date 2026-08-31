---
doc_type: docs-hub-n8n-workflow
title: User Activity Hub
group: Ops
group_order: 9
sort: 1
summary: Ingest last_opened + last_write dari FE Tyas/Merdian ke n8n Data Store; export JSON untuk dashboard olshoperp-docs.
n8n_id: pending-import
status: draft
version: 0.1
last_updated: 2026-08-28
---

Menerima beacon dari Vue (`VITE_USER_ACTIVITY_WEBHOOK_URL`), upsert satu baris per `(env, user_id)`, dan menyediakan GET export untuk [User Activity dashboard](https://github.com/olshoperp/olshoperp-docs) di `dashboard/user-activity.html`.

Import JSON & setup: repo `olshoperp-docs` → `n8n/user-activity/`.

## Alur

```mermaid
flowchart LR
  FE[Vue Tyas or Merdian] -->|POST open/write| WH[Webhook Ingest]
  WH --> DS[Data Store upsert]
  DASH[docs dashboard HTML] -->|GET export| EXP[Webhook Export]
  EXP --> DS
```

## Payload

Lihat `olshoperp-docs/n8n/user-activity/README.md`.

## Relasi

- FE: `olshoperp-frontend/src/utils/userActivityTelemetry.ts`
- Viewer: `olshoperp-docs/dashboard/user-activity.html`
