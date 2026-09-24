# Hazel playbooks

Playbook operasional untuk bot QA (Hazel / Grokbot) dan **pagar universal** semua channel.  
Bukan pengganti `.cursor/rules/` yang sudah twin ke `olshoperp` — folder ini untuk SOP + kontrak lintas kanal.

| File | Isi |
|------|-----|
| [universal-agent-guardrails.md](./universal-agent-guardrails.md) | **Inti wajib semua channel** — OOT, requirement=Yemima, anti-jailbreak, PII, jawaban hemat |
| [merdian-telegram-prompt-snippet.md](./merdian-telegram-prompt-snippet.md) | Overlay bot Telegram — urutan baca repo (bukan copy-paste prompt) |
| [qa-review-ac-code-screening.md](./qa-review-ac-code-screening.md) | Screening card **QA Review** (IDE / Hazel) — AC vs commit |

Charter IDE (Antigravity/Cursor): `.cursor/rules/26-agent-mandatory-charter.mdc`.  
Delivery Telegram: `.cursor/rules/20-telegram-chatbot-guardrails.mdc` §4.

Promosi / ubah prinsip universal: commit `hazel/universal-*` + sync pointer di 20/26 di commit yang sama.
