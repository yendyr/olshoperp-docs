# Docs Screening Routine (non–Test Case)

Operational playbook for agent + Telegram topic `30246` (`https://t.me/c/1931573603/30246`).

## Triggers

| When | What |
|------|------|
| Cursor session start (PC on) | Run one screening putaran |
| Every 1 hour while session hidup | Screening putaran (card → docs → Telegram #1/#2) |
| Daily **08:00 WIB** (once) | Reminder docs + Lingo only (#3) — **not** every hourly tick |

## Card filter (Jira ETM)

- Site: `erpintegration.atlassian.net` / cloudId `44cc9820-3372-4c12-884c-698b1397173c`
- `issuetype != "Test Case"`
- `status IN ("To Do", Done)` only
- Window: `updated` since last successful putaran (state file) → now

## Docs rules

| Card status | Docs label |
|-------------|------------|
| To Do | Update from card; mark **TO-BE** if kode belum ada |
| Done | Update to **AS-IS** from card + codebase |

- SoT: `olshoperp/docs/qa-docs/` → mirror `olshoperp-docs/qa-docs/` → commit & push both
- Commit tag when agent writes layers: include `[yemimadocs]` if Hazel path; Yemima-approved chat “OK eksekusi” counts for this routine
- While Yemima has not replied on a GAP thread: still update docs from card + code (TO-BE ok)

## Telegram formats

Chat: `-1001931573603` · thread: `30246` · mention: `@yemimatifani`

### 1 — Update Docs Summary (setiap screening)

```
📚 Update Docs Summary
Versi putaran: {YYYY-MM-DD HH:MM} WIB
Periode card: {from} → {to}

✅ Sudah update & push
• …

🪞 Mirror: olshoperp → olshoperp-docs · commit {sha7}

⏭️ Tidak perlu ubah docs
• …

@yemimatifani ringkas saja — kalau ada yang keliru arah, balas di thread ini.
```

Zero update: `✅ Tidak ada docs yang perlu diubah di putaran ini.`

### 2 — Need overview (hanya bila GAP / approval / analisa)

```
⚠️ Docs screening - need overview @yemimatifani

Card: {ETM-xxxxx} · {judul}
Status: {To Do|Done} · Tipe: {Error|Improvement|CR}

Yang saya temukan
• …

Dampak ke docs
• …

Opsi yang perlu kamu pilih
1. …
2. …

Sementara
• Docs tetap diisi dari card + kode (kode belum ada → TO-BE).
• Setelah kamu balas, dirapikan lagi.
```

### 3 — Reminder docs need update (08:00 saja, maks 10 menu + 10 Lingo)

```
📚 Reminder docs need update

Menu prioritas (maks 10)
1. {Menu} (`{slug}`) — kurang: {layer} · {kenapa}
   · Overview: {konten sudah cukup / masih tipis} · Status docs: {draft|pending|review stuck} · Relasi belum dibahas: {…|—}
…

Lingo / Feature Map (maks 10)
1. {SF-xx} — {menu} · gap: {stub/kosong/outdated}
   · Overview: … · Relasi belum dibahas: …
…

@yemimatifani usulan saja — boleh ubah urutan / skip.
```

## State

Agent store: `docs-screening/state.json`

```json
{
  "last_screening_to": "ISO8601",
  "last_reminder_date": "YYYY-MM-DD",
  "last_summary_message_id": null
}
```

## Loop / hook

- User hook `sessionStart` → inject reminder to run this playbook
- Hourly local loop while IDE session active
- Reminder #3 only when local WIB hour is 8 and `last_reminder_date` ≠ today
