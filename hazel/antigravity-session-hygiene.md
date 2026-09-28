---
title: Antigravity / Cursor — session hygiene (token)
audience: qa-team
status: active
version: 1.3
last_updated: 2026-09-28
owner: QA - Yemima
source: .cursor/rules/26-agent-mandatory-charter.mdc § A.1–A.5
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
| — | Hasil data banyak | Ringkasan + 3–5 contoh (rule 19) |

## Yang tidak dikunci otomatis dari Settings Antigravity

- Hapus chat >24 jam (belum ada fitur native)
- Batas “maksimal N langkah tool per jawaban” — lihat catatan § C di bawah (opsional, belum dipasang angka kaku)

## Catatan soal “batas langkah” (opsi C)

Artinya: dalam **satu** pertanyaan, agent jangan jalan terus puluhan kali (baca file, query, cari) tanpa kepastian.  
Belum dipasang angka tetap (mis. “maks 15”) karena kadang investigasi memang butuh beberapa langkah.  
Kalau mau dikunci angka nanti: agent wajib **berhenti & tanya** setelah N langkah tanpa jawaban jelas.

## SOP singkat tim

1. Satu topik = satu chat baru  
2. Daftar panjang → file `scratch/`  
3. Sebut menu + kode + server biar agent tidak “mengembara”  
4. Jangan minta agent “bikin script dulu” untuk cek data biasa  
