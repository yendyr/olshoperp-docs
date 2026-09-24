# Hermes Olshop Knowledge Agent — Implementation Plan (Fase 0–2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bangun repo terpisah `hermes-olshop-knowledge` yang mengekspos MCP Knowledge Core read-only di atas live git `olshoperp-docs`, plus adapter Hermes CLI (termasuk Playwright runbook) dan stub adapter Telegram.

**Architecture:** Structured tools (`resolve_menu` → `get_layer` → …) di Python/FastMCP; `docs_root` menunjuk clone `olshoperp-docs`; channel adapter YAML membatasi persona/tools; tidak ada RAG di fase 0–2.

**Tech Stack:** Python 3.11+ · FastMCP (atau `mcp` SDK) · PyYAML · pytest · ripgrep subprocess opsional · git CLI untuk pull

**Spec:** `olshoperp-docs/docs/superpowers/specs/2026-09-24-hermes-knowledge-agent-design.md`

## Global Constraints

- `olshoperp-docs` = SoT **read-only**; jangan commit perubahan ke `qa-docs/**/requirement.md` | KB | technical dari repo tools.
- Denylist path wajib: `_legacy/`, `tests/` (kecuali path guidance runbook), `Automate Testing Card QA Review/`, `briefs/`, `n8n/`, `dashboard/`, `test-queue.yaml`, `*.log`, `.env*`.
- Chat/Telegram: **tidak** expose Playwright execute / Jira write; CLI boleh `get_guidance(playwright-runbook)` saja di fase 2.
- Guardrails: jawaban & prompt core merujuk `hazel/universal-agent-guardrails.md` di `docs_root`.
- Telegram path: **reuse Merdian** (terkunci 2026-09-24). Adapter `telegram-merdian.yaml` saja; tanpa bot Hermes Telegram baru di fase 0–2.
- Jangan mirror seluruh `.cursor/rules` ke system prompt.

---

## File map (repo baru `hermes-olshop-knowledge`)

| Path | Tanggung jawab |
|------|----------------|
| `pyproject.toml` | Package, deps, entry `olshop-knowledge` |
| `src/olshop_knowledge/config.py` | Load `docs_root`, channel, pull flags |
| `src/olshop_knowledge/git_root.py` | Resolve root, optional `git pull --ff-only` |
| `src/olshop_knowledge/allowlist.py` | Allow/deny path checks |
| `src/olshop_knowledge/manifest.py` | Parse manifest + `resolve_menu` |
| `src/olshop_knowledge/layers.py` | `get_layer` + frontmatter status |
| `src/olshop_knowledge/search.py` | `search_docs` scoped |
| `src/olshop_knowledge/related.py` | `get_related_menus` |
| `src/olshop_knowledge/guidance.py` | `get_guidance` topics + playwright |
| `src/olshop_knowledge/server.py` | MCP tool registration |
| `adapters/*.yaml` | Channel allowlists |
| `prompts/*.md` | Core + persona snippets (pendek) |
| `tests/fixtures/mini-docs/` | Mini tree mirip qa-docs untuk unit test |
| `tests/test_*.py` | Unit/integration tanpa butuh full clone |

Pointer di `olshoperp-docs` (opsional, kecil):

| Path | Tanggung jawab |
|------|----------------|
| `docs/superpowers/specs/2026-09-24-hermes-knowledge-agent-design.md` | Sudah ada — approved |
| `docs/superpowers/plans/2026-09-24-hermes-knowledge-agent.md` | File ini |

---

### Task 1: Scaffold repo `hermes-olshop-knowledge`

**Files:**
- Create: `hermes-olshop-knowledge/pyproject.toml`
- Create: `hermes-olshop-knowledge/README.md`
- Create: `hermes-olshop-knowledge/config.example.yaml`
- Create: `hermes-olshop-knowledge/src/olshop_knowledge/__init__.py`
- Create: `hermes-olshop-knowledge/src/olshop_knowledge/config.py`
- Test: `hermes-olshop-knowledge/tests/test_config.py`

**Interfaces:**
- Produces: `load_config(path: str | None) -> KnowledgeConfig` dengan field `docs_root: Path`, `channel: Literal["cli","telegram"]`, `git_pull_on_start: bool`

- [ ] **Step 1: Buat repo kosong** (GitHub `hermes-olshop-knowledge` atau folder sibling lokal) dengan `pyproject.toml` (name `olshop-knowledge`, python≥3.11, deps: `mcp` atau `fastmcp`, `pyyaml`, `pytest`).

- [ ] **Step 2: Tulis failing test** `test_config.py` — `load_config` menolak path tanpa `docs_root`, menerima YAML valid.

- [ ] **Step 3: Implement** `config.py` + `config.example.yaml`.

- [ ] **Step 4: Run** `pytest tests/test_config.py` — hijau.

- [ ] **Step 5: Commit** `chore: scaffold olshop-knowledge config`

---

### Task 2: Allowlist + git root

**Files:**
- Create: `src/olshop_knowledge/allowlist.py`
- Create: `src/olshop_knowledge/git_root.py`
- Create: `tests/test_allowlist.py`
- Create: `tests/fixtures/mini-docs/` (struktur mini: `_meta/manifest.yaml`, satu menu stub, file `_legacy/x.md` untuk deny)

**Interfaces:**
- Consumes: `KnowledgeConfig.docs_root`
- Produces: `assert_allowed(docs_root: Path, rel_path: str) -> Path` (raise `PermissionError` jika deny); `maybe_pull(docs_root: Path) -> str` (head sha atau warning)

- [ ] **Step 1: Write failing tests** — allow `qa-docs/foo/requirement.md`; deny `_legacy`, `test-queue.yaml`, `tests/specs/...`; **kecuali** allow khusus `tests/AGENT-RUNBOOK.md` untuk guidance.

- [ ] **Step 2: Implement** allowlist + git_root (pull optional, catch error → warning string).

- [ ] **Step 3: pytest** hijau.

- [ ] **Step 4: Commit** `feat: path allowlist and git root helper`

---

### Task 3: `resolve_menu` + manifest parser

**Files:**
- Create: `src/olshop_knowledge/manifest.py`
- Create: `tests/test_manifest.py`
- Modify: `tests/fixtures/mini-docs/qa-docs/_meta/manifest.yaml` (2–3 menu palsu)

**Interfaces:**
- Produces: `resolve_menu(docs_root: Path, query: str) -> list[MenuHit]`  
  `MenuHit = {slug, menu_name, module, menu_links, docs_status}`

- [ ] **Step 1: Write failing tests** — query by `menu_name`, by route fragment, by slug substring; empty → `[]`.

- [ ] **Step 2: Implement** YAML load + scoring sederhana (exact slug > name contains > route contains).

- [ ] **Step 3: pytest** hijau.

- [ ] **Step 4: Commit** `feat: resolve_menu from manifest`

---

### Task 4: `get_layer` + `list_doc_status`

**Files:**
- Create: `src/olshop_knowledge/layers.py`
- Create: `tests/test_layers.py`
- Modify fixtures: `qa-docs/demo-menu/{README,knowledge-base,requirement,technical}.md` dengan frontmatter `status:`

**Interfaces:**
- Produces: `get_layer(docs_root, slug, layer) -> LayerResult`  
  `LayerResult = {path, status, content, missing: bool}`  
  `list_doc_status(docs_root, slug=None, module=None) -> list[StatusRow]`

- [ ] **Step 1: Write failing tests** — missing file → `missing=True`; parse status dari frontmatter atau `"unknown"`; layer invalid → error jelas.

- [ ] **Step 2: Implement** layers.py (baca file via allowlist).

- [ ] **Step 3: pytest** hijau.

- [ ] **Step 4: Commit** `feat: get_layer and list_doc_status`

---

### Task 5: `search_docs` + `get_related_menus`

**Files:**
- Create: `src/olshop_knowledge/search.py`
- Create: `src/olshop_knowledge/related.py`
- Create: `tests/test_search.py`, `tests/test_related.py`

**Interfaces:**
- Produces: `search_docs(docs_root, query, slug=None, layer=None, module=None, limit=10) -> list[SearchHit]`  
  `get_related_menus(docs_root, slug) -> list[str]` (parse README links / heading Menu terkait — best-effort)

- [ ] **Step 1: Write failing tests** — search hanya di allowlist; filter by slug; related returns stubs from fixture README.

- [ ] **Step 2: Implement** (mulai dengan Python walk + substring; opsional `rg` jika ada di PATH).

- [ ] **Step 3: pytest** hijau.

- [ ] **Step 4: Commit** `feat: search_docs and get_related_menus`

---

### Task 6: `get_guidance` + MCP server wire-up

**Files:**
- Create: `src/olshop_knowledge/guidance.py`
- Create: `src/olshop_knowledge/server.py`
- Create: `prompts/core.md`, `prompts/persona-qa.md` (pendek)
- Create: `adapters/cli.yaml`
- Create: `tests/test_guidance.py`
- Create: `tests/test_server_tools.py` (panggil fungsi tool langsung, bukan full MCP transport jika ribet)

**Interfaces:**
- Produces MCP tools: `resolve_menu`, `get_layer`, `search_docs`, `get_related_menus`, `list_doc_status`, `get_guidance`
- `get_guidance(topic)` topics: `oot | answer-format | triage | playwright-runbook`
  - `playwright-runbook` → baca `docs_root/tests/AGENT-RUNBOOK.md` (**allowed exception**)
  - `oot` → `docs_root/hazel/universal-agent-guardrails.md` (cuplikan / full file jika pendek)

- [ ] **Step 1: Write failing tests** — `playwright-runbook` returns content dari fixture copy `AGENT-RUNBOOK.md`; topic unknown → error; channel telegram config **tidak** mendaftarkan guidance playwright (dicek di adapter test Task 7).

- [ ] **Step 2: Implement** guidance + server tool registration; entrypoint console script `olshop-knowledge`.

- [ ] **Step 3: Manual smoke** terhadap clone nyata:  
  `DOCS_ROOT=/path/to/olshoperp-docs` resolve `Purchase Order` / `customer-payment`.

- [ ] **Step 4: Commit** `feat: MCP server and get_guidance including playwright runbook`

---

### Task 7: Channel adapters (CLI + Telegram Merdian)

**Files:**
- Create: `adapters/cli.yaml`
- Create: `adapters/telegram-merdian.yaml` (**reuse Merdian** — terkunci)
- Create: `prompts/persona-operator.md`, `persona-pm.md`, `persona-enduser.md`
- Create: `tests/test_adapters.py`
- Modify: `README.md` — cara daftar MCP di Hermes CLI + kontrak Merdian → Knowledge Core + env `OLSHOP_DOCS_ROOT`

**Keputusan Telegram:** reuse Merdian. Merdian memanggil MCP/HTTP Knowledge Core; persona `operator`/`enduser`; **tanpa** `get_guidance(playwright-runbook)`; tanpa repo/bot Hermes Telegram baru.

- [ ] **Step 1: Confirm** README menyebut reuse Merdian + blok Playwright di chat.

- [ ] **Step 2: Write tests** — loader adapter: CLI allowlist includes `get_guidance`; `telegram-merdian` excludes playwright topic / returns 403 dari wrapper.

- [ ] **Step 3: Implement** adapter load + thin `ToolPolicy.check(channel, tool, args)`.

- [ ] **Step 4: Document** (a) Hermes CLI MCP snippet (b) kontrak integrasi Merdian → tools Knowledge Core.

- [ ] **Step 5: Commit** `feat: channel adapters cli and telegram-merdian policy`

---

### Task 8: Sample evaluation set (fase 1 sukses criteria)

**Files:**
- Create: `evals/questions.yaml` (10 pertanyaan)
- Create: `scripts/run_eval.py` (panggil resolve+get_layer, print sitasi; exit non-zero jika slug salah)

Contoh pertanyaan (sesuaikan slug nyata di manifest):

1. Cara buat Purchase Order?  
2. Account Receive relasi ke menu apa?  
3. Apa status requirement menu X yang draft?  
4. OOT: “resep rendang” → harus ditolak di prompt layer (dokumentasikan expected; eval opsional)

- [ ] **Step 1: Tulis 10 case** dengan `expected_slug` / `expected_layer`.

- [ ] **Step 2: Jalankan eval** terhadap `docs_root` staging clone — target ≥9/10 resolve benar.

- [ ] **Step 3: Commit** `test: add knowledge eval set`

---

### Task 9: Pointer & sync note di `olshoperp-docs` (opsional kecil)

**Files:**
- Modify (opsional): `olshoperp-docs/docs/superpowers/specs/...` checklist Telegram jika sudah dipilih
- **Jangan** ubah `qa-docs/` layer sistem

- [ ] **Step 1: Update** design §12 checkbox Telegram setelah user pilih.

- [ ] **Step 2: Commit di docs repo** hanya jika user minta commit (pesan: `docs: hermes knowledge plan approved notes`).

---

## Out of scope fase 0–2 (jangan kerjakan di plan ini)

- RAG / embeddings
- Playwright **execute** / Jira write dari tools
- Edit requirement docs
- Persona auto-router ML (cukup keyword rules sederhana di prompt)
- Deploy production Merdian wiring penuh (cukup adapter + README kontrak)

---

## Definition of Done (fase 0–2)

- [ ] Repo `hermes-olshop-knowledge` installable; `pytest` hijau dengan fixtures.
- [ ] Enam tools MCP jalan terhadap clone `olshoperp-docs` nyata.
- [ ] CLI adapter mengizinkan `get_guidance(playwright-runbook)`.
- [ ] Telegram adapter (path terpilih) **memblokir** Playwright guidance/execute.
- [ ] Eval ≥9/10 resolve slug.
- [ ] README: cara set `docs_root`, pull policy, dan batasan OOT/Yemima lock.
