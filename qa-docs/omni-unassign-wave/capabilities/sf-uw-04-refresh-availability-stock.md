---
doc_type: menu-capability
menu: omni-unassign-wave
id: SF-UW-04
title: Refresh Availability Stock
aliases: [refresh availability stock, refresh stok unassign]
scope: menu
summary: >-
  Tombol untuk menghitung ulang ketersediaan stok pada Processing Date dan membersihkan tanda stok tidak cukup bila stok sudah ditambah.
version: 1.0
last_updated: 2026-09-28
status: review
---

# Refresh Availability Stock

## Apa ini

Tombol **Refresh Availability Stock** menghitung ulang stok untuk order di list (menggunakan **Processing Date**). Dipakai setelah stok digudang sudah ditambah.

## Kapan dipakai

- Baru Stock In / Transfer masuk, tetapi flag Stock masih muncul.
- Setelah mengubah Processing Date ke hari stok ready.

## Cara pakai

1. Pastikan **Processing Date** sudah benar.
2. Klik **Refresh Availability Stock**.
3. Tunggu selesai — cek lagi Error Flag / Failed Process.
4. Lanjut **Send to Default Waves** jika sudah bersih.

## Catatan

- Refresh memakai tanggal Processing Date (atau “sekarang” jika kosong).
- Tooltip stock sering menampilkan **Last Checked** setelah evaluasi.

## Lihat juga

- [Processing Date](#sf-lingo:SF-UW-02)
- [Failed Process & Error Flag](#sf-lingo:SF-UW-03)

