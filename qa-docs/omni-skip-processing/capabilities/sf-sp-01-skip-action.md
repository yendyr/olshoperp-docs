---
doc_type: menu-capability
menu: omni-skip-processing
id: SF-SP-01
title: Skip Processing (aksi)
aliases: [tombol skip processing, bulk skip, skip picking]
scope: menu
summary: >-
  Centang order yang sudah di Default Wave lalu jalankan Skip Processing agar sistem menyelesaikan picking sampai Shipped tanpa menu tahap manual.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Skip Processing (aksi)

## Apa ini

Aksi utama menu: sistem mengerjakan picking → checking → packing → collecting sampai order **Shipped**, tanpa kamu masuk menu tahap satu per satu.

## Kapan dipakai

- Order sudah **Send to Default Wave**.
- Mau bypass tahap manual gudang untuk banyak order.
- Jangan pakai jika order belum di wave, sudah shipped, atau masih ada proses manual yang berjalan.

## Cara pakai

1. Pastikan SO sudah di Default Wave.
2. Buka Omni → **Skip Processing**.
3. Centang satu atau banyak order (tidak ada form tambahan).
4. Klik **Skip Processing**.
5. Pantau **Skip Progress** dan ikon tahap.

## Catatan

- Sukses batch = order sampai **Shipped** (bukan hanya selesai picking).
- Sistem menahan order yang sama agar tidak diproses dua kali bersamaan (lock).

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 10 SO di Default Wave | Skip Processing | Batch SP-… jalan; progress naik |
| SO masih Unassign Wave | Buka list | Order tidak eligible / tidak bisa diproses |

## Lihat juga

- [Skip Progress & ikon tahap](#sf-lingo:SF-SP-02)
- [Log Data & Retry](#sf-lingo:SF-SP-03)

