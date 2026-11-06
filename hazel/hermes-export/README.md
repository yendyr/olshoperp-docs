# Hazel → Hermes export (OTW DEV + Server Update + Callback)

Paket siap-port ke **Hermes** untuk mengganti / mirror bot Hazel (quota).  
Diekstrak dari skill/routine Hazel (locked policies Sep–Nov 2026) + SoT di repo ini.

| Folder / file | Peran |
|---|---|
| [`skills/olshoperp-otw-dev-screening/SKILL.md`](./skills/olshoperp-otw-dev-screening/SKILL.md) | Webhook INTO **OTW DEV** → screen AC vs kode + TC auto (Improvement) + Telegram 6059 |
| [`skills/olshoperp-telegram-callback/SKILL.md`](./skills/olshoperp-telegram-callback/SKILL.md) | Inline button `rwk:` / legacy / `rgc:` disabled |
| [`skills/olshoperp-server-update/SKILL.md`](./skills/olshoperp-server-update/SKILL.md) | Deploy FINISHED (atau Mode A tip≈deploy) → geser OTW DEV → QA Review → Done |
| [`reference/ids-ledgers.md`](./reference/ids-ledgers.md) | cloudId, field IDs, transition IDs, chat/thread, ledger paths |
| [`reference/telegram-templates.md`](./reference/telegram-templates.md) | Template HTML screening + server update A/B/C/D |
| [`reference/flow-map.md`](./reference/flow-map.md) | Diagram end-to-end |
| [`../qa-review-ac-code-screening.md`](../qa-review-ac-code-screening.md) | Playbook Define≠Enforce≠Message (SoT screening) |

## Trigger map (n8n → Hermes)

| Event | Body / sinyal | Skill |
|---|---|---|
| Status → **OTW DEV** | `{ "key", "event": "qa-review" }` (nama historis) | `otw-dev-screening` |
| Telegram callback | `callback_query` | `telegram-callback` |
| Mention Assist / deploy text | `FRONTEND/BACKEND … Update FINISHED` | `server-update` |

## Runtime paths (Hazel VM → remap di Hermes)

| Hazel | Remap |
|---|---|
| `/workspace/reopen-flow-ledger.json` | ledger screening + callbacks |
| `/workspace/server-update-ledger.json` | ledger deploy |
| `/workspace/telegram-jira-mapping.json` | accountId ↔ @telegram |
| `/workspace/hazel-tc-assignee-rotation.json` | Jein ↔ Firda |
| `/workspace/server-update-telegram-templates.md` | mirror di `reference/telegram-templates.md` § Server Update |
| `TELEGRAM_OERP_ASSIST_BOT_TOKEN` | secret — never log |

## Site Jira (wajib)

- Host: `erpintegration.atlassian.net`
- `cloudId`: `44cc9820-3372-4c12-884c-698b1397173c`
- Project: **ETM** only

## Catatan port Hermes

1. Hard gate INTO OTW DEV + race-safe claim (flock) wajib — cegah false trigger & double Telegram.
2. PASS **tidak** transition; Server Update (atau Mode A) yang geser.
3. REWORK: notify-only + tombol; aksi Jira hanya lewat callback `:go`.
4. Cursor standby (sementara) = **tanpa tombol**; Hermes production = **dengan tombol** seperti skill asli.
5. SoT format card / Request ID: `olshoperp-docs` `.cursor/rules/12-jira-card-format.mdc` (bukan twin AI yang tertinggal).
6. Auto-TC matrix: skill `olshoperp-testcase-authoring` di repo docs.
7. **Server Update Telegram** (thread 46841): ikuti template screenshot di `reference/telegram-templates.md` — Ready to test footer `@dapirdaa @Jeiniiii · cc @yemimatifani`; WARNING footer Dev+reporter + `cc @yendyrach`.
