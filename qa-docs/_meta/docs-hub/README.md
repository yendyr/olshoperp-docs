---
doc_type: docs-hub-index
version: 0.1
last_updated: 2026-07-27
status: draft
owner: QA - Yemima
---

# Docs Hub / Docs Page (`/docs`) · keywords: **docs-page**, **help-center**

In-app Help Center (Lark-like homepage + sidebar Module→Menu→Layer). **No database** for content.

| vs | |
|----|--|
| **docs-page / help-center** | UI di `https://staging.olshoperp.com/docs` — rule `.cursor/rules/11-docs-page-help-center.mdc` |
| **qa-docs** | Isi MD per menu di folder ini — rule `09-menu-documentation` + `qa-docs-standard` |

| File | Role |
|------|------|
| [home.md](./home.md) | Hero title / subtitle |
| [getting-started.md](./getting-started.md) | Getting Started cards |
| [academy.md](./academy.md) | Academy placeholders |

API: `GET /api/qa-docs/hub/home`, `hub/tree`, `hub/modules/{key}`, `hub/whats-new`.

FE routes: `/docs`, `/docs/:module`, `/docs/:module/:menuSlug/:layer?`.

Per-menu **docs icon** (MenuDoc slideover) is unchanged.
