# Telegram templates (HTML, Assist)

Footer standby Cursor (opsional, bukan Hazel prod):  
`🤖 Sementara diganti agent Cursor (Hazel quota) — tanpa tombol. …`

---

## Screening — PASS tinggi (thread 6059)

```
✅ <b>PASS</b> · menunggu server update
cc @yendyrach

<a href="{jira_url}">{KEY}</a>
<b>{Summary}</b>

<b>Expected:</b>
• {poin 1}
• {poin 2 bila ada}

<b>Hasil:</b> sudah sesuai ✅
Card tetap di OTW DEV. Begitu server update untuk repo {backend|frontend|backend + frontend} selesai, card otomatis aku geser ke QA Review, lalu ke Done. Bukti ada di comment card.

<b>Konsistensi UI:</b> {Konsisten|— (tidak ada perubahan UI)}
• {catatan minor + menu acuan, bila ada}

👤 Card created by @{creator}
🛠 Dev by {Nama assignee} (@{dev_username})

📄 Docs: {up to date | diupdate v{x} | MISSING | gagal …}

<i>Basis: olshoperp@{sha7} · frontend@{sha7} · refresh {HH:MM WIB}</i>
cc @yemimatifani
```

## Screening — PASS sedang (thread 6059)

Sama, tapi:
- Header: `✅ <b>PASS</b> · Perlu cek QA`
- Tanpa `cc @yendyrach`, tanpa “menunggu server update”
- Hasil: `sudah sesuai dari cek kode ✅` + `Mohon QA cek lalu geser card, bukti ada di comment card.`

## Screening — REWORK / NEED MANUAL QA (thread 6059)

```
⚠️ <b>Screening OTW DEV — {REWORK|NEED MANUAL QA}</b> (notify-only)
<a href="{jira_url}">{KEY}</a> · {Summary}
Confidence: {tinggi|sedang|rendah}

<b>Sudah oke:</b>
• …

<b>Masih gap (kait AC):</b>
• …

<b>Dampak performa:</b> {Aman|Perlu perhatian|Risiko tinggi} — …
{Risiko tinggi: TC performa: <a href="{tc_url}">{TC_KEY}</a>}

<b>Konsistensi UI:</b> {Konsisten|Tidak konsisten|— (tidak ada perubahan UI)}
• …

<b>Potensi regresi:</b> {Aman|…}   <!-- bila Perlu dicek / Risiko tinggi: list per menu + @Jeiniiii @dapirdaa; TANPA tombol rgc -->

<b>Rekomendasi:</b> …

<b>Draft aksi (belum dijalankan):</b> {hanya REWORK}

📄 Docs: …

<blockquote expandable>Lampiran teknis: …
Performa: …</blockquote>
Basis: olshoperp@{sha7} · frontend@{sha7} · refresh {HH:MM WIB}
{mentions}
```

### Inline keyboard (REWORK only — Hermes prod)

```json
{
  "inline_keyboard": [[
    {"text": "🔁 Reopen", "callback_data": "rwk:{KEY}:go"},
    {"text": "🔄 Cek lagi", "callback_data": "rwk:{KEY}:re"}
  ]]
}
```

`rgc:` **disabled** sejak 2026-10-12 — jangan pasang.

### Mentions

- PASS tinggi: `@yendyrach` + creator + Dev + `@yemimatifani` (dedup)
- PASS sedang: creator + Dev + `@yemimatifani`
- REWORK: Dev (mapping) + `@yemimatifani`
- NEED MANUAL QA: `@dapirdaa @Jeiniiii` + `@yemimatifani`
- Tanpa mapping: `Dev belum di mapping` / `Creator belum di mapping` — jangan tebak

### Koreksi verdict (key+enteredAt sama)

`deleteMessage` lama → kirim baru → update `telegramMessageId`.

---

## Server Update (thread **46841**, NEVER 6059)

SoT format dari pesan Hazel produksi (contoh ETM-17110 Ready to test · ETM-17109 WARNING, 2026-11).  
`parse_mode=HTML`. Drop baris `[PREVIEW]`. Spasi: header → blank → card block(s) → blank antar section.  
Combine **A/B/D** dalam **satu** pesan per deploy (hanya section yang relevan). **C** selalu **pesan terpisah**, **tanpa** `reply_to` (screening di topic 6059; cross-topic reply gagal).

Link screening: `https://t.me/c/1931573603/{screening_msg_id}` (id dari reopen-flow ledger).

### Mention rules (Server Update — locked dari screenshot)

| Case | Footer mentions |
|---|---|
| **B Ready to test** / aman digeser QA Review | **Default tetap:** `@dapirdaa @Jeiniiii · cc @yemimatifani` |
| **C WARNING** rework-deployed | `@{dev}` (assignee Jira → mapping Telegram) + `@{reporter}` (reporter Jira → mapping) + **`cc @yendyrach`** (default). Dedup jika reporter = yemimatifani sudah di baris. |
| **A Done** | Ikuti pola B untuk QA mentions bila ada “Ready to deploy/Done” ke tim; Bugsy label rule bila ada. |
| Tanpa mapping Dev/reporter | Tulis nama display + `Dev belum di mapping` / `Reporter belum di mapping` — **jangan tebak** username. |

Dev di body card (baris 🛠) = assignee; **bukan** pengganti footer default B.

---

### B — QA Review · Ready to test (contoh ETM-17110)

`{SIDE}` = `BACKEND` | `FRONTEND` | `BACKEND + FRONTEND`.

```
🚀 <b>Server Update · {SIDE}</b> · {HH:MM} WIB

🧪 <b>Status: QA Review · Ready to test</b>

• <a href="{jira_url}">{KEY}</a> — <b>{Summary}</b>
  Hasil OTW DEV: PASS (confidence {sedang|tinggi}) · {backend|frontend}@{sha7}
  Screening: <a href="https://t.me/c/1931573603/{screening_msg_id}">msg {screening_msg_id}</a> (topic 6059)
  🛠 Dev: {Nama assignee} (@{dev_username})

  <b>Yang perlu diuji:</b>
  • {poin uji 1 dari Expected / AC — bahasa operasional}
  • {poin uji 2}
  • {poin uji 3 bila ada}

  <b>Test Case ({n}):</b>
<blockquote expandable>• <a href="{tc_url}">{TC1}</a> — {summary TC1}
• <a href="{tc_url}">{TC2}</a> — {summary TC2}
…</blockquote>

@dapirdaa @Jeiniiii · cc @yemimatifani
```

- Satu card = satu blok `• KEY — …` (boleh beberapa card dalam pesan yang sama setelah header Status).
- `Test Case (n):` hanya jika ada TC Relates / QA Test Case; kalau 0 → omit section (jangan tulis kosong).
- Blockquote expandable untuk daftar TC (HTML Telegram).
- Footer **selalu** tiga mention default di atas (bukan Dev).

---

### C — WARNING rework-deployed (contoh ETM-17109)

Pesan **sendiri** (jangan digabung A/B/D).

```
⚠️ <b>WARNING: Card yg potensi RE-OPEN lolos ke production</b>

• <a href="{jira_url}">{KEY}</a> · <b>{Summary}</b>
Screening OTW DEV ({HH:MM} WIB, <a href="https://t.me/c/1931573603/{screening_msg_id}">msg {screening_msg_id}</a>) menyatakan <b>REWORK</b>, tapi commit {backend|frontend}@{sha7} sudah masuk Staging &amp; Production/Tyas.

<b>Gap yang masih ada:</b>
• {gap 1 kait AC}
• {gap 2}

<b>Risiko di Production:</b> {1–2 kalimat dampak bisnis/data}

<b>Tindakan:</b> Dev perbaiki segera atau rollback · card ditahan di QA Review

@{dev_username} @{reporter_username} cc @yendyrach
```

- `{dev_username}` ← `assignee.accountId` via `telegram-jira-mapping.json`
- `{reporter_username}` ← `reporter.accountId` via mapping
- `cc @yendyrach` **wajib** (default WARNING)

---

### A — Done (PASS tinggi setelah deploy)

```
🚀 <b>Server Update · {SIDE}</b> · {HH:MM} WIB

✅ <b>Status: Done</b>

• <a href="{jira_url}">{KEY}</a> — <b>{Summary}</b>
  Hasil OTW DEV: PASS (confidence tinggi) · {backend|frontend}@{sha7}
  Screening: <a href="https://t.me/c/1931573603/{screening_msg_id}">msg {screening_msg_id}</a> (topic 6059)
  🛠 Dev: {Nama} (@{dev_username})

@dapirdaa @Jeiniiii · cc @yemimatifani
```

(Sesuaikan bila ada aturan Bugsy label — jangan sebut label teknis ke pembaca bila rule melarang.)

---

### D — Menunggu repo lain

```
🚀 <b>Server Update · {SIDE_YANG_BARU}</b> · {HH:MM} WIB

⏳ <b>Status: Menunggu repo lain</b>

• <a href="{jira_url}">{KEY}</a> — <b>{Summary}</b>
  Sudah masuk tip/deploy: {frontend|backend}@{sha7}
  Masih menunggu: {backend|frontend}
  Card tetap <b>OTW DEV</b> sampai kedua repo ready.

@dapirdaa @Jeiniiii · cc @yemimatifani
```
