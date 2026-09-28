---
title: Antigravity / Cursor — session hygiene (token)
audience: qa-team
status: active
version: 1.1
last_updated: 2026-09-28
owner: QA - Yemima
source: .cursor/rules/26-agent-mandatory-charter.mdc § A.1–A.2
---

# Session hygiene — kenapa dikunci di rules, bukan di Settings Antigravity

## Batas teknis

| Yang diinginkan | Bisa lewat rules? | Bisa lewat Settings Antigravity? |
|-----------------|-------------------|----------------------------------|
| Auto-hapus chat >24 jam | **Tidak** | **Belum ada** fitur native |
| Agent tolak lanjut di sesi gemuk / multi-topik | **Ya** — charter § A.1 | — |
| Tolak paste daftar SO/SKU panjang di chat | **Ya** — charter § A.2 | — |
| Satu chat = satu investigasi | **Ya** (SOP + agent remind) | Manual: New chat + trash |

Rules mengunci **perilaku agent**. Hapus file chat di `~/.gemini/antigravity-ide/` tetap manual / script terpisah.

## SOP tim (wajib)

1. Topik baru → **New chat** (jangan numpuk 1 thread berhari-hari).
2. Chat sudah panjang / ganti topik → agent akan minta chat baru (rule 26 § A.1).
3. **Daftar banyak SO/SKU** (≥ ±20) → simpan ke file `scratch/daftar-so.txt` (satu kode per baris), kasih path ke agent — **jangan** tempel di chat (rule 26 § A.2).
4. **Cek data banyak baris** → agent wajib kasih **ringkasan angka + beberapa contoh saja**, bukan tempel daftar panjang di chat (rule 19 / `agent-db/README`).
5. Hapus chat lama lewat trash di sidebar Agent (ikon jam/history) kalau sudah selesai.

## Kalau tetap lemot / overload API

Hampir selalu: masih memakai **satu mega-session**, atau paste list raksasa di chat. Buka chat baru + kirim list via file.
