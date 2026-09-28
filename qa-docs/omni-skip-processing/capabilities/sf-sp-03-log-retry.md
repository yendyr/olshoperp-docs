---
doc_type: menu-capability
menu: omni-skip-processing
id: SF-SP-03
title: Log Data & Retry
aliases: [skip processing log, retry skip]
scope: menu
summary: >-
  Log Data menampilkan batch sukses/gagal per order. Retry hanya untuk order yang gagal, dari tahap terakhir yang berhasil.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Log Data & Retry

## Apa ini

Toolbar **Log Data** membuka riwayat batch Skip: total diproses, sukses, gagal, durasi, dan siapa yang jalankan. Order gagal bisa di-**Retry**.

## Kapan dipakai

- Ada order gagal di tengah batch.
- Perlu pesan error per order.
- Audit eksekusi Skip.

## Cara pakai

1. Klik **Log Data**.
2. Buka batch → detail Success / Failed / All / DO Processed.
3. Di Failed: baca pesan error.
4. Klik **Retry** hanya untuk yang gagal (lanjut dari tahap terakhir sukses).

## Catatan

- Retry bukan untuk order yang belum pernah di-Skip.
- Pesan error umum (stok, DO, lock) → perbaiki data dulu baru Retry.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 8 sukses, 2 gagal stok | Retry 2 gagal setelah stok ready | 2 lanjut dari tahap terakhir |

## Lihat juga

- [Skip Processing (aksi)](#sf-lingo:SF-SP-01)
- Requirement: [§6.3 Skip Processing Log](../requirement.md)

