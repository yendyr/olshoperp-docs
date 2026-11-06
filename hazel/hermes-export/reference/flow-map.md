# Flow map — Hazel OTW DEV end-to-end

```
Jira: status → OTW DEV
        │
        ▼
n8n POST { key, event: "qa-review" }
        │
        ▼
┌───────────────────────────────┐
│  otw-dev-screening            │
│  hard gate + claim ledger      │
│  AC vs tip dev (diff)         │
│  perf + UI + regresi + docs   │
│  Improvement → create TC(s)   │
│  comment Jira + Telegram 6059 │
│  PASS: tetap OTW DEV          │
│  REWORK: tombol rwk:go / :re  │
└───────────────┬───────────────┘
                │
     ┌──────────┴──────────┐
     │                     │
 PASS awaitingDeploy    REWORK callback
     │                     │
     ▼                     ▼
 server-update          telegram-callback
 (FINISHED / Mode A)      :go → reopen (rule 22)
     │                    :re → delta screen
     ▼
 OTW DEV → QA Review
 PASS tinggi → Done
 PASS sedang → stop QA Review
 REWORK deployed → WARNING 46841
```

## Threads Telegram

| Thread | ID | Isi |
|---|---|---|
| QA / screening / callback | `6059` | PASS/REWORK/NEED MANUAL QA, tombol rwk |
| Server Update | `46841` | A Done / B Ready to test / C WARNING / D waiting repo |
| TC Screening (modul lain) | `51623` | Expected≠Actual — **bukan** paket ini |

Chat: `-1001931573603` · bot `@OERPAssistBot`
