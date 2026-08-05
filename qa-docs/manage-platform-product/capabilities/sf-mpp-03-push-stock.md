---
doc_type: menu-capability
menu: manage-platform-product
id: SF-MPP-03
title: Push Stock
aliases: [kirim stok, update stok marketplace, stock push]
scope: menu
summary: >-
  Push Stock mengirim jumlah stok dari OlshopERP ke etalase marketplace.
  Fake Stock selalu menang; tanpa bind dan tanpa Fake Stock, push gagal.
version: 1.0
last_updated: 2026-07-31
status: review
---

# Push Stock

## Apa ini

**Push Stock** mengirim angka stok **dari** OlshopERP **ke** etalase marketplace untuk store yang dipilih (atau baris yang di-centang pada bulk push). Tujuannya agar stok yang dilihat buyer selaras dengan aturan yang kamu set di sini.

## Kapan dipakai

- Setelah binding selesai dan ingin etalase ter-update.
- Saat memakai **Fake Stock** (override stok gudang) untuk etalase.
- Rutin menjaga stok marketplace setelah perubahan ATS / pengaturan ratio.

## Cara pakai

1. Pilih **Store** ([Filter Store](#sf-lingo:SF-MPP-01)).
2. Pastikan produk **Binded** *atau* sudah set **Fake Stock** ([Stock Management](#sf-lingo:SF-MPP-07)).
3. (Opsional) Atur **Minimum Stock** / **Stock Ratio** di modal Specification.
4. Klik **Push Stock** (atau bulk push untuk baris terpilih).
5. Cek hasil di Sync Log bila stok etalase tidak berubah.

## Catatan

| Prioritas qty yang dipush | Arti |
|---------------------------|------|
| **Fake Stock** diisi | Angka Fake Stock yang dikirim (override) |
| Binded, tanpa Fake Stock | Dari stok tersedia jual × ratio, dengan batas minimum |
| Belum bind & tanpa Fake Stock | Tidak ikut push / error |

- Stok **PARENT** di marketplace diabaikan — yang relevan VARIANT / SINGLE yang sudah bind.
- System Product inactive bisa membuat push untuk SKU itu gagal/dilewati.
- Tombol disabled jika store belum dipilih atau job masih berjalan.

## Contoh

| Kondisi | Yang dipush |
|---------|-------------|
| Fake Stock = 999, ATS gudang = 10 | 999 |
| Binded, Fake kosong, ratio 100%, ATS 50, min 0 | 50 |
| Not Binded, Fake kosong | Tidak dipush |

## Lihat juga

- [Stock Management](#sf-lingo:SF-MPP-07)
- [Manual Binding](#sf-lingo:SF-MPP-04)
- [Feature Map](../feature-map.md) · [KB §6 Push](../knowledge-base.md#skenario-kirim-stok-ke-marketplace)
