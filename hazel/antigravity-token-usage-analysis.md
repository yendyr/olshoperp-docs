---
title: Antigravity — analisa token usage (on-point)
audience: qa-lead / agent
status: active
version: 1.0
last_updated: 2026-09-28
owner: QA - Yemima
related:
  - .cursor/rules/26-agent-mandatory-charter.mdc § A.1–A.6
  - hazel/antigravity-session-hygiene.md
---

# Analisa token usage Antigravity — wajib on-point

Pakai playbook ini setiap kali user minta **analisa token / usage / pemborosan sesi** Antigravity (file log lokal atau laporan markdown).

Tujuan: bandingkan pemakaian dengan **rem charter A.1–A.6**, bukan esai umum.

---

## 1. Data yang WAJIB diminta (kalau belum dilampirkan)

Agent **STOP & minta** item di bawah sebelum menyimpulkan “sudah hemat / masih boros”. Minimal **blok A**; **blok B** sangat disarankan untuk banding sebelum/sesudah rules.

### Blok A — wajib (satu analisa)

| # | Data | Contoh / path tipikal |
|---|------|------------------------|
| 1 | **Conversation ID** (atau judul chat + workspace) | `0cf2354d-55cd-444a-a02b-bddf08b3dad6` |
| 2 | **File log transcript** | `~/.gemini/antigravity-ide/brain/{id}/.system_generated/logs/transcript_full.jsonl` **atau** export/laporan `.md` hasil audit |
| 3 | **Rentang waktu** sesi yang dianalisis | mis. 28–30 Sep 2026 |
| 4 | **Apakah sesi ini dibuat SETELAH** sync rules hygiene (`main` berisi A.1–A.6)? | ya / tidak / tidak tahu |
| 5 | **Workspace** yang dipakai | path folder (docs only vs 3-repo) |

### Blok B — untuk banding “sebelum vs sesudah” (sangat disarankan)

| # | Data | Kenapa |
|---|------|--------|
| 6 | Laporan analisa **baseline** sebelumnya (kalau ada) | Banding % VIEW_FILE / RUN_COMMAND / tool calls |
| 7 | **2–3 conversation ID** sesi *baru* (bukan mega-session lama) | Rem hanya terukur di chat baru |
| 8 | Catatan: apakah user pernah diingatkan **chat baru / file list / stop-tanya**? | Cek kepatuhan A.1/A.2/A.6 |

### Blok C — opsional tapi berguna

| # | Data |
|---|------|
| 9 | Screenshot / list Top heaviest turns (kalau tool hitung sudah jalan) |
| 10 | Apakah ada paste list SO/SKU besar di chat (ya/tidak + perkiraan jumlah) |

Kalau hanya dapat “rasanya lemot” tanpa file log → **tolak spekulasi**; minta Blok A dulu.

---

## 2. Metrik wajib di laporan (kuantitatif)

Jangan hanya narasi. Selalu isi tabel:

### 2.1 Ukuran sesi

| Metrik | Nilai |
|--------|------:|
| User turns | |
| Total steps | |
| Estimasi token konten unik (jika bisa dihitung) | |
| Catatan compaction / checkpoint (berapa×) | |

### 2.2 Breakdown tool (minimal)

| Tool / jenis | Count | Estimasi token / chars | % |
|--------------|------:|------------------------:|--:|
| VIEW_FILE (atau setara) | | | |
| RUN_COMMAND / DB / shell | | | |
| GREP_SEARCH | | | |
| Model responses | | | |
| User input | | | |

### 2.3 Top turns terberat

Minimal **5** turn terberat: nomor turn, topik singkat, **jumlah tool calls**, estimasi token/chars.

### 2.4 Checklist kepatuhan rem (inti on-point)

Untuk sesi yang diklaim “setelah rules”, nilai tiap baris: **PATUH / LANGGAR / TIDAK TERLIHAT** + 1 bukti singkat.

| Rem | Cek di log |
|-----|------------|
| **A.1** Chat baru / anti mega-session | 1 conversation multi-hari multi-topik? |
| **A.2** List besar via file | Ada paste ≥ ~20 kode di USER_INPUT? |
| **A.3** Baca kode sempit | VIEW_FILE berulang file ribuan baris / slice lebar? |
| **A.4** Triage kabur | Langsung DB/log tanpa menu/kode? |
| **A.5** No script sampah | Ada create `.mjs/.sh` sekali pakai di repo? |
| **A.6** Stop ~15 langkah | Ada turn dengan **≥ 40** tool calls? (≥ 70 = parah) |
| **Anti-dump** | RUN_COMMAND / response menempel JSON/list ratusan baris? |

### 2.5 Verdict (wajib satu label)

| Verdict | Arti |
|---------|------|
| **HEMAT_CUKUP** | Rem diikuti; tidak ada turn ekstrem; tidak mega-session |
| **CAMPUR** | Ada perbaikan vs baseline, masih ada pelanggaran jelas |
| **MASIH_BOROS** | Pola lama (mega-session / dump / 50+ tools/turn) masih dominan |
| **DATA_KURANG** | Blok A tidak lengkap — jangan claim hemat |

Sertakan **1–3 rekomendasi tindakan** ke Lead QA (bahasa non-teknis ke tim kalau diminta forward).

---

## 3. Cara kerja agent (urutan)

1. Cek kelengkapan Blok A → kalau kurang, minta (template §4).
2. Hitung / ekstrak metrik §2 dari log atau laporan yang dilampirkan.
3. Isi checklist rem A.1–A.6 + anti-dump.
4. Verdict + banding baseline (jika Blok B ada).
5. **Jangan** usulkan rewrite besar rules kecuali ada pelanggaran berulang yang belum tertutup rem.

Hemat token saat menganalisa: jangan `VIEW_FILE` seluruh `transcript_full.jsonl` utuh berkali-kali — pakai script ringkas / sampling turn terberat; stdout analisa = **rekap**, detail ke `scratch/` bila perlu.

---

## 4. Template minta data ke user (copy)

```
Untuk analisa token yang on-point, tolong kirim:

1. Conversation ID (atau export/laporan .md-nya)
2. Path file transcript_full.jsonl (atau lampirkan hasil audit)
3. Rentang tanggal sesi
4. Apakah chat ini dibuat setelah sync rules hygiene (A.1–A.6)? ya/tidak
5. Workspace path yang dipakai

Opsional tapi penting untuk banding:
6. Laporan analisa sebelumnya (baseline)
7. 2–3 conversation ID chat BARU (bukan thread lama multi-hari)
```

---

## 5. Relasi file

| File | Peran |
|------|--------|
| Charter § A.1–A.6 | Rem perilaku saat **pakai** agent |
| Playbook ini | Rem saat **minta analisa usage** |
| `hazel/antigravity-session-hygiene.md` | SOP singkat untuk tim |
