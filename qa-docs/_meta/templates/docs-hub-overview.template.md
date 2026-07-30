---
doc_type: docs-hub-overview-template
version: 0.1
last_updated: 2026-07-30
status: draft
---

# Template — Help Center menu overview

Copy ke `_meta/docs-hub/menus/{menu-slug}/overview.en.md` dan `overview.id.md`.  
Isi frontmatter + body; hapus baris panduan. Standar penuh: `.cursor/rules/11-docs-page-help-center.mdc`.

```yaml
---
doc_type: docs-hub-menu-overview
menu_slug: {menu-slug}
menu_name: "{Menu Name}"
lang: en   # atau id
version: 1.0
last_updated: YYYY-MM-DD
status: draft
audience: help-center
source_type: derived   # derived | authored
source_ref: null       # path file user, atau "user-provided (...)" jika authored tanpa path
notes: Help Center landing. Separate from QA layers.
---
```

**`source_type`:**

| Nilai | Kapan |
|-------|-------|
| `derived` | Agent susun dari QA docs (default) |
| `authored` | User beri file `@…` atau konfirmasi Help Center dari user |

Jangan overwrite `authored` → `derived` tanpa instruksi user.
