---
title: Antigravity / Cursor — session hygiene (token)
audience: qa-team
status: active
version: 1.4
last_updated: 2026-09-28
owner: QA - Yemima
source: .cursor/rules/26-agent-mandatory-charter.mdc § A.1–A.6
---

# Session hygiene — kontrol saat tim pakai Antigravity

## Sudah dikunci di rules (charter § A)

| § | Aturan | Yang dirasakan tim |
|---|--------|-------------------|
| A (umum) | Jangan buka 3 repo “jaga-jaga” | Agent fokus 1 tempat dulu |
| A.1 | Chat gemuk / ganti topik | Diminta **buka chat baru** |
| A.2 | List SO/SKU ≥ ±20 | Diminta **simpan ke file** dulu |
| A.3 | Baca kode | Hanya cuplikan kecil, bukan file utuh |
| A.4 | Pertanyaan masih kabur | Diminta **menu / nomor / server** dulu — belum DB/log |
| A.5 | File sampah | Agent tidak bikin script sekali pakai di repo tanpa diminta |
| A.6 | Muter terlalu lama | Setelah ~15 langkah belum jelas → **stop & tanya**, jangan ngeluyur |
| — | Hasil data banyak | Ringkasan + 3–5 contoh (rule 19) |

## Yang tidak dikunci dari Settings Antigravity

- Hapus chat >24 jam (belum ada fitur native)

## SOP singkat tim

1. Satu topik = satu chat baru  
2. Daftar panjang → file `scratch/`  
3. Sebut menu + kode + server biar agent tidak “mengembara”  
4. Jangan minta agent “bikin script dulu” untuk cek data biasa  
5. Kalau agent berhenti & tanya → jawab petunjuk, atau minta ringkas temuan dulu  
