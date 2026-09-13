# QA docs lookup indexes — agent protocol

Thin indexes so **Cursor, Antigravity, and other agents** can resolve a menu
without reading the full `manifest.yaml` (~4k lines).

This repo uses **`qa-docs/` at the repository root** (not `docs/qa-docs/`).

| File | Role | Edit? |
|------|------|-------|
| [`manifest.yaml`](./manifest.yaml) | Developer / write-docs **source of truth** — slugs, modules, doc status | Yes, when adding/changing a menu |
| [`lookup.tsv`](./lookup.tsv) | Greppable alias → slug (one row per alias) | **No** — generated |
| [`alias-index.yaml`](./alias-index.yaml) | Same map + per-menu status/routes/readme | **No** — generated |
| [`lookup-overrides.yaml`](./lookup-overrides.yaml) | Extra aliases + collision prefer | Yes — then regenerate |
| [`generate-lookup.py`](./generate-lookup.py) | Regenerator | Yes, if the schema changes |

---

## Regenerate

From the **olshoperp-docs** repo root:

```bash
python3 qa-docs/_meta/generate-lookup.py
```

Check that committed indexes match the generator (no hand-edits drifted):

```bash
python3 qa-docs/_meta/generate-lookup.py --check
```

npm alias (same commands):

```bash
npm run docs:lookup
npm run docs:lookup:check
```

Requires **Python 3** + **PyYAML** (`python3 -m pip install pyyaml` if missing).

After you add a menu to `manifest.yaml`, change `menu_name` / `menu_links`,
or add aliases in `lookup-overrides.yaml` / layer frontmatter → run the
regenerator in the **same commit**.

---

## Two paths (do not mix)

### A. Q&A — jawab pertanyaan (default)

Agents answering “apa aturan PO?”, “menu SI di modul mana?”, “kenapa save inbound ditolak?”:

1. **Resolve slug** from user text via **`alias-index.yaml` or `lookup.tsv`**
   (grep alias, `menu_name`, route, nickname). Do **not** open the fat
   `manifest.yaml` just to find a slug.
2. Open **`qa-docs/{slug}/README.md`** — layer table, route, related menus.
3. Read **one layer** according to the question (see
   `.cursor/rules/08-question-triage.mdc`):
   - how-to / can-cannot → `knowledge-base.md`
   - rule / acceptance / AS-IS → `requirement.md`
   - validasi / API / state → `technical.md`
4. If the alias has `also:` / a row in `collisions:` — disambiguate from
   user wording before answering. Do not silently pick the preferred slug
   when the user clearly meant the other menu.

**Q&A must not read** (noise, not menu truth):

| Skip | Why |
|------|-----|
| `qa-docs/{slug}/test-cases/**` | Katalog uji — hanya jika pertanyaan *adalah* test case / E2E |
| `qa-docs/{slug}/ETM-*/**` | Artefak card — hanya jika user menyebut card itu |
| `qa-docs/_legacy/**` | Historis, bukan canonical |
| `qa-docs/flows/**` | Recall E2E — hanya jika pertanyaan *adalah* flow |
| `qa-docs/_meta/docs-hub/**`, `gemini-briefs/**`, `templates/**` | Bukan sumber jawaban menu |
| Layer `capabilities/` | Index fitur — bukan pengganti requirement |

Jika alias tidak ketemu: katakan menu tidak terdaftar di lookup; baru
boleh fallback grep `manifest.yaml` (`menu_name`, `menu_links`, slug).
Jangan mengarang slug.

### B. Write-docs — tambah / ubah dokumentasi menu

Convention **tetap manifest-first** (tidak berubah):

1. `qa-docs/_meta/manifest.yaml` — daftar slug, `menu_name`, `menu_links`,
   `docs.*.status`. **Jangan rename slug** yang sudah dipakai folder / TC.
2. Folder `qa-docs/{menu-slug}/` + templates di `_meta/templates/`.
3. Sync `status` frontmatter ↔ manifest in the same commit.
4. Run `python3 qa-docs/_meta/generate-lookup.py` so Q&A indexes match.
5. Extra nicknames / collisions → `lookup-overrides.yaml`, **not** a mass
   rewrite of requirement bodies.

`manifest.yaml` stays the registry. Lookup files are a **derived index**.

---

## How to grep (examples)

```bash
# Nickname / UI name
rg -i "^po\t|^purchase order\t" qa-docs/_meta/lookup.tsv

# Route
rg "supplychain/purchase-order" qa-docs/_meta/lookup.tsv qa-docs/_meta/alias-index.yaml

# YAML map
rg -n -i "^  purchase order:" -A 8 qa-docs/_meta/alias-index.yaml
```

TSV columns:

`alias`, `slug`, `menu_name`, `module`, `source`, `routes`, `kb`, `req`, `tech`, `ug`, `also`, `readme`

---

## Collision policy

Short codes (`SO`, `PI`, `invoice`, `inbound`) are resolved in
`lookup-overrides.yaml` → `collisions`. The preferred slug is what a
bare nickname maps to; `also` lists the other legal menus.

Adding a new collision: edit overrides, regenerate, commit both.

---

## Portable for non-Cursor agents

If the tool does not load `.cursor/rules/`:

1. Read **this file**.
2. Follow path **A** (Q&A) or **B** (write-docs).
3. Persona / answer format remain in `AGENTS.md` and
   `.cursor/rules/05-qa-engineer-persona.mdc` when those files exist.

Cursor / Antigravity in this repo: `.cursor/rules/09-menu-documentation.mdc`
and `.cursor/rules/20-qa-docs-lookup.mdc` encode the same split.

---

## Out of scope

- No menu slug renames.
- No mass rewrite of `requirement.md` / KB / technical bodies.
- Indexes never include test-case or ETM folder paths as Q&A sources.
- `docs:drift` still treats `_meta/*.md` as system docs vs the developer
  repo; `lookup.tsv` / `*.yaml` / `generate-lookup.py` are not part of
  that `.md`-only walker.
