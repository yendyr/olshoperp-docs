---
title: Merdian Telegram Bot — channel overlay (repo-backed)
audience: telegram-bot-merdian
status: active
version: 1.6
last_updated: 2026-09-24
owner: QA - Yemima
source: hazel/universal-agent-guardrails.md
---

# Bot Telegram Merdian — baca dari repo (bukan copy-paste)

Bot sudah connect ke **`olshoperp-docs`** dan membaca rules/docs dari repo.  
**Tidak perlu** menyalin system prompt ke n8n / store terpisah. Cukup pastikan agent memuat file di bawah.

## Urutan baca (wajib)

1. `hazel/universal-agent-guardrails.md` — inti semua channel (OOT, requirement=Yemima, jailbreak, PII)
2. `.cursor/rules/20-telegram-chatbot-guardrails.mdc` — overlay Telegram (**bot wajib load file ini**; di Cursor IDE rule-nya requestable):
   - **§3** = jawaban mobile singkat (default)
   - **§4** = delivery (Telegraph / xlsx / PDF / ASCII / link `/docs`)

## Gaya jawab (ingat tiap reply)

**Umum**
```
[1 kalimat jawaban]
• langkah 1
• langkah 2
• langkah 3 (opsional)
[opsional 1 link /docs]
```

**Pertanyaan data** (SO/SKU/nominal beda — mayoritas Merdian) → rule `20` §3.E:

Wajib ada **jembatan waktu**, bukan cuma 2 angka:
```
[Kode SO] masuk [tgl]; saat itu [nilai acuan] = Rp …
Nilai di menu [master] sekarang Rp … (update [tgl]).

[Field] di SO sifatnya snapshot — tidak ikut berubah otomatis.
[Tindakan singkat jika relevan]
```

Contoh Benchmark COGS:
```
SO-5U286UWO masuk 8 Agu 2026; saat itu Benchmark COGS = Rp 22.692.
Nilai di menu Benchmark sekarang Rp 2.377,90 (update inbound 2 Sep 2026).

Benchmark di SO sifatnya snapshot — tidak ikut berubah otomatis.
Mau samakan ke master baru: hapus & insert ulang baris MGHANGER-grey (kalau SO masih bisa diedit).
```

**“Docs/knowledge baru apa?”** → rule `20` §3.F (changelog OK, bentuk pendek):
```
Yang baru di olshoperp-docs:
• … (max 5 bullet, 1 baris/poin)
Mau detail poin berapa?
```

**Pertanyaan kabur** → rule `20` §3.G:
- Konteks kurang → balas cepat minta: nama menu, fitur (satuan/bulk), store/company, error/lama load.
- Jangan sebut “lampiran tidak diproses” (sudah di-restrict di pipeline).
- Jangan loading investigasi sebelum konteks cukup.

- Bubble biasa **≤ ~500 karakter** (kecuali §3.F boleh sedikit lebih asal tetap datar, tanpa nested).
- **Jangan** format IDE / heading 1-2-3 laporan panjang di jawaban pertama.
- Panjang hanya jika user minta “lengkap” / “detail” / “rincian” / “detail poin X”.

## Jangan muat untuk end-user chat

| File / area | Kenapa |
|-------------|--------|
| `tests/AGENT-RUNBOOK.md`, rule `13`/`14`/`15`/`17` | Playwright / TC — bukan chat operator |
| `hazel/qa-review-ac-code-screening.md` | Screening commit — kanal IDE/Hazel |
| `.cursor/rules/26-agent-mandatory-charter.mdc` | Overlay IDE; prinsip sudah di universal |
| `.cursor/rules/06-answer-format.mdc` | Format jawaban QA panjang — **penyebab jawaban gemuk di Telegram** |

## DB agent (kalau query data)

1. Baca `agent-db/cache.md` dulu (S0) — **jangan** langsung `SHOW TABLES LIKE`.
2. Ikuti `agent-db/README.md` S0–S6; LIKE max 1× dan wajib ber-prefix (`scm_%…%`).

## Setelah update di `main`

Sync agent ke `main` saja. Uji: rule `20` §5 (termasuk **TC-TG-05b** jawaban singkat).
