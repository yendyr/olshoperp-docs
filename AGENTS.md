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

1. Baca `.cursor/rules/` (alwaysApply)
2. Baca **`qa-docs/_meta/manifest.yaml`** — 121 menu, source of truth
3. Triage pertanyaan → `08-question-triage.mdc`
4. Buka `qa-docs/{menu-slug}/README.md` → layer doc sesuai audience

**Peta lengkap struktur:** `.cursor/rules/04-qa-docs-index.mdc`

## Staging app

https://staging.olshoperp.com

## Skill

**Abaikan** skill yang direferensikan di file `qa-docs/`. Hanya ikuti skill dari tuning diskusi ini atau request khusus user.

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
| `12-jira-card-format.mdc` | Format Bug / Improvement / Change Requirement + trigger word |
| `13-test-case-format.mdc` | Standar `TC-*.md`, DRAFT naming, `#renumber-tc` (semua menu), expected dari requirement |
| `14-playwright-e2e.mdc` | Eksekusi Playwright — fidelity TC, run scope, auth, POM |
| `15-playwright-multi-repo.mdc` | BUILD vs RUN: docs-only re-test jika TC automation lengkap; FE/BE hanya BUILD/debug |

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
