---
name: olshoperp-telegram-callback
description: >-
  Handle @OERPAssistBot inline-button callbacks (rwk reopen / cek lagi, legacy
  bukan-gap, rgc disabled) for OlshopERP ETM OTW DEV screening. Source of truth
  for reopen actions is olshoperp-otw-dev-screening + rule 22. Never print bot token.
---

# Telegram Callback (Regression + Rework)

Payload n8n: `callback_query` (`data`, `id`, `from`, `message`).

## Wajib dulu

1. `answerCallbackQuery` (abaikan error “query too old”).
2. Semua output Telegram: chat `-1001931573603`, thread **6059**, **reply** ke pesan screening yang diklik.
3. Diam di chat agent kecuali gagal / butuh keputusan manusia (Rachy) — di Telegram jangan sebut nama manusia sebagai “yang sedang cek” bila callback terpotong (pakai “Hazel sedang cek…”).

Baca dulu skill `olshoperp-otw-dev-screening` (SoT aksi reopen & delta screen).

## Branches `callback_query.data`

### `rwk:<KEY>:go` — 🔁 Reopen

1. Flock claim `key` + `callback_query.id` di ledger; sudah diproses → stop.
2. Latest ledger verdict untuk KEY harus **REWORK** dan state card memungkinkan.
3. Jalankan reopen (**rule 22**, locked 2026-10-29):
   - **Error:** clone `RE-OPEN [Menu] - …` + origin → RE-OPEN (`10`); copy Request ID/Menu/SP/labels/assignee (Request ID HARD); clear field tes di clone.
   - **Improvement / CR / Story / Task:** create **Error** baru + **Relates** ke origin + origin → RE-OPEN (**tanpa** clone). Copy Menu + Request ID sah; assignee = origin Dev.
4. Verify fields setelah create.
5. Telegram reply: mention Dev + `@yemimatifani`.
6. Ledger: callback `done` + catat keys baru — **klik ulang tidak create card kedua**.

### `rwk:<KEY>:re` — 🔄 Cek lagi (delta, 2026-10-20)

1. answerCallback + flock claim.
2. Tip `dev` FE+BE (+ PR open) vs basis ledger terakhir.
3. Sama → reply “Belum ada commit baru sejak screening terakhir”.
4. Beda → **delta** (lewati gate INTO OTW DEV; **no transition**):
   - Diff basis lama → baru saja.
   - Tiap gap REWORK lama: ✅/❌ + bukti file/baris.
   - UI / perf / regresi hanya file/menu tersentuh; full bila modul baru atau diff besar (>~15 file).
   - DB hanya jika gap soal data.
5. Comment Jira baru: header `Screening Ulang (Cek lagi)` — jangan edit komentar manusia.
6. Telegram pendek (reply screening): verdict, basis lama→baru, 1 baris per gap, temuan baru, mentions. REWORK baru → tombol `rwk:go` + `rwk:re` baru.
7. Update ledger + `history`.

### `rwk:<KEY>:no` — ✋ Bukan gap (legacy)

Catat not-a-gap di ledger; reply singkat; **no** Jira transition.

### `rgc:…` — disabled sejak 2026-10-12

Reply “tombol tidak aktif”; no other action.

## Callback terpotong (data hilang)

1. **Jangan** aksi Jira.
2. Ledger `callbacks` status `blocked`.
3. Reply: tombol belum bisa diproses; belum ada aksi Jira; bot sedang cek (jangan sebut nama manusia di Telegram).
4. Manual fix atas perintah Lead: deleteMessage blocked → reply hasil normal → `status: done` + `resolution: manual`.

## Env

`TELEGRAM_OERP_ASSIST_BOT_TOKEN` — never print.
