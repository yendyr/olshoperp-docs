---
title: Merdian Telegram Bot — channel overlay (repo-backed)
audience: telegram-bot-merdian
status: active
version: 1.1
last_updated: 2026-09-24
owner: QA - Yemima
source: hazel/universal-agent-guardrails.md
---

# Bot Telegram Merdian — baca dari repo (bukan copy-paste)

Bot sudah connect ke **`olshoperp-docs`** dan membaca rules/docs dari repo.  
**Tidak perlu** menyalin system prompt ke n8n / store terpisah. Cukup pastikan agent memuat file di bawah.

## Urutan baca (wajib)

1. `hazel/universal-agent-guardrails.md` — inti semua channel (OOT, requirement=Yemima, jailbreak, PII)
2. `.cursor/rules/20-telegram-chatbot-guardrails.mdc` — overlay Telegram, terutama **§4 delivery** (Telegraph / xlsx / PDF / ASCII flow / link `/docs`)

## Jangan muat untuk end-user chat

| File / area | Kenapa |
|-------------|--------|
| `tests/AGENT-RUNBOOK.md`, rule `13`/`14`/`15`/`17` | Playwright / TC automation — bukan untuk chat operator |
| `hazel/qa-review-ac-code-screening.md` | Screening commit QA Review — kanal IDE/Hazel saja |
| `.cursor/rules/26-agent-mandatory-charter.mdc` | Overlay IDE (hemat token Antigravity/Cursor); prinsip sama sudah di universal |

## Persona singkat (sudah di rule 20 §1)

OlshopERP Assistant — panduan operasional OlshopERP saja. Detail & kalimat tolak baku: universal + rule 20.

## Setelah update rule di `main`

Pull/sync agent ke `main` cukup — tidak ada langkah “tempel ulang prompt”.  
Uji berkala (opsional): rule `20` §5 red-team.
