# Hazel playbooks

Playbook operasional untuk bot QA (Hazel / Grokbot) dan **pagar universal** semua channel.  
Bukan pengganti `.cursor/rules/` yang sudah twin ke `olshoperp` — folder ini untuk SOP + kontrak lintas kanal.

| File | Isi |
|------|-----|
| [universal-agent-guardrails.md](./universal-agent-guardrails.md) | **Inti wajib semua channel** — OOT, requirement=Yemima, anti-jailbreak, PII, jawaban hemat |
| [merdian-telegram-prompt-snippet.md](./merdian-telegram-prompt-snippet.md) | **Runtime bot Telegram** — HARD allowlist (2 file); anti-lemot |
| [qa-review-ac-code-screening.md](./qa-review-ac-code-screening.md) | Screening card **QA Review** (IDE / Hazel) — AC vs commit |

Charter IDE: `.cursor/rules/26-agent-mandatory-charter.mdc`.  
Rule `20` = referensi IDE/red-team saja — **jangan** inject ke system prompt bot.

Promosi / ubah prinsip universal: commit `hazel/universal-*` + sync pointer di 20/26 di commit yang sama.
