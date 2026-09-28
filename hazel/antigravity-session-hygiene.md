---
title: Antigravity / Cursor — session hygiene (token)
audience: qa-team
status: active
version: 1.2
last_updated: 2026-09-28
owner: QA - Yemima
source: .cursor/rules/26-agent-mandatory-charter.mdc § A.1–A.3
---

# Session hygiene — kenapa dikunci di rules, bukan di Settings Antigravity

## Batas teknis

| Yang diinginkan | Bisa lewat rules? | Bisa lewat Settings Antigravity? |
|-----------------|-------------------|----------------------------------|
| Auto-hapus chat >24 jam | **Tidak** | **Belum ada** fitur native |
| Agent tolak lanjut di sesi gemuk / multi-topik | **Ya** — charter § A.1 | — |
| Tolak paste daftar SO/SKU panjang di chat | **Ya** — charter § A.2 | — |
| Baca kode cuplikan sempit, bukan file utuh | **Ya** — charter § A.3 | — |
| Satu chat = satu investigasi | **Ya** (SOP + agent remind) | Manual: New chat + trash |

Rules mengunci **perilaku agent**. Hapus file chat di `~/.gemini/antigravity-ide/` tetap manual / script terpisah.

## SOP tim (wajib)

1. Topik baru → **New chat** (jangan numpuk 1 thread berhari-hari).
2. Chat sudah panjang / ganti topik → agent akan minta chat baru (rule 26 § A.1).
3. **Daftar banyak SO/SKU** (≥ ±20) → file `scratch/daftar-so.txt`, bukan paste chat (rule 26 § A.2).
4. **Cek data banyak baris** → ringkasan angka + beberapa contoh saja (rule 19 / `agent-db/README`).
5. **Investigasi kode** → agent cari dulu, baca cuplikan kecil saja — bukan buka file beribu baris sekaligus (rule 26 § A.3).
6. Hapus chat lama lewat trash di sidebar Agent kalau sudah selesai.

## Kalau tetap lemot / overload API

Biasanya: mega-session, paste list raksasa, atau agent baca source terlalu lebar. Chat baru + file list + minta “jelasin singkat tanpa buka file utuh”.
