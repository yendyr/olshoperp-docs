# Agent lookup indexes (qa-docs)

Slim, token-efficient menu lookup for **all coding agents** (Cursor, Antigravity, and others). Use these files to answer one product/ops question. Do **not** read full `_meta/manifest.yaml` for Q&A.

Developer source of truth for **writing/updating** docs is still [`manifest.yaml`](./manifest.yaml). These indexes are generated; they do not replace it.

## Files

| File | Role |
|------|------|
| [`lookup.tsv`](./lookup.tsv) | One row per menu: slug, name, aliases, module, UI route, layer flags, one-liner |
| [`alias-index.yaml`](./alias-index.yaml) | Normalized phrase → slug (or multi-slug + hint when ambiguous) |
| [`lookup-overrides.yaml`](./lookup-overrides.yaml) | Hand-maintained extra aliases + collision hints (not generated) |
| [`generate-lookup.py`](./generate-lookup.py) | Regenerator |

## How indexes are generated

`generate-lookup.py` reads:

1. `manifest.yaml` — slug, `menu_name`, `module`, `menu_links`, `short_description`, layer status
2. Per-menu YAML frontmatter `aliases` on `knowledge-base.md` / `requirement.md` / `technical.md` / `user-guide.md` (when present)
3. `lookup-overrides.yaml` — extra UI/chat phrases and disambiguation hints

It does **not** scan `**/test-cases/**`, `**/ETM-*/**`, `_legacy/`, `_meta/sot/`, or `_meta/gemini-briefs/`.

## Regenerate (one command)

From the **repository root**:

```bash
python3 docs/qa-docs/_meta/generate-lookup.py
```

Requires Python 3.10+ and PyYAML (`pip install pyyaml` if missing).

Regenerate after adding a menu, renaming a slug, changing `menu_name` / `short_description` / `menu_links`, or editing `lookup-overrides.yaml`. Commit the script output in the same change as the manifest update.

## Agent protocol (portable — Cursor, Antigravity, others)

Same path for every agent. Rule `.cursor/rules/09-menu-documentation.mdc` restates this for Cursor.

### Answering one user/product question

1. Resolve the menu from [`alias-index.yaml`](./alias-index.yaml) or [`lookup.tsv`](./lookup.tsv) — **not** full `manifest.yaml`.
2. Open `docs/qa-docs/{slug}/README.md`.
3. Open **only one** layer by intent:
   - ops / how-to / troubleshoot → `knowledge-base.md`
   - boleh / tidak / aturan / validasi → `requirement.md`
   - API / DB / jobs / file map → `technical.md`
   - onboarding publish → `user-guide.md`
4. If the alias value is a mapping (`slugs` + `hint`), pick using the hint (example: Sales Return finance vs warehouse). Do not merge two menus into one answer.

### Do not read for Q&A

- `**/test-cases/**`
- `**/ETM-*/**`
- `docs/qa-docs/_legacy/**`
- `docs/qa-docs/_meta/sot/**`
- `docs/qa-docs/_meta/gemini-briefs/**`
- Full `manifest.yaml` (use it only when **writing** docs or changing menu registry)

### Writing / updating docs

Unchanged developer protocol: `manifest.yaml` first, then the menu folder, then the layer you edit. After a menu add/rename, run the regenerate command above.

## Safety

- Indexes live only under `docs/qa-docs/_meta/`.
- App KB corpus (`Modules/AI/config/kb-corpus.php`) is unchanged. In-app Gemini indexing still follows that config (`_meta/` and `_legacy/` already excluded). Agent Q&A excludes are documented here, not in app runtime.
- Prefer new aliases in `lookup-overrides.yaml` instead of mass-editing menu frontmatter.
