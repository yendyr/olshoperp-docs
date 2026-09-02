---
doc_type: menu-capability
menu: supplychain-mutation-transfer-external
id: SF-TFE-03
title: Show Virtual WH
aliases: [show virtual, virtual warehouse, hidden in transit]
scope: menu
summary: >-
  Di produksi Transfer External, Show Virtual WH tidak dipakai. Dokumen In Transit
  otomatis disembunyikan dari daftar; toggle diarahkan untuk di-hide (TO-BE).
version: 1.0
last_updated: 2026-09-01
status: review
---

# Show Virtual WH

## Apa ini

Toggle datalist untuk menampilkan warehouse/dokumen **virtual**. Di **Transfer External produksi**, fitur ini **tidak dipakai** — dokumen In Transit memang disembunyikan sistem, bukan ditampilkan lewat toggle.

## Kapan dipakai

- **Produksi:** tidak perlu — biarkan off / tersembunyi.
- **Transfer Internal:** beda — di sana Show Virtual WH dipakai untuk TF otomatis dari order.

## Cara pakai

1. Di datalist Transfer External produksi, abaikan **Show Virtual WH** jika sempat terlihat.
2. Cari dokumen kiriman biasa lewat kode **TF** / filter Delivery Status.
3. Dokumen In Transit sistem tidak muncul di list — itu normal.

## Catatan

- Target produk: toggle **di-hide** di produksi (sudah diminta ke tim).
- Route BETA mungkin masih menampilkan toggle — jangan jadikan acuan produksi.
- Beda dengan Transfer Internal yang memang mengandalkan Show Virtual WH.

## Lihat juga

- [Dual approve & In Transit](#sf-lingo:SF-TFE-01)
- [Requirement §4](../requirement.md)
- [Knowledge Base FAQ](../knowledge-base.md)
