# Design: Hermes Knowledge Agent — Structured Tools over Live Git

| Field | Value |
|-------|--------|
| Status | **approved** (2026-09-24) |
| Date | 2026-09-24 |
| Approach | **#2 Structured Knowledge Tools** (bukan pure agentic, bukan RAG-first) |
| Constraints from discovery | Hybrid persona (D) · Dual channel CLI+chat (3) · Live git SoT (A) |
| Repo SoT | `olshoperp-docs` (`qa-docs/`, `hazel/`, `AGENTS.md`) |
| Tools code | **Repo terpisah** `hermes-olshop-knowledge` (bukan mono di docs) |
| Playwright | **Ikut fase 2 CLI** — `get_guidance(playwright-runbook)` + pointer `tests/AGENT-RUNBOOK.md` |
| Telegram | **Reuse Merdian** (2026-09-24) — Merdian panggil Knowledge Core; persona operator/enduser; Playwright hanya di Hermes CLI |
| Owner (docs governance) | QA — Yemima (`Yemimatifani`) for requirement layers |

---

## 1. Goal

Menyediakan **satu Knowledge Core** untuk Hermes Agent yang:

1. Menjawab pertanyaan OlshopERP dari dokumentasi QA dengan **sitasi path + status layer**.
2. Melayani **multi-persona** (QA, PM, operator, end-user) tanpa mengarang aturan bisnis.
3. Jalan di **dua channel** (Hermes CLI/desktop + chat team) lewat adapter — tools & tone berbeda, core sama.
4. Tetap **live git** sebagai sumber kebenaran (tanpa vector index wajib di fase 1).

### Non-goals (fase 1)

- Edit `requirement.md` / KB / technical (tetap lock Yemima).
- Playwright execute / Jira write dari chat end-user.
- RAG/embedding sebagai jalur utama retrieval.
- Mirror penuh always-on Cursor rules (~1.9k baris) ke system prompt Hermes.

---

## 2. Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│  Channels                                                    │
│  ┌──────────────────┐              ┌──────────────────────┐ │
│  │ Hermes CLI / IDE │              │ Telegram / Slack     │ │
│  │ (internal QA/PM) │              │ (ops / end-user)     │ │
│  └────────┬─────────┘              └──────────┬───────────┘ │
│           │  Channel Adapter                   │            │
│           │  - persona default                 │            │
│           │  - tool allowlist                  │            │
│           │  - tone / max length / delivery    │            │
└───────────┼────────────────────────────────────┼────────────┘
            │                                    │
            └──────────────┬─────────────────────┘
                           ▼
                 ┌───────────────────┐
                 │  Persona Router   │
                 │  qa|pm|operator|  │
                 │  enduser (+auto)  │
                 └─────────┬─────────┘
                           ▼
                 ┌───────────────────┐
                 │  Knowledge Core   │
                 │  (MCP / tools)    │
                 │  resolve_menu     │
                 │  get_layer        │
                 │  search_docs      │
                 │  get_related      │
                 │  list_status      │
                 └─────────┬─────────┘
                           ▼
                 ┌───────────────────┐
                 │  Live git clone   │
                 │  olshoperp-docs   │
                 │  read-only        │
                 │  pull on start /  │
                 │  cron / webhook   │
                 └───────────────────┘
```

**Prinsip:** agent **tidak** free-browse seluruh repo. Semua baca docs melewati tools yang enforce: manifest-first, layer by persona, exclude `_legacy` / noise, label status `draft|pending|review`.

**Guardrails universal** (semua channel): `hazel/universal-agent-guardrails.md` — OOT, requirement lock, PII, anti-jailbreak. Overlay channel tidak boleh melemahkan inti ini.

---

## 3. Persona + channel matrix

### 3.1 Personas

| Persona | Default layer | Fokus jawaban | Boleh sebut gap/status draft |
|---------|---------------|---------------|------------------------------|
| `qa` | `requirement.md` → KB → technical | AC, edge case, can/cannot, preconditions | Ya |
| `pm` | `requirement.md` → KB | AS-IS/TO-BE, impact bisnis, keputusan | Ya (ringkas) |
| `operator` | `knowledge-base.md` → user-guide | How-to, troubleshooting | Minim; arahkan support jika gap |
| `enduser` | `user-guide` / KB how-to saja | Langkah singkat, status order | Tidak bahas draft/internal |

### 3.2 Channel defaults

| Channel | Default persona | Tools | Tone | Delivery |
|---------|-----------------|-------|------|----------|
| Hermes CLI / desktop | `qa` (bisa switch `pm`) | Full knowledge tools + optional `search_rules` pointer | QA format (`06`) | Markdown penuh + sitasi path |
| Telegram / Slack (team ops) | `operator` | Knowledge tools read-only; **tanpa** Jira/Playwright | Plain language (`24`) | Singkat; panjang → Instant View / docs URL |
| Telegram end-user (jika dipakai) | `enduser` | Subset: resolve + get_layer(kb/ug only) | OOT ketat, &lt;25 token reject | Bubble pendek |

### 3.3 Persona switch

- Eksplisit: user bilang `mode: qa` / `untuk PM` / `cara pakai`.
- Implisit (router ringan): kata kunci “boleh gak”, “acceptance”, “cara input”, “kenapa error”.
- Chat end-user: **tidak** boleh naik ke `qa` tanpa autentikasi internal.

---

## 4. Tool contracts (Knowledge Core)

Semua path relatif ke root clone `olshoperp-docs`. **Read-only.**

### 4.1 `resolve_menu`

**Input:** `query` (nama menu, route, keyword slug).  
**Output:** daftar kandidat `{ slug, menu_name, module, menu_links, docs_status: {kb, requirement, technical} }`.

**Impl:** parse `qa-docs/_meta/manifest.yaml` (+ fuzzy match nama/route).  
**Wajib dipanggil dulu** sebelum `get_layer` jika slug belum pasti.

### 4.2 `get_layer`

**Input:** `slug`, `layer` ∈ `readme | knowledge-base | requirement | technical | user-guide` (opsional: `capabilities` index saja).  
**Output:** teks + metadata `{ status, path, last_updated? }`.

**Rules:**
- Jika file tidak ada → `{ missing: true }` — agent **dilarang** mengarang.
- Jika `status: draft|pending` → agent wajib sebut tingkat keyakinan di jawaban (persona qa/pm).
- Persona `enduser`: hanya `knowledge-base` / `user-guide`; tolak `technical` / `requirement` mentah.

### 4.3 `search_docs`

**Input:** `query`, optional `slug`, `layer`, `module`.  
**Output:** list hit `{ path, heading?, snippet, score }`.

**Allowlist roots:**
- `qa-docs/{slug}/**` (layer docs + test-cases metadata saja jika persona qa)
- `hazel/**`
- `AGENTS.md`, `PROMPT-QA-AGENT.md` (internal channel only)

**Denylist (hard):**
- `qa-docs/_legacy/**`
- `qa-docs/_meta/templates/**` (kecuali tool khusus authoring — fase 1 off)
- `tests/**`, `Automate Testing Card QA Review/**`, `briefs/**`, `n8n/**`, `dashboard/**`
- `test-queue.yaml`, `*.log`, secrets / `.env`
- `.cursor/rules/**` penuh — lihat `get_guidance` di bawah

### 4.4 `get_related_menus`

**Input:** `slug`.  
**Output:** related dari README § Menu terkait / manifest hints — untuk jawaban lintas menu.

### 4.5 `list_doc_status`

**Input:** optional `module` atau `slug`.  
**Output:** ringkas status layer (untuk QA/PM: “requirement masih draft”).

### 4.6 `get_guidance` (internal channel only)

**Input:** `topic` ∈ `oot | answer-format | triage | jira-card | card-tc | playwright-runbook`.  
**Output:** **cuplikan pendek** dari `hazel/` atau pointer file — **bukan** dump seluruh `.cursor/rules`.

Mapping contoh:
- `oot` → `hazel/universal-agent-guardrails.md`
- `playwright-runbook` → `tests/AGENT-RUNBOOK.md` (CLI only)
- `triage` → ringkas tabel dari rule `08` (boleh di-vendor sebagai JSON kecil di package Hermes)

### 4.7 Tools yang **tidak** ada di Knowledge Core fase 1

- Write/edit docs
- Jira MCP (boleh adapter CLI terpisah nanti)
- Playwright run
- DB/log webhooks (adapter internal opsional fase 2)

---

## 5. Session bootstrap (hemat token)

### Saat session start (semua channel)

Load **kecil** saja ke system / memory:

1. `hazel/universal-agent-guardrails.md` (inti)
2. Channel overlay ½–1 halaman (tone + tool allowlist)
3. Instruksi: “selalu `resolve_menu` → `get_layer`; sitasi path; hormati status”
4. Staging URL: `https://staging.olshoperp.com`

**Jangan** inject: seluruh `.cursor/rules`, seluruh `AGENTS.md` panjang, `test-queue.yaml`, daftar 130 menu.

### On-demand

- Manifest dibaca tool `resolve_menu` (cache in-process OK; invalidate on git pull).
- Isi layer hanya lewat `get_layer`.
- Playwright / Jira guidance hanya jika channel = CLI **dan** user minta automate/card.

### Git freshness

- Clone path konfigurasi Hermes (mis. `HERMES_OLSHOP_DOCS_ROOT`).
- `git pull --ff-only` on session start **atau** cron 5–15 menit (internal).
- Jika pull gagal: jawab dengan warning “docs mungkin stale” + timestamp `HEAD`.

---

## 6. Answer policy (Knowledge Core)

Selaras `06-answer-format` / `10-anti-hallucination`, disederhanakan per persona:

1. **Ringkasan** 1–2 kalimat.
2. **Detail** sesuai persona (QA: bisa/tidak bisa + AC; operator: langkah).
3. **Konteks doc:** `slug`, layer, `status`.
4. **Gap:** jika missing/draft — katakan jelas; jangan isi dari “pengetahuan ERP umum”.

Label sumber:
- **AS-IS (docs)** — kutipan/parafrase dari layer
- **Catatan QA** — implikasi (hanya persona qa/pm)
- **Rekomendasi** — di luar docs (eksplisit)

Sitasi wajib: `qa-docs/{slug}/requirement.md` (± heading) + `menu_name` + route dari manifest.

---

## 7. Packaging untuk Hermes

### 7.1 Repo layout — `hermes-olshop-knowledge` (terpisah dari olshoperp-docs)

```
hermes-olshop-knowledge/
├── README.md
├── pyproject.toml                 # Python + FastMCP (Hermes-friendly)
├── src/olshop_knowledge/
│   ├── server.py                  # MCP entry
│   ├── manifest.py                # YAML resolve_menu
│   ├── layers.py                  # get_layer + frontmatter status
│   ├── search.py                  # ripgrep/allowlist search_docs
│   ├── related.py
│   ├── guidance.py                # get_guidance topics incl. playwright
│   ├── allowlist.py
│   └── git_root.py                # docs_root + optional pull
├── adapters/
│   ├── cli.yaml                   # persona default qa, full tools + playwright guidance
│   ├── telegram-merdian.yaml      # jika reuse Merdian
│   └── telegram-hermes.yaml       # jika bot baru
├── prompts/
│   ├── core.md
│   ├── persona-qa.md
│   ├── persona-pm.md
│   ├── persona-operator.md
│   └── persona-enduser.md
├── tests/
│   ├── fixtures/                  # mini manifest + 1 menu stub
│   └── test_*.py
└── config.example.yaml
    docs_root: /absolute/path/to/olshoperp-docs
    channel: cli
    git_pull_on_start: true
```

`olshoperp-docs` **tidak** diubah isinya untuk Knowledge Core selain opsional pointer di `docs/superpowers/` (design/plan saja).
### 7.2 Integrasi Hermes

- Daftarkan sebagai **MCP server** atau **Hermes toolset** (ikut mekanisme plugin Hermes yang dipakai tim).
- Memory provider Hermes (Honcho/OpenViking/dll.) **opsional** untuk preferensi user — **bukan** pengganti `qa-docs`.
- Built-in `MEMORY.md`: hanya preferensi sesi (company favorit, persona terakhir) — jangan simpan isi requirement.

### 7.3 Keamanan

- Clone read-only credential (deploy key read-only).
- Chat channel: rate limit + OOT short-circuit sebelum tool call.
- Jangan expose path absolut mesin / token di jawaban.

---

## 8. Phased rollout

| Fase | Deliverable | Sukses jika |
|------|-------------|-------------|
| **0** | Design approved + repo `hermes-olshop-knowledge` scaffold + config `docs_root` | Matrix OK; Telegram = reuse Merdian |
| **1** | MCP tools: resolve, get_layer, search, related, status | 10 pertanyaan sample QA akurat + sitasi |
| **2** | Adapter Hermes CLI + `get_guidance` (**termasuk playwright-runbook**) + adapter Telegram (operator) | CLI bisa buka runbook; chat OOT ketat; tone beda |
| **3** | Persona router + enduser subset | Tidak bocor technical/requirement ke enduser |
| **4** (opsional) | Hybrid RAG di atas allowlist | Hanya jika search keyword sering gagal |
| **5** (opsional) | CLI-only Jira write / Playwright **execute** (bukan hanya pointer) | Tidak di chat enduser |

---

## 9. Mapping ke masalah audit Cursor/Antigravity

| Masalah IDE | Solusi di desain ini |
|-------------|----------------------|
| Always-on ~1.9k baris | Bootstrap kecil + `get_guidance` topik |
| Agent free-browse salah file | Wajib lewat tools + denylist |
| Prompt Playwright bias | Hanya CLI + user minta automate |
| Layer UG/capabilities tidak di protokol | `get_layer` enum eksplisit; capabilities = fase 1 index-only |
| Dual channel butuh tone beda | Channel adapter |

Mirip Cursor secara **protokol baca** (manifest → README → layer); **beda** dari Cursor secara **mekanisme** (tools ketat, bukan dump rules).

---

## 10. Success criteria

- ≥90% pertanyaan menu ter-resolve ke slug benar di sample set internal.
- 0 jawaban yang mengutip `_legacy` sebagai canonical.
- Setiap jawaban qa/pm menyebut `status` jika bukan `review`/`approved`.
- Chat OOT: reject tanpa tool call.
- Latency tool `resolve_menu` &lt; 200ms cache hit; `get_layer` didominasi I/O disk/git.

---

## 11. Keputusan & sisa open question

### Diputuskan (2026-09-24)

| # | Pertanyaan | Keputusan |
|---|------------|-----------|
| 1 | Tempat kode tools | **Repo terpisah** `hermes-olshop-knowledge`; `olshoperp-docs` tetap SoT read-only via `docs_root` |
| 3 | Playwright | **Ikut fase 2 CLI** — guidance/runbook pointer (`get_guidance(playwright-runbook)` → `tests/AGENT-RUNBOOK.md`). Eksekusi test tetap non-goal chat; execute opsional fase 5 |

### 11.1 Telegram: reuse Merdian vs bot Hermes baru *(masih dipilih)*

| | **Reuse Merdian** | **Bot Hermes baru** |
|--|-------------------|---------------------|
| **Pros** | Sudah punya UX, topic, mapping QA, rule `20`/hazel; satu wajah ke tim; Knowledge Core tinggal di-plug (MCP/HTTP); tidak dobel OOT policy | Isolasi beban/risiko; bisa persona `qa` internal tanpa campur end-user; eksperimen Hermes tanpa ganggu produksi Merdian; brand/kanal terpisah |
| **Cons** | Coupling ke stack Merdian existing; regress risk saat ganti backend; kalau Merdian end-user-facing, tools QA/Playwright harus tetap di-block ketat di adapter | Dua bot = dua onboarding, dua secret, dua tempat notifikasi; drift prompt vs `hazel/merdian-*`; tim bisa bingung bot mana |
| **Cocok jika** | Chat = ops/end-user (operator/enduser), Knowledge Core shared | Chat = internal QA/PM saja, paralel Merdian |

**Rekomendasi desain (dipilih):**  
- **Reuse Merdian** sebagai channel Telegram → panggil Knowledge Core (persona `operator` / `enduser`).  
- **CLI Hermes** = internal `qa`/`pm` + Playwright runbook.  
- Bot Hermes Telegram baru **tidak** dibangun di fase 0–2.

Checklist: [x] **reuse** · [ ] baru · [ ] keduanya

---

## 12. Approval

- [x] Approach #2 + section 2–7 disetujui
- [x] Kode tools terpisah; Playwright ikut fase 2 CLI
- [x] Telegram path: **reuse Merdian**
- [x] Implementation plan fase 0–2 ditulis di `docs/superpowers/plans/`
