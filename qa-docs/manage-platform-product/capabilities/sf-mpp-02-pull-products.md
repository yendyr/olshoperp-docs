---
doc_type: menu-capability
menu: manage-platform-product
id: SF-MPP-02
title: Pull Products
aliases: [sync produk, tarik produk marketplace, product sync]
scope: menu
summary: >-
  Pull Products menarik katalog dari marketplace ke OlshopERP untuk
  store yang dipilih. Setelah sukses, Auto Binding sering ikut jalan.
version: 1.0
last_updated: 2026-07-31
status: review
---

# Pull Products

## Apa ini

**Pull Products** menarik data produk **dari** marketplace **ke** OlshopERP. Ini cara utama mengisi daftar Platform Product — kamu tidak bisa membuat produk baru manual di menu ini.

## Kapan dipakai

- Toko baru setelah authorize (atau cek onboarding di Store Binding).
- SKU sudah ada di seller center tapi belum muncul di OlshopERP.
- Setelah ubah nama/SKU/varian di marketplace dan ingin data lokal ikut update.
- Troubleshooting order yang butuh produk platform terbaru.

## Cara pakai

1. Pilih **Store** di filter atas ([Filter Store](#sf-lingo:SF-MPP-01)).
2. Klik **Pull Products**.
3. Tunggu proses background — jangan klik berulang.
4. Refresh / cek **Sync Log** bila hasil tidak sesuai.
5. Lanjut bind (Auto / manual / Bulk) jika status masih **Not Binded**.

## Catatan

- Store harus authorized dan sync produk diaktifkan; kalau tidak, sync bisa dilewati atau hanya auto-bind yang jalan.
- Sync otomatis (~hourly) dan webhook TikTok juga mengisi data yang sama — Pull = manual segera.
- Setelah pull sukses, sistem sering menjalankan **Auto Binding** otomatis untuk SKU yang cocok.
- Ubah katalog di seller center dulu, baru Pull — jangan expect edit SKU di OlshopERP.

## Lihat juga

- [Auto Binding](#sf-lingo:SF-MPP-05)
- [Manual Binding](#sf-lingo:SF-MPP-04)
- [Feature Map](../feature-map.md) · [KB §3](../knowledge-base.md#3-dari-mana-data-ini-muncul)
