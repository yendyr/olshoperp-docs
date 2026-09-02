---
doc_type: menu-capability
menu: supplychain-transfer-inbound
id: SF-TFINB-03
title: Show Virtual WH
aliases: [show virtual, virtual warehouse inbound]
scope: menu
summary: >-
  Transfer Inbound memakai datalist yang sama dengan TF Ext. Show Virtual WH
  diarahkan untuk di-hide di produksi; list inbound sudah filter In Transit/Delivered.
version: 1.0
last_updated: 2026-09-01
status: review
---

# Show Virtual WH

## Apa ini

Toggle yang sama dengan keluarga Transfer External. Di **produksi**, tidak dipakai untuk menemukan dokumen penerimaan — list Transfer Inbound sudah menampilkan TF Ext dengan Delivery **In Transit** atau **Delivered**.

## Kapan dipakai

- Tidak perlu untuk operasi harian inbound.
- Cari nomor **TF** atau filter Delivery Status.

## Cara pakai

1. Buka **Transfer Inbound**.
2. Cari dokumen In Transit tanpa mengandalkan **Show Virtual WH**.
3. Jika toggle masih terlihat, biarkan off — target produk: di-hide.

## Catatan

- Keputusan sama dengan Transfer External (TO-BE hide).
- Dokumen In Transit sistem (hidden) tetap tidak muncul di list.

## Lihat juga

- [Approve ke-2 & Delivered](#sf-lingo:SF-TFINB-02)
- [TF Ext — Show Virtual WH](../../supplychain-mutation-transfer-external/capabilities/sf-tfe-03-show-virtual-wh.md)
