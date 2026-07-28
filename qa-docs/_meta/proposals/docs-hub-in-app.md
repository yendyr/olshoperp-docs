---
title: In-app Docs Hub (/docs)
status: draft
last_updated: 2026-07-27
---

# Docs Hub — phase 1

Keywords: **docs-page**, **help-center** (UI `/docs`). Bukan sinonim “edit qa-docs folder”.

Cursor rule: `.cursor/rules/11-docs-page-help-center.mdc` (FE: `olshoperp-frontend/.cursor/rules/06-docs-page-help-center.mdc`).

Lark-like homepage + Pentaho-like browse (sidebar Module → Menu → Layer), **inside** OlshopERP at `/docs`. No database. Per-menu MenuDoc icon unchanged.

## URLs

| Path | View |
|------|------|
| `/docs` | Homepage (no docs sidebar) |
| `/docs/{module}` | Module landing + sidebar |
| `/docs/{module}/{menuSlug}/{layer?}` | Article + sidebar |

Module keys: `accounting`, `omni`, `scm`, `gate`, `settings` (`config/qa-docs.php` `module_url_keys`).

## API

- `GET qa-docs/hub/home`
- `GET qa-docs/hub/tree`
- `GET qa-docs/hub/modules/{moduleKey}`
- `GET qa-docs/hub/whats-new`
- Article body: existing `GET qa-docs/{slug}?layer=`

## Content files

`docs/qa-docs/_meta/docs-hub/` — home, getting-started, academy.
