---
doc_type: menu-capability
menu: omni-unassign-wave
id: SF-UW-03
title: Failed Process & Error Flag
aliases: [failed process, error flag, unavailable stock]
scope: menu
summary: >-
  Pill Failed Process memfilter order bermasalah; Error Flag (Shipping, Bind, Stock, …) menjelaskan kenapa belum bisa Send.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Failed Process & Error Flag

## Apa ini

Pill **Failed Process** menampilkan order yang bermasalah. Tiap baris bisa punya satu atau lebih **Error Flag** (ikon) — hover untuk detail.

## Kapan dipakai

- Sebelum Send, cek order yang sering gagal.
- Setelah Send gagal, pahami jenis masalah.

## Cara pakai

1. Klik pill **Failed Process** (opsional filter).
2. Hover ikon **Error Flag** di baris.
3. Perbaiki di menu terkait (binding, stok, shipping, COA, dll.).
4. Untuk flag Stock: sesuaikan **Processing Date** lalu **Refresh Availability Stock**.
5. Coba **Send to Default Waves** lagi.

## Catatan

Jenis flag umum: Shipping, Bind, COA, Stock / Unavailable Stock, Price, Bundle, Warehouse, Cancelled, Broken data. Satu order bisa punya beberapa sekaligus.

## Contoh

| Given | Aksi | Hasil |
|-------|------|--------|
| Flag Bind | Perbaiki Product Binding | Flag hilang setelah sync/list refresh |
| Flag Stock, date salah | Ubah Processing Date + Refresh | Flag Stock bisa hilang jika stok cukup di tanggal itu |

## Lihat juga

- [Refresh Availability Stock](#sf-lingo:SF-UW-04)
- [Send to Default Waves](#sf-lingo:SF-UW-01)

