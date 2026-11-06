---
name: olshoperp-server-update
description: >-
  Move ETM cards from OTW DEV to QA Review (and Done for PASS tinggi) after
  deploy. Triggered by FRONTEND/BACKEND Server Update FINISHED (Telegram/n8n)
  or Hermes Mode A (tip origin/dev advance ≈ deploy). No screening — Reopen Flow
  already screened. Notify thread 46841 only.
---

# Server Update → OTW DEV to QA Review

**No screening.** Screening sudah di OTW DEV (`olshoperp-otw-dev-screening`).

## Triggers

### Production (Hazel)

n8n when `@OERPAssistBot` mentioned (or deploy system). Act only if text contains:

| Text | Repo |
|---|---|
| `FRONTEND Server (Staging & Production/Tyas) Update FINISHED` | `yendyr/olshoperp-frontend` |
| `BACKEND Server (Staging & Production/Tyas) Update FINISHED` | `yendyr/olshoperp` |

Other mentions → ledger `ignored`, quiet stop.

### Hermes Mode A (standby / tip≈deploy)

Setiap poll: `git fetch` tip `origin/dev` FE+BE. Jika tip SHA berubah vs `lastTips` di ledger → treat sebagai deploy sisi itu (catat di `deploys` seperti FINISHED), lalu jalankan langkah yang sama. Watermark `lastTips` setelah proses.

## Steps

1. Record deploy in `server-update-ledger.json` (repo, time, estimated `devTip`, message id). Dedupe message id / repo+date + flock.
2. Find all ETM issues status **OTW DEV**.
3. Per card: repos touched = PRs/commits on `dev` referencing key; prefer Reopen Flow ledger basis/`repos`. Unreadable → `pending-access`.
4. **Ready** = every touched repo has a recorded deploy whose `devTip` contains the card’s latest commit there (`compare commit...devTip` behind 0). Both repos → wait both. No commits → stay OTW DEV (ledger only, no Telegram).
5. Ready → transition **OTW DEV → QA Review** (`341`) + short Jira comment (repos, SHAs, deploy time WIB). Never overwrite human content.
6. Latest Reopen Flow verdict:
   - **PASS tinggi** → QA Review → **Done** (`291`)
   - Other PASS / NEED MANUAL QA → stop at QA Review
   - **REWORK** but code deployed → `rework-deployed` (stay QA Review + WARNING C)
7. Per-card ledger statuses: `moved-qa-review` | `moved-done` | `rework-deployed` | `waiting-other-repo` | `no-commits` | `pending-access`

## Telegram

- Bot Assist, HTML, chat `-1001931573603`, thread **`46841` only** (never 6059, never deploy-message thread).
- Templates: `../../reference/telegram-templates.md` § Server Update (A/B/C/D). Exact spacing; drop `[PREVIEW]`; Bugsy label rule.
- Combine A/B/D for one deploy into **one** message (only sections that apply).
- **C** always own message, **without** `reply_to`; link screening REWORK: `https://t.me/c/1931573603/{screening_msg_id}` from reopen-flow ledger.
- Nothing moved and nothing waiting → **send nothing**.

## Agent chat output

Only blockers (repo access, Jira errors) and any `rework-deployed` card. Otherwise quiet.

## Never

- Re-screen AC
- Print bot token
- Post server-update notifs to thread 6059
