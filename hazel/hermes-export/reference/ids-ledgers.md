# IDs, fields, ledgers

## Atlassian / ETM

| Item | Value |
|---|---|
| Site | `https://erpintegration.atlassian.net` |
| cloudId | `44cc9820-3372-4c12-884c-698b1397173c` |
| Error (bug) | issuetype `10033` |
| Improvement | `10088` |
| Change Requirement | `10048` |
| Test Case | `10051` |
| Status OTW DEV | name `OTW DEV` (id tipikal `10047`) |
| Status QA Review | `10010` |
| Status RE-OPEN | status `4`, transition `10` (alt `71`) |
| QA Review → Done | transition `291` |
| OTW DEV → QA Review | transition `341` (verify via GET transitions if fail) |

## Custom fields

| Field | ID |
|---|---|
| Menu Name | `customfield_10429` |
| Request ID | `customfield_10495` — sah: Lark `rec…` **atau** `none`; **bukan** `REQ-…` / `-` / kosong |
| Story Points | `customfield_10043` |
| Actual Result (TC) | `customfield_10203` |
| Test Result | `customfield_10202` |
| Tested By Dev / Staging | `10077` / `10078` |
| Test Execute By | `10201` |
| Env | `10231` |

**Setelah create:** GET fields di atas + labels + assignee; Request ID invalid → PUT sekali.

## Telegram

| Item | Value |
|---|---|
| Bot | `@OERPAssistBot` |
| Env secret | `TELEGRAM_OERP_ASSIST_BOT_TOKEN` |
| chat_id | `-1001931573603` |
| Screening / callback thread | `6059` |
| Server Update thread | `46841` |
| parse_mode | `HTML` |

## Ledgers (Hazel paths — remap di Hermes)

| File | Isi |
|---|---|
| `reopen-flow-ledger.json` | `screening` / `notified` / `skipped` / `callbacks` / `history`; flock LOCK_EX |
| `server-update-ledger.json` | `deploys[]`, per-card move status |
| `telegram-jira-mapping.json` | `byAccountId` → `@username`; Dev map 6-dev |
| `hazel-tc-assignee-rotation.json` | Jeiniffer ↔ Firda |

### Dedupe keys

- Screening: `issueKey` + `enteredAt` (timestamp changelog INTO OTW DEV)
- Callback: `issueKey` + `callback_query.id`
- Deploy message: Telegram `message_id` or `repo+date`

### notified (PASS tinggi) fields

`verdict`, `confidence`, `telegramMessageId`, `jiraCommentId`, `transition: none`, `passHigh: true`, `awaitingDeploy: true`, `repos[]`, `perfRisk`, `uiConsistency`, `regressionRisk`, `regressionMenus`, `docs`, `basis` sha7
