---
doc_type: menu-capability
menu: omni-unassign-wave
id: SF-UW-01
title: Send to Default Waves
aliases: [send to default waves, send wave single, send wave bulk]
scope: menu
summary: >-
  Kirim order approved dari antrian Unassign Wave ke Default Wave (single atau bulk) agar stok di-reserve dan siap picking.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Send to Default Waves

## Apa ini

Aksi utama Unassign Wave: mengirim order yang sudah approved ke **Default Wave** supaya stok di-reserve dan order siap masuk rantai gudang (picking, dll.).

## Kapan dipakai

- Order Platform / General sudah **approved** dan masih di list Unassign Wave.
- Siap kirim ke proses gudang (cek Error Flag dulu jika ada).

## Cara pakai

1. Set **Processing Date** jika perlu.
2. Cek list — pastikan tidak ada **Error Flag** yang belum diperbaiki (atau filter **Failed Process**).
3. **Single:** klik tombol di kolom Action per baris.
4. **Bulk:** centang beberapa baris → toolbar **Send to Default Waves**.
5. Tunggu pill **On Process** selesai. Sukses = order hilang dari list.

## Catatan

- Order yang sudah sukses send tidak muncul lagi di Unassign Wave.
- Gagal → sering kembali ke list / masuk Failed Process.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| 5 SO approved, stok cukup | Bulk Send | On Process → hilang dari list |
| SO dengan flag Stock | Send tanpa perbaiki | Gagal / tetap di Failed Process |

## Lihat juga

- [Failed Process & Error Flag](#sf-lingo:SF-UW-03)
- [Processing Date](#sf-lingo:SF-UW-02)

