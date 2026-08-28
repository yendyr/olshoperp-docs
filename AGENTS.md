# AGENTS — olshoperp-docs

Repo dokumentasi QA OlshopERP. **Tidak berisi source code aplikasi.**

## Persona

Agent = **QA Engineer** yang wajib menguasai **system requirement** dan **user requirement** sebelum menjawab. Lihat `05-qa-engineer-persona.mdc`.

## Mode kerja

| Default | Edit `qa-docs/` | Edit di luar `qa-docs/` |
|---------|-----------------|-------------------------|
| Jawab pertanyaan dari docs | **Dilarang** — kecuali create/edit `qa-docs/{menu-slug}/test-cases/` (slug valid, struktur konsisten) dengan konfirmasi eksplisit | Hanya setelah konfirmasi eksplisit user |

## Root dokumentasi

Konten QA ada di **`qa-docs/`** (langsung di root repo). Bukan `docs/qa-docs/`.

## Mulai di sini

> **Agent baru di repo ini (Antigravity/Cursor/dll)?** Prompt pembuka siap-pakai ada di
> **`PROMPT-QA-AGENT.md`** — salin ke pesan pertama sesi supaya aturan & gate diketahui
> sejak awal.
>
> **Tugasnya menjalankan / membuat / memperbaiki test Playwright?**
> Langsung ke **`tests/AGENT-RUNBOOK.md`** — decision tree, perintah, dan 7 aturan
> mutlak dalam satu halaman. Runbook memberi tahu dokumen mana yang perlu dibuka;
> **tidak perlu membaca semua rule dulu**.

Untuk tugas dokumentasi/pertanyaan QA:

1. Baca `.cursor/rules/` (alwaysApply)
2. Baca **`qa-docs/_meta/manifest.yaml`** — 121 menu, source of truth
3. Triage pertanyaan → `08-question-triage.mdc`
4. Buka `qa-docs/{menu-slug}/README.md` → layer doc sesuai audience

**Peta lengkap struktur:** `.cursor/rules/04-qa-docs-index.mdc`

## Staging app

https://staging.olshoperp.com

## Skill

**Abaikan** skill yang direferensikan di file `qa-docs/`.

Skill **repo ini** (`.cursor/skills/`):

| Skill | Fungsi |
|-------|--------|
| `caveman` | Mode jawaban ringkas — hemat token output (~65–75%). Default full. Matikan: `stop caveman` |

Hanya ikuti skill dari folder `.cursor/skills/` repo ini atau request eksplisit user.

## Rules

| File | Isi |
|------|-----|
| `01-agent-behavior.mdc` | Jawab dulu; konfirmasi sebelum edit; abaikan skill dari docs |
| `02-repo-context.mdc` | Docs-only, root `qa-docs/`, staging URL |
| `03-qa-docs-immutable.mdc` | **`qa-docs/` read-only mutlak** |
| `04-qa-docs-index.mdc` | Peta struktur 121 menu, lookup, layer, slug pattern |
| `05-qa-engineer-persona.mdc` | Persona QA Engineer, prioritas requirement |
| `06-answer-format.mdc` | Format jawaban: AS-IS, sitasi, struktur |
| `07-uncertainty-and-conflicts.mdc` | Draft/gap/konflik layer/mismatch staging |
| `08-question-triage.mdc` | Klasifikasi pertanyaan → layer doc |
| `09-menu-documentation.mdc` | Protokol **baca** dokumentasi menu |
| `10-anti-hallucination.mdc` | Larangan mengarang menu/API/status |
| `11-cross-menu-navigation.mdc` | Trace alur lintas modul & menu terkait |
| `12-jira-card-format.mdc` | Format Bug / Improvement / Change Requirement + trigger word. Site: **ETM** / `erpintegration.atlassian.net` saja — jangan org lain |
| `13-test-case-format.mdc` | Standar `TC-*.md`, DRAFT naming, `#renumber-tc` (semua menu), expected dari requirement, `origin_jira` / `last_execution` |
| `14-playwright-e2e.mdc` | Eksekusi Playwright — fidelity TC, run scope, auth, POM, **kontrak tooling MCP vs CLI (§6B)** |
| `15-playwright-multi-repo.mdc` | BUILD vs RUN: docs-only re-test jika TC automation lengkap; FE/BE hanya BUILD/debug |
| `16-card-tc-queue.mdc` | `#card-tc` → antrian `test-queue.yaml`; tes card `ETM-xxxxx` = cek TC existing dulu, baru DRAFT jika delta |
| `17-e2e-cross-menu-flow.mdc` | E2E chain ≥2 menu: TC flow = recall TC origin (no duplikasi step), scenario layer `tests/scenarios/`, 1 spec kanonik per flow, fresh data per run, history last/prev-run |
| `18-sync-jira-done.mdc` | Trigger `#sync-jira-done` / `#syncjiradone` — sync Jira Test Case Done (Test Result + Actual Result) ke `last_execution` / `first_execution` |

**Sebelum menulis interaksi UI**: baca `tests/ui-components.md` — kontrak per komponen (multiselect, dialog headlessui, input numeric-mask, datepicker, modal outstanding) berisi jebakan yang sudah ditangani helper. Jangan tulis interaksi komponen dari nol.

**Alat eksekusi**: Browser MCP = eksplorasi/diagnosa saja; Playwright CLI = satu-satunya jalur eksekusi TC & flow. Detail + aturan turunan di rule `14` §6B.

**Sebelum menambah TC / menjalankan flow**: `npm run tc:lint` (anti-duplikat) dan `npm run flow:preflight -- {flow-id}` (gate kelengkapan chain) wajib bersih.

## Playwright — dua mode (ringkas)

| Mode | Kapan | Repo app |
|------|-------|----------|
| **RUN** | TC punya spec + registry + POM lengkap | ❌ — cukup `olshoperp-docs` |
| **BUILD** | Automation baru / belum lengkap | ✅ setelah `shared/` + `pom-registry/` |

Detail: `15-playwright-multi-repo.mdc`.

## Repo sibling (Playwright BUILD / debug)

| Repo | Path | Peran |
|------|------|-------|
| `olshoperp-docs` | workspace ini | Requirement, TC, manifest |
| `olshoperp` | `../olshoperp` | Backend — API, validasi |
| `olshoperp-frontend` | `../olshoperp-frontend` | Frontend — UI, selector, `e2e/` |

Requirement & expected result tetap dari **`olshoperp-docs`**. Repo app untuk mode **BUILD** atau **debug FAIL** saja — lihat `15-playwright-multi-repo.mdc`.

## Layer doc per audience

| File | Untuk |
|------|-------|
| `knowledge-base.md` | Operator, support |
| `requirement.md` | PM, QA |
| `technical.md` | Developer |

**Maintenance owner:** QA — Yemima
