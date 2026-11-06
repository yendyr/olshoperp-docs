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

Combine A/B/D in **one** message when applicable. Case **C** = own message, **no** `reply_to`; link screening: `https://t.me/c/1931573603/{screening_msg_id}`.

### A — Done (PASS tinggi setelah deploy)

Header Done + list card yang digeser sampai Done + basis SHA/waktu deploy WIB. Ikuti spacing: header, blank, card blocks. Drop `[PREVIEW]`. Apply Bugsy label rule (lihat ledger/ops).

### B — QA Review · Ready to test

Cards stopped at QA Review + expandable blockquote daftar TC terkait bila ada.

### C — WARNING rework-deployed

REWORK tapi kode sudah ikut deploy; card di QA Review; link pesan screening REWORK.

### D — Menunggu repo lain

Card menyentuh FE+BE; baru satu sisi yang deploy.

> **Hermes:** salin verbatim dari Hazel `/workspace/server-update-telegram-templates.md` bila masih ada di VM; section di atas = kontrak semantik (A/B/C/D) jika file belum di-port.
